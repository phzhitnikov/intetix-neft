let io = require("socket.io-client")

let socketClient = io("http://localhost:5001", {transports: ["websocket"]});

socketClient.on("connect", () => {
    console.log("Connected to socketio server")
});

socketClient.on("disconnect", () => {
    console.log("Disconnected")
});

socketClient.on("button", (response) => {
    console.log('Received button data:', response)
});

socketClient.on("rfid", (response) => {
    console.log('Received RFID data:', response)
});
