import {PaginatedList, PaginationService} from '../services/PaginationService';
import {PerPageOption, SearchResult} from '../contracts/AppContracts';
import SearchResultsHeader from './../components/Search/SearchResultsHeader.vue';
import Vue from 'vue';
/* ===========================================================================================================
*                                              SEARCH RESULTS MIXIN
* Generic functionality for search results component
* ===========================================================================================================*/
export default Vue.extend({
    components: {
        SearchResultsHeader
    },
    /**
     * Reactive data
     */
    data: function () {
        return {
            local_active_page_index: 0,
            local_active_per_page: <PerPageOption>10
        };
    },
    computed: {
        /**
         * The active page of the paginated results.
         * Computed property to enable state integration within extending components
         */
        active_page_index: {
            /**
             * Get value through local state
             */
            get: function (): number {
                return this.local_active_page_index;
            },
            /**
             * Set value in local state
             */
            set: function (value: number) {
                this.local_active_page_index = value;
            }
        },
        /**
         * The active per-page option
         *
         * Computed property to enable state integration within extending components
         */
        active_per_page: {
            /**
             * Get value from local state
             */
            get: function (): PerPageOption {
                return this.local_active_per_page;
            },
            /**
             * Set value in local state
             */
            set: function (value: PerPageOption) {
                this.local_active_per_page = value;
            }
        },
        /**
         * The active display result set
         */
        active_results: function (): SearchResult[] {
            return this.paginated_results[this.active_page_index];
        },
        /**
         * The total list of search results
         */
        search_results: function (): SearchResult[] {
            return [];
        },
        /**
         * The paginated results
         */
        paginated_results: function (): PaginatedList<SearchResult> {
            return PaginationService.paginate(this.search_results, this.active_per_page);
        },
        /**
         * Whether pagination is available
         */
        pagination_available: function (): boolean {
            return this.paginated_results.length > 1;
        }
    },
    watch: {
        /**
         * When active per page amount changes, go to the first page of results
         */
        active_per_page: function () {
            this.setActivePage(0);
        }
    },
    methods: {
        /**
         * Emit event to edit search
         */
        editSearch: function () {
            this.$emit('edit-search');
        },
        /**
         * Set the active page within the paged result set
         */
        setActivePage: function (page_index: number) {
            if (page_index >= this.paginated_results.length || page_index < 0) {
                return;
            }
            this.active_page_index = page_index;
        }
    }
});