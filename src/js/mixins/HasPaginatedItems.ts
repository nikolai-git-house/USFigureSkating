import {PaginatedList, PaginationService} from '../services/PaginationService';
import {PaginationComponent} from '../components/Pagination.vue';
import Vue from 'vue';

export default Vue.extend({
    /**
     * Reactive data
     */
    data: function () {
        return {
            /**
             * The active page of paginated results
             */
            active_page_index: 0,
            /**
             * The amount of items per page of pagination
             */
            pagination_per_page: 50
        };
    },
    computed: {
        /**
         * The items to paginate
         */
        pagination_items: function (): any[] {
            return [];
        },
        /**
         * Paginated items that have passed all active filters
         */
        paginated_items: function (): PaginatedList<any> {
            return PaginationService.paginate(this.pagination_items, this.pagination_per_page);
        },
        /**
         * The pagination component element
         */
        pagination_component: function (): PaginationComponent | null {
            return this.$refs.pagination ? this.$refs.pagination as PaginationComponent : null;
        },
        /**
         * Whether to show the pagination
         *
         * If there is more than one page of paginated items
         */
        show_pagination: function (): boolean {
            return this.paginated_items.length > 1;
        },
        /**
         * The set of items currently visible on the active pagination page
         */
        visible_items: function (): any[] {
            return this.paginated_items[this.active_page_index];
        }
    },
    watch: {
        /**
         * When pagination items change, reset the active page to the first
         */
        pagination_items: function () {
            this.changeActivePage(0);
        }
    },
    methods: {
        /**
         * Set the active page within the component and its dependents
         */
        changeActivePage: function (page_index: number) {
            this.active_page_index = page_index;
            const pagination_component = <PaginationComponent | null> this.$refs.pagination;
            if (pagination_component) {
                pagination_component.setActivePage(page_index);
            }
        },
        /**
         * Handle active page change reported by pagination component
         */
        handleActivePageChange: function (page_index: number) {
            this.active_page_index = page_index;
        }
    }
});