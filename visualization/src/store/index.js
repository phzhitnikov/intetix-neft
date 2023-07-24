import {createStore} from 'vuex';
import {prepareDefaultDict} from "@/utils";

const _ = require('lodash');

// Array of device settings
// - address - RFID address of flask
// - position - xy position where to draw flask hint animation

const devices = [
    {'id': '0'},  // button device
    {'id': '1',  'address': '71 CB F8 26', 'position': {left: "2506px", top: "763px"}},
    {'id': '2',  'address': '30 31 E1 1A', 'position': {left: "2461px", top: "502px"}},
    {'id': '3',  'address': '51 6E 73 26', 'position': {left: "1971px", top: "568px"}},
    {'id': '4',  'address': '95 B5 A8 AC', 'position': {left: "1456px", top: "531px"}},
    {'id': '5',  'address': '12 20 12 1A', 'position': {left: "1125px", top: "941px"}},

    {'id': '6',  'address': '50 5B 85 1A', 'position': {left: "2538px", top: "345px"}},
    {'id': '7',  'address': '25 4C 0A AD', 'position': {left: "2677px", top: "761px"}},
    {'id': '8',  'address': 'C0 09 64 21', 'position': {left: "1505px", top: "1353px"}},
    {'id': '9',  'address': '81 5F 9D 26', 'position': {left: "1291px", top: "1724px"}},
    {'id': '10', 'address': '81 73 94 26', 'position': {left: "1086px",  top: "678px"}},

    {'id': '11', 'address': '71 A4 12 26', 'position': {left: "2395px", top: "1940px"}},
    {'id': '12', 'address': '81 04 93 26', 'position': {left: "2738px", top: "1747px"}},
    {'id': '13', 'address': '71 79 98 26', 'position': {left: "2407px", top: "1470px"}},
    {'id': '14', 'address': '51 46 3D 26', 'position': {left: "2057px", top: "1366px"}},
    {'id': '15', 'address': '71 92 A7 26', 'position': {left: "1513px", top: "792px"}},
    {'id': '16', 'address': '40 6F 58 1A', 'position': {left: "1229px", top: "358px"}},
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
            return Object.values(state.deviceStatus).filter(o => o === true).length
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
