<template>
    <div class="competition-management-contacts-add">
        <div v-if="!component_loaded" class="grid-container">
            <p v-if="load_error" class="text--alert">
                Error loading form.
            </p>
            <p v-else-if="!loaded && loading_timeout">
                Loading...
            </p>
        </div>
        <div v-else>
            <div class="grid-container">
                <h2 class="site-overlay__heading site-overlay__heading--large">
                    Add {{active_type_label.replace('Competition','')}}
                </h2>
                <p v-if="is_form_active" class="competition-management-contacts-add__message">
                    Search for a member by membership number or name. The first three letters will be used to find all
                    matches containing those letters.
                </p>
            </div>
            <member-search ref="search" v-on:clear-form="position=null">
                <div slot="pre-form" slot-scope="slotProps">
                    <div class="form-group competition-management-contacts-add__position">
                        <label class="sr-only" for="position">
                            Select a Position to Add {{active_type_label.replace('Competition','')}}
                        </label>
                        <select id="position"
                                v-model="position"
                                class="form-field"
                                name="position"
                                v-on:change="slotProps.clearError()">
                            <option :value="null">
                                Select a Position to Add {{active_type_label.replace('Competition','')}}
                            </option>
                            <option v-for="option in position_form_options"
                                    :key="option.value"
                                    :value="option">
                                {{option.label}}
                            </option>
                        </select>
                    </div>
                </div>
            </member-search>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {
        MemberSearchConfig,
        MemberSearchFormAdditionalValidator,
        MemberSearchParameters,
        MemberSearchResult,
        MemberSearchSearchFunction
    } from '../../../../contracts/app/MemberSearchContracts';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import {MemberSearchState} from '../../../../store/Modules/MemberSearchState';
    import {
        CompetitionManagementContactAddComponentPayload,
        CompetitionManagementContactAddSearchParameters,
        CompetitionManagementContactPositionFormOption
    } from '../_contracts/CompetitionManagementContactsContracts';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies on the component
                 */
                dependencies: {
                    form_options: false
                },
                /**
                 * The selected position value from the form
                 */
                position: <CompetitionManagementContactPositionFormOption | null>null
            };
        },
        computed: {
            /**
             * The active type display label
             */
            active_type_label: function (): string {
                return this.$store.getters['competition_management/contacts/active_type_label'];
            },
            /**
             * Whether the form is active (as opposed to search results)
             */
            is_form_active: function (): boolean {
                return this.$store.state.member_search.results_active === false;
            },
            /**
             * Options for the position form input
             */
            position_form_options: function (): CompetitionManagementContactPositionFormOption[] {
                return this.$store.getters['competition_management/contacts/add_contact_form_position_options'];
            },
            /**
             * List of additional functions to validate the search form prior to submit
             */
            search_form_validators: function (): MemberSearchFormAdditionalValidator[] {
                return [this.validatePosition];
            },
            /**
             * Function to supply to Member Search to run search
             */
            search_function: function (): MemberSearchSearchFunction {
                return (search_params: MemberSearchParameters) => {
                    return this.$store.dispatch('competition_management/contacts/search', <CompetitionManagementContactAddSearchParameters>{
                        ...search_params,
                        position: this.position ? this.position.value : null
                    });
                };
            }
        },
        methods: {
            /**
             * Method to close the component
             */
            closeComponent: function () {
                this.$emit('close');
            },
            /**
             * Configure member search
             */
            configureMemberSearch: function (): void {
                const member_search_config: MemberSearchConfig = {
                    close_method: this.closeComponent,
                    entity_descriptor: 'Member',
                    ineligible_instruction: 'Please choose another member.',
                    result_validators: [],
                    search_function: this.search_function,
                    form_validators: this.search_form_validators,
                    selection_method: this.selectResult
                };
                this.$store.commit('member_search/configure', member_search_config);
            },
            /**
             * Load data for the form
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_management/contacts/loadAddForm')
                        .then(() => {
                            this.dependencies.form_options = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Action to take prior to data load attempt
             *
             * 1. Ensure member search state module is registered
             * 2. Configure member search
             */
            preDataLoad: function () {
                return new Promise((resolve) => {
                    this.registerMemberSearchModule();
                    this.configureMemberSearch();
                    resolve();
                });
            },
            /**
             * Ensure member search state module is registered
             */
            registerMemberSearchModule: function (): void {
                if (typeof this.$store.state.member_search === 'undefined') {
                    this.$store.registerModule('member_search', MemberSearchState);
                }
            },
            /**
             * Handle the selection event on a member search result
             *
             * Start add contact data flows
             */
            selectResult: function (result: MemberSearchResult): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_management/contacts/addContact', <CompetitionManagementContactAddComponentPayload> {
                        member: result,
                        position: <CompetitionManagementContactPositionFormOption> this.position
                    })
                        .then(() => {
                            resolve();
                        })
                        .catch((error_message: string) => {
                            reject(error_message);
                        });
                });
            },
            /**
             * Validation function to ensure a position has been selected prior to search form submission
             */
            validatePosition: function (): true | string {
                if (this.position) {
                    return true;
                }

                return 'Please select a position.';
            }
        }
    });
</script>