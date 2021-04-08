<template>
    <div class="series-registration-overview-page">
        <page :header="page_header"
              :class="{'page--accent':component_loaded && application_exists}"
              :style="page_style">
            <series-page-header v-if="component_loaded"
                                slot="pre-header"
                                :series="series"></series-page-header>
            <div v-if="component_loaded && status_message"
                 slot="header-content"
                 class="series-registration-overview-page__status-message">
                <span :class="series.status.message.type_key|status_class">Series Status:</span>
                <span>{{series.status.message.text}}</span>
            </div>
            <component-loader v-if="!component_loaded"
                              slot="loader"
                              :container="true"
                              :source="this"
                              error_message="Error loading series information."></component-loader>
            <div v-else
                 class="series-registration-overview-page__content">
                <div class="page--accent__standard-content">
                    <div class="grid-container">
                        <div class="series-registration-overview-page__statement">
                            <page-alert v-if="application_exists"
                                        class="page-alert page-alert--notice page-alert--medium">
                                <div slot="trigger_text">
                                    Statement
                                </div>
                                <div slot="expand_content">
                                    {{series.statement}}
                                </div>
                            </page-alert>
                            <p v-else>
                                {{series.statement}}
                            </p>
                        </div>
                        <div class="series-registration-overview-page__contact">
                            <p>
                                If you have questions, email
                                <a class="standard-link standard-link--no-visited"
                                   :href="`mailto:${series.contact_email_address}`">{{series.contact_email_address}}
                                </a>
                            </p>
                            <p v-if="show_refund_contact">
                                Need a refund?
                                <a class="standard-link standard-link--no-visited"
                                   :href="`mailto:${series.refund_email_address}`">{{series.refund_email_address}}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                <div v-if="application_exists"
                     class="series-registration-overview-page__application page__accent-content">
                    <div v-if="user_application"
                         class="grid-container">
                        <series-overview-application-discipline v-for="discipline in user_application.disciplines"
                                                                :key="discipline.id"
                                                                class="card"
                                                                :discipline="discipline"></series-overview-application-discipline>
                    </div>
                    <div v-if="applied_teams"
                         class="grid-container">
                        <series-overview-application-team v-for="team in applied_teams.teams"
                                                          :key="team.id"
                                                          :team="team"
                                                          class="card"></series-overview-application-team>
                    </div>
                </div>
                <div v-if="series.reports"
                     class="series-registration-overview-page__reports">
                    <div class="grid-container">
                        <ul class="series-registration-overview-page__reports__list">
                            <li v-for="(report, index) in series.reports"
                                :key="index">
                                <a target="_blank"
                                   rel="noopener noreferrer"
                                   :href="report.link"
                                   class="icon-link icon-link--download">
                                    {{report.name}}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-if="show_footer"
                     ref="footer"
                     class="series-registration-overview-page__footer">
                    <div class="grid-container">
                        <series-overview-cta v-if="!series.is_team_series"
                                             :series="series"
                                             :application="user_application"
                                             v-on:pay-attempt="handlePayAttempt"
                                             v-on:mounted="updatePageFooterOffset"></series-overview-cta>
                        <series-overview-team-cta v-else
                                                  :application_exists="team_application_exists"
                                                  :series="series"
                                                  v-on:mounted="updatePageFooterOffset"
                                                  v-on:pay-attempt="handlePayAttempt"></series-overview-team-cta>
                    </div>

                </div>
            </div>
            <site-overlay transition_name="fade"
                          :open_fn="overlayIsActive"
                          class="site-overlay--faded"
                          :show_header="false"
                          :lock_scroll="false">
                <div class="confirm-action-overlay">
                    <series-registration-eligibility-confirmation v-if="eligibility_confirmation_active"
                                                                  :eligibility_documents="series.application_configuration.eligibility_documents"
                                                                  v-on:continue="handleEligibilityConfirm"></series-registration-eligibility-confirmation>
                    <div v-else-if="pay_confirmation_active"
                         class="confirm-action-overlay__content">
                        <div class="confirm-action-overlay__dialog">
                            <div class="confirm-action-overlay__message">
                                Do you want to make additional
                                <br>
                                updates before you pay?
                            </div>
                            <div class="confirm-action-overlay__cta">
                                <div class="confirm-action-overlay__cta__button">
                                    <a :href="series.links.application"
                                       class="button button--small button--info button--block">
                                        Update
                                    </a>
                                </div>
                                <div class="confirm-action-overlay__cta__button">
                                    <a :href="series.links.checkout"
                                       class="button button--action button--small button--block"
                                       v-on:click.prevent="eligibility_confirmation_active=true">
                                        Pay
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </site-overlay>
        </page>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import {PageComponentHeaderConfiguration, StatusMessage} from '../../../contracts/AppContracts';
    import {SeriesRegistrationState} from '../../_store/SeriesRegistrationState';
    import {SeriesOverview} from '../_contracts';
    import SeriesOverviewCta from '../_components/SeriesOverviewCta.vue';
    import {SeriesApplication} from '../../SeriesApplication/_contracts';
    import SeriesOverviewApplicationDiscipline from '../_components/SeriesOverviewApplicationDiscipline.vue';
    import SeriesOverviewApplicationTeam from '../_components/SeriesOverviewApplicationTeam.vue';
    import SeriesOverviewTeamCta from '../_components/SeriesOverviewTeamCta.vue';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        components: {
            SeriesOverviewApplicationDiscipline,
            SeriesOverviewApplicationTeam,
            SeriesOverviewCta,
            SeriesOverviewTeamCta
        },
        /**
         * Reactive Data
         */
        data: function () {
            return {
                /**
                 * Data dependencies required for component
                 */
                dependencies: {
                    series: false
                },
                eligibility_confirmation_active: false,
                /**
                 * Amount of bottom padding to add to page to account for fixed footer
                 */
                page_bottom_padding: 0,
                pay_confirmation_active: false
            };
        },
        computed: {
            /**
             * Whether an individual user has started an application, or if a team manager has a team with an active application
             */
            application_exists: function (): boolean {
                return !!this.user_application || this.team_application_exists;
            },
            /**
             * Whether a team application has been started
             */
            team_application_exists: function (): boolean {
                return this.applied_teams ? !!this.applied_teams.teams.length : false;
            },
            /**
             * The teams with a started application for the series
             */
            applied_teams: function (): SeriesApplication.AppliedTeams | null {
                return this.$store.state.series_registration.application.applied_teams;
            },
            /**
             * The configuration for the page header
             */
            page_header: function (): PageComponentHeaderConfiguration {
                const conf: PageComponentHeaderConfiguration = {
                    title: 'Series Overview'
                };
                if (this.series) {
                    conf.back_link = this.series.links.series_list;
                    conf.back_link_label = 'Back to Series Information';
                }

                return conf;
            },
            /**
             * Additional style properties to apply to the page element
             */
            page_style: function (): { [key: string]: string | null; } | null {
                if (this.page_bottom_padding) {
                    return {
                        paddingBottom: `${this.page_bottom_padding}px`
                    };
                }

                return null;
            },
            /**
             * Whether a paid level exists for the active user application
             */
            paid_level_exists: function (): boolean {
                return this.$store.getters['series_registration/application/paid_level_exists'];
            },
            /**
             * The series for the page
             */
            series: function (): SeriesOverview.Series {
                return this.$store.state.series_registration.overview_series;
            },
            /**
             * Whether to show the footer (CTA)
             */
            show_footer: function (): boolean {
                return this.series && (this.series.status.applications_open || this.series.status.standings_available);
            },
            /**
             * Whether to show the refund contact link
             */
            show_refund_contact: function (): boolean {
                return this.paid_level_exists;
            },
            /**
             * The status message for the series
             */
            status_message: function (): StatusMessage | null {
                return this.series && this.series.status && this.series.status.message;
            },
            /**
             * The active user's application for the series
             */
            user_application: function (): SeriesApplication.UserApplication | null {
                return this.$store.state.series_registration.application.user_application;
            }
        },
        /**
         * Upon mounted, attach debounced resize listener
         */
        mounted: function (): void {
            let window_resize_timeout: number;
            window.addEventListener('resize', () => {
                if (window_resize_timeout) {
                    clearTimeout(window_resize_timeout);
                }
                window_resize_timeout = window.setTimeout(() => {
                    this.updatePageFooterOffset();
                }, 150);
            });
        },
        /**
         * Before component created, ensure state modules are registered and configured
         */
        beforeCreate: function (): void {
            if (typeof this.$store.state.series_registration === 'undefined') {
                this.$store.registerModule('series_registration', SeriesRegistrationState);
            }
        },
        methods: {
            /**
             * Handle confirmation of eligibility requirements
             */
            handleEligibilityConfirm: function (): void {
                window.location.assign(this.series.links.checkout);
            },
            /**
             *  Handle the click event on the CTA pay button
             */
            handlePayAttempt: function (): void {
                this.pay_confirmation_active = true;
            },
            /**
             * Load data dependencies
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('series_registration/fetchSeriesOverview')
                        .then(() => {
                            this.dependencies.series = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });

                });
            },
            /**
             * Whether overlay is active
             */
            overlayIsActive: function (): boolean {
                return this.pay_confirmation_active || this.eligibility_confirmation_active;
            },
            /**
             * Update page bottom padding to account for fixed footer
             */
            updatePageFooterOffset: function (): void {
                let footer_offset = 0;
                const footer = this.$refs.footer as HTMLElement;
                if (footer) {
                    footer_offset = footer.offsetHeight || footer.clientHeight;
                }
                this.page_bottom_padding = footer_offset + 30;
            }
        }
    });
</script>