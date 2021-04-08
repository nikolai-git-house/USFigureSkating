<template>
    <div class="series-standings-page"
         :class="{'page--accent':component_loaded}">
        <page :header="page_header">
            <series-page-header v-if="component_loaded"
                                slot="pre-header"
                                :series="series"></series-page-header>
            <div slot="header-content">
                <div class="series-standings-page__update-notice">
                    <p v-if="standings_last_updated"
                       class="series-standings-page__update-notice__date">
                        Updated: {{standings_last_updated}}
                    </p>
                    <p class="series-standings-page__update-notice__description">
                        Series standings are updated daily, see above for last update. Note: results could take up to 24
                        hours to process upon conclusion of competition.
                    </p>
                </div>
                <div v-if="resource_documents.length"
                     class="series-standings-page__resources">
                    <p>Resource PDFs for eligibility:</p>
                    <ul class="series-standings-page__resource-list">
                        <li v-for="(document,index) in resource_documents"
                            :key="index"
                            class="series-standings-page__resource-list__item">
                            <a class="icon-link icon-link--download"
                               :href="document.link"
                               target="_blank"
                               rel="noreferrer noopener">
                                {{document.name}}
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="series-standings-page__granular-filter">
                    <standings-granular-filter></standings-granular-filter>
                </div>
                <div class="series-standings-page__global-filter-trigger">
                    <a class="standard-link"
                       href="#"
                       v-on:click.prevent="global_filters_active=true">Filter by Disciplines, Levels and Section
                    </a>
                </div>
            </div>
            <component-loader v-if="!component_loaded"
                              slot="loader"
                              :container="true"
                              :source="this"
                              error_message="Error loading standings."></component-loader>
            <div v-else
                 class="series-standings-page__content page__accent-content pagination-footer-offset">
                <div class="grid-container">
                    <div v-if="events.length">
                        <accordion v-for="event in visible_items"
                                   :key="event.uid"
                                   class="accordion--info accordion--info--large"
                                   :external_expand_check="accordionOpen(event.uid)"
                                   v-on:accordion_toggle="handleAccordionToggle(event.uid)">
                            <span slot="trigger_text">{{event.name}}</span>
                            <div slot="expand_content">
                                <standings-table :standings="event.standings"
                                                 :event_name="event.name"></standings-table>
                            </div>
                        </accordion>
                    </div>
                    <p v-else
                       class="series-standings-page__no-results text--error">
                        No standings match your current search/filters.
                    </p>
                </div>
            </div>
            <div v-if="show_pagination"
                 class="pagination-footer series-standings-page__footer">
                <div class="grid-container">
                    <pagination ref="pagination"
                                :paginated_items="paginated_items"
                                v-on:page-changed="handleActivePageChange"></pagination>
                </div>
            </div>
        </page>
        <site-takeover v-if="global_filters_active"
                       :return_to_scroll_location="true"
                       v-on:close="global_filters_active=false">
            <standings-global-filter v-on:close="global_filters_active=false"></standings-global-filter>
        </site-takeover>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import {PageComponentHeaderConfiguration} from '../../../contracts/AppContracts';
    import {SeriesStandingsState} from '../_store/SeriesStandingsState';
    import {SeriesStandings} from '../_contracts';
    import StandingsTable from '../_components/StandingsTable.vue';
    import HasPaginatedItems from '../../../mixins/HasPaginatedItems';
    import StandingsGranularFilter from '../_components/StandingsGranularFilter.vue';
    import StandingsGlobalFilter from '../_components/StandingsGlobalFilter.vue';

    const vueClass = mixins(HasDataDependencies, HasPaginatedItems);
    // @vue/component
    export default vueClass.extend({
        components: {
            StandingsGlobalFilter,
            StandingsGranularFilter,
            StandingsTable
        },
        /**
         * Reactive Data
         */
        data: function () {
            return {
                /**
                 * The indices of the actively-expanded accordion
                 */
                active_accordion_indices: <number[]>[],
                /**
                 * Data dependencies required for component
                 */
                dependencies: {
                    series: false
                },
                /**
                 * Whether global filters are active
                 */
                global_filters_active: false,
                /**
                 * The amount of items per page of pagination
                 */
                pagination_per_page: 50
            };
        },
        computed: {
            /**
             * The configuration for the page header
             */
            page_header: function (): PageComponentHeaderConfiguration {
                const conf: PageComponentHeaderConfiguration = {
                    title: 'Standings'
                };
                if (this.series) {
                    conf.back_link = this.series.links.overview;
                    conf.back_link_label = 'Back to Series Overview';
                }

                return conf;
            },
            /**
             * The items to paginate
             */
            pagination_items: function (): SeriesStandings.StandingsEvent[] {
                return this.events;
            },
            /**
             * Resource documents for the series standings
             */
            resource_documents: function (): SeriesStandings.ResourceDocument[] {
                return this.series ? this.series.resource_documents : [];
            },
            /**
             * The series for the page
             */
            series: function (): SeriesStandings.Series | null {
                return this.$store.state.series_standings.series;
            },
            /**
             * Formatted string indicating when standings were last updated
             */
            standings_last_updated: function (): string | null {
                return this.$store.getters['series_standings/standings_last_updated'];
            },
            /**
             * The list of standings events for display on the page
             */
            events: function (): SeriesStandings.StandingsEvent[] {
                return this.$store.getters['series_standings/display_events'];
            }
        },
        /**
         * Before creation, ensure state modules registered
         */
        beforeCreate: function (): void {
            if (typeof this.$store.state.standings === 'undefined') {
                this.$store.registerModule('series_standings', SeriesStandingsState);
            }
        },
        methods: {
            /**
             * Whether an accordion is open
             */
            accordionOpen: function (uid: number): boolean {
                return this.active_accordion_indices.indexOf(uid) !== -1;
            },
            /**
             * Handle the toggle event on an accordion in the accordion list
             */
            handleAccordionToggle: function (uid: number) {
                const indices_index: number = this.active_accordion_indices.indexOf(uid);
                if (indices_index !== -1) {
                    this.active_accordion_indices.splice(indices_index, 1);

                    return;
                }
                this.active_accordion_indices.push(uid);
            },
            /**
             * Load data dependencies
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('series_standings/fetchSeriesStandings')
                        .then(() => {
                            this.dependencies.series = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            }
        }
    });
</script>