<template>
    <div class="event-requirements-overlay">
        <div class="competition-registration-takeover">
            <div class="competition-registration-takeover__header">
                <h2 class="competition-registration-takeover__title">
                    Event Requirements
                </h2>
                <p class="competition-registration-takeover__header__lead">
                    Please review the requirements below. Your partner must meet them to be eligible to participate.
                </p>
                <hr class="competition-registration-takeover__header-divider">
                <div class="event-requirements-overlay__header">
                    <h3 class="event-requirements-overlay__header__partner-name">
                        {{ requirements_data.partner.name }}
                    </h3>
                    <ul class="label-list event-requirements-overlay__header__event-details">
                        <li>
                            <span class="label-list__label">Event Name:</span>
                            <span class="label-list__value">{{ requirements_data.event.name }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="competition-registration-takeover__content competition-registration-takeover__content--event-requirements">
                <div class="event-requirements-overlay__content">
                    <div class="grid-container">
                        <div class="card" v-if="show_skate_test_requirements">
                            <div class="card__content">
                                <h3 class="card__heading">
                                    Skate Test Requirements:
                                </h3>
                                <div class="card__section" v-if="show_min_skate_tests">
                                    <p class="card__text">
                                        Your partner must meet one of the following minimum requirements:
                                    </p>
                                    <ul class="card__list list list--light">
                                        <li v-for="minimum_skate_test_requirement in minimum_skate_tests">
                                            <span class="list__text">{{ minimum_skate_test_requirement }}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="card__section" v-if="show_max_skate_tests">
                                    <p class="card__text">
                                        Your partner must meet all of the following maximum requirements:
                                    </p>
                                    <ul class="card__list list list--light">
                                        <li v-for="maximum_skate_test_requirement in maximum_skate_tests">
                                            <span class="list__text">{{ maximum_skate_test_requirement }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card" v-if="show_age_requirements">
                            <div class="card__content">
                                <h3 class="card__heading">
                                    Age Requirements:
                                </h3>
                                <div class="card__section">
                                    <p class="card__text" v-if="show_min_age">
                                        Your partner must be at least
                                        <span class="text--highlight">{{ minimum_age }}</span>
                                        years-old.
                                    </p>
                                    <p class="card__text" v-if="show_max_age">
                                        Your partner can not be older than
                                        <span class="text--highlight">{{ maximum_age }}</span>
                                        years-old.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="event-requirements-overlay__close">
                            <slot name="close-button"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {PartnerSkateTestSummary} from '../../contracts/app/CompetitionRegistrationContracts';

    export default Vue.extend({
        props: {
            requirements_data: {
                type: Object as () => PartnerSkateTestSummary,
                required: true
            }
        },
        data: function () {
            return {
                /**
                 * The list of minimum skate tests
                 */
                minimum_skate_tests: <string[] | false>false,
                /**
                 * The list of maximum skate tests
                 */
                maximum_skate_tests: <string[] | false>false,
                /**
                 * The minimum age requirement
                 */
                minimum_age: <number | false>false,
                /**
                 * The maximum age requirement
                 */
                maximum_age: <number | false>false
            };
        },
        /**
         * When component created, import requirements data
         */
        created: function () {
            let {minimum_skate_tests, maximum_skate_tests, minimum_age, maximum_age} = {
                ...this.requirements_data.event.requirements
            };
            this.minimum_skate_tests = minimum_skate_tests && minimum_skate_tests.length ? minimum_skate_tests : false;
            this.maximum_skate_tests = maximum_skate_tests && maximum_skate_tests.length ? maximum_skate_tests : false;
            this.minimum_age = minimum_age !== null ? minimum_age : false;
            this.maximum_age = maximum_age !== null ? maximum_age : false;
        },
        computed: {
            /**
             * Whether to show the minimum age requirement block
             */
            show_min_age: function (): boolean {
                return this.minimum_age !== false;
            },
            /**
             * Whether to show the maximum age requirement block
             */
            show_max_age: function (): boolean {
                return this.maximum_age !== false;
            },
            /**
             * Whether to show the maximum skate tests requirement block
             */
            show_max_skate_tests: function (): boolean {
                return this.maximum_skate_tests !== false;
            },
            /**
             * Whether to show the minimum skate tests requirement block
             */
            show_min_skate_tests: function (): boolean {
                return this.minimum_skate_tests !== false;
            },
            /**
             * Whether to show the entire skate test requirements section
             */
            show_skate_test_requirements: function (): boolean {
                return this.show_min_skate_tests || this.show_max_skate_tests;
            },
            /**
             * Whether to show the entire age requirements section
             */
            show_age_requirements: function (): boolean {
                return this.show_min_age || this.show_max_age;
            }
        }
    });
</script>