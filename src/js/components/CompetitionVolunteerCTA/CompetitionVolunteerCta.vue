<template>
    <div class="competition-volunteer-cta">
        <p v-if="phase_message" class="competition-volunteer-cta__phase-message">
            <i v-if="phase_message.type==='success'" class="inline-icon icon-status-check"></i>
            <i v-else-if="phase_message.type==='error'" class="inline-icon icon-status-x"></i>
            {{phase_message.text}}
        </p>
        <button v-if="request_button_visible"
                :disabled="request_button_disabled"
                class="button button--block"
                v-on:click.prevent="$emit('request')">
            Request
        </button>
        <a v-if="select_shifts_button_visible"
           :class="{'disabled':select_shifts_button_disabled}"
           :href="select_shifts_url"
           class="button button--block">
            Select Shifts
        </a>
        <p v-if="status_message"
           class="competition-volunteer-cta__status-message"
           :class="status_message_class">
            {{status_message.text}}
        </p>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {
        CompetitionVolunteerCtaConfiguration,
        CompetitionVolunteerCtaPhaseMessage,
        CompetitionVolunteerCtaStatusMessage
    } from './CompetitionVolunteerCtaContracts';

    export default Vue.extend({
        props: {
            /**
             * The configuration for the component
             */
            source: {
                required: true,
                type: Object as () => CompetitionVolunteerCtaConfiguration
            }
        },
        computed: {
            /**
             * The phase message configuration
             */
            phase_message: function (): CompetitionVolunteerCtaPhaseMessage | false {
                return this.source.phase_message || false;
            },
            /**
             * Whether the request button should be disabled
             */
            request_button_disabled: function () {
                return !this.source.actions.request.enabled;
            },
            /**
             * Whether the request button should display
             */
            request_button_visible: function () {
                return this.source.actions.request.visible;
            },
            /**
             * Whether the select shifts button should be disabled
             */
            select_shifts_button_disabled: function () {
                return !this.source.actions.select_shifts.enabled;
            },
            /**
             * Whether the select shifts button should be visible
             */
            select_shifts_button_visible: function () {
                return this.source.actions.select_shifts.visible;
            },
            /**
             * The URL for the select shifts button
             */
            select_shifts_url: function () {
                return this.source.actions.select_shifts.url;
            },
            /**
             * The status message configuration
             */
            status_message: function (): CompetitionVolunteerCtaStatusMessage | false {
                return this.source.status_message || false;
            },
            /**
             * The class to apply to the status message
             */
            status_message_class: function () {
                const status_type_key = this.source.status_message && this.source.status_message.type_key;
                if (status_type_key) {
                    return `text--${status_type_key}`;
                }

                return '';
            }
        }
    });
</script>