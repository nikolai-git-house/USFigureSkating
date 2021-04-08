<script lang="ts">
    import MyCoachesSearch from './MyCoachesSearch.vue';
    import {CoachRemovePayload, SearchActivationPayload, SkaterEventCategoryCoach} from '../../contracts/AppContracts';
    import {SkaterCoachedEventCategory} from '../../models/SkaterCoachedEventCategory';
    import {CoachSearchState} from '../../store/Modules/CoachSearchState';
    import mixins from 'vue-typed-mixins';
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import {CompetitionPortalPageMixin} from '../../CompetitionPortal/_mixins';
    import {CompetitionPortalAppService} from '../../CompetitionPortal/_services';

    const vueClass = mixins(HasDataDependencies, CompetitionPortalPageMixin);
    // @vue/component
    export default vueClass.extend({
        components: {
            MyCoachesSearch
        },
        data: function () {
            return {
                active_competition_id: CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId(),
                coach_cta_error: '',
                cta_state: {
                    coach_id: -1,
                    category_id: -1,
                    active_action: '',
                    error_message: ''
                },
                dependencies: {
                    coaches: false
                },
                page_title: 'Coach Information'
            };
        },
        computed: {
            search_active: function () {
                return this.$store.state.coach_search.search_active;
            },
            ineligible_coach: function (): boolean {
                for (let i = 0; i < this.event_categories.length; i++) {
                    const category = this.event_categories[i];
                    for (let i = 0; i < category.coaches.length; i++) {
                        const coach = category.coaches[i];
                        if (coach.ineligible) {
                            return true;
                        }
                    }
                }

                return false;
            },
            event_categories: function (): SkaterCoachedEventCategory[] {
                return this.$store.state.skater.active_competition_coach_events.all();
            }
        },
        created: function () {
            this.registerSearchState();
        },
        destroyed: function () {
            this.$store.unregisterModule('coach_search');
        },
        methods: {
            /**
             * Register search module state.
             * Get Options for State form input
             */
            registerSearchState: function () {
                this.$store.registerModule('coach_search', CoachSearchState);
                this.$store.dispatch('coach_search/fetchStateOptions');
            },
            /**
             * Initiate the add coach process
             */
            addCoach: function (category_id: number) {
                const payload: SearchActivationPayload = {
                    search_type: 'add',
                    category_id,
                    coach_id: -1
                };
                this.$store.commit('coach_search/activateSearch', payload);
            },
            /**
             * Initiate the "change" coach process
             */
            editCoach: function (category_index: number, coach: SkaterEventCategoryCoach, category_id: number) {
                const payload: SearchActivationPayload = {
                    search_type: 'edit',
                    category_id,
                    coach_id: coach.id
                };
                this.$store.commit('coach_search/activateSearch', payload);
            },
            /**
             * Set the currently active CTA category coach
             */
            setActiveCTACategoryCoach: function (category_id: number, coach_id: number) {
                this.cta_state.error_message = '';
                this.cta_state.coach_id = coach_id;
                this.cta_state.category_id = category_id;
            },
            /**
             * Remove a coach
             */
            removeCoach: function (event_category_id: number, coach: SkaterEventCategoryCoach) {
                const vm = this;
                this.cta_state.active_action = 'remove';

                this.setActiveCTACategoryCoach(event_category_id, coach.id);
                const payload: CoachRemovePayload = {
                    event_category_id,
                    coach,
                    competition_id: this.active_competition_id
                };
                this.$store.dispatch('skater/removeCoach', payload)
                    .then(function () {
                        vm.setActiveCTACategoryCoach(-1, -1);
                        vm.cta_state.active_action = '';
                    })
                    .catch(function () {
                        vm.cta_state.error_message = 'Error removing coach.';
                        vm.cta_state.active_action = '';
                    });
            },
            showAddButton: function (event_category: SkaterCoachedEventCategory) {
                return !event_category.coach_limit_met;
            },
            /**
             * Based on state, display normal change button class or alert class
             */
            changeButtonClass: function (coach: SkaterEventCategoryCoach) {
                if (coach.ineligible) {
                    return 'button--action';
                }

                return 'button--info';
            },
            /**
             * Return the ordinal for a coach based on position
             */
            ordinal: function (index: number): string {
                if (index > 2) {
                    return '';
                }

                return ['1st', '2nd', '3rd'][index];
            },
            /**
             * Determine whether the remove button should show for a category coach item
             */
            showRemove: function (coach_index: number, category_index: number) {
                const coach_array = this.event_categories[category_index].coaches;

                return coach_index === coach_array.length - 1;
            },
            /**
             * Determine whether a category coach is the active cta category coach
             */
            isActiveCTACategoryCoach: function (category_id: number, coach_id: number) {
                const state = this.cta_state;

                return state.coach_id === coach_id && state.category_id === category_id;
            },
            /**
             * Show a CTA error for a category coach item
             */
            showCTAError: function (category_id: number, coach_id: number) {
                return this.cta_state.error_message && this.isActiveCTACategoryCoach(category_id, coach_id);
            },
            /**
             * Determine if removal is currently active for a given category coach
             */
            isRemoveActive: function (category_id: number, coach_id: number) {
                const state = this.cta_state;

                return this.isActiveCTACategoryCoach(category_id, coach_id) && state.active_action === 'remove';
            },
            /**
             * Method passed to overlay for open/close determination
             */
            searchActive: function () {
                return this.search_active;
            },
            /**
             * Handle search overlay close event
             */
            closeSearch: function () {
                this.$store.commit('coach_search/closeSearch');
            },
            /**
             * Pre data load hook
             *
             * Using the new methodology, set the active competition ID in state
             */
            preDataLoad: function () {
                return new Promise((resolve) => {
                    this.$store.commit('competitions/setActiveID', this.active_competition_id);
                    resolve();
                });
            },
            /**
             * Load data necessary for the page
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchMyCoaches')
                        .then(() => {
                            this.dependencies.coaches = true;
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