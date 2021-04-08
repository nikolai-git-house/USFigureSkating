import Vue from 'vue';
import {AnimatedCheckInterface} from '../components/AnimatedIcons/AnimatedCheckIcon.vue';

export default Vue.extend({
    /**
     * Reactive Data
     */
    data: function () {
        return {
            /**
             * Whether the confirmation dialog is active
             */
            confirmation_active: false
        };
    },
    methods: {
        /**
         * Hook function to perform actions after confirmation has closed
         */
        afterCloseConfirmation: function () {
            // no action in base mixin
        },
        /**
         * Handle click event on confirmation close button
         */
        closeConfirmation: function () {
            this.confirmation_active = false;
            this.afterCloseConfirmation();
        },
        /**
         * Whether the confirmation dialog is active. Used by overlay component
         */
        confirmationOverlayIsActive: function (): boolean {
            return this.confirmation_active;
        },
        /**
         * Action after the confirmation dialog enters
         */
        dialogEnter: function () {
            const check_icon: AnimatedCheckInterface = this.$refs.check as AnimatedCheckInterface;
            if (check_icon) {
                check_icon.play();
            }
        }
    }
});