import _ from "lodash";
import {mapState} from "vuex";

import InactivityMixin from "@/mixins/InactivityMixin";
import {getDevicesPropertyArray} from "@/store";
import {findLastTruthyIdx} from "@/utils";

export default {
    data() {
        return {
            // Device ids that are associated with current page
            deviceIds: [],

            // Subfolder of assets/video/ to grab videos from
            videoFolder: "",

            // Sequence of videos to use
            videos: [],

            // Warnings
            showRuinedSequenceWarning: false,
            showWrongFlaskWarning: false,

            // Misc vars
            currentVideoIdx: 0,
            currentFlaskIdx: 0,
            lastStepIdx: 0,  // the farthest step that was
            wasFinished: false,
        };
    },

    mixins: [InactivityMixin],

    computed: {
        ...mapState(['lastButtonValue', 'deviceStatus']),

        // React only to devices from deviceIds list
        devicesToWatch() {
            return _.pick(this.deviceStatus, this.deviceIds);
        },

        // Collect flask CSS positions
        flaskPositions() {
            return getDevicesPropertyArray(this.deviceIds, 'position');
        },

        // Current flask x-y position
        currentFlaskPos() {
            const position = this.flaskPositions[this.currentFlaskIdx];
            return {x: position?.left, y: position?.top}
        },

        // Determine a CSS style for current flask
        currentFlaskStyle() {
            const position = this.currentFlaskPos;

            if (position.x === undefined || position.y === undefined) {
                return {visibility: "hidden"};
            }

            return {
                width: "170px",
                height: "170px",
                bottom: "0em",
                right: "0em",
                transform: "translate(-50%, -50%)",
                visibility: "visible",
                left: position.x,
                top: position.y,
            }
        },

        hasWarnings() {
            return this.showRuinedSequenceWarning || this.showWrongFlaskWarning;
        },

        totalFlaskCount: function () {
            return this.deviceIds.length;
        },
    },

    watch: {
        // Watch for button clicked
        lastButtonValue(value) {
            switch (value) {
                case "Exit":
                    this.exit();
            }
        },

        devicesToWatch: {
            deep: true,
            handler: function (statuses) {
                this.setInactivityTimers();
                this.onFlaskUpdate(Object.values(statuses));

                console.log('after: currentFlaskIdx', this.currentFlaskIdx);
                console.log("");
            }
        },
    },

    created() {
        this.initFlaskPage();
    },

    unmounted() {
        this.resetInactivityTimers();
    },

    methods: {
        initFlaskPage() {
            this.exitToMainPage = this.exit;
            this.setInactivityTimers();
        },

        exit() {
            this.$router.push({path: '/'});
        },

        checkWarnings(currentSequence) {
            // Check for wrong flasks ('false' values)
            const wrongFlasksCount = currentSequence.filter(o => o === false).length;
            this.showWrongFlaskWarning = wrongFlasksCount > 0;

            // Check if previous sequence was ruined. Skip the currentFlaskId
            const misplacedPrevFlasks = currentSequence
                .slice(0, -1)  // skip last flask of opened sequence
                .filter((o, idx) => idx !== this.currentFlaskIdx)  // skip current flask
                .filter(o => !o) // get both false & null

            this.showRuinedSequenceWarning = misplacedPrevFlasks.length > 0

            console.log('wrongFlasksCount', wrongFlasksCount);
            console.log('misplacedPrevFlasks', misplacedPrevFlasks);
        },

        onFlaskUpdate(status) {
            if (this.wasFinished) {
                // Don't allow to go back from final state,
                // don't show warnings except for the one about cleaning the table
                return;
            }

            // Ignore all the future flasks (after currentFlaskIdx)
            const currentSequence = status.slice(0, this.lastStepIdx + 1);

            this.checkWarnings(currentSequence);
            console.log('currentSequence', currentSequence);

            const lastTrueIdx = findLastTruthyIdx(status);
            console.log('before: currentFlaskIdx', this.currentFlaskIdx, 'lastTrueIdx', lastTrueIdx);

            if (lastTrueIdx == null) {
                this.currentFlaskIdx = 0;
                return;
            }

            this.currentFlaskIdx = lastTrueIdx + 1;

            if (this.hasWarnings)
                return;

            // Proceed to next video and save the tail of sequence
            this.currentVideoIdx = this.currentFlaskIdx;
            this.lastStepIdx = this.currentVideoIdx;

            // If all flasks are placed, hide flask indicator & mark page finished
            if (lastTrueIdx >= this.totalFlaskCount - 1) {
                this.currentFlaskIdx = null;
                this.wasFinished = true;
            }
        },
    },
}