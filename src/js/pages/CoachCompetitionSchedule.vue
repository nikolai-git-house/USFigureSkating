<script lang="ts">
    import Vue from 'vue';
    import Swiper from 'swiper/dist/js/swiper.min';
    import RinkScheduleComponent from './PracticeIce/RinkSchedule.vue';
    import {RinkNameCarousel} from './PracticeIce/RinkNameCarousel';
    import {RinkSessionCarousel} from './PracticeIce/RinkSessionCarousel';
    import {DateFilterContract, RinkScheduleActiveFilters} from '../contracts/RinkScheduleFiltersContracts';
    import {ScheduleFilters} from '../models/RinkSchedule/ScheduleFilters';
    import {RinkSchedule} from '../models/RinkSchedule/RinkSchedule';
    import {SessionCollection} from '../models/Collections/SessionCollection';
    import {Session} from '../models/Sessions/Session';
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../mixins/HasDataDependencies';
    import {CompetitionPortalPageMixin} from '../CompetitionPortal/_mixins';
    import {PageComponentHeaderConfiguration} from '../contracts/AppContracts';

    const vueClass = mixins(HasDataDependencies, CompetitionPortalPageMixin);
    // @vue/component
    export default vueClass.extend({
        components: {
            'rink-schedule': RinkScheduleComponent
        },
        data: function () {
            return {
                /**
                 * The primary carousel
                 */
                // eslint-disable-next-line
                Swiper: <Swiper | undefined>undefined,
                /**
                 * The secondary carousel
                 */
                // eslint-disable-next-line
                Swiper2: <Swiper | undefined>undefined,
                /**
                 * The index of the active carousel slide
                 */
                active_slide_index: 0,
                /**
                 * The active session filters
                 */
                active_filters: new RinkScheduleActiveFilters(),
                /**
                 * The available session filters to choose from
                 */
                available_filters: {
                    dates: <DateFilterContract[]>[]
                },
                /**
                 * The rink schedules within the schedule
                 */
                rink_schedules: <RinkSchedule[]>[],
                /**
                 * Data dependencies required for the page to load
                 */
                dependencies: {
                    competition_schedule: false
                },
                /**
                 * Whether the legend is active
                 */
                legend_active: false,
                /**
                 * The title to display in the page header
                 */
                page_title: 'Competition Schedule'
            };
        },
        computed: {
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
                    lead = 'Swipe or tap the arrows to move between the ice sheets associated with the schedule.';
                }

                return {
                    ...this.page_header,
                    lead
                };
            },
            /**
             * Whether the competition schedule is available to display
             */
            schedule_available: function (): boolean {
                return this.$store.state.competitions.active_competition_schedule_available_override;
            },
            /**
             * The sessions the coach has skaters registered for
             */
            coached_sessions: function (): SessionCollection {
                return this.$store.getters['coach/active_competition_skater_sessions'];
            },
            /**
             * Whether there are multiple rink schedules
             */
            multiple_sheets: function (): boolean {
                return this.$store.state.competitions.active_schedule.rink_schedules.length > 1;
            }
        },
        /**
         * On component update, rebuild the carousels
         */
        updated: function () {
            if (this.Swiper) {
                this.Swiper.update();
            }
        },
        methods: {
            /**
             * Attempt to fetch the data for practice ice.
             *
             * If it's been fetched already, or if the active competition id isn't set yet, don't load
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchCoachCompetitionSchedule')
                        .then(() => {
                            this.dependencies.competition_schedule = true;
                            this.importData();
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Create the available filters for sessions
             *
             * Dates for all unique session dates in the competition
             * Active view filter is the entire competition schedule ('event_schedule')
             */
            prepareFilters: function () {
                const filters = new ScheduleFilters(this.$store.state.competitions.active_schedule.unique_dates);
                this.available_filters.dates = filters.date_filters;
                if (filters.default_date_filter) {
                    this.active_filters.date = filters.default_date_filter.value;
                }
                this.active_filters.view = ['event_schedule'];

            },
            /**
             * Set the initial date filter to the date of the first event session in the coach's schedule
             */
            setDefaultDateFilter: function () {
                const first_session_date = this.coached_sessions.filterType(['event'])
                    .firstDate();
                if (!first_session_date) {
                    return;
                }
                this.active_filters.date = first_session_date.getTime();
            },
            /**
             * In order to create perceived infinite loop of rinks,
             * Copy the last rink to the start and the first to the end
             */
            prepareSchedule: function () {
                if (this.rink_schedules.length > 0) {
                    const first = this.rink_schedules[0];
                    const last = this.rink_schedules[this.rink_schedules.length - 1];
                    this.rink_schedules.unshift(last);
                    this.rink_schedules.push(first);
                }
            },
            /**
             * Initialize the rink name and rink session carousels
             */
            initSwipers: function () {
                this.Swiper2 = RinkNameCarousel.create();
                this.Swiper = RinkSessionCarousel.create();
                this.Swiper.controller.control = this.Swiper2;
                this.Swiper2.controller.control = this.Swiper;
                const vm = this;
                window.addEventListener('resize', function () {
                    if (vm.Swiper2) {
                        vm.Swiper2.update();
                    }
                    if (vm.Swiper) {
                        vm.Swiper.update();
                    }
                });
            },
            /**
             * Handle the situation in which a filter has changed, changing the height of the resulting session list
             *
             * Inform carousels to update their heights
             */
            childFilterChanged: function () {
                this.updateSwiperAutoHeight();
            },
            /**
             * Update the height of the Rink Session Carousel following DOM changes
             */
            updateSwiperAutoHeight: function () {
                const vm = this;

                return new Promise(function (resolve) {
                    Vue.nextTick(function () {
                        if (vm.Swiper) {
                            vm.Swiper.updateAutoHeight();
                        }
                        resolve();
                    });
                });

            },
            /**
             * After data fetch, load the proper data into the component
             */
            importData: function () {
                this.rink_schedules = this.$store.state.competitions.active_schedule.rink_schedules.slice();
                if (this.rink_schedules.length < 1 || !this.schedule_available) {
                    return;
                }
                const vm = this;
                this.prepareSchedule();
                this.prepareFilters();
                this.setDefaultDateFilter();
                this.$nextTick(function () {
                    vm.initSwipers();
                });
            },
            /**
             * Get the skaters for a session
             */
            session_skaters: function (session: Session): string[] {
                return this.$store.getters['coach/session_skaters'](session.id);
            }
        }
    });
</script>