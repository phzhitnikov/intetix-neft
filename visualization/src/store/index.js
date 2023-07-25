import {createStore} from 'vuex';
import {prepareDefaultDict} from "@/utils";

const _ = require('lodash');

// Array of device settings
// - address - RFID address of flask
// - position - xy position where to draw flask hint animation

const devices = [
    {'id': '0'},  // button device

    // Timano
    {'id': '12', 'address': '71 CB F8 26', 'position': {left: "2506px", top: "743px"}},
    {'id': '13', 'address': '30 31 E1 1A', 'position': {left: "2461px", top: "502px"}},
    {'id': '14', 'address': '51 6E 73 26', 'position': {left: "1991px", top: "548px"}},
    {'id': '15', 'address': '95 B5 A8 AC', 'position': {left: "1456px", top: "511px"}},
    {'id': '16', 'address': '12 20 12 1A', 'position': {left: "1125px", top: "941px"}},

    // Sibir
    {'id': '7',  'address': '50 5B 85 1A', 'position': {left: "2568px", top: "325px"}},
    {'id': '8',  'address': '25 4C 0A AD', 'position': {left: "2700px", top: "741px"}},
    {'id': '9',  'address': 'C0 09 64 21', 'position': {left: "1505px", top: "1353px"}},
    {'id': '10', 'address': '81 5F 9D 26', 'position': {left: "1291px", top: "1724px"}},
    {'id': '11', 'address': '81 73 94 26', 'position': {left: "1086px",  top: "678px"}},

    // Baku
    {'id': '1', 'address': '71 A4 12 26', 'position': {left: "2450px", top: "1940px"}},
    {'id': '2', 'address': '81 04 93 26', 'position': {left: "2780px", top: "1747px"}},
    {'id': '3', 'address': '71 79 98 26', 'position': {left: "2460px", top: "1470px"}},
    {'id': '4', 'address': '51 46 3D 26', 'position': {left: "2057px", top: "1366px"}},
    {'id': '5', 'address': '71 92 A7 26', 'position': {left: "1520px", top: "762px"}},
    {'id': '6', 'address': '40 6F 58 1A', 'position': {left: "1259px", top: "348px"}},
]

function getDeviceById(id) {
    id = id.toString()
    return _.find(devices, {'id': id});
}

function getDevicesPropertyArray(ids, property) {
    // For each given deviceId,
    // get an array of properties, e.g. ['71 CB F8 26', '30 31 E1 1A' ]

    let result = [];
    ids.forEach(id => {
        let device = getDeviceById(id);
        result.push(device[property]);
    })

    return result;
}


const store = createStore({
    state: {
        // Status can be:
        // - true - card is present, address is right
        // - false - card is present, but address is wrong
        // - null - no card present
        deviceStatus: prepareDefaultDict(devices.filter(o => o.address), null),
        lastButtonValue: null,
    },

    getters: {
        getFlaskPosition: () => (id) => {
            return getDeviceById(id)?.position
        },

        placedFlasksCount(state) {
            return Object.values(state.deviceStatus).filter(o => o != null).length
        },
    },

    mutations: {
        setButtonValue(state, sceneName) {
            state.lastButtonValue = sceneName
        },

        setStatus(state, {deviceId, status}) {
            state.deviceStatus[deviceId] = status;
        },
    },

    actions: {
        resetButtonValue(context) {
            context.commit('setButtonValue', null);
        },

        handleButtonPacket({commit}, {deviceId, data}) {
            let device = getDeviceById(deviceId);
            if (device === undefined) {
                console.log('Unknown device id:', deviceId);
                return;
            }

            // Update button value in storage
            commit('setButtonValue',  data);
        },

        handleDevicePacket({commit}, {deviceId, data}) {
            let device = getDeviceById(deviceId);
            if (device === undefined) {
                console.log('Unknown device id:', deviceId);
                return;
            }

            let status;
            if (data === 'EMPTY') {
                status = null;
            } else {
                status = device.address === data;
            }


            commit('setStatus', {deviceId, status});
        },
    },
});

export {store, getDevicesPropertyArray};
