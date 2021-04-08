<template>
    <page :header="page_header"
          class="my-teams-page"
          :class="{'page--accent':component_loaded}">
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading teams."></component-loader>
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="pre-header"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>

        <div slot="content"
             class="page__accent-content grid-container">
            <select-team-list :teams="teams"
                              v-on:select="selectTeam"></select-team-list>
        </div>
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
    </page>
</template>
<script lang="ts">
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import mixins from 'vue-typed-mixins';
    import CompetitionPortalPageMixin from '../../_mixins/CompetitionPortalPageMixin';
    import {MyTeamsPage} from './_contracts';
    import SelectTeamList from '../../../Teams/_components/SelectTeamList.vue';

    const extendedVue = mixins(HasDataDependencies, CompetitionPortalPageMixin);

    // @vue/component
    export default extendedVue.extend({
        components: {
            SelectTeamList
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies for component to load
                 */
                dependencies: {
                    teams: false
                },
                /**
                 * Title to display for the page in the header block
                 */
                page_title: 'My Teams',
                /**
                 * Error resulting from a selection attempt
                 */
                selection_error: <string | null>null
            };
        },
        computed: {
            /**
             * The teams to display on the page
             */
            teams: function (): MyTeamsPage.Team[] {
                return this.$store.state.competition_portal.competition_managed_teams;
            }
        },
        methods: {
            /**
             * Load data dependencies for component
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchMyTeams')
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
            selectTeam: function (team: MyTeamsPage.Team): void {
                location.assign(team.links.competition_portal);
            }
        }
    });
</script>