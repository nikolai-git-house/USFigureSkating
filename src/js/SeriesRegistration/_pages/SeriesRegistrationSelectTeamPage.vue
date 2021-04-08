<template>
    <page :class="{'page--accent':component_loaded}"
          :header="page_header"
          class="series-registration-select-team-page">
        <series-page-header v-if="component_loaded"
                            slot="pre-header"
                            :series="series"></series-page-header>
        <p slot="header-content"
           class="page-heading__intro">
            If you do not see the team listed, verify the team’s membership has been renewed and you are indicated as
            either Coach or Team Manager.
        </p>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading teams."></component-loader>
        <div v-else
             class="page__accent-content grid-container">
            <select-team-list v-if="teams.length"
                              :teams="teams">
                <a slot="button"
                   slot-scope="{team}"
                   :href="team.select_button.url"
                   class="button button--block button--info button--block">
                    <slot :team="team"
                          name="button-text">
                        {{team.select_button.text}}
                    </slot>
                </a>
            </select-team-list>
            <p v-else class="series-registration-select-team-page__notice text--alert">
                You don't manage any teams eligible to apply for this series.
            </p>
        </div>
    </page>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import SelectTeamList from '../../Teams/_components/SelectTeamList.vue';
    import {PageComponentHeaderConfiguration} from '../../contracts/AppContracts';
    import {SeriesRegistrationState} from '../_store/SeriesRegistrationState';
    import {SeriesRegistration} from '../_contracts/SeriesRegistrationContracts';

    const extendedVue = mixins(HasDataDependencies);

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
                page_title: 'Select a Team'
            };
        },
        computed: {
            /**
             * The series for the page
             */
            series: function (): SeriesRegistration.SubpageSeriesSummary {
                return this.$store.state.series_registration.series_summary;
            },
            /**
             * The configuration for the page header
             */
            page_header: function (): PageComponentHeaderConfiguration {
                const conf: PageComponentHeaderConfiguration = {
                    title: this.page_title
                };
                if (this.series) {
                    conf.back_link = this.series.links.overview;
                    conf.back_link_label = 'Back to Series Overview';
                }

                return conf;
            },
            /**
             * The teams to display on the page
             */
            teams: function (): SeriesRegistration.SelectableTeam[] {
                return this.$store.state.series_registration.selectable_teams;
            }
        },
        /**
         * Before component created, ensure state modules are registered and configured
         */
        beforeCreate: function (): void {
            if (typeof this.$store.state.series_registration === 'undefined') {
                this.$store.registerModule('series_registration', SeriesRegistrationState);
            }
        },
        methods: {
            /**
             * Load data dependencies for component
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('series_registration/fetchSeriesTeamSelect')
                        .then(() => {
                            this.dependencies.teams = true;
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