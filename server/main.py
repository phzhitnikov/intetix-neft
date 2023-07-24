import config as cfg
from device import DeviceCollector, SerialDeviceThread
from socketio_server import SocketIOServer


if __name__ == '__main__':
    # Global server to retranslate data
    sio_server = SocketIOServer(host=cfg.SERVER_HOST, port=cfg.SERVER_PORT)

    device_threads = [SerialDeviceThread(data, sio_server)
                      for data in DeviceCollector.get_devices()]


    def start_all():
        for t in device_threads:
            t.start()

        sio_server.run()  # blocking method


    def stop_all():
        print("Stopping all threads...")
        for t in device_threads:
            t.stop()

        sio_server.stop()


    try:
        print('-' * 10)
        start_all()
    except KeyboardInterrupt:
        stop_all()
