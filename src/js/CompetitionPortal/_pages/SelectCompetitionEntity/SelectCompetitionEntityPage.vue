<template>
    <page :header="page_header"
          :class="{'page--accent':component_loaded}">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="pre-header"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <p slot="header-content"
           class="page-heading__intro">
            You are able to view this competition in multiple ways. Select whether you would like to view this
            competition as yourself or as a team that you manage. Only teams registered for the competition are listed
            below.
        </p>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading competition registrant information."></component-loader>
        <div v-else
             class="page__accent-content grid-container">
            <select-team-list :teams="entities"
                              v-on:select="selectEntity"></select-team-list>
        </div>
    </page>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import {CompetitionPortalPageMixin} from '../../_mixins';
    import SelectTeamList from '../../../Teams/_components/SelectTeamList.vue';
    import {SelectEntityPage} from './_contracts';

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
                page_title: 'Choose View'
            };
        },
        computed: {
            /**
             * The teams to display on the page
             */
            entities: function (): SelectEntityPage.Entity[] {
                return this.$store.state.competition_portal.competition_selectable_entities;
            }
        },
        methods: {
            /**
             * Load data dependencies for component
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchCompetitionEntitySelect')
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
            selectEntity: function (entity: SelectEntityPage.Entity): void {
                location.assign(entity.links.competition_portal);
            }
        }
    });
</script>