<template>
    <form action="#" v-on:submit.prevent="doSearch()">
        <div v-if="load_error" class="grid-container">
            <p class="text--alert">
                Error loading search form.
            </p>
        </div>
        <div v-else class="grid-container member-search-form">
            <slot name="pre-form" :clearError="clearError"></slot>
            <div class="form-group">
                <label for="member_number" class="field-label">Membership #</label>
                <input id="member_number"
                       v-model="formData.member_number"
                       :disabled="inputs_disabled"
                       type="text"
                       class="form-field">
            </div>
            <div class="form-group">
                <label for="first_name" class="field-label">First Name</label>
                <input id="first_name"
                       v-model="formData.first_name"
                       :disabled="inputs_disabled"
                       type="text"
                       class="form-field">
            </div>
            <div class="form-group">
                <label for="last_name" class="field-label">Last Name</label>
                <input id="last_name"
                       v-model="formData.last_name"
                       :disabled="inputs_disabled"
                       type="text"
                       class="form-field">
            </div>
            <div class="form-group form-group--state">
                <label for="state" class="field-label">State</label>
                <select id="state"
                        v-model="formData.state"
                        :disabled="inputs_disabled"
                        class="form-field">
                    <option v-for="(state_option, index) in state_options"
                            :key="index"
                            :value="state_option.value">
                        {{state_option.label}}
                    </option>
                </select>
            </div>
            <slot v-if="this.$slots['post-form']"
                  name="post-form"
                  :clearError="clearError"></slot>
            <div class="member-search-form__cta">
                <div class="member-search-form__cta-element">
                    <button :disabled="inputs_disabled"
                            class="button button--block button--info"
                            type="button"
                            v-on:click="clearForm">
                        Clear
                    </button>
                </div>
                <div class="member-search-form__cta-element">
                    <button :disabled="inputs_disabled"
                            class="button button--block"
                            type="submit">
                        {{search_button_text}}
                    </button>
                </div>
            </div>
            <p v-if="error.visible" class="input-error">
                {{error.message}}
            </p>
        </div>
    </form>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {
        MemberSearchFormAdditionalValidatorsResult,
        MemberSearchParameters,
        MemberSearchResult
    } from '../../contracts/app/MemberSearchContracts';

    import {FormOption} from '../../contracts/AppContracts';

    /**
     * Created as an abstract copy of sub-elements of "My Coaches".
     * For additional documentation, see the original component
     * src/js/pages/MyCoaches/MyCoachesSearchForm.vue
     */
    export default Vue.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The active form data
                 */
                formData: <MemberSearchParameters>{
                    member_number: null,
                    first_name: null,
                    last_name: null,
                    state: null
                },
                /**
                 * Information about active form error
                 */
                error: {
                    visible: false,
                    message: ''
                },
                /**
                 * Whether the form is searching
                 */
                searching: {
                    display: false,
                    logic: false,
                    timeout: 0
                }
            };
        },
        computed: {
            /**
             * Result from additional validators
             */
            additional_validators_result: function (): MemberSearchFormAdditionalValidatorsResult {
                const additionalValidationFunctions = this.$store.state.member_search.additional_form_validators;
                for (let i = 0; i < additionalValidationFunctions.length; i++) {
                    const additionalValidationFunction = additionalValidationFunctions[i];
                    const result = additionalValidationFunction();
                    if (result !== true) {
                        return {
                            pass: false,
                            error: result
                        };
                    }
                }

                return {
                    pass: true
                };
            },
            /**
             * Options for state form input
             */
            state_options: function (): FormOption[] {
                const local_options: FormOption[] = <FormOption[]>[...this.$store.getters['member_search/state_options']];
                local_options.unshift({
                    label: 'Any',
                    value: null
                });

                return local_options;
            },
            /**
             * Text for search button
             */
            search_button_text: function () {
                if (this.searching.display) {
                    return 'Searching';
                }

                return 'Search';
            },
            /**
             * Whether search form controls are disabled
             */
            inputs_disabled: function () {
                return this.searching.display;
            },
            /**
             * Whether the form has any values present
             */
            form_value_present: function (): boolean {
                for (const i in this.formData) {
                    if (this.formData[i]) {
                        return true;
                    }
                }

                return false;
            },
            /**
             * Hook for potential future case where form loads its own options and may experience an error.
             * Currently, form data is loaded from parent, where error will display if there is one.
             */
            load_error: function (): boolean {
                return this.$store.getters['member_search/search_form_load_error'];
            }
        },
        watch: {
            formData: {
                /**
                 * When form data changes, clear any errors on the form
                 */
                handler: function () {
                    this.clearError();
                },
                deep: true
            }
        },
        methods: {
            /**
             * Display the supplied error message below the form
             *
             * If a timeout is provided, error will disappear in that many milliseconds
             */
            setError: function (message: string, timeout?: number) {
                this.error.message = message;
                this.error.visible = true;
                if (timeout) {
                    const vm = this;
                    window.setTimeout(function () {
                        vm.clearError();
                    }, timeout);
                }
            },
            /**
             * Clear errors
             */
            clearError: function () {
                this.error.message = '';
                this.error.visible = false;
            },
            /**
             * Set that the search is currently running
             */
            setSearching: function () {
                this.searching.logic = true;
                const vm = this;
                vm.searching.timeout = window.setTimeout(function () {
                    vm.searching.display = true;
                }, 100);
            },
            /**
             * Set that the search is no longer running
             */
            clearSearching: function () {
                if (this.searching.timeout) {
                    clearTimeout(this.searching.timeout);
                }
                this.searching.logic = false;
                this.searching.display = false;
            },
            /**
             * Clear all form inputs
             */
            clearForm: function () {
                for (const i in this.formData) {
                    if (Object.prototype.hasOwnProperty.call(this.formData, i)) {
                        this.formData[i] = null;
                    }
                }
                this.$emit('clear-form');
            },
            /**
             * Run the search
             *
             * Display error on no results or server error
             *
             * Emit success event upon results
             */
            doSearch: function () {
                const activeElement = document.activeElement;
                if (activeElement) {
                    // eslint-disable-next-line
                    (activeElement as HTMLElement).blur();
                }
                if (this.searching.logic) {
                    return;
                }
                this.setSearching();
                this.clearError();
                if (!this.form_value_present) {
                    this.setError('Please enter search criteria.');
                    this.clearSearching();

                    return;
                }
                if (!this.additional_validators_result.pass) {
                    this.setError(this.additional_validators_result.error);
                    this.clearSearching();

                    return;
                }
                const vm = this;
                this.$store.dispatch('member_search/runSearch', this.formData)
                    .then(function (results: MemberSearchResult[]) {
                        vm.clearSearching();
                        if (results.length) {
                            vm.$emit('search-success');

                            return;
                        }
                        vm.setError('No results found.');
                    })
                    .catch(function () {
                        vm.clearSearching();
                        vm.setError('Search error. Please try again.', 2000);
                    });
            }
        }
    });
</script>