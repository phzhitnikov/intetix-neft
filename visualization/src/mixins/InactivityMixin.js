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
            clearTimeout(this.inactivityWarningTimer);
            this.showInactivityWarning = false;

            clearTimeout(this.inactivityExitTimer);

            this.inactivityWarningTimer = setTimeout(() => {
                this.showInactivityWarning = true;
            }, this.inactivityWarningTimeSec * 1000);

            this.inactivityExitTimer = setTimeout(() => {
                this.exitToMainPage();
            }, this.inactivityExitTimeSec * 1000);
        },
    },
}