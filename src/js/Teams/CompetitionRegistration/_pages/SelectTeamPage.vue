<template>
    <div class="select-team-page">
        <page :header="page_header"
              :class="{'page--accent':component_loaded}">
            <p slot="header-content"
               class="select-team-page__lead">
                If you do not see the team listed, verify the team’s membership has been renewed and you are indicated
                as either Coach or Team Manager.
            </p>
            <component-loader v-if="!component_loaded"
                              slot="loader"
                              :container="true"
                              :source="this"
                              error_message="Error loading teams."></component-loader>
            <div v-else
                 class="page__accent-content grid-container">
                <select-team-list :teams="teams"
                                  v-on:select="selectTeam"></select-team-list>
            </div>
        </page>
        <popup v-cloak
               v-if="selection_error"
               class="popup popup--error popup--md"
               :math_center="true"
               v-on:close-popup="selection_error=null">
            <span slot="heading-text">
                Error
            </span>
            <div slot="content">
                <p>
                    {{selection_error}}
                </p>
            </div>
        </popup>
    </div>
</template>
<script lang="ts">
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import mixins from 'vue-typed-mixins';
    import {PageComponentHeaderConfiguration} from '../../../contracts/AppContracts';
    import {Teams} from '../../_contracts';
    import {TeamsCompetitionRegistrationState} from '../TeamsCompetitionRegistrationState';
    import SelectTeamList from '../../_components/SelectTeamList.vue';

    const extendedVue = mixins(HasDataDependencies);
    // @vue/component
    export default extendedVue.extend({
        components: {
            SelectTeamList
        },
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
                 * Data dependencies for page component
                 */
                dependencies: {
                    teams: false
                },
                /**
                 * Error resulting from a selection attempt
                 */
                selection_error: <string | null>null
            };
        },
        computed: {
            /**
             * The configuration for the page header
             */
            page_header: function (): PageComponentHeaderConfiguration {
                const conf: PageComponentHeaderConfiguration = {
                    title: 'Select a team to register',
                    back_link: this.back_link,
                    back_link_label: this.back_link_label
                };

                return conf;
            },
            /**
             * Teams available for selection
             */
            teams: function (): Teams.SelectTeamPageTeam[] {
                return this.$store.getters['teams/competition_registration/selection_teams'];
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
             * Load data dependencies
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('teams/competition_registration/fetchTeamSelect')
                        .then(() => {
                            this.dependencies.teams = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Select a team
             */
            selectTeam: function (team: Teams.SelectTeamPageTeam) {
                this.$store.dispatch('teams/competition_registration/selectTeam', team)
                    .catch((error_message: string) => {
                        this.selection_error = error_message;
                    });
            }
        }
    });
</script>