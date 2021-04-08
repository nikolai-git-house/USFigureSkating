<script lang="ts">
    import SearchMixin from '../../mixins/SearchMixin';
    import VolunteerOpportunitiesSearchForm from './VolunteerOpportunitiesSearchForm.vue';
    import VolunteerOpportunitiesSearchResults from './VolunteerOpportunitiesSearchResults.vue';
    import mixins from 'vue-typed-mixins';

    const extendedVue = mixins(SearchMixin);
    export default extendedVue.extend({
        components: {
            VolunteerOpportunitiesSearchForm,
            VolunteerOpportunitiesSearchResults
        },
        computed: {
            /**
             * Whether results are active.
             */
            results_active: {
                /**
                 * Get from state
                 */
                get: function (): boolean {
                    return this.$store.state.volunteer_opportunities.search_results_active;
                },
                /**
                 * Set in state
                 */
                set: function (value: boolean) {
                    this.$store.commit('volunteer_opportunities/setSearchResultsActive', value);
                }
            },
            /**
             * Subheading text in the header
             */
            subheading_text: function (): string {
                return this.results_active ? 'Search Results' : 'Search';
            }
        },
        methods: {
            /**
             * Reset the pagination related properties for search results
             */
            resetResultsPagination: function () {
                this.$store.commit('volunteer_opportunities/setSearchResultsPerPage', null);
                this.$store.commit('volunteer_opportunities/setSearchResultsPageIndex', 0);
            }
        },
        watch: {
            /**
             * When form is shown, reset results pagination
             */
            show_form: function (value: boolean) {
                if (value === true) {
                    this.resetResultsPagination();
                }
            }
        }
    });
</script>