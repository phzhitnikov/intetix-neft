import _ from "lodash";
import {mapState} from "vuex";

import {getDevicesPropertyArray} from "@/store";
import {findLastTruthyIdx, Warning} from "@/utils";

import FlaskIndicatorAnimation from '@/assets/animation/flaskIndicator.json';
import WarningMixin from "@/mixins/WarningMixin";

export default {
    data() {
        return {
            // Device ids that are associated with current page
            deviceIds: [],

            // Subfolder of assets/video/ to grab videos from
            videoFolder: "",

            // Sequence of videos to use
            videos: [],

            // Animations
            FlaskIndicatorAnimation,

            // Timers
            // Exit to the main menu after N seconds
            finalExitTimeSec: 10,
            finalExitTimer: null,

            // Misc vars
            currentSequence: [],
            currentVideoIdx: 0,
            currentFlaskIdx: 0,
            lastStepIdx: 0,  // the farthest step that was
            wasFinished: false,
        };
    },

    mixins: [WarningMixin],

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
            return {x: position?.x, y: position?.y}
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

        // Place warnings depending on current flask position (at the top or bottom of screen)
        warningStyle() {
            const defaultStyle = {transform: "translateY(0%)"};
            if (this.currentFlaskPos.y === undefined) {
                return defaultStyle;
            }

            // string "100px" -> number 100
            const flaskYPos = parseInt(this.currentFlaskPos.y, 10);
            const middleOfViewport = window.innerHeight / 2;

            return flaskYPos > middleOfViewport
                ? defaultStyle
                : {transform: "translateY(100%)"};
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

        // Set timer to exit to the main menu after N seconds
        wasFinished(value) {
            if (value)
                this.setFinalTimer();
        }
    },

    created() {
        this.initFlaskPage();
    },

    unmounted() {
        this.resetInactivityTimers();
        this.resetFinalTimer();
    },

    methods: {
        initFlaskPage() {
            this.exitToMainPage = this.exit;
            this.setInactivityTimers();
        },

        exit() {
            this.$router.push({path: '/'});
        },

        setFinalTimer() {
            this.finalExitTimer = setTimeout(() => {
                this.exit();
            }, this.finalExitTimeSec * 1000);
        },

        resetFinalTimer() {
            clearTimeout(this.finalExitTimer)
            this.finalExitTimer = null;
        },

        checkWarnings() {
            let newWarning = null;

            // Check if previous sequence was ruined
            const misplacedPrevFlasks = this.currentSequence
                .slice(0, -1)  // skip last flask of opened sequence
                .filter(o => !o) // get both false & null

            if (misplacedPrevFlasks.length > 0)
                newWarning = Warning.RuinedSequence;

            // Check for wrong flasks ('false' values)
            const wrongFlasksCount = this.currentSequence.filter(o => o === false).length;
            if (wrongFlasksCount > 0)
                newWarning = Warning.WrongFlask;

            console.log('wrongFlasksCount', wrongFlasksCount);
            console.log('misplacedPrevFlasks', misplacedPrevFlasks);

            this.flaskWarning = newWarning;
        },

        onFlaskUpdate(status) {
            if (this.wasFinished) {
                // Don't allow to go back from final state,
                // don't show warnings except for the one about cleaning the table
                return;
            }

            // Ignore all the future flasks (after currentFlaskIdx)
            this.currentSequence = status.slice(0, this.lastStepIdx + 1);

            this.checkWarnings();
            console.log('currentSequence', this.currentSequence);

            const lastTrueIdx = findLastTruthyIdx(status);
            console.log('before: currentFlaskIdx', this.currentFlaskIdx, 'lastTrueIdx', lastTrueIdx);

            if (lastTrueIdx == null) {
                this.currentFlaskIdx = 0;
                return;
            }

            this.currentFlaskIdx = lastTrueIdx + 1;

            if (this.flaskWarning != null)
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