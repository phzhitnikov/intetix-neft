from flask import Flask, request
from flask_socketio import SocketIO


class SocketIOServer:
    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port

        self.app = Flask(__name__)
        self.sio = SocketIO(self.app, cors_allowed_origins='*')

        self.sio.on_event('connect', self.on_connect)
        self.sio.on_event('disconnect', self.on_disconnect)

    def on_connect(self):
        print(f"Client connected: ", request.sid)

    def on_disconnect(self):
        print(f"Client disconnected: ", request.sid)

    def run(self):
        self.sio.run(self.app, host=self.host, port=self.port, allow_unsafe_werkzeug=True)

    def send_data(self, event, data, room=None):
        # print('Sending data:', event, data)
        # Emit the data to all connected clients
        self.sio.emit(event, data, room=room)

    def stop(self):
        self.sio.stop()
