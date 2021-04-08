<template>
    <div class="skate-tests">
        <div class="skate-tests__history">
            <skate-test-history inline-template>
                <div class="skate-test-history">
                    <div v-for="(discipline,index) in disciplines"
                         :key="index"
                         class="skate-test-history__section">
                        <div class="skate-test-history__section-header">
                            <h6 class="skate-test-history__section-header__name">
                                {{discipline.label}}
                            </h6>
                            <div class="skate-test-history__section-header__actions">
                                <span v-if="index===0"
                                      class="skate-test-history__section-header__actions__help-text"
                                      :disabled="disableDisciplineActions(discipline)">Tap to add</span>
                                <button class="icon-button icon-button--add icon-button--lg"
                                        :disabled="disableDisciplineActions(discipline)"
                                        v-on:click.prevent="addTest(discipline)">
                                    <span class="sr-only">Add</span>
                                </button>
                            </div>
                        </div>
                        <div v-for="(skate_test,test_index) in discipline.key_test"
                             :key="test_index">
                            <div class="skate-test-history__existing-test">
                                <button class="skate-test-history__existing-test__button icon-button icon-button--delete"
                                        :style="{visibility:skate_test.is_self_reported?'visible':'hidden'}"
                                        :disabled="!skate_test.is_self_reported"
                                        v-on:click.prevent="removeTest(discipline, skate_test,[index,test_index])">
                                    <span class="sr-only">Remove</span>
                                </button>
                                <span class="skate-test-history__existing-test__name">
                                    {{skate_test.name}}
                                </span>
                            </div>
                            <p v-if="testError([index,test_index])"
                               class="input-error">
                                {{testError([index,test_index])}}
                            </p>
                        </div>
                    </div>
                </div>
            </skate-test-history>
        </div>
        <site-takeover v-if="overlayActive()"
                       :return_to_scroll_location="true"
                       class="site-takeover--accent"
                       v-on:close="closeOverlay()">
            <div>
                <div class="site-takeover--accent__standard-content">
                    <h2 class="site-takeover__title">
                        {{takeover_title}}
                    </h2>
                </div>
                <div class="skate-test-takeover">
                    <div class="skate-test-takeover__section skate-test-takeover__section--add-form">
                        <div class="grid-container">
                            <!--@integration:
                                see integration guide for club_autosuggest attribute options
                            -->
                            <skate-test-discipline-form inline-template
                                                        :form_test_options="active_test_options"
                                                        :is_equivalency="false"
                                                        :external_error="test_submit_error"
                                                        :submitting="submitting_test"
                                                        :allow_cancel="true"
                                                        :club_autosuggest="club_autosuggest_configuration"
                                                        v-on:cancel="closeOverlay()"
                                                        v-on:complete="completeSkateTest">
                                <div class="skate-test-discipline-form">
                                    <div v-if="!component_loaded">
                                        <p v-if="load_error"
                                           class="text--alert">
                                            Error loading form.
                                        </p>
                                        <p v-else-if="!loaded && loading_timeout">
                                            Loading form...
                                        </p>
                                    </div>
                                    <div v-else>
                                        <div class="form-group">
                                            <label class="field-label"
                                                   for="test">
                                                Test
                                            </label>
                                            <select id="test"
                                                    v-model="form_data.test"
                                                    class="form-field"
                                                    :class="fieldClass('test')">
                                                <option disabled
                                                        selected
                                                        :value="null">
                                                    Select Test
                                                </option>
                                                <option v-for="(test_option, test_index) in test_options"
                                                        :key="test_index"
                                                        :disabled="test_option.value===null"
                                                        :value="test_option">
                                                    {{test_option.label}}
                                                </option>
                                            </select>
                                            <p v-if="fieldMessage('test')"
                                               class="input-error">
                                                *{{fieldMessage('test')}}
                                            </p>
                                        </div>
                                        <div class="form-group">
                                            <label for="club"
                                                   class="field-label">
                                                Club
                                            </label>
                                            <auto-suggest v-if="show_auto_suggest"
                                                          :initial_value="{label:form_data.club,value:form_data.club_id}"
                                                          :restricted="club_autosuggest.restrict"
                                                          :options="clubs"
                                                          :input_attrs="{id:'club',class:[fieldClass('club'),'form-field'],type:'text',autocomplete:'off'}"
                                                          v-on:input="clubChange"></auto-suggest>
                                            <input v-else
                                                   id="club"
                                                   v-model="form_data.club"
                                                   type="text"
                                                   class="form-field"
                                                   :class="fieldClass('club')">
                                            <p v-if="fieldMessage('club')"
                                               class="input-error">
                                                *{{fieldMessage('club')}}
                                            </p>
                                        </div>
                                        <div class="form-group">
                                            <label for="date"
                                                   class="field-label">
                                                Date
                                            </label>
                                            <date-input id="date"
                                                        v-model="form_data.date"
                                                        placeholder="mm/dd/yyyy"
                                                        :class="fieldClass('date')"
                                                        :initial="form_data.date"></date-input>
                                            <p v-if="fieldMessage('date')"
                                               class="input-error">
                                                *{{fieldMessage('date')}}
                                            </p>
                                        </div>
                                        <div class="form-actions">
                                            <div v-if="external_error"
                                                 class="form-actions__column form-actions__column--full form-actions__column--notice">
                                                <p class="input-error">
                                                    {{external_error}}
                                                </p>
                                            </div>
                                            <div v-if="allow_cancel"
                                                 class="form-actions__column form-actions__column--sm">
                                                <button type="button"
                                                        class="button button--info button--block"
                                                        v-on:click.prevent="cancel()">
                                                    Cancel
                                                </button>
                                            </div>
                                            <div class="form-actions__column form-actions__column--lg"
                                                 :class="allow_cancel?'form-actions__column--lg':'form-actions__column--full'">
                                                <button type="button"
                                                        class="button button--block"
                                                        :disabled="submitting"
                                                        v-on:click.prevent="complete()">
                                                    {{submitting?"Saving":"Save"}}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </skate-test-discipline-form>
                        </div>
                    </div>
                    <div class="skate-test-takeover__section skate-test-takeover__section--self-reported">
                        <div class="grid-container">
                            <h4 class="skate-test-takeover__section-heading skate-test-takeover__section-heading--padded">
                                Delete self-reported tests
                            </h4>
                            <skate-test-history inline-template>
                                <ul class="skate-test-takeover__self-reported-list">
                                    <li v-for="(discipline,index) in self_reported_test_disciplines"
                                        :key="index"
                                        class="skate-test-takeover__self-reported-list__discipline">
                                        <ul class="skate-test-takeover__self-reported-list__discipline__list">
                                            <li v-for="(test,test_index) in discipline.self_reported_tests"
                                                :key="test_index"
                                                class="self-reported-test">
                                                <div class="self-reported-test__heading">
                                                    <h5 class="self-reported-test__heading__name">
                                                        {{discipline.label}}
                                                    </h5>
                                                    <button class="self-reported-test__button icon-button icon-button--delete icon-button--labeled-inline"
                                                            v-on:click.prevent="removeTest(discipline,test,[index,test_index])">
                                                        Remove
                                                    </button>
                                                </div>
                                                <p class="self-reported-test__test-name">
                                                    {{test.name}}
                                                </p>
                                                <p v-if="testError([index,test_index])"
                                                   class="input-error">
                                                    {{testError([index,test_index])}}
                                                </p>
                                            </li>
                                        </ul>
                                    </li>
                                    <li v-if="!self_reported_test_disciplines.length"
                                        class="self-reported-test">
                                        <span class="self-reported-test__no-test-notice">
                                            No self-reported tests
                                        </span>
                                    </li>
                                </ul>
                            </skate-test-history>
                        </div>
                    </div>
                </div>
            </div>
        </site-takeover>
    </div>
</template>
<script lang="ts">

    /* ===========================================================================================================
    *                                              2020-03-08 SKATE TESTS COMPONENT
    * Full component for handling skate tests, including history display and edit discipline overlay
    * ===========================================================================================================*/

    import Vue from 'vue';
    import {
        SkateTestFormData,
        SkateTestFormOption,
        SkateTestHistoryDiscipline
    } from '../../contracts/app/SkateTestContracts';

    export default Vue.extend({
        props: {
            club_autosuggest_configuration: {
                type: Object,
                required: false,
                default: () => {
                    return {
                        active: true,
                        restrict: false
                    };
                }
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether a test is in the process of being submitted
                 */
                submitting_test: false,
                /**
                 * Error message resulting from a submission
                 */
                test_submit_error: <string | null>null
            };
        },
        computed: {
            /**
             * The currently active discipline on state
             */
            active_discipline: function (): SkateTestHistoryDiscipline | null {
                return this.$store.getters['skate_test_history/active_discipline'];
            },
            /**
             * Form options for test for the active form instance
             */
            active_test_options: function (): SkateTestFormOption[] {
                return this.$store.getters['skate_test_history/active_discipline_test_options'];
            },
            /**
             * The title of the skate test overlay
             */
            takeover_title: function (): string {
                if (this.active_discipline) {
                    return `Add ${this.active_discipline.label}`;
                }

                return '';
            }
        },
        methods: {
            /**
             * Close the overlay
             */
            closeOverlay: function (): void {
                if (this.submitting_test) {
                    return;
                }
                this.test_submit_error = null;
                this.$store.commit('skate_test_history/setActiveDiscipline', null);
            },
            /**
             * Respond to completion event on skate test discipline form.
             *  - Submit information
             *  - Close form
             *  Log error on submission failure
             */
            completeSkateTest: function (test_data: SkateTestFormData): void {
                this.submitting_test = true;
                this.test_submit_error = null;
                this.$store.dispatch('skate_test_history/saveTest', test_data)
                    .then(() => {
                        this.$store.commit('skate_test_history/setActiveDiscipline', null);
                        this.submitting_test = false;
                    })
                    .catch((error_message) => {
                        this.submitting_test = false;
                        this.test_submit_error = error_message;
                    });
            },
            /**
             * Whether the overlay is active
             */
            overlayActive: function (): boolean {
                return !!this.active_discipline;
            }
        }
    });
</script>