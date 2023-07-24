function findLastTruthyIdx(arr) {
    let lastTrueIdx = null;

    for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) break;  // break on first false/null value
        else {
            lastTrueIdx = i;
        }
    }

    return lastTrueIdx
}

function prepareDefaultDict(dict, value) {
    // { key1: {object}, key2: {object} }  —>  { key1: value, key2: value }

    return Object.keys(dict).reduce((acc, key) => {
        acc[key] = value;
        return acc;
    }, {});
}

function parsePacket(packet) {
    // Packet variants:
    // "Reader 1: C2 EF CB 2E"
    // "Reader 1: EMPTY"
    // "Button 0: Scene1"

    let parsed_packet = packet.match(/(.*) (.*): (.*)/)
    if (parsed_packet == null) {
        console.log("Unknown packet format:", packet);
        return;
    }

    let deviceId = parsed_packet[2];
    let data = parsed_packet[3];

    return {deviceId, data}
}


export {findLastTruthyIdx, prepareDefaultDict, parsePacket}