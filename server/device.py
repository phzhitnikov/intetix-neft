import threading
from concurrent.futures import as_completed, ThreadPoolExecutor
from dataclasses import dataclass
import time
from time import sleep

import serial
from serial.tools import list_ports

import config as cfg
from socketio_server import SocketIOServer
from utils import read_line


@dataclass
class DeviceData:
    id: int
    type: str
    port: str


class DeviceCollector:
    PACKET_TRIES = 5

    @staticmethod
    def get_devices():
        executor = ThreadPoolExecutor()

        ports = list_ports.comports()
        futures = [executor.submit(DeviceCollector.find_device, p) for p in ports]
        results = [future.result() for future in as_completed(futures)]
        return [r for r in results if r is not None]

    @staticmethod
    def find_device(port):
        def _log(msg):
            print(f'[{port.device}]: {msg}')

        try:
            for i in range(DeviceCollector.PACKET_TRIES):
                with serial.Serial(port.device, cfg.SERIAL_SPEED, timeout=cfg.COM_TIMEOUT) as ser:
                    # Read data and try to get identification packet
                    # Format: Init <device_type> <device_id>
                    bytes_line = ser.readline()
                    line = bytes_line.decode('utf-8', 'ignore').strip()

                    device_data = line.split(' ')
                    if not line.startswith('Init') or len(device_data) != 3:
                        _log(f'Unknown packet: {line} | {bytes_line}')
                        sleep(i * 0.5)
                        continue

                    _, device_type, device_id = device_data
                    _log(f'Found {device_type} #{device_id}')
                    return DeviceData(device_id, device_type, port.device)

            raise ValueError(f'Failed to detect packet')
        except Exception as e:
            _log(f'Skipping device. Error: {e}')


class SerialDeviceThread(threading.Thread):
    MAX_CONNECTION_ATTEMPTS = 3
    MAX_IDLE_SEC_BEFORE_RESET = 30

    def __init__(self, device_data: DeviceData, server: SocketIOServer):
        super(SerialDeviceThread, self).__init__()
        self.daemon = True

        self.serial = None
        self.server = server
        self.device_data = device_data
        self.alive = True
        self._write_lock = threading.Lock()
        self.last_data_time = time.time()

        self.connect()

    def connect(self) -> bool:
        for i in range(self.MAX_CONNECTION_ATTEMPTS):
            try:
                self.serial = serial.Serial(self.device_data.port, cfg.SERIAL_SPEED, timeout=cfg.COM_TIMEOUT)
                self.alive = True
                return True
            except serial.SerialException as e:
                self._log(f"Failed to connect to serial port. Retry #{i} in 3 seconds. Error: {e}")
                sleep(3)

        return False

    def stop(self):
        self.alive = False
        if hasattr(self.serial, 'cancel_read'):
            self.serial.cancel_read()

        self.close()
        self.join(2)

    def on_data_received(self, data: str):
        self.last_data_time = time.time()
        if data != 'ping':
            self._log(data)
            self.server.send_data(self.device_data.type, data)

    def run(self):
        if not hasattr(self.serial, 'cancel_read'):
            self.serial.timeout = 3

        print(f"Connected to {self.serial.port}")
        while self.alive and self.serial.is_open:
            try:
                # Read all that is there or wait for one byte (blocking)
                data = read_line(self.serial)

                # Watchdog
                if time.time() - self.last_data_time > self.MAX_IDLE_SEC_BEFORE_RESET:
                    self._log(f"No data for {self.MAX_IDLE_SEC_BEFORE_RESET} seconds")
                    # self.close()
                    # self.connect()
            except serial.SerialException as e:
                # Probably some I/O problem such as disconnected USB serial
                self._log(f'Got SerialException: {str(e)}')

                # Try to reconnect
                if not self.connect():
                    break
            else:
                if data:
                    try:
                        self.on_data_received(data)
                    except Exception as e:
                        self._log(f'Got exception while retransmitting data: {str(e)}')
                        break

        self.alive = False

    def write(self, data):
        with self._write_lock:
            return self.serial.write(data)

    def close(self):
        # Use the lock to let other threads finish writing
        with self._write_lock:
            # First stop reading, so that closing can be done on idle port
            self.stop()
            self.serial.close()

    def _log(self, msg):
        print(f'[{self.device_data.type} {self.device_data.id}]: {msg}')
