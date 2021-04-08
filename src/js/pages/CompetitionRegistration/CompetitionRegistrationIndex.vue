<script lang="ts">
    /* eslint-disable */
    import {
        CompetitionQualifyingKey,
        CompetitionSearchCriteria,
        RegistrationListCompetition
    } from "../../contracts/app/CompetitionRegistrationContracts";
    import {PaginatedList, PaginationService} from "../../services/PaginationService";
    import {PaginationComponent} from "../../components/Pagination.vue";
    import {CompetitionSearchHelpers} from "../../helpers/CompetitionSearchHelpers";
    import CompetitionSearch, {CompetitionSearchInterface} from "../../components/CompetitionRegistration/CompetitionSearch.vue";
    import HasDataDependencies from "../../mixins/HasDataDependencies";
    import mixins from 'vue-typed-mixins'
    import {FormOption} from "../../contracts/AppContracts";


    export default mixins(HasDataDependencies).extend({
        data: function () {
            return {
                /**
                 * The active type of events being shown (qual/nonqual)
                 */
                active_type: <CompetitionQualifyingKey>"non_qualifying",
                /**
                 * The active page of paginated results
                 */
                active_page_index: 0,
                /**
                 * The active search (filter) criteria for the competition list
                 */
                search_criteria: <CompetitionSearchCriteria>{
                    search_term: null,
                    search_field: null
                },
                /**
                 * data needed for component to function
                 */
                dependencies: {
                    competitions: false
                }
            }
        },

        methods: {
            /**
             * Load data needed for component to function
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_registration/fetchCompetitions').then(() => {
                        this.dependencies.competitions = true;
                        resolve();
                    }).catch(() => {
                        reject()
                    });
                });
            },
            /**
             * Select whether qualifying or nonqualifying are active
             */
            selectActiveType: function (qualifying_key: CompetitionQualifyingKey) {
                this.changeActivePage(0);
                if (this.search_component) {
                    this.search_component.reset();
                }
                this.active_type = qualifying_key;
            },
            /**
             * Whether a competition is registered for by the user
             */
            isRegistered: function (competition: RegistrationListCompetition): boolean {
                return competition.user_registration_status === 'registered';
            },
            /**
             * Whether a competition has an in-progress registration for the current user
             *
             * @deprecated - If CompetitionRegistrationRegistrationCta is being used, this is no longer needed within this component
             */
            isInProgress: function (competition: RegistrationListCompetition): boolean {
                return competition.user_registration_status === 'in_progress';
            },
            /**
             * Whether a competition is in the late registration window
             *
             * @deprecated - If CompetitionRegistrationRegistrationCta is being used, this is no longer needed within this component
             */
            isLateRegistration(competition: RegistrationListCompetition): boolean {
                return competition.competition_registration_status === 'late';
            },
            /**
             * Whether the competition's registration deadline should show in alert text
             *
             * @deprecated - If CompetitionRegistrationRegistrationCta is being used, this is no longer needed within this component
             */
            hasDeadlineWarning(competition: RegistrationListCompetition): boolean {
                return competition.has_registration_deadline_warning;
            },
            /**
             * Whether a competition is a future competition ('Coming Soon')
             *
             * @deprecated - If CompetitionRegistrationRegistrationCta is being used, this is no longer needed within this component
             */
            isFuture(competition: RegistrationListCompetition): boolean {
                return competition.competition_registration_status === "future";
            },
            /**
             * Whether  competition has a banner for its tile
             */
            hasBanner: function (competition: RegistrationListCompetition): boolean {
                return this.isRegistered(competition);
            },
            /**
             * The class to apply to a competition CTA button
             *
             * @deprecated - If CompetitionRegistrationRegistrationCta is being used, this is no longer needed within this component
             */
            buttonClass: function (competition: RegistrationListCompetition): string {
                if (this.isLateRegistration(competition)) {
                    return "button--action";
                }
                if (this.isInProgress(competition)) {
                    return "button--info";
                }
                if (this.isRegistered(competition)) {
                    return "button--info";
                }
                return "";
            },
            /**
             * The text to display for a competition CTA button
             *
             * @deprecated - If CompetitionRegistrationRegistrationCta is being used, this is no longer needed within this component
             */
            buttonText: function (competition: RegistrationListCompetition): string {
                if (this.isLateRegistration(competition)) {
                    return "Late";
                }
                if (this.isInProgress(competition)) {
                    return "Continue Registration";
                }
                if (this.isRegistered(competition)) {
                    return "Add Event";
                }
                if (this.isFuture(competition)) {
                    return "Coming Soon";
                }
                return "Register Now";
            },
            /**
             * Begin registration process for a competition
             *
             * @deprecated - If CompetitionRegistrationRegistrationCta is being used, this is no longer needed within this component
             */
            beginRegistration(competition: RegistrationListCompetition) {
                location.assign(competition.user_registration_link);
            },
            /**
             * Handle active page change reported by pagination component
             */
            handleActivePageChange: function (page_index: number) {
                this.active_page_index = page_index;
            },
            /**
             * Set the active page within the component and its dependents
             */
            changeActivePage: function (page_index: number) {
                this.active_page_index = page_index;
                if (this.pagination_component) {
                    this.pagination_component.setActivePage(page_index);
                }
            }
        },
        computed: {
            /**
             * The search component element
             */
            search_component: function (): CompetitionSearchInterface | null {
                return this.$refs['search'] ? this.$refs['search'] as CompetitionSearchInterface : null;
            },
            /**
             * The pagination component element
             */
            pagination_component: function (): PaginationComponent | null {
                return this.$refs['pagination'] ? this.$refs['pagination'] as PaginationComponent : null;
            },
            /**
             * All available competitions
             */
            available_competitions: function (): RegistrationListCompetition[] {
                return this.$store.getters['competition_registration/competition_list'];
            },
            /**
             * All competitions that have passed any active filters
             */
            filtered_competitions: function (): RegistrationListCompetition[] {
                let qualifying_check = this.active_type === "qualifying";
                return this.available_competitions.filter((competition) => {
                    if (competition.is_qualifying !== qualifying_check) {
                        return false;
                    }
                    return CompetitionSearchHelpers.competitionPassesFilter(competition, this.search_criteria);
                })
            },
            /**
             * List of state filters for search form.
             * Each unique state value in alpha order for the active competition set (qual/nonqual)
             */
            available_state_filters: function (): FormOption[] {
                let added_states: string[] = [];
                return this.available_competitions.reduce((carry: FormOption[], competition: RegistrationListCompetition) => {
                    let qualifying_check = this.active_type === "qualifying";
                    if (competition.is_qualifying === qualifying_check) {
                        let competition_state: string = competition.state;
                        if (added_states.indexOf(competition_state) === -1) {
                            added_states.push(competition_state);
                            carry.push({
                                label: competition_state,
                                value: competition_state
                            });
                        }
                    }
                    return carry;
                }, []).sort((item: FormOption, item2: FormOption) => {
                    return item.value.localeCompare(item2.value);
                });

            },
            /**
             * Paginated competitions that have passed all active filters
             */
            paginated_competitions: function (): PaginatedList<RegistrationListCompetition> {
                return PaginationService.paginate(this.filtered_competitions, 5);
            },
            /**
             * The set of competitions currently visible on the active pagination page
             */
            visible_competitions: function (): RegistrationListCompetition[] {
                return this.paginated_competitions[this.active_page_index];
            },
            /**
             * Whether no competitions are available for the currently active type
             */
            no_active_configured_competitions: function (): boolean {
                return this.visible_competitions.length === 0 && !this.search_criteria.search_field;
            },
            /**
             * Whether to show the search form
             */
            show_search: function (): boolean {
                return !(this.no_active_configured_competitions);
            },
            /**
             * Whether to show the pagination
             */
            show_pagination: function (): boolean {
                return this.visible_competitions.length > 0;
            },
        },
        components: {
            CompetitionSearch
        },
        watch: {
            /**
             * When search term changes, go to first page of paginated results
             */
            "search_criteria.search_term": function () {
                this.changeActivePage(0);
            }
        }
    });
</script>