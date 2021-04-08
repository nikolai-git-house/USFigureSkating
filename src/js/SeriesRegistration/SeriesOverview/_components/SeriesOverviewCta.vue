<template>
    <div class="series-overview-cta">
        <p v-if="show_deadline"
           class="text--muted series-overview-cta__deadline">
            Application deadline: {{series.application_deadline_formatted}}
        </p>
        <a v-if="show_application_button"
           :href="series.links.application"
           class="button button--block button--large">
            {{application_button_text}}
        </a>
        <div v-if="show_pay"
             class="series-overview-cta__cost">
            <span class="cost-display">
                <span class="cost-display__label">Total:</span>
                <span class="cost-display__value">${{total_cost}}</span>
            </span>
        </div>
        <a v-if="show_pay"
           class="button button--block button--large button--action"
           v-on:click.prevent="$emit('pay-attempt')">Pay Now
        </a>
        <a v-if="show_standings"
           :href="series.links.standings"
           class="button button--block button--large">Standings
        </a>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesOverview} from '../_contracts';
    import {SeriesApplication} from '../../SeriesApplication/_contracts';

    export default Vue.extend({
        props: {
            /**
             * The application started, if any, for the series
             */
            application: {
                type: Object as () => SeriesApplication.UserApplication | null,
                required: false
            },
            /**
             * The series for the CTA
             */
            series: {
                type: Object as () => SeriesOverview.CtaSeries,
                required: true
            }
        },
        computed: {
            /**
             * Text to show for application link button
             */
            application_button_text: function (): string {
                const application_started = !!this.application;

                return application_started ? 'Update My Application' : 'Start';
            },
            /**
             * Whether the application window is open
             */
            applications_open: function (): boolean {
                return this.series && this.series.status.applications_open;
            },
            /**
             * Whether to show the start/update button
             */
            show_application_button: function (): boolean {
                return this.applications_open;
            },
            /**
             * Whether to show the deadline element
             */
            show_deadline: function (): boolean {
                return this.applications_open;
            },
            /**
             * Whether to show the pay element
             */
            show_pay: function (): boolean {
                return this.applications_open && !!this.total_cost;
            },
            /**
             * Whether to show the standings element
             */
            show_standings: function (): boolean {
                return this.standings_available;
            },
            /**
             * Whether standings are available
             */
            standings_available: function (): boolean {
                return this.series && this.series.status.standings_available;
            },
            /**
             * The cost for unpaid application elements
             */
            total_cost: function (): number {
                return this.$store.getters['series_registration/application/total_cost'];
            }
        },
        /**
         * Emit event when mounted
         */
        mounted: function (): void {
            this.$emit('mounted');
        }
    });
</script>