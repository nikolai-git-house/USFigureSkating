<template>
    <site-overlay transition_name="fade"
                  :open_fn="confirmationOverlayIsActive"
                  class="site-overlay--faded"
                  :show_header="false"
                  :lock_scroll="false">
        <div class="confirmation-overlay">
            <div class="confirmation-overlay__content">
                <div class="confirmation-overlay__dialog">
                    <div class="confirmation-overlay__dialog__icon">
                        <i :class="is_danger?'icon-danger-alt':'icon-warning-alt'">&nbsp;</i>
                    </div>
                    <div ref="content"
                         class="confirmation-overlay__dialog__message"
                         v-html="notice"></div>
                    <button class="button button--small"
                            v-on:click="dismiss">
                        OK
                    </button>
                </div>
            </div>
        </div>
    </site-overlay>
</template>
<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        computed: {
            /**
             * The notice content
             */
            notice: function (): string | null {
                return this.$store.state.app.notice ? this.$store.state.app.notice.notice : null;
            },
            /**
             * Whether the notice should feature the danger icon
             */
            is_danger: function (): boolean {
                return this.$store.state.app.notice ? this.$store.state.app.notice.is_danger : false;
            }
        },
        methods: {
            /**
             * Cancel the active action
             */
            dismiss: function (): void {
                this.$store.dispatch('app/dismissNotice');
            },
            /**
             * Whether the overlay is active
             */
            confirmationOverlayIsActive: function (): boolean {
                return this.notice !== null;
            }
        }
    });
</script>