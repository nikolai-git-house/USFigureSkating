<template>
    <div class="competition-management-index pagination-footer-offset">
        <div class="page">
            <div class="page__heading">
                <h1 class="page__title">
                    Competition Management
                </h1>
            </div>
            <div v-cloak class="page__content page__content--no-top-pad">
                <div v-if="!component_loaded">
                    <p v-if="load_error" class="text--alert">
                        Error loading competitions.
                    </p>
                    <p v-else-if="!loaded && loading_timeout">
                        Loading...
                    </p>
                </div>
                <div v-else class="competition-management-index__content">
                    <div class="competition-management-index__tabs">
                        <div class="tabs tabs--justified tabs--equal tabs--reduced">
                            <div class="tabs__triggers">
                                <ul class="tabs__list">
                                    <li class="tabs__item">
                                        <a href="#"
                                           class="tabs__trigger"
                                           :class="{'active':active_type==='upcoming'}"
                                           v-on:click.prevent="selectActiveType('upcoming')">
                                            Upcoming
                                        </a>
                                    </li>
                                    <li class="tabs__item">
                                        <a href="#"
                                           class="tabs__trigger"
                                           :class="{'active':active_type==='past'}"
                                           v-on:click.prevent="selectActiveType('past')">
                                            Past
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="competition-management-index__competitions-list">
                        <div v-if="visible_competitions.length" class="panel-link-group">
                            <a v-for="competition in visible_competitions"
                               :key="competition.id"
                               :href="competition.manage_link"
                               class="panel-link">
                                <div class="panel-link__content">
                                    <competition-management-competition-summary :competition="competition"></competition-management-competition-summary>
                                </div>
                            </a>
                        </div>
                        <div v-else class="competition-management-index__no-competitions">
                            <p>
                                {{no_competitions_message}}
                            </p>
                        </div>
                    </div>
                    <div v-if="show_pagination" class="competition-management-index__footer">
                        <div class="grid-container">
                            <pagination ref="pagination"
                                        :paginated_items="paginated_items"
                                        v-on:page-changed="handleActivePageChange"></pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../../mixins/HasDataDependencies';
    import HasPaginatedItems from '../../../mixins/HasPaginatedItems';
    import {
        CompetitionManagementCompetitionTypeKey,
        CompetitionManagementIndexCompetition
    } from '../_contracts/CompetitionManagementContracts';

    const vueClass = mixins(HasDataDependencies, HasPaginatedItems);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Active competition type
                 */
                active_type: <CompetitionManagementCompetitionTypeKey>'upcoming',
                /**
                 * Data needed for component to function
                 */
                dependencies: {
                    competitions: false
                },
                /**
                 * The amount of items per page of pagination
                 */
                pagination_per_page: 50
            };
        },
        computed: {
            /**
             * All competitions that have passed any active filters
             */
            filtered_competitions: function (): CompetitionManagementIndexCompetition[] {
                if (this.active_type === 'upcoming') {
                    return this.upcoming_competitions;
                }

                return this.past_competitions;
            },
            /**
             * Message to show when no competitions are available for a tab
             */
            no_competitions_message: function () {
                return `There are no ${this.active_type} competitions configured.`;
            },
            /**
             * The items to paginate
             */
            pagination_items: function (): CompetitionManagementIndexCompetition[] {
                return this.filtered_competitions;
            },
            /**
             * Past Competitions
             */
            past_competitions: function (): CompetitionManagementIndexCompetition[] {
                return this.$store.state.competition_management.past_competitions;
            },
            /**
             * Upcoming Competitions
             */
            upcoming_competitions: function (): CompetitionManagementIndexCompetition[] {
                return this.$store.state.competition_management.upcoming_competitions;
            },
            /**
             * The set of competitions currently visible on the active pagination page
             */
            visible_competitions: function (): CompetitionManagementIndexCompetition[] {
                return this.visible_items;
            }
        },

        methods: {
            /**
             * Load data needed for component to function
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_management/fetchCompetitionLists')
                        .then(() => {
                            this.dependencies.competitions = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Select the active competition type
             */
            selectActiveType: function (type: CompetitionManagementCompetitionTypeKey) {
                this.active_type = type;
            }
        }
    });
</script>