<template>
    <page :header="page_header"
          class="team-registration-registration-overview">
        <team-registration-header slot="pre-header"></team-registration-header>
        <div slot="header-content">
            <team-registration-progress-bar></team-registration-progress-bar>
            <div v-if="component_loaded"
                 class="team-registration__page-information">
                <page-alert class="page-alert page-alert--notice page-alert--medium">
                    <div slot="trigger_text">
                        Registration Information
                    </div>
                    <div slot="expand_content">
                        <ul class="team-registration-registration-overview__information-list">
                            <li v-for="(information_item, index) in registration_information"
                                :key="index"
                                v-html="information_item"></li>
                        </ul>
                    </div>
                </page-alert>
            </div>
        </div>
        <component-loader v-if="!component_loaded"
                          :container="true"
                          :source="this"
                          error_message="Error loading registration overview."></component-loader>
        <div v-else
             class="team-registration-registration-overview__content">
            <div class="team-registration-registration-overview__prices">
                <div class="team-registration-registration-overview__prices__container">
                    <team-registration-pricing-table v-for="(table, tindex) in tables"
                                                     :key="tindex"
                                                     :config="table.config"
                                                     :rows="table.rows"></team-registration-pricing-table>
                </div>
            </div>
            <div class="grid-container">
                <div class="team-registration__terms">
                    <p class="team-registration__terms__lead">
                        By clicking the box below and continuing with registration I acknowledge, accept and agree to
                        abide by all bylaws, rules, policies, procedures and guidelines as outlined in the
                        {{rulebook_year}}
                        U.S. Figure Skating Rulebook and as listed within the official announcement for the sanctioned
                        competition I am registering for. Compliance with all such provisions as updated or amended is
                        the responsibility of the participants.
                    </p>
                    <div class="team-registration__terms__confirm">
                        <label for="terms_confirm"
                               class="usfsa-checkbox">
                            <input id="terms_confirm"
                                   v-model="confirmed"
                                   type="checkbox">
                            <span class="usfsa-checkbox__text">I have read and understand the above overview of the U.S. Figure Skating online registration process.</span>
                        </label>
                    </div>
                </div>
                <team-registration-page-navigation :retreat="retreat"
                                                   :advance="advance"
                                                   :advance_disabled="advance_disabled"
                                                   :hide_retreat="hide_retreat"></team-registration-page-navigation>
            </div>
        </div>
    </page>
</template>
<script lang="ts">
    import TeamRegistrationSubpageMixin from '../_mixins/TeamRegistrationSubpageMixin';
    import mixins from 'vue-typed-mixins';
    import TeamRegistrationPricingTable from '../_components/TeamRegistrationPricingTable.vue';
    import {TeamRegistration} from '../_contracts';
    import {RegistrationOverview} from '../_models';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';

    const vueClass = mixins(TeamRegistrationSubpageMixin, HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        components: {
            TeamRegistrationPricingTable
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether the confirmation checkbox has been checked
                 */
                confirmed: false,
                /**
                 * Data dependencies for the component
                 */
                dependencies: {
                    page_data: false
                },
                /**
                 * Title to display for page
                 */
                page_title: 'Registration Overview'
            };
        },
        computed: {
            /**
             * Whether continue button should be disabled
             */
            advance_disabled: function (): boolean {
                return !this.confirmed;
            },
            /**
             * Content for registration information accordion
             */
            registration_information: function (): string[] {
                return this.registration_overview.registration_information;
            },
            /**
             * The registration overview information
             */
            registration_overview: function (): RegistrationOverview {
                return this.$store.state.team_registration.registration_overview;
            },
            /**
             * The year range for the current rulebook
             */
            rulebook_year: function (): string {
                return this.registration_overview.rulebook_year;
            },
            /**
             * Pricing table data
             */
            tables: function (): TeamRegistration.PricingTableBinding[] {
                return this.registration_overview.pricing_tables;
            }
        },
        methods: {
            /**
             * Load data for page
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('team_registration/fetchRegistrationOverview')
                        .then(() => {
                            this.dependencies.page_data = true;
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