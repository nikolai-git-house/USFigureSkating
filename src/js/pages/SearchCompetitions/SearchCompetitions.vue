<template>
    <div class="search-competitions-page">
        <page :class="{'page--accent':component_loaded}"
              :header="{title:'Search Competitions', lead:' Search to view any competition.'}">
            <component-loader
                    v-if="!component_loaded"
                    slot="loader"
                    :container="true"
                    :source="this"
                    error_message="Error loading competitions.">
            </component-loader>
            <div v-else
                 slot="content"
                 class="page__accent-content">
                <div class="grid-container">
                    <competition-filter v-if="show_filters"
                                        ref="filters"
                                        :competitions="available_competitions"
                                        v-on:input="filtered_competitions = $event"></competition-filter>
                    <div v-if="available_competitions.length===0">
                        <p class="alert">
                            There are no competitions currently available. Check back again.
                        </p>
                    </div>
                    <div v-else class="competition-tile-list">
                        <p v-if="visible_competitions.length===0" class="competition-tile-list__no-results alert">
                            No competitions match your filters.
                        </p>
                        <competition-tile v-for="competition in visible_competitions"
                                          :key="competition.id"
                                          :class="{'competition-tile--with-banners':hasBanner(competition)}"
                                          :competition="competition">
                            <div v-if="hasBanner(competition)"
                                 slot="banners"
                                 class="competition-tile__banners">
                                <div v-if="isRegistered(competition)"
                                     class="competition-tile-banner competition-tile-banner--registered">
                                    Registered
                                </div>
                            </div>
                            <div slot="drawer" class="competition-tile__drawer">
                                <div class="competition-tile__cta">
                                    <a :href="competition.view_competition_link" class="button button--block">
                                        View Competition
                                    </a>
                                </div>
                                <p v-if="competition.registration_deadline"
                                   class="competition-tile__text competition-tile__text--secondary"
                                   :class="{'competition-tile__text--alert':hasDeadlineWarning(competition)}">
                                    Registration deadline: {{competition.registration_deadline}}
                                </p>
                            </div>
                        </competition-tile>
                    </div>
                </div>
            </div>
            <pagination v-if="component_loaded && show_pagination"
                        ref="pagination"
                        slot="pagination"
                        :paginated_items="paginated_items"
                        v-on:page-changed="handleActivePageChange"></pagination>
        </page>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import HasPaginatedItems from '../../mixins/HasPaginatedItems';
    import {SearchCompetitionsCompetition} from './SearchCompetitionsContracts';

    const vueClass = mixins(HasDataDependencies, HasPaginatedItems);
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data needed for component to function
                 */
                dependencies: {
                    competitions: false
                },
                /**
                 * Competitions that pass active filters
                 */
                filtered_competitions: <SearchCompetitionsCompetition[]>[],
                /**
                 * The amount of items per page of pagination
                 */
                pagination_per_page: 50
            };
        },
        methods: {
            /**
             * Whether a competition has a banner for its tile
             */
            hasBanner: function (competition: SearchCompetitionsCompetition): boolean {
                return this.isRegistered(competition);
            },
            /**
             * Whether the competition's registration deadline should show in alert text
             */
            hasDeadlineWarning: function (competition: SearchCompetitionsCompetition): boolean {
                return competition.has_registration_deadline_warning;
            },
            /**
             * Whether a competition is registered for by the user
             */
            isRegistered: function (competition: SearchCompetitionsCompetition): boolean {
                return competition.user_registration_status === 'registered';
            },
            /**
             * Load data needed for component to function
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competitions/fetchCompetitionListSearch')
                        .then(() => {
                            this.dependencies.competitions = true;
                            this.filtered_competitions = this.available_competitions;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            }
        },
        computed: {
            /**
             * All available competitions
             */
            available_competitions: function (): SearchCompetitionsCompetition[] {
                return this.$store.state.competitions.competition_list_search;
            },
            /**
             * Items to paginate
             */
            pagination_items: function (): SearchCompetitionsCompetition[] {
                return this.filtered_competitions;
            },
            /**
             * Whether to show the filters form
             */
            show_filters: function (): boolean {
                return this.available_competitions.length > 0;
            },
            /**
             * The set of competitions currently visible on the active pagination page
             */
            visible_competitions: function (): SearchCompetitionsCompetition[] {
                return this.visible_items;
            }
        }
    });
</script>