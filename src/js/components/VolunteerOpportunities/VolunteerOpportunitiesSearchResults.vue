<script lang="ts">
    import {PerPageOption} from '../../contracts/AppContracts';
    import SearchResultsMixin from '../../mixins/SearchResultsMixin';
    import {VolunteerOpportunityEvent} from '../../contracts/app/VolunteerOpportunitiesContracts';
    import mixins from 'vue-typed-mixins';

    const extendedVue = mixins(SearchResultsMixin);
    export default extendedVue.extend({
        computed: {
            /**
             * The active page of the paginated results.
             */
            active_page_index: {
                /**
                 * Get value through state
                 */
                get: function (): number {
                    return this.$store.state.volunteer_opportunities.search_results_active_page_index;
                },
                /**
                 * Set value in state
                 */
                set: function (value: number) {
                    this.$store.commit('volunteer_opportunities/setSearchResultsPageIndex', value);
                }
            },
            /**
             * The active per-page option
             */
            active_per_page: {
                /**
                 * Get value through state
                 */
                get: function (): PerPageOption | null {
                    return this.$store.state.volunteer_opportunities.search_results_per_page;
                },
                /**
                 * Set value in state
                 */
                set: function (value: PerPageOption) {
                    this.$store.commit('volunteer_opportunities/setSearchResultsPerPage', value);
                }
            },
            /**
             * The total list of search results
             */
            search_results: function (): VolunteerOpportunityEvent[] {
                return this.$store.getters['volunteer_opportunities/search_results'];
            }
        },
        methods: {
            /**
             * Select a result to begin a request
             */
            selectResult: function (result: VolunteerOpportunityEvent) {
                this.$store.dispatch('volunteer_opportunities/beginRequest', result.competition_id);
            },
            /**
             * Update the active per page value
             */
            updatePerPage: function (value: PerPageOption) {
                this.active_per_page = value;
            }
        }
    });
</script>