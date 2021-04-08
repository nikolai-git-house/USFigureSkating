<template>
    <site-overlay :open_fn="isActive"
                  transition_name="fade"
                  class="site-overlay--faded"
                  :show_header="false"
                  :lock_scroll="false">
        <div class="confirmation-overlay">
            <div class="confirmation-overlay__content">
                <div v-if="is_saving"
                     class="confirmation-overlay__dialog">
                    <div class="confirmation-overlay__dialog__icon">
                        <animated-saving-icon></animated-saving-icon>
                    </div>
                    <div class="confirmation-overlay__dialog__message confirmation-overlay__dialog__message--large">
                        Please wait while we save your information
                    </div>
                </div>
                <div v-else-if="save_error"
                     class="confirmation-overlay__dialog">
                    <div class="confirmation-overlay__dialog__icon">
                        <i class="icon-danger">&nbsp;</i>
                    </div>
                    <div class="text--error confirmation-overlay__dialog__message">
                        {{save_error}}
                    </div>
                    <div>
                        <button class="button button--small"
                                v-on:click.prevent="$emit('close')">
                            OK
                        </button>
                    </div>
                </div>
                <div v-else-if="confirmation_message"
                     class="confirmation-overlay__dialog">
                    <div class="confirmation-overlay__dialog__icon">
                        <animated-check-icon ref="check"></animated-check-icon>
                    </div>
                    <div class="confirmation-overlay__dialog__message"
                         v-html="confirmation_message_processed"></div>
                    <div>
                        <button class="button button--small"
                                v-on:click.prevent="$emit('close')">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </site-overlay>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {AnimatedCheckInterface} from './AnimatedIcons/AnimatedCheckIcon.vue';

    export default Vue.extend({
        props: {
            confirmation_message: {
                type: String,
                required: false
            },
            is_saving: {
                type: Boolean,
                required: false
            },
            save_error: {
                type: String,
                required: false
            }
        },
        computed: {
            /**
             * Confirmation message with last two words wrapped in a span to prevent wrapping
             */
            confirmation_message_processed: function (): string {
                if (this.confirmation_message) {
                    const split = this.confirmation_message.split(' ');
                    if (split.length > 3) {
                        const starting_segment = split.slice(0, split.length - 2)
                            .join(' ');
                        const ending_segment = split.slice(split.length - 2)
                            .join(' ');

                        return `${starting_segment} <span class="nowrap">${ending_segment}</span>`;
                    }

                    return this.confirmation_message;
                }

                return '';
            }
        },
        /**
         * Hook into updates to play animated icon if appropriate
         */
        updated: function () {
            this.$nextTick(() => {
                this.playAnimatedIconIfPresent();
            });
        },
        /**
         * Hook into updates to play animated icon if appropriate
         */
        mounted: function () {
            this.$nextTick(() => {
                this.playAnimatedIconIfPresent();
            });
        },
        methods: {
            /**
             * Whether the component is active
             */
            isActive: function (): boolean {
                return !!this.is_saving || !!this.save_error || !!this.confirmation_message;
            },
            /**
             * Play the animated icon if it's visible
             */
            playAnimatedIconIfPresent: function () {
                const check_icon: AnimatedCheckInterface = this.$refs.check as AnimatedCheckInterface;
                if (check_icon) {
                    check_icon.play();
                }
            }
        }
    });
</script>