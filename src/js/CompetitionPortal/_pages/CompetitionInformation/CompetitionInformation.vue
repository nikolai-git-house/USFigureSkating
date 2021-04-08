<!-- eslint-disable vue/no-v-html -->
<template>
    <page class="page page-competition-information"
          :header="page_header">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="pre-header"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading competition information."></component-loader>
        <div slot="content"
             class="page__content page__content--no-top-pad">
            <div class="accordion-group">
                <accordion>
                    <span slot="trigger_text">Registered Events</span>
                    <div slot="expand_content">
                        <div class="practice-ice-information">
                            <ul v-for="registered_event in registered_events"
                                :key="registered_event.id">
                                <li>{{registered_event.name}}</li>
                            </ul>
                        </div>
                    </div>
                </accordion>
                <accordion>
                    <span slot="trigger_text">Practice Ice Prices &amp; Timeline</span>
                    <div slot="expand_content">
                        <div class="practice-ice-information">
                            <p v-if="no_practice_ice">
                                Practice Ice is not offered through EMS at this competition.
                            </p>
                            <div v-else>
                                <div v-if="pricing_message || practice_ice_event_pricing.length"
                                     class="practice-ice-information__pricing">
                                    <p v-if="pricing_message">
                                        {{pricing_message}}
                                    </p>
                                    <div v-for="(pricing_group,index) in practice_ice_event_pricing"
                                         v-else
                                         :key="index"
                                         class="pricing-group">
                                        <p class="pricing-group__name">
                                            Discipline: {{pricing_group.event_name}}
                                        </p>
                                        <ul class="pricing-group__list">
                                            <li v-for="(credit_type,cindex) in pricing_group.available_credits"
                                                :key="cindex">
                                                <span>{{credit_type.name}} ${{credit_type.cost}}</span>
                                            </li>
                                        </ul>
                                        <ul v-if="pricing_group.available_credit_packages"
                                            class="pricing-group__packages">
                                            <li v-for="(credit_package,cpindex) in pricing_group.available_credit_packages"
                                                :key="cpindex">
                                                Package ({{credit_package.summary}}): ${{credit_package.cost}}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="practice-ice-information__sales-windows">
                                    <dl v-for="(sales_window,index) in practice_ice_sales_windows"
                                        :key="index"
                                        class="sales-window"
                                        :class="{'sales-window--open':sales_window.is_active}">
                                        <dt>{{sales_window.name}} Begins:</dt>
                                        <dd>{{sales_window.start_datetime_formatted}}</dd>
                                        <dt>{{sales_window.name}} Deadline:</dt>
                                        <dd>{{sales_window.end_datetime_formatted}}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </accordion>
                <accordion>
                    <span slot="trigger_text">Practice Ice Instructions</span>
                    <div slot="expand_content"
                         class="practice-ice-information practice-ice-information--text"
                         v-html="practice_ice_instructions"></div>
                </accordion>
                <accordion>
                    <span slot="trigger_text">Practice Ice Terminology</span>
                    <div slot="expand_content"
                         class="practice-ice-information"
                         v-html="practice_ice_terminology"></div>
                </accordion>
            </div>
        </div>
    </page>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import {CompetitionPortalPageMixin} from '../../_mixins';
    import {CompetitionInformationPage} from './_contracts';
    import {CompetitionPortal} from '../../_contracts';

    const vueClass = mixins(HasDataDependencies, CompetitionPortalPageMixin);
    export default vueClass.extend({
        /**
         * Reactive Data
         */
        data: function () {
            return {
                dependencies: {
                    competition_information: false
                },
                page_title: 'Competition Information'
            };
        },
        computed: {
            /**
             * The source of information for the page
             */
            competition_information: function (): CompetitionInformationPage.CompetitionInformation | null {
                return this.$store.state.competition_portal.competition_information;
            },
            /**
             * Whether practice ice is not offered via EMS for the competition
             */
            no_practice_ice: function (): boolean {
                return this.competition_information ? this.competition_information.no_practice_ice : false;
            },
            /**
             * Content to show in practice ice instructions accordion
             */
            practice_ice_instructions: function (): string {
                return this.competition_information ? this.competition_information.practice_ice_instructions : '';
            },
            /**
             * Content to show in practice ice terminology accordion
             */
            practice_ice_terminology: function (): string {
                return this.competition_information ? this.competition_information.practice_ice_terminology : '';
            },
            /**
             * Pricing information
             */
            practice_ice_event_pricing: function (): CompetitionInformationPage.EventPricing[] {
                return this.competition_information ? this.competition_information.practice_ice_event_pricing : [];
            },
            /**
             * Practice ice sales windows for display
             */
            practice_ice_sales_windows: function (): CompetitionInformationPage.PracticeIceSalesWindow[] {
                return this.competition_information ? this.competition_information.practice_ice_sales_windows : [];
            },
            /**
             * Message to display in place of standard content in PI Prices and timeline accordion
             */
            pricing_message: function (): string | null {
                return this.competition_information ? this.competition_information.pricing_message : null;
            },
            /**
             * The list of events the active entity is registered for
             */
            registered_events: function (): CompetitionPortal.CompetitionInformationRegisteredEvent[] {
                return this.competition_information ? this.competition_information.registered_events : [];
            }
        },
        methods: {
            /**
             * Load data necessary to display page
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchCompetitionInformation')
                        .then(() => {
                            this.dependencies.competition_information = true;
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