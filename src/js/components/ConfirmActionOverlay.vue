<template>
    <site-overlay transition_name="fade"
                  :open_fn="confirmationOverlayIsActive"
                  class="site-overlay--faded"
                  :show_header="false"
                  :lock_scroll="false">
        <div class="confirm-action-overlay">
            <div class="confirm-action-overlay__content">
                <div class="confirm-action-overlay__dialog">
                    <div class="confirm-action-overlay__icon">
                        <i class="icon-warning-alt">&nbsp;</i>
                    </div>
                    <div class="confirm-action-overlay__message">
                        {{confirmation_message}}
                    </div>
                    <div class="confirm-action-overlay__cta">
                        <div class="confirm-action-overlay__cta__button">
                            <button class="button button--small button--block"
                                    :disabled="disable_action"
                                    v-on:click="confirmAction">
                                OK
                            </button>
                        </div>
                        <div class="confirm-action-overlay__cta__button">
                            <button class="button button--small button--info button--block"
                                    :disabled="disable_action"
                                    v-on:click="cancelAction">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </site-overlay>
</template>
<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        data: function () {
            return {
                disable_action: false
            };
        },
        computed: {
            /**
             * The message to display
             */
            confirmation_message: function (): string {
                return this.$store.state.app.confirm_action_overlay ? this.$store.state.app.confirm_action_overlay.message : '';
            }
        },
        methods: {
            /**
             * Cancel the active action
             */
            cancelAction: function (): void {
                this.$store.dispatch('app/cancelConfirmAction');
            },
            /**
             * Whether the overlay is active
             */
            confirmationOverlayIsActive: function (): boolean {
                return this.$store.state.app.confirm_action_overlay !== null;
            },
            /**
             * Confirm the active action
             */
            confirmAction: function (): void {
                this.disable_action = true;
                this.$store.dispatch('app/confirmConfirmAction')
                    .then(() => {
                        this.disable_action = false;
                    });
            }
        }
    });
</script>