import sys

from PyQt6.QtCore import QThread
from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget, QCheckBox, QLineEdit, QGridLayout, QPushButton

import config as cfg
from socketio_server import SocketIOServer

flasks = {
    # Timano
    12: '71 CB F8 26',
    13: '30 31 E1 1A',
    14: '51 6E 73 26',
    15: '95 B5 A8 AC',
    16: '12 20 12 1A',

    # Sibir
    7:  '50 5B 85 1A',
    8:  '25 4C 0A AD',
    9:  'C0 09 64 21',
    10: '81 5F 9D 26',
    11: '81 73 94 26',

    # Baku
    1: '71 A4 12 26',
    2: '81 04 93 26',
    3: '71 79 98 26',
    4: '51 46 3D 26',
    5: '71 92 A7 26',
    6: '40 6F 58 1A',
}

buttons = ["Scene 1", "Scene 2", "Scene 3", "Exit"]


class WorkerThread(QThread):
    def __init__(self, server: SocketIOServer):
        super().__init__()
        self.server = server

    def run(self):
        self.server.run()


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Create the central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Create the layout
        layout = QGridLayout()
        central_widget.setLayout(layout)

        # Create checkboxes and input fields
        for i, card in flasks.items():
            checkbox = QCheckBox(f"Flask {i}")
            checkbox.setProperty("id", i)
            checkbox.stateChanged.connect(self.checkbox_changed)
            layout.addWidget(checkbox, i - 1, 1)

            input_field = QLineEdit(card)
            input_field.setProperty("id", i)
            layout.addWidget(input_field, i - 1, 2)

        for i, btn_text in enumerate(buttons):
            checkbox = QPushButton(f"{btn_text}")
            checkbox.setProperty("id", 0)
            checkbox.setProperty("action", btn_text)
            checkbox.pressed.connect(self.button_pressed)
            layout.addWidget(checkbox, i, 0)

        # Start the SocketIO server in a separate thread
        self.socketio_server = SocketIOServer(host=cfg.SERVER_HOST, port=cfg.SERVER_PORT)
        self.worker_thread = WorkerThread(self.socketio_server)
        self.worker_thread.start()

    def button_pressed(self):
        button = self.sender()

        device_id = button.property("id")
        action = button.property("action")
        self._send_data('button', f'Button {device_id}: {action}')

    def checkbox_changed(self, state):
        checkbox = self.sender()

        device_id = checkbox.property("id")
        address_element = self.get_element_by_property(QLineEdit, 'id', device_id)

        if checkbox.isChecked() and address_element:
            address = address_element.text()
        else:
            address = "EMPTY"

        self._send_data('rfid', f'Reader {device_id}: {address}')

    def _send_data(self, event, data):
        print(f'[{event}] {data}')
        self.worker_thread.server.send_data(event, data)

    def get_element_by_property(self, el_class, name, value):
        for child in self.findChildren(el_class):
            if child.property(name) == value:
                return child

        return None

    def closeEvent(self, event):
        # Stop the SocketIO server and join the thread
        self.socketio_server.stop()
        event.accept()


if __name__ == '__main__':
    app = QApplication(sys.argv)
    mainWindow = MainWindow()
    mainWindow.show()
    sys.exit(app.exec())
