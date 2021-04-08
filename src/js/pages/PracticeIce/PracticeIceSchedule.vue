<script lang="ts">
    /* eslint-disable */
    import {
        DateFilterContract,
        FilterContract,
        RinkScheduleActiveFilters,
        ViewFilter
    } from '../../contracts/RinkScheduleFiltersContracts';
    import PracticeIceFilters from './PracticeIceFilters.vue';
    import {RinkNameCarousel} from './RinkNameCarousel';
    import RinkScheduleComponent from './RinkSchedule.vue';
    import {RinkSessionCarousel} from './RinkSessionCarousel';
    import {ScheduleFilters} from '../../models/RinkSchedule/ScheduleFilters';
    import ScrollHelpers from '../../helpers/scroll';
    import Swiper from 'swiper/dist/js/swiper.min';
    import Vue from 'vue';
    import {CompetitionPortalPracticeIceState} from '../../CompetitionPortal/_store/CompetitionPortalPracticeIceState';
    import mixins from 'vue-typed-mixins';
    import {CompetitionPortalPageMixin} from '../../CompetitionPortal/_mixins';
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import {NullableSalesWindowKey} from '../../contracts/AppContracts';

    const vueClass = mixins(CompetitionPortalPageMixin, HasDataDependencies);
    //@vue/component
    export default vueClass.extend({
        components: {
            'practice-ice-filters': PracticeIceFilters,
            'rink-schedule': RinkScheduleComponent
        },
        /**
         * Reactive data
         */
        data: function () {
            let initial_swiper!: Swiper;
            const default_dates: DateFilterContract[] = [];
            const default_views: FilterContract[] = [];

            return {
                Swiper: initial_swiper,
                Swiper2: initial_swiper,
                active_slide_index: 0,
                is_credits_active: false,
                active_filters: new RinkScheduleActiveFilters(),
                available_filters: {
                    views: default_views,
                    dates: default_dates
                },
                rink_schedules: [],
                dependencies: {
                    practice_ice: false
                },
                page_title: 'Practice Ice'
            };
        },
        computed: {
            /**
             * Whether PI is available for the requested competition
             */
            practice_ice_available: function () {
                return this.rink_schedules.length;
            },
            /**
             * Whether selections are blocked for sessions
             */
            selections_blocked: function (): boolean {
                const blocked_window_keys = ['none', 'pre_purchase'];
                return this.is_team_version || blocked_window_keys.indexOf(this.active_sales_window) !== -1;
            },
            /**
             * The active sales window on the competition
             */
            active_sales_window: function (): NullableSalesWindowKey {
                return this.$store.getters['competitions/active_sales_window'];
            },
            /**
             * Referred to in template as well as VM
             */
            skater_schedule: function () {
                return this.$store.state.skater.active_schedule;
            },
            /**
             * Hide the footer when credits overlay active during selection or on site sales
             */
            show_footer: function () {
                if (this.is_team_version) {
                    return false;
                }
                if (['selection', 'on_site'].indexOf(this.active_sales_window) !== -1 && this.is_credits_active) {
                    return false;
                }

                return true;
            },
            /**
             * Whether there are multiple rink schedules
             */
            multiple_sheets: function (): boolean {
                return this.$store.state.competitions.active_schedule.rink_schedules.length > 1;
            },
            /**
             * [2020-07-13] Whether page is in team view mode
             */
            is_team_version: function (): boolean {
                return this.$store.state.competition_portal.is_team_view;
            }
        },
        beforeCreate: function () {
            if (!this.$store.state.competition_portal.practice_ice) {
                this.$store.registerModule(['competition_portal', 'practice_ice'], CompetitionPortalPracticeIceState);
            }
        },
        /**
         * When component reactive data changes, trigger update on carousel
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
                return new Promise((resolve,reject)=>{
                    this.$store.dispatch('competition_portal/practice_ice/fetch')
                        .then(()=>{
                            this.dependencies.practice_ice = true;
                            this.importData();
                            resolve();
                        })
                        .catch(()=>{
                            reject();
                        });
                });
            },
            /**
             * Create the available filters for sessions
             *
             * Dates for all unique session dates in the competition
             * Views from default configured available set
             */
            prepareFilters: function () {
                const filters = new ScheduleFilters(this.$store.state.competitions.active_schedule.unique_dates);
                this.available_filters.dates = filters.date_filters;
                this.available_filters.views = filters.view_filters;
                if (filters.default_date_filter) {
                    this.active_filters.date = filters.default_date_filter.value;
                }
            },
            /**
             * Set the initial date filter to the date of the first session in the skater's schedule
             */
            setDefaultDateFilter: function () {
                const first_session_date = this.skater_schedule.sessions.filterType(['event'])
                    .firstDate();
                if (!first_session_date) {
                    return;
                }
                this.active_filters.date = first_session_date.getTime();
            },
            /**
             * Set the initial view filter based on the context in which the page is being viewed
             */
            setDefaultViewFilter: function () {
                const value: ViewFilter[] = ["available_practice_ice", "my_schedule"];

                if (this.is_team_version) {
                    value.push('event_schedule');
                }
                this.active_filters.view = value;
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
                    vm.Swiper2.update();
                    vm.Swiper.update();
                });
            },
            /**
             * Handle the situation in which a filter has changed, changing the height of the resulting session list
             *
             * Need to inform carousels to update their heights
             */
            childFilterChanged: function () {
                this.updateSwiperAutoHeight();
            },
            /**
             * When session feedback changes, update the Swiper height.
             * Additionally, if requested, scroll to the bottom of the page
             */
            sessionFeedbackChange: function (scroll_to_bottom: boolean) {
                this.updateSwiperAutoHeight()
                    .then(function () {
                        if (scroll_to_bottom) {
                            const scrolling_element = ScrollHelpers.getRootScrollingElement();
                            const scroll_height = scrolling_element.scrollHeight;
                            ScrollHelpers.scrollToOffset(scroll_height);
                        }
                    });
            },
            /**
             * Update the height of the swiper following DOM changes
             */
            updateSwiperAutoHeight: function () {
                const vm = this;

                return new Promise(function (resolve) {
                    Vue.nextTick(function () {
                        vm.Swiper.updateAutoHeight();
                        resolve();
                    });
                });

            },
            /**
             * Method passed to credits overlay to permit opening and closing of credit purchase overlay
             */
            showCredits: function () {
                return this.is_credits_active;
            },

            /**
             * When session feedback is active, lock the swipers to prevent navigation to a new rink
             */
            lockSwipers: function () {
                this.Swiper2.detachEvents();
                this.Swiper.detachEvents();
            },
            /**
             * After session feedback has gone away, unlock swipers to allow for rink navigation again.
             *
             * If we have 3 rink schedules, there's only 1 "real" rink schedule.  In this case, we don't want to unlock
             */
            unlockSwipers: function () {
                if (this.rink_schedules.length === 3) {
                    return;
                }
                this.Swiper2.attachEvents();
                this.Swiper.attachEvents();
            },
            /**
             * After data fetch, load the proper data into the component
             */
            importData: function () {
                this.rink_schedules = this.$store.state.competitions.active_schedule.rink_schedules.slice();
                if (this.rink_schedules.length < 1) {
                    return;
                }
                const vm = this;
                this.prepareSchedule();
                this.prepareFilters();
                this.setDefaultDateFilter();
                this.setDefaultViewFilter();
                Vue.nextTick(function () {
                    vm.initSwipers();
                });
            }
        }
    });
</script>