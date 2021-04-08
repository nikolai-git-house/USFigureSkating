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
        <a v-if="show_standings"
           :href="series.links.standings"
           class="button button--block button--large">Standings
        </a>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesOverview} from '../_contracts';

    export default Vue.extend({
        props: {
            /**
             * The application started, if any, for the series
             */
            application_exists: {
                type: Boolean,
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
                return this.application_exists ? 'Start/Update Application' : 'Start Application';
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