<template>
    <div class="competition-management-contacts" :class="{'competition-management-contacts--loaded':component_loaded}">
        <div v-if="!component_loaded && !is_child" class="grid-container">
            <p v-if="load_error" class="text--alert">
                Error loading contacts.
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
                        Contacts
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
                <div class="competition-management-contacts__content">
                    <transition name="fade">
                        <div v-if="show_confirmation" class="competition-management-contacts__confirmation">
                            <div class="competition-management-contacts__confirmation__container">
                                <div class="session-feedback session-feedback--success">
                                    <div class="session-feedback__content">
                                        <div class="session-feedback__text">
                                            {{show_confirmation}} Added
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <competition-management-contacts-index v-on:open-filters="filterOverlayOpen" v-on:open-add="addContactOverlayOpen"></competition-management-contacts-index>
                </div>
            </div>
            <site-takeover
                v-if="filterOverlayIsActive()"
                :return_to_scroll_location="true"
                v-on:close="filterOverlayClose()">
                <competition-management-compliance-position-filters
                    :available_position_filters="available_position_filters"
                    :selected_filters="active_filters"
                    :title="filter_component_title"
                    v-on:change="handleFilterChange"></competition-management-compliance-position-filters>
            </site-takeover>
            <site-takeover
                v-if="addContactOverlayIsActive()"
                :return_to_scroll_location="true"
                v-on:close="addContactOverlayClose()">
                <competition-management-contacts-add v-on:close="addContactOverlayClose(true)"></competition-management-contacts-add>
            </site-takeover>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {AppRootInterface, FormOption} from '../../../../contracts/AppContracts';

    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import {CompetitionManagementCompliancePositionFiltersChangePayload} from '../../_contracts/component-contracts/CompetitionManagementCompliancePositionFiltersContracts';
    import CompetitionManagementSubComponentMixin from '../../_mixins/CompetitionManagementSubComponentMixin';
    import {CompetitionManagementCompliancePageCompetitionInterface} from '../../CompetitionManagementCompliance/_contracts/CompetitionManagementComplianceContracts';
    import CompetitionManagementContactsAdd from '../_components/CompetitionManagementContactsAdd.vue';
    import CompetitionManagementContactsIndex from '../_components/CompetitionManagementContactsIndex.vue';
    import {CompetitionManagementContactsFiltersInterface} from '../_contracts/CompetitionManagementContactsContracts';
    import {CompetitionManagementContactsState} from '../_store/CompetitionManagementContactsState';

    const vueClass = mixins(HasDataDependencies, CompetitionManagementSubComponentMixin);
    // @vue/component
    export default vueClass.extend({
        components: {
            CompetitionManagementContactsAdd,
            CompetitionManagementContactsIndex
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether the add contact overlay is active
                 */
                add_contact_overlay_active: false,
                /**
                 * Data needed for component to function
                 */
                dependencies: {
                    entities: false,
                    competition: false
                },
                /**
                 * Whether the filter overlay is active
                 */
                filter_overlay_active: false,
                /**
                 * Whether to show the entity added confirmation
                 */
                show_confirmation: <string | false>false
            };
        },
        computed: {
            /**
             * The active filters from state
             */
            active_filters: function (): CompetitionManagementContactsFiltersInterface {
                return this.$store.state.competition_management.contacts.active_filters;
            },
            /**
             * Label for active entity type
             */
            active_type_label: function (): string {
                return this.$store.getters['competition_management/contacts/active_type_label'];
            },
            /**
             * The available position filters to configure the abstract child filter component
             */
            available_position_filters: function (): FormOption[] {
                return this.$store.getters['competition_management/contacts/position_filters'];
            },
            /**
             * The active competition
             */
            competition: function (): CompetitionManagementCompliancePageCompetitionInterface {
                return this.$store.state.competition_management.active_competition;
            },
            /**
             * The title for the filter component
             */
            filter_component_title: function (): string {
                return `Filter ${this.active_type_label.replace('Competition', '')}s`;
            }
        },
        /**
         * Before component creation, register necessary state modules
         * 1. Compliance State
         */
        beforeCreate: function () {
            this.$store.registerModule(['competition_management', 'contacts'], CompetitionManagementContactsState);
        },
        /**
         * On component destruction, unregister state module
         */
        destroyed: function () {
            this.$store.commit('competition_management/contacts/restoreDefaults');
            this.$store.unregisterModule(['competition_management', 'contacts']);
        },

        methods: {
            /**
             * Close the email overlay
             *
             * If close is the result of a contact addition, show the confirmation
             */
            addContactOverlayClose: function (is_add_success: boolean = false): void {

                this.add_contact_overlay_active = false;
                if (is_add_success) {
                    this.$nextTick(() => {
                        const $root = this.$root as AppRootInterface;
                        $root.resetScroll();
                        this.showAddConfirmation();
                    });
                }
            },
            /**
             * Whether the add_contact overlay is currently active
             */
            addContactOverlayIsActive: function (): boolean {
                return this.add_contact_overlay_active;
            },
            /**
             * Open the add_contact overlay
             */
            addContactOverlayOpen: function (): void {
                this.add_contact_overlay_active = true;
            },
            /**
             * Handle change on selected filters
             *
             * 1. Close overlay
             * 2. Commit filter changes to state
             */
            handleFilterChange: function (payload: CompetitionManagementCompliancePositionFiltersChangePayload) {
                this.filter_overlay_active = false;
                this.$store.commit('competition_management/contacts/setActiveFilters', {
                    ...payload,
                    free: this.active_filters.free
                });
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
                            this.$store.dispatch('competition_management/contacts/fetchContacts')
                                .then(() => {
                                    this.dependencies.entities = true;
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
             * Show the confirmation for a newly added contact
             */
            showAddConfirmation: function () {
                this.show_confirmation = this.active_type_label;
                setTimeout(() => {
                    this.show_confirmation = false;
                }, 2000);
            }
        }
    });
</script>