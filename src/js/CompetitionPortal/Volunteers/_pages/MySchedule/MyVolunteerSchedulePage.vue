<template>
    <page class="my-volunteer-schedule-page ada-text"
          :header="page_header_override"
          :class="{'page--accent':component_loaded}">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="competition-heading"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading volunteer schedule."></component-loader>
        <div slot="content"
             class="page__content">
            <div class="my-volunteer-schedule-page__links">
                <a :href="links.download_schedule"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="icon-link icon-link--download icon-link--underline">My Schedule (PDF)
                </a>
                <a href="#"
                   class="standard-link"
                   v-on:click.prevent="contactsOverlayOpen">Volunteer Contacts
                </a>
            </div>
            <div class="my-volunteer-schedule-page__information">
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
            <div class="my-volunteer-schedule-page__schedule">
                <p v-if="!schedule.length"
                   class="text--alert">
                    There are no shifts in your schedule for this competition.
                </p>
                <div v-for="day in schedule"
                     v-else
                     :key="day.id"
                     class="schedule-card">
                    <h3 class="schedule-card__heading">
                        {{day.date_formatted}}
                    </h3>
                    <div class="schedule-card__content">
                        <my-volunteer-schedule-shift-card v-for="shift in day.shifts"
                                                          :key="shift.id"
                                                          :user_is_compliant="user_is_compliant"
                                                          :shift="shift"
                                                          v-on:compliance-click="compliance_popup_active=true"
                                                          v-on:remove="removeShift(shift)"></my-volunteer-schedule-shift-card>
                    </div>
                </div>
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
        <site-takeover v-if="contactsOverlayIsActive()"
                       :return_to_scroll_location="true"
                       v-on:close="contactsOverlayClose()">
            <my-volunteer-schedule-contacts-overlay></my-volunteer-schedule-contacts-overlay>
        </site-takeover>
    </page>
</template>
<script lang="ts">
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import mixins from 'vue-typed-mixins';
    import {CompetitionPortalPageMixin} from '../../../_mixins';
    import {CompetitionPortalVolunteerState} from '../../_store/CompetitionPortalVolunteerState';
    import {MyVolunteerSchedulePage} from './_contracts';
    import {MyVolunteerScheduleContactsOverlay, MyVolunteerScheduleShiftCard} from './_components';
    import {AppNoticeStatePayload, PageComponentHeaderConfiguration} from '../../../../contracts/AppContracts';
    import {CompetitionPortalVolunteer} from '../../_contracts';

    const extendedVue = mixins(HasDataDependencies, CompetitionPortalPageMixin);

    // @vue/component
    export default extendedVue.extend({
        components: {
            MyVolunteerScheduleShiftCard,
            MyVolunteerScheduleContactsOverlay
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether the compliance popup is active
                 */
                compliance_popup_active: false,
                /**
                 * Whether the contacts overlay is active
                 */
                contacts_overlay_active: false,
                /**
                 * Data dependencies for the page
                 */
                dependencies: {
                    volunteer_schedule: false
                },
                /**
                 * Title to display in page header
                 */
                page_title: 'My Volunteer Schedule'
            };
        },
        computed: {
            /**
             * Links associated with the volunteer schedule
             */
            links: function (): CompetitionPortalVolunteer.MyVolunteerScheduleLinks {
                return this.$store.state.competition_portal.volunteer.links;
            },
            /**
             * Override of page header binding
             */
            page_header_override: function (): PageComponentHeaderConfiguration {
                return {
                    ...this.page_header,
                    lead: 'This page contains all shifts you have selected and are subject to change.'
                };
            },
            /**
             * The days in the schedule
             */
            schedule: function (): MyVolunteerSchedulePage.ScheduleDay[] {
                return this.$store.state.competition_portal.volunteer.user_schedule;
            },
            /**
             * Link href to manage compliance
             */
            compliance_link_target: function (): string {
                return this.links.user_compliance;
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
        },
        methods: {
            /**
             * Close the contacts overlay
             */
            contactsOverlayClose: function (): void {
                this.contacts_overlay_active = false;
            },
            /**
             * Whether the contacts overlay is currently active
             */
            contactsOverlayIsActive: function (): boolean {
                return this.contacts_overlay_active;
            },
            /**
             * Open the contacts overlay
             */
            contactsOverlayOpen: function (): void {
                this.contacts_overlay_active = true;
            },
            /**
             * Load data dependencies for component
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/volunteer/fetchMyVolunteerSchedule')
                        .then(() => {
                            this.dependencies.volunteer_schedule = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Remove a shift from schedule
             */
            removeShift: function (shift: MyVolunteerSchedulePage.Shift) {
                this.$store.dispatch('app/confirmAction', {
                    message: 'Are you sure you want to remove this shift from your schedule?',
                    action: () => {
                        return new Promise((resolve) => {
                            this.$store.dispatch('competition_portal/volunteer/removeShift', shift)
                                .then(() => {
                                    resolve();
                                })
                                .catch((error: string) => {
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
            }
        }
    });
</script>