import serial


def read_line(ser: serial.Serial):
    return ser.readline().decode('utf-8', 'ignore').strip()
