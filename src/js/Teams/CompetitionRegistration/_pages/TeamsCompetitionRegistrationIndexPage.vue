<template>
    <div class="teams-competition-registration-index-page">
        <page :header="page_header"
              :class="{'page--accent':component_loaded}">
            <page-entity-header v-if="component_loaded && team_summary_name"
                                slot="pre-header"
                                :entity_name="team_summary_name"></page-entity-header>
            <component-loader v-if="!component_loaded"
                              slot="loader"
                              :container="true"
                              :source="this"
                              error_message="Error loading competitions."></component-loader>
            <div v-else
                 slot="content"
                 class="page__content page__content--bleed">
                <div class="tabs tabs--justified tabs--reduced page--accent__standard-content">
                    <div class="tabs__triggers">
                        <ul class="tabs__list">
                            <li class="tabs__item">
                                <a href="#"
                                   class="tabs__trigger"
                                   :class="{'active':active_type==='qualifying'}"
                                   v-on:click.prevent="selectActiveType('qualifying')">
                                    Qualifying
                                </a>
                            </li>
                            <li class="tabs__item">
                                <a href="#"
                                   class="tabs__trigger"
                                   :class="{'active':active_type==='non_qualifying'}"
                                   v-on:click.prevent="selectActiveType('non_qualifying')">
                                    Nonqualifying
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="page__accent-content grid-container">
                    <competition-filter v-if="show_search"
                                        ref="filter"
                                        :competitions="type_filtered_competitions"
                                        v-on:input="filtered_competitions = $event"></competition-filter>
                    <div v-if="no_active_configured_competitions"
                         class="teams-competition-registration-index-page__no_configured_notice">
                        <p>
                            For questions regarding {{active_type.replace('_','')}} events, contact
                            events@usfigureskating.org.
                        </p>
                        <p class="alert">
                            There are no {{active_type.replace('_','')}} competitions setup and currently
                            accepting entries. Check back again.
                        </p>
                    </div>
                    <div v-else
                         class="competition-tile-list">
                        <p v-if="visible_competitions.length===0"
                           class="competition-tile-list__no-results alert">
                            No competitions match your filters.
                        </p>
                        <competition-tile v-for="competition in visible_competitions"
                                          :key="competition.id"
                                          :class="{'competition-tile--with-banners':isRegistered(competition)}"
                                          :competition="competition">
                            <div v-if="isRegistered(competition)"
                                 slot="banners"
                                 class="competition-tile__banners">
                                <div class="competition-tile-banner competition-tile-banner--registered">
                                    Registered
                                </div>
                            </div>
                            <competition-registration-cta slot="drawer"
                                                          :competition="competition"
                                                          class="competition-tile__drawer"></competition-registration-cta>
                        </competition-tile>
                    </div>
                </div>
            </div>
            <div v-if="show_pagination"
                 class="pagination-footer">
                <div class="grid-container">
                    <pagination ref="pagination"
                                :paginated_items="paginated_items"
                                v-on:page-changed="handleActivePageChange"></pagination>
                </div>
            </div>
        </page>
    </div>
</template>
<script lang="ts">

    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import {
        CompetitionFilterComponentInterface,
        PageComponentHeaderConfiguration
    } from '../../../contracts/AppContracts';
    import mixins from 'vue-typed-mixins';
    import {CompetitionQualifyingKey} from '../../../contracts/app/CompetitionRegistrationContracts';
    import {CompetitionListCompetition} from '../_models';
    import HasPaginatedItems from '../../../mixins/HasPaginatedItems';
    import {TeamsCompetitionRegistration} from '../_contracts';
    import {TeamsCompetitionRegistrationState} from '../TeamsCompetitionRegistrationState';

    const vueClass = mixins(HasDataDependencies, HasPaginatedItems);
    // @vue/component
    export default vueClass.extend({
        props: {
            /**
             * The back link url to display in the page header
             */
            back_link: {
                type: String,
                required: false
            },
            /**
             * The label for the back link in the page header
             */
            back_link_label: {
                type: String,
                required: false
            }
        },
        /**
         * Reactive Data
         */
        data: function () {
            return {
                /**
                 * The active type of events being shown (qual/nonqual)
                 */
                active_type: <CompetitionQualifyingKey>'non_qualifying',
                /**
                 * Data dependencies for page
                 */
                dependencies: {
                    competitions: false
                },
                /**
                 * The competitions filtered by the user
                 */
                filtered_competitions: <CompetitionListCompetition[]>[]
            };
        },
        computed: {
            /**
             * The competitions to display on the page.
             */
            available_competitions: function (): CompetitionListCompetition[] {
                return this.$store.state.teams.competition_registration.available_competitions;
            },
            /**
             * Whether no competitions are available for the currently active type
             */
            no_active_configured_competitions: function (): boolean {
                return this.type_filtered_competitions.length === 0;
            },
            /**
             * The configuration for the page header
             */
            page_header: function (): PageComponentHeaderConfiguration {
                const conf: PageComponentHeaderConfiguration = {
                    title: 'Competition Registration - Teams',
                    back_link: this.back_link,
                    back_link_label: this.back_link_label
                };

                return conf;
            },
            /**
             * The items to paginate
             */
            pagination_items: function (): CompetitionListCompetition[] {
                return this.filtered_competitions;
            },
            /**
             * Whether to show the search form
             */
            show_search: function (): boolean {
                return !this.no_active_configured_competitions;
            },
            /**
             * The name of the current team to use in the summary header
             */
            team_summary_name: function (): string | null {
                const active_team: TeamsCompetitionRegistration.TeamSummary | null = this.$store.state.teams.competition_registration.active_team;
                if (active_team) {
                    return [active_team.name, active_team.level].join(' - ');
                }

                return null;
            },
            /**
             * Competitions that belong to the active type
             */
            type_filtered_competitions: function (): CompetitionListCompetition[] {
                return this.available_competitions.filter((competition: CompetitionListCompetition) => {
                    const check = this.active_type === 'qualifying';

                    return competition.is_qualifying === check;
                });
            },
            /**
             * The set of competitions currently visible on the active pagination page
             */
            visible_competitions: function () {
                return this.visible_items;
            }
        },
        /**
         * Before component is created, initialize state
         */
        beforeCreate: function () {
            if (!this.$store.state.teams.competition_registration) {
                this.$store.registerModule(['teams', 'competition_registration'], TeamsCompetitionRegistrationState);
            }
        },
        methods: {
            /**
             * Whether a competition is registered for by the user
             */
            isRegistered: function (competition: CompetitionListCompetition): boolean {
                return competition.user_registration_status === 'registered';
            },
            /**
             * Load data dependencies
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('teams/competition_registration/fetchCompetitionList')
                        .then(() => {
                            this.dependencies.competitions = true;
                            this.resetFilteredCompetitions();
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Reset the filtered competitions
             */
            resetFilteredCompetitions: function () {
                this.$nextTick(() => {
                    this.filtered_competitions = this.type_filtered_competitions;
                });
            },
            /**
             * Reset the filter component to initial state
             */
            resetFilterComponent: function (): void {
                const ref: CompetitionFilterComponentInterface | null = this.$refs.filter as CompetitionFilterComponentInterface | null;
                if (ref && 'reset' in ref) {
                    ref.reset();
                }
            },
            /**
             * Select whether qualifying or nonqualifying are active
             */
            selectActiveType: function (qualifying_key: CompetitionQualifyingKey) {
                this.active_type = qualifying_key;
                this.resetFilteredCompetitions();
                this.resetFilterComponent();
            }
        }
    });
</script>