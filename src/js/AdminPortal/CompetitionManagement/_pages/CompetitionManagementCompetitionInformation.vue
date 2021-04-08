<template>
    <div class="competition-management-competition-information">
        <div v-if="!component_loaded && !is_child" class="grid-container">
            <p v-if="load_error" class="text--alert">
                Error loading competition information.
            </p>
            <p v-else-if="!loaded && loading_timeout">
                Loading...
            </p>
        </div>
        <div v-else class="page page--content-height">
            <competition-heading v-if="competition"
                                 :always_show="true"
                                 :competition_override="competition"></competition-heading>
            <div class="admin-portal-page-heading">
                <div class="grid-container">
                    <div v-if="competition" class="admin-portal-page-heading__back-link">
                        <a :href="competition.manage_link"
                           class="icon-link icon-link--back"
                           v-on:click="backClick">
                            Back
                        </a>
                    </div>
                    <h1 class="admin-portal-page-heading__page-title">
                        Competition Information
                    </h1>
                </div>
            </div>
            <div class="page__content page__content--bleed">
                <div class="competition-management-competition-information__content">
                    <div v-if="!component_loaded" class="grid-container">
                        <p v-if="load_error" class="text--alert">
                            Error loading competition information.
                        </p>
                        <p v-else-if="!loaded && loading_timeout">
                            Loading...
                        </p>
                    </div>
                    <div v-else class="accordion-group accordion-group--up-down">
                        <accordion class="accordion--data">
                            <span slot="trigger_text" class="accordion-data-trigger">
                                <span class="accordion-data-trigger__name">Competition Information</span>
                                <accordion-status-trigger :status_data="registrants.summary"></accordion-status-trigger>
                            </span>
                            <div slot="expand_content" class="competition-management-competition-information__competition">
                                <ul class="competition-management-competition-information__entries-list">
                                    <li v-for="(entity_type, index) in registrants.entity_counts"
                                        :key="index"
                                        class="competition-management-competition-information__entries-list__item">
                                        {{entity_type.name}}: {{entity_type.count}}
                                    </li>
                                </ul>
                            </div>
                        </accordion>
                        <accordion class="accordion--data">
                            <span slot="trigger_text" class="accordion-data-trigger">
                                <span class="accordion-data-trigger__name">Registration</span>
                                <accordion-status-trigger :status_data="registration_information.summary"></accordion-status-trigger>
                            </span>
                            <div slot="expand_content" class="competition-management-competition-information__registration-content">
                                <div v-for="(date,index) in registration_information.dates"
                                     :key="index"
                                     class="competition-date">
                                    <p class="competition-date__name">
                                        {{date.name}}:
                                    </p>
                                    <p class="competition-date__value">
                                        {{date.date_time_formatted}}
                                    </p>
                                    <p v-if="date.cost" class="competition-date__fee">
                                        {{date.cost.label}}:
                                        <span class="competition-date__fee__value">${{date.cost.value}}</span>
                                    </p>
                                </div>
                            </div>
                        </accordion>
                        <accordion class="accordion--data">
                            <span slot="trigger_text" class="accordion-data-trigger">
                                <span class="accordion-data-trigger__name">Deadlines</span>
                                <accordion-status-trigger class=" accordion-data-trigger__data--small" :status_data="deadline_information.summary"></accordion-status-trigger>
                            </span>
                            <div slot="expand_content" class="competition-management-competition-information__deadlines">
                                <div v-for="(deadline,index) in deadline_information.deadlines"
                                     :key="index"
                                     class="competition-date competition-date--status"
                                     :class="'competition-date--status--'+deadline.status_key">
                                    <p class="competition-date__name">
                                        {{deadline.name}} Deadline:
                                    </p>
                                    <p class="competition-date__value">
                                        {{deadline.date_time_formatted}}
                                    </p>
                                    <p v-if="deadline.late_fee !== null" class="competition-date__fee">
                                        {{deadline.name}} Late Fee:
                                        <span class="competition-date__fee__value">${{deadline.late_fee}}</span>
                                    </p>
                                </div>
                            </div>
                        </accordion>
                        <accordion class="accordion--data">
                            <span slot="trigger_text" class="accordion-data-trigger">
                                <span class="accordion-data-trigger__name">Practice Ice</span>
                                <accordion-status-trigger :status_data="practice_ice.summary"></accordion-status-trigger>
                            </span>
                            <div slot="expand_content" class="competition-management-competition-information__practice-ice">
                                <div v-for="(window,index) in practice_ice.windows"
                                     :key="index"
                                     class="competition-date-window">
                                    <div class="competition-date">
                                        <p class="competition-date__name">
                                            {{window.name}} Begins:
                                        </p>
                                        <p class="competition-date__value">
                                            {{window.begin_date_time_formatted}}
                                        </p>
                                    </div>
                                    <div class="competition-date">
                                        <p class="competition-date__name">
                                            {{window.name}} Deadline:
                                        </p>
                                        <p class="competition-date__value">
                                            {{window.end_date_time_formatted}}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </accordion>
                        <accordion v-if="volunteer_timeline.windows.length" class="accordion--data">
                            <span slot="trigger_text" class="accordion-data-trigger">
                                <span class="accordion-data-trigger__name">Volunteer Timeline</span>
                            </span>
                            <div slot="expand_content" class="competition-management-competition-information__volunteers">
                                <div v-for="(volunteer_window,index) in volunteer_timeline.windows"
                                     :key="index"
                                     class="competition-date-window">
                                    <div class="competition-date">
                                        <p class="competition-date__name">
                                            {{volunteer_window.name}} Open:
                                        </p>
                                        <p class="competition-date__value">
                                            {{volunteer_window.begin_date_time_formatted}}
                                        </p>
                                    </div>
                                    <div class="competition-date">
                                        <p class="competition-date__name">
                                            {{volunteer_window.name}} Deadline:
                                        </p>
                                        <p class="competition-date__value">
                                            {{volunteer_window.end_date_time_formatted}}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </accordion>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import {
        CompetitionInformationSectionDeadlines,
        CompetitionInformationSectionPracticeIce,
        CompetitionInformationSectionRegistrants,
        CompetitionInformationSectionRegistration,
        CompetitionInformationSectionVolunteer,
        CompetitionManagementCompetitionInformationPageInterface
    } from '../_contracts/page-contracts/CompetitionManagementCompetitionInformationPageContracts';
    import CompetitionManagementSubComponentMixin from '../_mixins/CompetitionManagementSubComponentMixin';

    import {CompetitionManagementCompetition} from '../_models/CompetitionManagementCompetition';

    const vueClass = mixins(HasDataDependencies, CompetitionManagementSubComponentMixin);
    // @vue/component
    export default vueClass.extend({

        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies
                 */
                dependencies: {
                    competition: false,
                    competition_information: false
                }
            };
        },
        computed: {
            /**
             * The active competition
             */
            competition: function (): CompetitionManagementCompetition {
                return this.$store.state.competition_management.active_competition;
            },
            /**
             * Active competition information
             */
            competition_information(): CompetitionManagementCompetitionInformationPageInterface {
                return this.$store.state.competition_management.active_competition_information;
            },
            /**
             * Deadlines information
             */
            deadline_information: function (): CompetitionInformationSectionDeadlines {
                return this.competition_information.deadlines_summary;
            },
            /**
             * Registrants information
             */
            registrants: function (): CompetitionInformationSectionRegistrants {
                return this.competition_information.registrants_summary;
            },
            /**
             * Registration information
             */
            registration_information: function (): CompetitionInformationSectionRegistration {
                return this.competition_information.registration_summary;
            },
            /**
             * Practice ice information
             */
            practice_ice: function (): CompetitionInformationSectionPracticeIce {
                return this.competition_information.practice_ice_summary;
            },
            /**
             * Volunteer Information
             */
            volunteer_timeline: function (): CompetitionInformationSectionVolunteer {
                return this.competition_information.volunteer_summary;
            }
        },
        methods: {
            /**
             * Load data for the component
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_management/fetchActiveCompetition')
                        .then(() => {
                            this.dependencies.competition = true;
                            this.$store.dispatch('competition_management/fetchActiveCompetitionInformation')
                                .then(() => {
                                    this.dependencies.competition_information = true;
                                })
                                .catch(() => {
                                    reject();
                                });
                        })
                        .catch(() => {
                            reject();
                        });
                });
            }
        }
    });
</script>