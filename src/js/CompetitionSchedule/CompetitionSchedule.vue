<template>
    <div class="competition-schedule-page">
        <page :class="{'page--accent':component_loaded}"
              :header="page_header_override">
            <a v-if="admin_edit_link"
               slot="back-bar-secondary-link"
               class="icon-link icon-link--edit icon-link--underline"
               target="_blank"
               rel="noopener noreferrer"
               :href="admin_edit_link">
                Edit Mode
            </a>
            <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                             slot="competition-heading"
                                             v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
            <component-loader v-if="!component_loaded"
                              slot="loader"
                              :container="true"
                              :source="this"
                              error_message="Error loading competition schedule."></component-loader>
            <div v-else
                 slot="content"
                 class="competition-schedule">
                <div v-if="schedule_available" class="competition-schedule__schedule">
                    <div class="page--accent__standard-content">
                        <carousel
                                ref="rink-name-carousel"
                                v-model="carousel_rink_names"
                                class="rink-name-carousel"
                                :show_navigation="display_rink_schedules.length>1"
                                :factory_method="carousel_factory_method_rink_names"
                                v-on:init="linkSwipers">
                            <div v-for="(rink_schedule,index) in display_rink_schedules"
                                 :key="index"
                                 class="rink-name-carousel__slide swiper-slide">
                                <h3 class="rink-name">
                                    <span class="rink-name__text">
                                        {{rink_schedule.rink.full_name}}
                                    </span>
                                </h3>
                            </div>
                        </carousel>
                    </div>
                    <div class="grid-container">
                        <div class="competition-schedule__filters">
                            <competition-schedule-filters
                                    v-model="active_filters"
                                    :filter_options="filter_options">
                            </competition-schedule-filters>
                        </div>
                        <div class="download-schedule">
                            <a :disabled="!download_link"
                               class="standard-link"
                               target="_blank"
                               rel="noreferrer noopener"
                               :href="download_link">Download Schedule
                            </a>
                        </div>
                        <div class="competition-schedule__legend">
                            <competition-schedule-legend v-if="legend_data"
                                                         :source_data="legend_data">
                            </competition-schedule-legend>
                        </div>
                    </div>
                    <carousel
                            ref="rink-session-carousel"
                            v-model="carousel_rink_sessions"
                            :factory_method="carousel_factory_method_sessions"
                            :show_navigation="false"
                            class="competition-schedule__rink-sessions-carousel"
                            v-on:init="linkSwipers">
                        <div v-for="(rink_schedule,index) in display_rink_schedules"
                             :key="index"
                             class="swiper-slide">
                            <div class="grid-container">
                                <competition-schedule-rink-schedule
                                        :rink_schedule="rink_schedule"
                                        :active_filters="active_filters">
                                </competition-schedule-rink-schedule>
                            </div>
                        </div>
                    </carousel>
                </div>
                <div v-else class="competition-schedule__notice grid-container">
                    <p>Schedule is not currently available for this competition.</p>
                </div>
            </div>
        </page>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../mixins/HasDataDependencies';
    import {CompetitionSchedule} from '../models/Competition/CompetitionSchedule';
    import {RinkSchedule} from '../models/RinkSchedule/RinkSchedule';
    import {ScheduleFilters} from '../models/RinkSchedule/ScheduleFilters';
    import {RinkNameCarousel} from '../pages/PracticeIce/RinkNameCarousel';
    import {RinkSessionCarousel} from '../pages/PracticeIce/RinkSessionCarousel';
    import CompetitionScheduleFilters from './_components/CompetitionScheduleFilters.vue';
    import CompetitionScheduleLegend from './_components/CompetitionScheduleLegend.vue';
    import CompetitionScheduleRinkSchedule from './_components/CompetitionScheduleRinkSchedule.vue';
    import {
        CompetitionScheduleFilterActiveFilters,
        CompetitionScheduleFilterOptions,
        CompetitionScheduleLegend as CompetitionScheduleLegendInterface
    } from './_contracts/CompetitionScheduleContracts';
    import {COMPETITION_SCHEDULE_VIEW_FILTERS} from './CompetitionScheduleConstants';
    import {CompetitionPortalPageMixin} from '../CompetitionPortal/_mixins';
    import {PageComponentHeaderConfiguration} from '../contracts/AppContracts';

    const vueClass = mixins(HasDataDependencies, CompetitionPortalPageMixin);

    // @vue/component
    export default vueClass.extend({
        components: {
            CompetitionScheduleFilters,
            CompetitionScheduleLegend,
            CompetitionScheduleRinkSchedule
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The active filters on the component
                 *
                 * Initial values set when filter sub-component loads
                 */
                active_filters: <CompetitionScheduleFilterActiveFilters>{
                    date: {
                        label: 'All Dates',
                        value: null
                    },
                    views: COMPETITION_SCHEDULE_VIEW_FILTERS.slice()
                },
                /**
                 * The factory method to generate the rink names carousel
                 */
                carousel_factory_method_rink_names: RinkNameCarousel.create,
                /**
                 * The factory method to generate the rink sessions carousel
                 */
                carousel_factory_method_sessions: RinkSessionCarousel.create,
                /**
                 * The Swiper instance for the rink names carousel
                 */
                carousel_rink_names: <Swiper | null>null,
                /**
                 * The Swiper instance for the rink sessions carousel
                 */
                carousel_rink_sessions: <Swiper | null>null,
                /**
                 * Data dependencies for component
                 */
                dependencies: {
                    /**
                     * Competition schedule data
                     */
                    competition_schedule: false
                },
                page_title: 'Competition Schedule'
            };
        },
        computed: {
            /**
             * The target for the admin edit link
             */
            admin_edit_link: function (): string | null {
                return this.competition_schedule.admin_edit_schedule_link;
            },
            /**
             * The active competition schedule
             */
            competition_schedule: function (): CompetitionSchedule {
                return this.$store.state.competitions.active_schedule;
            },
            /**
             * The rink schedules for display in the component.
             *
             * To facilitate perceived infinite loop for carousels, copy the first rink to the end, and the last rink to the start
             */
            display_rink_schedules: function (): RinkSchedule[] {
                const source = this.competition_schedule.rink_schedules;
                const result = source.slice();
                if (source.length < 2) {
                    return result;
                }

                result.unshift(source[source.length - 1]);
                result.push(source[0]);

                return result;

            },
            /**
             * The target for the download schedule link
             */
            download_link: function (): string | null {
                return this.competition_schedule.download_schedule_link;
            },
            /**
             * Options to filter the schedule by
             */
            filter_options: function (): CompetitionScheduleFilterOptions {
                const core = new ScheduleFilters(this.competition_schedule.unique_dates);

                return {
                    dates: core.date_filters,
                    views: COMPETITION_SCHEDULE_VIEW_FILTERS.slice()
                };
            },
            /**
             * Data for competition legend
             */
            legend_data: function (): CompetitionScheduleLegendInterface | null {
                return this.competition_schedule.legend;
            },
            /**
             * Whether there are multiple sheets in the schedule
             */
            multiple_sheets: function (): boolean {
                return this.competition_schedule.rink_schedules.length > 1;
            },
            /**
             * The configuration for the page header
             */
            page_header_override: function (): PageComponentHeaderConfiguration {
                /**
                 * @integration:
                 * Currently, if a Competition Schedule only features one sheet of ice, no message will display in the header.
                 * If you would like to display a message on schedules with only one sheet, add it below
                 */
                let lead;
                if (this.multiple_sheets) {
                    lead = 'Please swipe or tap the arrows to select an ice sheet and view the schedule.';
                }

                return {
                    ...this.page_header,
                    lead
                };
            },
            /**
             * Whether the schedule is available for the competition
             */
            schedule_available: function (): boolean {
                return this.$store.getters['competitions/active_competition_schedule_available'];
            }
        },
        watch: {
            active_filters: {
                deep: true,
                /**
                 * When active filters change, update the height of the session carousel based on DOM changes
                 */
                handler: function () {
                    this.$nextTick(() => {
                        if (this.carousel_rink_sessions) {
                            this.carousel_rink_sessions.updateAutoHeight();
                        }
                    });
                }
            },
            /**
             * If rink schedules change, update carousels to accommodate potentially new slides
             */
            display_rink_schedules: function () {
                this.$nextTick(() => {
                    if (this.carousel_rink_sessions) {
                        this.carousel_rink_sessions.update();
                    }
                    if (this.carousel_rink_names) {
                        this.carousel_rink_names.update();
                    }
                });
            }
        },
        methods: {
            /**
             * Link carousels so transitions on one trigger transition in the other
             */
            linkSwipers: function () {
                if (this.carousel_rink_sessions && this.carousel_rink_names) {
                    this.carousel_rink_sessions.controller.control = this.carousel_rink_names;
                    this.carousel_rink_names.controller.control = this.carousel_rink_sessions;
                }
            },
            /**
             * Load data dependencies.  HasDataDependencies hook
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchCompetitionSchedule')
                        .then(() => {
                            this.dependencies.competition_schedule = true;
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