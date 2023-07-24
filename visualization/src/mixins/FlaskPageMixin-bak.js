import io from "socket.io-client";

import {findLastTruthyIdx} from "@/utils";
import InactivityMixin from "@/mixins/InactivityMixin";

export default {
    data() {
        return {
            videoFolder: "",
            videos: [],

            flaskStatus: [],

            // Collection of reader ids and addresses associated with current page
            flaskData: [
                // {ReaderId: '1', FlaskId: '71 CB F8 26'},
            ],

            // Positions where to draw flask hint animations
            flaskPositions: [
                // {top: "687px", left: "2400px"},
            ],

            showWarning1: false,
            showWrongFlaskWarning: false,

            currentFlaskId: 0,
            currentVideoIdx: 0,
            wasFinished: false,

            socketClient: null,
        };
    },

    mixins: [InactivityMixin],

    computed: {
        totalFlaskCount: function () {
            return this.flaskData.length;
        },

        currentFlaskStyle: function () {
            if (this.currentFlaskId == null || this.currentFlaskId > this.totalFlaskCount - 1)
                return {visibility: "hidden"};

            return {
                width: "170px",
                height: "170px",
                bottom: "0em",
                right: "0em",
                visibility: "visible",
                ...this.flaskPositions[this.currentFlaskId] || {}
            }
        },
    },

    methods: {
        initFlaskPage() {
            this.initSocketClient();
            this.exitToMainPage = this.exit;
        },

        initSocketClient() {
            this.socketClient = io("http://localhost:5001", {transports: ["websocket"]});

            this.socketClient.on("connect", () => {
                console.log("Connected to socketio server");
            });

            // Handle button commands
            this.socketClient.on("button", (response) => {
                console.log('Received button data:', response)

                switch (response) {
                    case "Exit":
                        this.exit();
                }
            });

            // Handle rfid commands
            this.socketClient.on("rfid", (response) => {
                console.log('Received RFID data:', response);
                this.resetInactivityTimer();
                this.handlePacket(response);
                this.updateFlask();
            });
        },

        handlePacket(packet) {
            // Packet variants:
            // "Reader 1: C2 EF CB 2E"
            // "Reader 1: EMPTY"
            let parsed_packet = packet.match(/(.*) (.*): (.*)/)
            if (parsed_packet == null) {
                console.log("Unknown packet format:", packet);
                return;
            }

            let statuses

            // Set initial values on first iteration
            if (this.flaskStatus.length === 0) {
                statuses = Array(this.flaskData.length).fill(false);
            } else {
                // Copy flaskStatus array and update it with value from the packet
                statuses = [...this.flaskStatus];
            }

            for (let i = 0; i < this.flaskData.length; i++) {
                let readerId = this.flaskData[i].ReaderId;
                let flaskId = this.flaskData[i].FlaskId;

                // Find the settings for given ReaderId
                if (readerId === parsed_packet[2]) {
                    statuses[i] = flaskId === parsed_packet[3];
                }
            }

            console.log(statuses);

            // Update whole status collection
            this.flaskStatus = statuses;
        },

        updateFlask() {
            const {consecutiveCount, lastTrueIdx} = findLastTruthyIdx(this.flaskStatus);
            const totalPlacedCount = this.flaskStatus.filter(Boolean).length;
            const hasMisplacedFlasks = consecutiveCount !== totalPlacedCount;

            console.log(consecutiveCount, lastTrueIdx);

            // TODO: handle wrong flask being placed
            // this.showWarning2 = statuses.includes(false);

            if (consecutiveCount === 0 || hasMisplacedFlasks) {
                // TODO: when to show this warning?
                this.showWarning1 = true;
            } else {
                if (this.wasFinished) {
                    // Don't allow to go back from final state,
                    // don't show warnings except for the one about cleaning the table
                    return;
                }

                this.showWarning1 = false;

                this.currentVideoIdx = lastTrueIdx + 1;

                // If not all flasks were correctly placed yet
                if (lastTrueIdx < this.totalFlaskCount - 1) {
                    this.currentFlaskId = lastTrueIdx + 1;
                } else {
                    // If all flasks are placed, hide flask indicator
                    this.currentFlaskId = null;
                    this.wasFinished = true;
                }
            }
        },

        exit() {
            // TODO: push state about placed flasks (or use Vuex)
            this.$router.push({path: '/'});
        }
    },
}