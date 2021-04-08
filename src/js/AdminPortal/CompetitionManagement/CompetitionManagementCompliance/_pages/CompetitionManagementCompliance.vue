<template>
    <div class="competition-management-compliance" :class="{'competition-management-compliance--loaded':component_loaded}">
        <div v-if="!component_loaded && !is_child" class="grid-container">
            <p v-if="load_error" class="text--alert">
                Error loading compliance information.
            </p>
            <p v-else-if="!loaded && loading_timeout">
                Loading...
            </p>
        </div>
        <div v-else
             class="page"
             :class="{'page--content-height': is_child}">
            <competition-heading v-if="competition"
                                 :always_show="true"
                                 :competition_override="competition"></competition-heading>
            <div class="admin-portal-page-heading page--accent__standard-content">
                <div class="grid-container">
                    <div class="admin-portal-page-heading__back-link">
                        <a :href="competition.manage_link"
                           class="icon-link icon-link--back"
                           v-on:click="backClick">
                            Back
                        </a>
                    </div>
                    <h1 class="admin-portal-page-heading__page-title">
                        Compliance
                    </h1>
                </div>
            </div>
            <div v-if="!component_loaded" class="grid-container">
                <p v-if="load_error" class="text--alert">
                    Error loading compliance information.
                </p>
                <p v-else-if="!loaded && loading_timeout">
                    Loading...
                </p>
            </div>
            <div v-else class="page__content page__content--bleed page__content--no-top-pad">
                <div class="competition-management-compliance__content">
                    <div class="competition-management-compliance__header page--accent__standard-content">
                        <div class="grid-container">
                            <page-alert class="page-alert page-alert--notice page-alert--medium">
                                <div slot="trigger_text">
                                    Compliance Information
                                </div>
                                <div slot="expand_content">
                                    <p>
                                        Coaches below are identified through a skater's registration or competition
                                        portal with the intent to attend the competition with them. All coaches are
                                        required to be compliant for the level of competition their skater is
                                        participating in.
                                    </p>
                                    <p class="small">
                                        Note: Background and Insurance information is updated weekly.
                                    </p>
                                </div>
                            </page-alert>
                            <div class="competition-management-compliance__header__email">
                                <a class="icon-link icon-link--lg icon-link--email"
                                   href="#"
                                   v-on:click.prevent="emailOverlayOpen">
                                    Email*
                                </a>
                                <p class="competition-management-compliance__header__email__description">
                                    *Select filter to choose email recipients
                                </p>
                            </div>
                            <div class="competition-management-compliance__header__links">
                                <a :href="competition.compliance_report_link"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   class="download-link">Compliance Report
                                </a>
                                <a href="#"
                                   class="standard-link standard-link--no-visited"
                                   v-on:click.prevent="filterOverlayOpen">
                                    Filter
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="competition-management-compliance__body">
                        <div class="competition-management-compliance__search">
                            <label for="compliance_free_filter" class="sr-only">Search</label>
                            <input id="compliance_free_filter"
                                   v-model="free_filter"
                                   placeholder="Search by Name or Member #"
                                   class="form-field form-field--search form-field--reduced-right">
                        </div>
                        <div class="competition-management-compliance__entities">
                            <p v-if="entities.length===0" class="text--alert">
                                No items to display
                            </p>
                            <p v-else-if="visible_entities.length===0" class="text--alert">
                                No matches for your current filters.
                            </p>
                            <status-entity-card v-for="entity in visible_entities"
                                                v-else
                                                :key="entity.id"
                                                :entity="entity"
                                                :is_success="entity.is_compliant">
                                <div slot="primary-content">
                                    {{entity.last_name}}, {{entity.first_name}}
                                    <span class="text--muted">({{entity.member_number}})</span>
                                </div>
                                <div slot="secondary-content">
                                    <p class="status-entity-card__secondary">
                                        {{entity.city}}, {{entity.state_abbreviation}}
                                    </p>
                                    <ul class="status-entity-card__secondary-list">
                                        <li>
                                            <a class="standard-link" :href="'mailto:'+entity.email_address">
                                                {{entity.email_address}}
                                            </a>
                                        </li>
                                        <li>
                                            <a class="standard-link" :href="'tel:'+entity.phone_number">
                                                {{entity.phone_number}}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <entity-compliance-requirements-summary slot="expand-content"
                                                                        class="entity-compliance-requirements-summary--small entity-compliance-requirements-summary--with-columns"
                                                                        :compliance_items="entity.compliance_summary"
                                                                        :override_permitted="false"></entity-compliance-requirements-summary>
                            </status-entity-card>
                        </div>
                    </div>
                    <div v-if="show_pagination" class="competition-management-compliance__footer">
                        <div class="grid-container">
                            <pagination ref="pagination"
                                        :paginated_items="paginated_items"
                                        v-on:page-changed="handleActivePageChange"></pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <email-overlay v-if="show_email_overlay"
                       ref="email_overlay"
                       v-site-takeover
                       class="competition-management-compliance__email-overlay"
                       v-on:close="emailOverlayClose"></email-overlay>
        <site-takeover
            v-if="filterOverlayIsActive()"
            :return_to_scroll_location="true"
            v-on:close="filterOverlayClose()">
            <competition-management-compliance-position-filters
                :available_position_filters="available_position_filters"
                :selected_filters="active_filters"
                title="Compliance Filter"
                v-on:change="handleFilterChange"></competition-management-compliance-position-filters>
        </site-takeover>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import HasPaginatedItems from '../../../../mixins/HasPaginatedItems';
    import {EmailFormState} from '../../../EmailForm/_store/EmailFormState';
    import {CompetitionManagementCompliancePositionFiltersChangePayload} from '../../_contracts/component-contracts/CompetitionManagementCompliancePositionFiltersContracts';

    import CompetitionManagementSubComponentMixin from '../../_mixins/CompetitionManagementSubComponentMixin';
    import {
        CompetitionManagementComplianceEntityPositionFilter,
        CompetitionManagementComplianceFiltersInterface,
        CompetitionManagementCompliancePageCompetitionInterface,
        CompetitionManagementCompliancePageEntityInterface
    } from '../_contracts/CompetitionManagementComplianceContracts';
    import CompetitionManagementComplianceService from '../_services/CompetitionManagementComplianceService';
    import {CompetitionManagementComplianceState} from '../_store/CompetitionManagementComplianceState';

    const vueClass = mixins(HasDataDependencies, HasPaginatedItems, CompetitionManagementSubComponentMixin);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data needed for component to function
                 */
                dependencies: {
                    compliance_entities: false,
                    competition: false
                },
                /**
                 * Whether the filter overlay is active
                 */
                filter_overlay_active: false,
                /**
                 * Free text entity filter
                 */
                free_filter: '',
                /**
                 * The amount of items per page of pagination
                 */
                pagination_per_page: 50,
                /**
                 * Whether the email overlay should be shown
                 */
                show_email_overlay: false

            };
        },
        computed: {
            /**
             * Position filters available to filter overlay
             */
            available_position_filters: function (): CompetitionManagementComplianceEntityPositionFilter[] {
                return this.$store.state.competition_management.compliance.position_filters;
            },
            /**
             * The active filters from state
             */
            active_filters: {
                /**
                 * Get from state
                 */
                get: function (): CompetitionManagementComplianceFiltersInterface {
                    return this.$store.state.competition_management.compliance.active_filters;
                },
                /**
                 * Set in state
                 */
                set: function (value: CompetitionManagementComplianceFiltersInterface) {
                    this.$store.commit('competition_management/compliance/setActiveFilters', value);
                }
            },
            /**
             * The active competition
             */
            competition: function (): CompetitionManagementCompliancePageCompetitionInterface {
                return this.$store.state.competition_management.active_competition;
            },
            /**
             * The full list of entities
             */
            entities: function (): CompetitionManagementCompliancePageEntityInterface[] {
                return this.$store.state.competition_management.compliance.entities;
            },
            /**
             * List of entities that pass filters
             */
            entities_filtered: function (): CompetitionManagementCompliancePageEntityInterface[] {
                return this.$store.getters['competition_management/compliance/filtered_entities'];
            },
            /**
             * The items to paginate
             */
            pagination_items: function (): any[] {
                return this.entities_filtered;
            },
            /**
             * The set of competitions currently visible on the active pagination page
             */
            visible_entities: function (): any[] {
                return this.visible_items;
            }
        },
        watch: {
            /**
             * Watch for free filter change and log it in state
             */
            free_filter: function (value) {
                this.active_filters = {
                    ...this.active_filters,
                    free: value
                };
            }
        },
        /**
         * Before component creation, register necessary state modules
         * 1. Compliance State
         * 2. Email Form State
         */
        beforeCreate: function () {
            this.$store.registerModule(['competition_management', 'compliance'], CompetitionManagementComplianceState);
            if (typeof this.$store.state.email_form === 'undefined') {
                this.$store.registerModule('email_form', EmailFormState);
            }
            this.$store.commit('email_form/setServiceClass', CompetitionManagementComplianceService);
            this.$store.commit('email_form/setIsEachBccRequired', true);
        },
        /**
         * On component destruction, unregister state module
         */
        destroyed: function () {
            this.$store.commit('competition_management/compliance/resetFilters');
            this.$store.unregisterModule(['competition_management', 'compliance']);
            this.$store.commit('email_form/resetState');
        },
        methods: {
            /**
             * Handle change on selected filters
             */
            handleFilterChange: function (payload: CompetitionManagementCompliancePositionFiltersChangePayload) {
                this.filter_overlay_active = false;
                this.active_filters = <CompetitionManagementComplianceFiltersInterface> {
                    positions: payload.positions,
                    compliance: payload.compliance,
                    free: this.free_filter
                };
            },
            /**
             * Open the email overlay
             */
            emailOverlayOpen: function () {
                this.show_email_overlay = true;
                this.setDefaultEmailState();
            },
            /**
             * Close the email overlay
             */
            emailOverlayClose: function () {
                this.show_email_overlay = false;
            },
            /**
             * Close the filter overlay
             */
            filterOverlayClose: function (): void {
                this.filter_overlay_active = false;
            },
            /**
             * Whether the filter overlay is currently active
             */
            filterOverlayIsActive: function (): boolean {
                return this.filter_overlay_active;
            },
            /**
             * Open the filter overlay
             */
            filterOverlayOpen: function (): void {
                this.filter_overlay_active = true;
            },
            /**
             * Load data for the component
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_management/fetchActiveCompetition')
                        .then(() => {
                            this.dependencies.competition = true;
                            this.$store.dispatch('competition_management/compliance/loadCompliance')
                                .then(() => {
                                    this.dependencies.compliance_entities = true;
                                    resolve();
                                })
                                .catch(() => {
                                    reject();
                                });
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Set the email form to its default state
             */
            setDefaultEmailState: function () {
                this.$store.dispatch('competition_management/compliance/resetEmailFormData');
            }
        }
    });

</script>