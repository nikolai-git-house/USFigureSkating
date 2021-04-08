<template>
    <div class="view-competition-page">
        <page :class="{'page--accent':component_loaded && competition.is_ems}"
              :header="page_header">
            <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                             slot="pre-header"
                                             v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
            <component-loader v-if="!component_loaded"
                              slot="loader"
                              :container="true"
                              :source="this"
                              error_message="Error loading competition information."></component-loader>
            <div v-else
                 slot="content"
                 class="view-competition-page__content">
                <div class="view-competition-page__primary page--accent__standard-content">
                    <div class="grid-container">
                        <p v-if="!competition.is_ems" class="view-competition-page__non-ems-notice">
                            This competition is not using EMS. Refer to announcement and competition website above.
                        </p>
                        <competition-user-navigation
                                :class="{'competition-user-navigation--no-bottom-border':competition.is_ems}"
                                :links="user_navigation">
                        </competition-user-navigation>
                    </div>
                </div>
                <div v-if="competition.is_ems"
                     class="view-competition-page__actions page__accent-content grid-container">
                    <div v-if="registration_cta_configuration"
                         class="card">
                        <div class="card__banners">
                            <div v-if="user_is_registered"
                                 class="competition-tile-banner competition-tile-banner--registered">
                                Registered
                            </div>
                        </div>
                        <div class="card__content card__content--equal">
                            <h3 class="card__title">
                                For Skaters
                            </h3>
                            <competition-registration-cta
                                    :competition="registration_cta_configuration">
                            </competition-registration-cta>
                        </div>
                    </div>
                    <div v-if="show_for_teams_cta"
                         class="card">
                        <div v-if="is_team_view"
                             class="card__banners">
                            <div v-if="team_is_registered"
                                 class="competition-tile-banner competition-tile-banner--registered">
                                Registered
                            </div>
                        </div>
                        <div class="card__content card__content--equal">
                            <h3 class="card__title">
                                For Teams
                            </h3>
                            <competition-registration-cta v-if="is_team_view"
                                                          :interrupt_click="true"
                                                          :competition="team_registration_cta_configuration"
                                                          v-on:open-registration="openTeamRegistration"></competition-registration-cta>
                            <div :class="{'card__section':is_team_view}">
                                <a :href="change_view_link"
                                   class="button button--block">Change View
                                </a>
                            </div>
                        </div>
                    </div>
                    <div v-if="volunteer_cta_configuration"
                         class="card">
                        <div class="card__content card__content--equal">
                            <h3 class="card__title">
                                For Volunteers
                            </h3>
                            <competition-volunteer-cta
                                    :source="volunteer_cta_configuration"
                                    v-on:request="beginVolunteerRequest"></competition-volunteer-cta>
                        </div>
                    </div>
                </div>
            </div>
        </page>
        <site-takeover
                v-if="volunteer_request_active"
                :return_to_scroll_location="true"
                v-on:close="closeVolunteerRequest">
            <volunteer-opportunities-request v-on:complete-local="handleVolunteerRequestCompletion"></volunteer-opportunities-request>
            <site-overlay transition_name="fade"
                          :open_fn="confirmationOverlayIsActive"
                          class="site-overlay--faded"
                          :show_header="false"
                          :lock_scroll="false"
                          v-on:entered="dialogEnter">
                <div class="confirmation-overlay">
                    <div class="confirmation-overlay__content">
                        <div class="confirmation-overlay__dialog">
                            <div class="confirmation-overlay__dialog__icon">
                                <animated-check-icon ref="check"></animated-check-icon>
                            </div>
                            <div class="confirmation-overlay__dialog__message confirmation-overlay__dialog__message--large">
                                {{confirmation_message}}
                            </div>
                            <div>
                                <button class="button button--small" v-on:click="closeConfirmation">
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </site-overlay>
        </site-takeover>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import CompetitionVolunteerCta from '../../components/CompetitionVolunteerCTA/CompetitionVolunteerCta.vue';
    import {CompetitionVolunteerCtaConfiguration} from '../../components/CompetitionVolunteerCTA/CompetitionVolunteerCtaContracts';
    import VolunteerOpportunitiesRequest
        from '../../components/VolunteerOpportunities/VolunteerOpportunitiesRequest.vue';
    import {CompetitionRegistrationCtaConfiguration} from '../../contracts/app/CompetitionRegistrationContracts';
    import {VolunteerRequestStandaloneCompletionResponse} from '../../contracts/app/VolunteerOpportunitiesContracts';
    import HasConfirmationOverlay from '../../mixins/HasConfirmationOverlay';
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import {VolunteerOpportunitiesState} from '../../store/Modules/VolunteerOpportunitiesState';
    import {ViewCompetitionCompetition} from './ViewCompetitionCompetition';
    import CompetitionPortalPageMixin from '../../CompetitionPortal/_mixins/CompetitionPortalPageMixin';
    import {DataNavigationLinkComponent} from '../../CompetitionPortal/_components/DataNavigationLink/_contracts';
    import {TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME} from '../../config/AppConfig';
    import {CompetitionPortalAppService} from '../../CompetitionPortal/_services';

    const vueClass = mixins(HasDataDependencies, HasConfirmationOverlay, CompetitionPortalPageMixin);
    // @vue/component
    export default vueClass.extend({
        components: {
            CompetitionVolunteerCta,
            VolunteerOpportunitiesRequest
        },
        /**
         * Reactive Data
         */
        data: function () {
            return {
                /**
                 * The confirmation message following a volunteer request submission
                 */
                confirmation_message: '',
                /**
                 * Data dependencies required for component
                 */
                dependencies: {
                    competition: false
                }
            };
        },
        computed: {
            /**
             * Link target for "Change View" links
             */
            change_view_link: function (): string {
                return this.competition.links.select_competition_entity;
            },
            /**
             * The competition for the page
             */
            competition: function (): ViewCompetitionCompetition {
                return this.$store.state.competitions.view_competition_competition;
            },
            /**
             * Whether the page is in team view mode
             */
            is_team_view: function (): boolean {
                return this.$store.state.competition_portal.is_team_view;
            },
            /**
             * The configuration for the registration CTA
             */
            registration_cta_configuration: function (): CompetitionRegistrationCtaConfiguration | null {
                return this.competition.registration_cta_configuration || null;
            },
            /**
             * Whether to show the "For Teams" CTA
             */
            show_for_teams_cta: function (): boolean {
                return this.is_team_view || this.$store.state.competition_portal.multiple_competition_views_available;
            },
            /**
             * Whether the current team viewing the page is registered for the competition
             */
            team_is_registered: function (): boolean {
                if (this.team_registration_cta_configuration) {
                    return this.team_registration_cta_configuration.user_registration_status === 'registered';
                }

                return false;
            },
            /**
             * The configuration for the "For Teams" registration CTA
             */
            team_registration_cta_configuration: function (): CompetitionRegistrationCtaConfiguration | null {
                return this.competition.team_registration_cta_configuration || null;
            },
            /**
             * Whether the user is registered for the competition
             */
            user_is_registered: function (): boolean {
                if (this.registration_cta_configuration) {
                    return this.registration_cta_configuration.user_registration_status === 'registered';
                }

                return false;
            },
            /**
             * The list of links for the competition user nav
             */
            user_navigation: function (): DataNavigationLinkComponent.DataNavigationLink[] {
                return this.competition.user_navigation;
            },
            /**
             * The configuration for the volunteer CTA
             */
            volunteer_cta_configuration: function (): CompetitionVolunteerCtaConfiguration | null {
                return this.competition.volunteer_cta_configuration || null;
            },
            /**
             * Whether the opportunity request component is active
             */
            volunteer_request_active: function () {
                return this.$store.state.volunteer_opportunities.request_active;
            }
        },
        /**
         * Upon creation, register volunteer opportunities state if it hasn't already been registered
         */
        created: function () {
            if (typeof this.$store.state.volunteer_opportunities === 'undefined') {
                this.$store.registerModule('volunteer_opportunities', VolunteerOpportunitiesState);
            }
            this.$store.commit('volunteer_opportunities/configure', {
                is_standalone: true
            });
        },
        /**
         * Upon destruction, unregister volunteer opportunities module
         */
        destroyed: function () {
            this.$store.dispatch('volunteer_opportunities/reset');
            this.$store.unregisterModule('volunteer_opportunities');
        },
        methods: {
            /**
             * After confirmation closes, reset the confirmation message to default and close the volunteer request
             */
            afterCloseConfirmation: function () {
                this.confirmation_message = '';
                this.closeVolunteerRequest();
            },
            /**
             * Begin a volunteer request for the competition
             */
            beginVolunteerRequest: function () {
                this.$store.dispatch('volunteer_opportunities/beginRequest', this.competition.id);
            },
            /**
             * Close the volunteer request for the competition
             */
            closeVolunteerRequest: function () {
                this.$store.dispatch('volunteer_opportunities/exitAll');
            },
            /**
             * Handle the completion event on the volunteer request
             *
             * 1. Close the volunteer request component
             * 2. Activate the confirmation with the appropriate message
             */
            handleVolunteerRequestCompletion: function (response: VolunteerRequestStandaloneCompletionResponse) {
                this.confirmation_active = true;
                this.confirmation_message = response.message;
            },
            /**
             * Load component data
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchCompetitionMain')
                        .then(() => {
                            this.dependencies.competition = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Open team registration from button click in "For Teams" CTA
             */
            openTeamRegistration: function (url: string) {
                if (this.$store.state.competition_portal.is_team_view) {
                    document.cookie = `${TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME}=${CompetitionPortalAppService.getActiveCompetitionPortalTeamId()}; path=/`;
                    location.assign(url);
                }
            }
        }
    });
</script>