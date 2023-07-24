export default {
    data() {
        return {
            // Show warning after N seconds of inactivity
            inactivityWarningTimeSec: 2 * 60,
            inactivityWarningTimer: null,

            // Exit to main page after N seconds of inactivity
            inactivityExitTimeSec: 5 * 60,
            inactivityExitTimer: null,

            showInactivityWarning: false,
        };
    },

    methods: {
        // Implement this
        exitToMainPage() {},

        resetInactivityTimer() {
            // Remove timers
            clearTimeout(this.inactivityWarningTimer);
            clearTimeout(this.inactivityExitTimer);

            // Clear vars
            this.inactivityWarningTimer = null;
            this.inactivityExitTimer = null;

            // Hide warnings
            this.showInactivityWarning = false;

            // Prepare inactivity callbacks
            this.inactivityWarningTimer = setTimeout(() => {
                this.showInactivityWarning = true;
            }, this.inactivityWarningTimeSec * 1000);

            this.inactivityExitTimer = setTimeout(() => {
                this.exitToMainPage();
            }, this.inactivityExitTimeSec * 1000);
        },
    },
}