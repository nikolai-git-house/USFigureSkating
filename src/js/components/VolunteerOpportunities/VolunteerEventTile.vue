<template>
    <div class="volunteer-event-tile">
        <transition name="fade">
            <div v-if="status_class"
                 class="volunteer-event-tile__status"
                 :class="'volunteer-event-tile__status--' + status_class">
                &nbsp;
            </div>
        </transition>
        <div class="volunteer-event-tile__content">
            <div class="volunteer-event-tile__header">
                <div class="volunteer-event-tile__header__column">
                    <p class="volunteer-event-tile__dates">
                        {{volunteer_event.start_date_formatted}}&ndash;{{volunteer_event.end_date_formatted}}
                    </p>
                </div>
                <div v-if="show_print_schedule_button" class="volunteer-event-tile__header__column volunteer-event-tile__header__column--print">
                    <a :href="volunteer_event.print_schedule_url" class="download-link download-link--small">
                        Schedule PDF
                    </a>
                </div>
            </div>
            <div class="volunteer-event-tile__body">
                <p class="volunteer-event-tile__data">
                    {{volunteer_event.name}}
                </p>
                <p class="volunteer-event-tile__data">
                    {{volunteer_event.city}}, {{volunteer_event.state}}
                </p>
                <p v-if="volunteer_event.location_name" class="volunteer-event-tile__venue">
                    {{volunteer_event.location_name}}
                </p>
            </div>
            <div class="volunteer-event-tile__footer">
                <div v-if="show_cta" class="volunteer-event-tile__cta">
                    <button v-if="show_request_button"
                            class="button button--small button--info button--block"
                            v-on:click.prevent="$emit('request')">
                        Request
                    </button>
                    <a v-if="show_select_shifts_button"
                       :href="volunteer_event.shift_selection_url"
                       class="button button--small button--info button--block">
                        Select Shifts
                    </a>
                </div>
                <p v-if="show_message"
                   class="volunteer-event-tile__message"
                   :class="'volunteer-event-tile__message--'+volunteer_event.status.type_key">
                    {{volunteer_event.status.text}}
                </p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {VolunteerOpportunityEvent} from '../../contracts/app/VolunteerOpportunitiesContracts';
    import Vue from 'vue';

    export interface VolunteerEventTileContract extends Vue {
        flashStatus: (status: 'success') => void;
        volunteer_event: VolunteerOpportunityEvent;
    }

    export default Vue.extend({
        props: {
            volunteer_event: {
                type: Object as () => VolunteerOpportunityEvent,
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                status_class: <'success' | null>null
            };
        },
        computed: {
            /**
             * Whether to show the CTA block
             */
            show_cta: function () {
                return this.show_request_button || this.show_select_shifts_button;
            },
            /**
             * Whether to show a status message
             */
            show_message: function (): boolean {
                return !!this.volunteer_event.status.text;
            },
            /**
             * Whether to show the print schedule button
             */
            show_print_schedule_button: function (): boolean {
                return this.volunteer_event.print_schedule_url !== null;
            },
            /**
             * Whether to show the request button
             */
            show_request_button: function (): boolean {
                return this.volunteer_event.status.is_open;
            },
            /**
             * Whether to show the select shifts button
             */
            show_select_shifts_button: function (): boolean {
                return this.volunteer_event.shift_selection_url !== null;
            }
        },
        methods: {
            /**
             * Flash a status display on the tile
             */
            flashStatus: function (status: 'success') {
                this.status_class = status;
                const STATUS_CHANGE_DURATION = 600;
                setTimeout(() => {
                    this.status_class = null;
                }, STATUS_CHANGE_DURATION);
            }
        }
    });
</script>