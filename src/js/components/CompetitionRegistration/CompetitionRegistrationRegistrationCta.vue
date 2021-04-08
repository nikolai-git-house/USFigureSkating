<template>
    <div class="competition-registration-cta">
        <div class="competition-registration-cta__cta">
            <p v-if="competition.action_blocked_message"
               class="competition-registration-cta__notice">
                <i class="inline-icon icon-warning-alt">&nbsp;</i>
                {{competition.action_blocked_message}}
            </p>
            <button v-if="!hide_button"
                    class="button button--block"
                    :disabled="is_future"
                    :class="button_class"
                    v-on:click.prevent="beginRegistration">
                {{button_text}}
            </button>
        </div>
        <p class="competition-registration-cta__deadline"
           :class="{'competition-registration-cta__deadline--alert':has_deadline_warning}">
            Registration deadline: {{competition.registration_deadline}}
        </p>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {CompetitionRegistrationCtaConfiguration} from '../../contracts/app/CompetitionRegistrationContracts';

    export default Vue.extend({
        props: {
            competition: {
                type: Object as () => CompetitionRegistrationCtaConfiguration,
                required: true
            },
            interrupt_click: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            /**
             * The class to apply to a competition CTA button
             */
            button_class: function (): string {
                if (this.is_late_registration) {
                    return 'button--action';
                }
                if (this.is_in_progress) {
                    return 'button--info';
                }
                if (this.is_registered) {
                    return 'button--info';
                }

                return '';
            },
            /**
             * The text to display for a competition CTA button
             */
            button_text: function (): string {
                if (this.is_late_registration) {
                    return 'Late';
                }
                if (this.is_in_progress) {
                    return 'Continue Registration';
                }
                if (this.is_registered) {
                    return 'Add Event';
                }
                if (this.is_future) {
                    return 'Coming Soon';
                }

                return 'Register Now';
            },
            /**
             * Whether the competition's registration deadline should show in alert text
             */
            has_deadline_warning(): boolean {
                return this.competition.has_registration_deadline_warning;
            },
            /**
             * Whether to hide the registration button
             */
            hide_button: function (): boolean {
                return !!this.competition.action_blocked_message || this.competition.competition_registration_status === 'closed';
            },
            /**
             * Whether a competition is a future competition ('Coming Soon')
             */
            is_future(): boolean {
                return this.competition.competition_registration_status === 'future';
            },
            /**
             * Whether a competition has an in-progress registration for the current user
             */
            is_in_progress: function (): boolean {
                return this.competition.user_registration_status === 'in_progress';
            },
            /**
             * Whether a competition is in the late registration window
             */
            is_late_registration(): boolean {
                return this.competition.competition_registration_status === 'late';
            },
            /**
             * Whether a competition is registered for by the user
             */
            is_registered: function (): boolean {
                return this.competition.user_registration_status === 'registered';
            }
        },
        methods: {
            /**
             * Begin registration process for a competition
             */
            beginRegistration() {
                if (this.interrupt_click) {
                    this.$emit('open-registration', this.competition.user_registration_link);

                    return;
                }
                location.assign(this.competition.user_registration_link);
            }
        }
    });
</script>