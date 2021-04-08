<template>
    <page :header="page_header">
        <component-loader v-if="!component_loaded"
                          :container="true"
                          :source="this"
                          error_message="Error loading competitions."></component-loader>
        <div v-else
             class="page__content">
            <div v-if="competitions.length"
                 class="panel-link-group panel-link-group--no-first-pad">
                <a v-for="competition in competitions"
                   :key="competition.id"
                   :href="competition.links.select_team"
                   class="panel-link">
                    <div class="panel-link__content">
                        <div class="competition-summary">
                            <div class="competition-summary__icon">
                                <img :src="competition.icon"
                                     :alt="`Competition Icon for ${competition.name}`">
                            </div>
                            <div class="competition-summary__details">
                                <p class="competition-summary__details-primary">{{competition.name}}</p>
                                <p class="competition-summary__details-secondary">
                                    Dates: {{competition.start_date_pretty}} - {{competition.end_date_pretty}}
                                </p>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            <div v-else-if="!loaded">
                Loading...
            </div>
            <div v-else>
                <p>Your team(s) are not registered for any competitions at this time.</p>
                <a v-if="competition_registration_url"
                   :href="competition_registration_url"
                   class="standard-link"
                   target="_blank"
                   rel="noopener noreferrer">Register on EMS Desktop Site
                </a>
            </div>
        </div>
    </page>
</template>
<script lang="ts">
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import mixins from 'vue-typed-mixins';
    import {
        BackLinkConfiguration,
        PageComponentHeaderBackLinkConfiguration,
        PageComponentHeaderConfiguration
    } from '../../contracts/AppContracts';
    import {MyCompetitionsTeamsPageCompetition} from './_contracts/MyCompetitionsTeamsPageContracts';
    import {TeamsState} from '../TeamsState';

    const extendedVue = mixins(HasDataDependencies);
    // @vue/component
    export default extendedVue.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Dependencies required for the page to load
                 */
                dependencies: {
                    competitions: false
                }
            };
        },
        computed: {
            /**
             * The configuration for the back link in the header
             */
            back_link: function (): PageComponentHeaderBackLinkConfiguration {
                const back_link_configuration: BackLinkConfiguration | null = this.$store.state.app.active_page_back_link;
                if (back_link_configuration) {
                    return {
                        back_link: back_link_configuration.url,
                        back_link_label: back_link_configuration.label
                    };
                }

                return {};
            },
            /**
             * The link to competition registration for teams.  Displays with no competitions message
             */
            competition_registration_url: function (): string | null {
                return this.$store.state.teams.links.competition_registration || null;
            },
            /**
             * The competitions to display
             */
            competitions: function (): MyCompetitionsTeamsPageCompetition[] {
                return this.$store.state.teams.managed_team_competitions;
            },
            /**
             * Configuration for page header sub-component
             */
            page_header: function (): PageComponentHeaderConfiguration {
                return {
                    title: 'My Competitions - Teams',
                    ...this.back_link
                };
            }
        },
        /**
         * Before creation, ensure teams state module is registered
         */
        beforeCreate: function (): void {
            if (!this.$store.state.teams) {
                this.$store.registerModule('teams', TeamsState);
            }
        },
        methods: {
            /**
             * Load data dependencies for component
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('teams/fetchManagedTeamCompetitions')
                        .then(() => {
                            this.dependencies.competitions = true;
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