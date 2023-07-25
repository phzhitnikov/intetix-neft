import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3Lottie from "vue3-lottie";
import "vue3-lottie/dist/style.css";

import "@/assets/css/main.css";
import io from "socket.io-client";
import {store} from "@/store";
import {parsePacket} from "@/utils";


const app = createApp(App)
    .use(store)
    .use(router)
    .use(Vue3Lottie)


// Global SocketIO client that listens to the SerialPort retranslator
const socketClient = io("http://localhost:5001", {transports: ["websocket"]});

socketClient.on("connect", () => {
    console.log("Connected to socketio server");
});

// Handle button commands
socketClient.on("button", (message) => {
    console.log('Received button data:', message)

    const parsed = parsePacket(message);
    if (!parsed)
        return;

    const {deviceId, data} = parsed
    app.config.globalProperties.$store.dispatch('handleButtonPacket', {deviceId, data});
});


// Handle rfid commands
socketClient.on("rfid", (message) => {
    console.log('Received RFID data:', message);

    const parsed = parsePacket(message);
    if (!parsed)
        return;

    const {deviceId, data} = parsed
    app.config.globalProperties.$store.dispatch('handleDevicePacket', {deviceId, data});
});


app.mount("#app");
