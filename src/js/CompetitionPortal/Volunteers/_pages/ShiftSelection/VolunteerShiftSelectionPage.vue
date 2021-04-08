<template>
    <page class="volunteer-shift-selection-page ada-text"
          :class="{'page--accent':component_loaded}"
          :header="page_header_override">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="competition-heading"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading shift selection."></component-loader>
        <div slot="content"
             class="competition-schedule">
            <div class="page--accent__standard-content">
                <carousel v-model="carousel_instance_names"
                          class="rink-name-carousel"
                          :show_navigation="display_locations.length>1"
                          :factory_method="carousel_factory_names"
                          v-on:init="swipersInit">
                    <div v-for="(location, index) in display_locations"
                         :key="index"
                         class="rink-name-carousel__slide swiper-slide">
                        <h3 class="rink-name">
                            <span class="rink-name__text">
                                {{location.name}}
                            </span>
                        </h3>
                    </div>
                </carousel>
            </div>
            <div v-if="schedule_available"
                 class="volunteer-shift-selection-page__content">
                <div class="grid-container">
                    <div class="volunteer-shift-selection-page__filters">
                        <shift-selection-filters v-on:change="filtersOnChange"></shift-selection-filters>
                    </div>
                    <div class="volunteer-shift-selection-page__links">
                        <div class="volunteer-shift-selection-page__links__column">
                            <a :href="links.download_schedule"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="icon-link icon-link--download">Full Schedule (PDF)
                            </a>
                        </div>
                        <div class="volunteer-shift-selection-page__links__column">
                            <span>{{result_count}} results</span>
                        </div>
                    </div>
                    <div class="volunteer-shift-selection-page__information">
                        <page-alert slot="information"
                                    class="page-alert page-alert--notice page-alert--medium">
                            <div slot="trigger_text">
                                Key Information
                            </div>
                            <div slot="expand_content">
                                <volunteer-page-key></volunteer-page-key>
                            </div>
                        </page-alert>
                    </div>
                </div>
                <div class="volunteer-shift-selection-page__shifts">
                    <carousel v-model="carousel_instance_schedules"
                              :factory_method="carousel_factory_schedules"
                              :show_navigation="false"
                              class="competition-schedule__rink-sessions-carousel"
                              v-on:init="swipersInit">
                        <div v-for="(location,index) in display_locations"
                             :key="index"
                             class="swiper-slide">
                            <shift-selection-location-schedule v-if="renderSchedule(index)"
                                                               :location="location"
                                                               :user_is_compliant="user_is_compliant"
                                                               :disable_interactions="disable_interactions"
                                                               v-on:compliance-click="compliance_popup_active=true"
                                                               v-on:shift-remove="removeShift"
                                                               v-on:shift-select="selectShift"
                                                               v-on:shift-toggle="handleShiftToggle"></shift-selection-location-schedule>
                        </div>
                    </carousel>
                </div>
            </div>
            <div v-else
                 class="grid-container">
                <p class="text--alert">
                    Shift selection is not currently available.
                </p>
            </div>
        </div>
        <popup v-if="compliance_popup_active"
               class="popup popup--info popup--md"
               :math_center="true"
               v-on:close-popup="compliance_popup_active=false">
            <span slot="heading-text">
                Compliance Information
            </span>
            <div slot="content">
                <p>
                    Some shifts require you to be compliant. You can select a shift that requires compliance, but you
                    will need to be compliant before the shift begins.
                </p>
                <p>
                    To manage your compliance status, please go to your
                    <a :href="compliance_link_target"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="standard-link">
                        <span>My Profile</span>
                    </a>
                    page.
                </p>
            </div>
        </popup>
        <site-overlay transition_name="fade"
                      :open_fn="overlayIsActive"
                      class="site-overlay--faded"
                      :show_header="false"
                      :lock_scroll="false">
            <div class="confirmation-overlay">
                <div class="confirmation-overlay__content">
                    <div class="confirmation-overlay__dialog">
                        <div class="confirmation-overlay__dialog__icon">
                            <animated-check-icon v-if="staged_selection_is_added"
                                                 ref="check"></animated-check-icon>
                            <i v-else
                               class="icon-pending-thin"></i>
                        </div>
                        <div class="confirmation-overlay__dialog__message">
                            {{confirmation_message}}
                        </div>
                        <div>
                            <button class="button button--small"
                                    v-on:click="closeConfirmationOverlay">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </site-overlay>
    </page>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {CompetitionPortalPageMixin} from '../../../_mixins';
    import {AppNoticeStatePayload, PageComponentHeaderConfiguration} from '../../../../contracts/AppContracts';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import {CompetitionPortalVolunteerState} from '../../_store/CompetitionPortalVolunteerState';
    import {ShiftSelectionFilters, ShiftSelectionLocationSchedule} from './_components';
    import {VolunteerShiftSelectionState} from './_store/VolunteerShiftSelectionState';
    import {VolunteerShiftSelection, VolunteerShiftSelectionPage} from './_contracts';
    import {RinkNameCarousel} from '../../../../pages/PracticeIce/RinkNameCarousel';
    import {RinkSessionCarousel} from '../../../../pages/PracticeIce/RinkSessionCarousel';
    import {AnimatedCheckInterface} from '../../../../components/AnimatedIcons/AnimatedCheckIcon.vue';
    import {CompetitionPortalVolunteer} from '../../_contracts';

    const vueClass = mixins(CompetitionPortalPageMixin, HasDataDependencies);

    // @vue/component
    export default vueClass.extend({
        components: {
            ShiftSelectionLocationSchedule,
            ShiftSelectionFilters
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The index of the currently active location slide
                 */
                active_slide_index: 1,
                /**
                 * The factory method to generate the location names carousel
                 */
                carousel_factory_names: RinkNameCarousel.create,
                /**
                 * The factory method to generate the location shifts carousel
                 */
                carousel_factory_schedules: RinkSessionCarousel.create,
                /**
                 * The Swiper instance for the location names carousel
                 */
                carousel_instance_names: <Swiper | null>null,
                /**
                 * The Swiper instance for the location shifts carousel
                 */
                carousel_instance_schedules: <Swiper | null>null,
                /**
                 * Data dependencies required for the component to function
                 */
                dependencies: {
                    shift_selection: false
                },
                /**
                 * Whether to disable interactions with shifts
                 */
                disable_interactions: false,
                /**
                 * Title to display in page header
                 */
                page_title: 'Shift Selection',
                /**
                 * Whether the compliance popup is active
                 */
                compliance_popup_active: false
            };
        },
        computed: {
            /**
             * The target for the link in the compliance popups
             */
            compliance_link_target: function (): string {
                return this.links.user_compliance;
            },
            /**
             * The confirmation overlay message
             */
            confirmation_message: function (): string {
                if (this.staged_selection_is_added) {
                    return 'Your shift has been added.';
                }

                return 'Your request has been submitted.';
            },
            /**
             * The locations for display in the component.
             *
             * To facilitate perceived infinite loop for carousels, copy the first location to the end, and the last location to the start
             */
            display_locations: function (): VolunteerShiftSelectionPage.Location[] {
                const source = this.locations;
                const result = source.slice();
                if (source.length < 2) {
                    return result;
                }

                result.unshift(source[source.length - 1]);
                result.push(source[0]);

                return result;
            },
            /**
             * Links associated with shift selection
             */
            links: function (): CompetitionPortalVolunteer.ShiftSelectionLinks {
                return this.$store.state.competition_portal.volunteer.shift_selection.links;
            },
            /**
             * The master locations list containing the volunteer shifts
             */
            locations: function (): VolunteerShiftSelectionPage.Location[] {
                return this.$store.state.competition_portal.volunteer.shift_selection.locations;
            },
            /**
             * Whether there are multiple locations in the component
             */
            multiple_locations: function (): boolean {
                return this.locations.length > 1;
            },
            /**
             * Override for page header configuration
             */
            page_header_override: function (): PageComponentHeaderConfiguration {
                /**
                 * @integration:
                 * Currently, if a Competition Schedule only features one sheet of ice, no message will display in the header.
                 * If you would like to display a message on schedules with only one sheet, add it below
                 */
                let lead;// = 'There is only one location to volunteer.';
                if (this.multiple_locations) {
                    lead = 'Swipe or tap the arrows to browse through locations to volunteer.';
                }

                return {
                    ...this.page_header,
                    lead
                };
            },
            /**
             * The count of filtered shift results
             */
            result_count: function (): number {
                return this.$store.getters['competition_portal/volunteer/shift_selection/shifts_filtered_count'];
            },
            /**
             * Whether the shift selection schedule is available
             */
            schedule_available: function () {
                return !!this.locations.length && !!this.$store.state.competition_portal.volunteer.shift_selection.shifts.length;
            },
            /**
             * The staged result from selecting a shift
             */
            staged_selection: function (): VolunteerShiftSelection.PendingShiftSelection | null {
                return this.$store.state.competition_portal.volunteer.shift_selection.staged_selection;
            },
            /**
             * Whether the staged selection represents an add (rather than pending)
             */
            staged_selection_is_added: function (): boolean {
                return !!this.staged_selection && this.staged_selection.selection_result.shift_status === 'approved';
            },
            /**
             * Whether the current user is compliant
             */
            user_is_compliant: function (): boolean {
                return this.$store.state.competition_portal.volunteer.user_is_compliant;
            }
        },
        /**
         * Lifecycle hook before component created
         *
         * Register state module if it's not already registered
         */
        beforeCreate: function () {
            if (!this.$store.state.competition_portal.volunteer) {
                this.$store.registerModule(['competition_portal', 'volunteer'], CompetitionPortalVolunteerState);
            }
            if (!this.$store.state.competition_portal.volunteer.shift_selection) {
                this.$store.registerModule(['competition_portal', 'volunteer', 'shift_selection'], VolunteerShiftSelectionState);
            }
        },
        methods: {
            /**
             * Close the confirmation overlay
             */
            closeConfirmationOverlay: function (): void {
                this.$store.dispatch('competition_portal/volunteer/shift_selection/resolveStagedSelection');
                this.disable_interactions = false;
            },
            /**
             * Handle change in filters
             */
            filtersOnChange: function (): void {
                this.$nextTick(() => {
                    this.updateScheduleCarouselHeight();
                });
            },
            /**
             * Handle the toggle event of a shift in the list
             */
            handleShiftToggle: function (): void {
                this.$nextTick(() => {
                    this.updateScheduleCarouselHeight();
                });
            },
            /**
             * Load data needed by the page to function
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/volunteer/shift_selection/fetch')
                        .then(() => {
                            this.dependencies.shift_selection = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Whether the confirmation message is active
             */
            overlayIsActive: function (): boolean {
                return !!this.staged_selection;
            },
            /**
             * Remove a shift
             */
            removeShift: function (shift: VolunteerShiftSelectionPage.Shift): void {
                this.$store.dispatch('app/confirmAction', {
                    message: 'Are you sure you want to remove this shift from your schedule?',
                    action: () => {
                        return new Promise((resolve) => {
                            this.disable_interactions = true;
                            this.$store.dispatch('competition_portal/volunteer/shift_selection/removeShift', shift)
                                .then(() => {
                                    this.disable_interactions = false;
                                    resolve();
                                })
                                .catch((error: string) => {
                                    this.disable_interactions = false;
                                    const payload: AppNoticeStatePayload = {
                                        notice: error,
                                        is_danger: true
                                    };
                                    this.$store.commit('app/setNotice', payload);
                                    resolve();
                                });
                        });
                    },
                    is_promise: true
                });
            },
            /**
             * Whether the sessions in a location schedule slide should be rendered
             *
             * Prevents rendering excess session components that aren't visible to the user
             */
            renderSchedule: function (index: number): boolean {
                const min = this.active_slide_index - 1;
                const max = this.active_slide_index + 1;

                return index >= min && index <= max;
            },
            /**
             * Select a shift
             */
            selectShift: function (shift: VolunteerShiftSelectionPage.Shift): void {
                this.disable_interactions = true;
                this.$store.dispatch('competition_portal/volunteer/shift_selection/selectShift', shift)
                    .then(() => {
                        // disable_interactions set to false upon confirmation overlay close
                        this.$nextTick(() => {
                            const check_icon: AnimatedCheckInterface = this.$refs.check as AnimatedCheckInterface;
                            if (check_icon) {
                                check_icon.play();
                            }
                        });
                    })
                    .catch((error: string) => {
                        this.disable_interactions = false;
                        const payload: AppNoticeStatePayload = {
                            notice: error,
                            is_danger: true
                        };
                        this.$store.commit('app/setNotice', payload);
                    });
            },
            /**
             * Handle swiper init event
             */
            swipersInit: function () {
                const schedules_carousel: Swiper | null = this.carousel_instance_schedules;
                const names_carousel: Swiper | null = this.carousel_instance_names;
                if (schedules_carousel && names_carousel) {
                    this.swipersLink(schedules_carousel, names_carousel);
                    this.swipersInitConditionalIndexing(schedules_carousel);
                }
            },
            /**
             * Initialize active carousel slide indexing
             *
             * Purpose:
             * 1. Track active slide index to facilitate removal of session component instances outside of the  visible context.
             * 2. Resize session carousel as session component instances are added/removed
             * - This prevents UI sluggishness in iOS.  Non-visible sessions don't result in excessive event listener attachments
             *
             * 1. Track the active slide index
             * 2. On change, update height of carousel to prevent clipping
             */
            swipersInitConditionalIndexing: function (schedules_carousel: Swiper) {
                schedules_carousel.on('slideChange', () => {
                    this.$set(this, 'active_slide_index', schedules_carousel.activeIndex);
                    this.$nextTick(() => {
                        schedules_carousel.updateAutoHeight();
                    });
                });
            },
            /**
             * Link carousels so transitions on one trigger transition in the other
             */
            swipersLink: function (schedules_carousel: Swiper, names_carousel: Swiper) {
                schedules_carousel.controller.control = names_carousel;
                names_carousel.controller.control = schedules_carousel;
            },
            /**
             * Recalculate the shift carousel height to make up for shift changes
             */
            updateScheduleCarouselHeight: function () {
                if (this.carousel_instance_schedules) {
                    this.carousel_instance_schedules.update();
                }
            }
        }
    });
</script>