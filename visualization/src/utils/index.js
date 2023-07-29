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

function prepareDefaultDict(arr, keyName, defaultValue) {
    // [{ <keyName>: v1, key2: v2}, { <keyName>: v1, key2: v2}]
    // —>
    // { keyName: <defaultValue>, key2: <defaultValue> }

    let result = {};
    arr.forEach(v => {
        let key = v[keyName];
        result[key] = defaultValue;
    })

    return result;
}

function parsePacket(packet) {
    // Packet variants:
    // "Reader 1: C2 EF CB 2E"
    // "Reader 1: EMPTY"
    // "Button 0: Scene1"
    // "Init rfid 5"

    let parsed_packet = packet.match(/(.*) (.*): (.*)/)
    if (parsed_packet == null) {
        console.log("Unknown packet format:", packet);
        return;
    }

    let deviceId = parsed_packet[2];
    let data = parsed_packet[3];

    return {deviceId, data}
}

const Warning = {
    Inactivity: 'inactivity',
    WrongFlask: 'wrongFlask',
    RuinedSequence: 'ruinedSequence',
}


export {findLastTruthyIdx, prepareDefaultDict, parsePacket, Warning}