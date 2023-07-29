import {Warning} from "@/utils";

export default {
    data() {
        return {
            flaskWarning: null,
            showInactivityWarning: false,

            // Show warning after N seconds of inactivity
            inactivityWarningTimeSec: 2 * 60,
            inactivityWarningTimer: null,

            // Exit to main page after N seconds of inactivity
            inactivityExitTimeSec: 5 * 60,
            inactivityExitTimer: null,
        }
    },

    computed: {
        priorityWarning() {
            if (this.showInactivityWarning)
                return Warning.Inactivity;

            return this.flaskWarning;
        },
    },

    methods: {
        // Override this
        exitToMainPage() {},

        resetInactivityTimers() {
            // Remove timers
            clearTimeout(this.inactivityWarningTimer);
            clearTimeout(this.inactivityExitTimer);

            // Clear vars
            this.inactivityWarningTimer = null;
            this.inactivityExitTimer = null;

            // Hide warnings
            this.showInactivityWarning = false;
        },

        setInactivityTimers() {
            this.resetInactivityTimers();

            // Prepare inactivity callbacks
            this.inactivityWarningTimer = setTimeout(() => {
                this.showInactivityWarning = true;
            }, this.inactivityWarningTimeSec * 1000);

            this.inactivityExitTimer = setTimeout(() => {
                console.log("Returning to main menu due to inactivity");
                this.exitToMainPage();
            }, this.inactivityExitTimeSec * 1000);
        },
    }
}