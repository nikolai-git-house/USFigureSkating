<template>
    <div class="pagination">
        <a class="pagination__nav pagination__nav--previous"
           href="#"
           :disabled="previous_disabled"
           v-on:click.prevent="setActivePage(active_page_index-1)">
            Previous page
        </a>
        <ul class="pagination__list">
            <li v-for="(option,index) in pagination_options"
                :key="index"
                class="pagination__list-item"
                :class="{'pagination__list-item--ellipses':option.page_index===false}">
                <a v-if="option.page_index!==false"
                   class="pagination__list-link"
                   :class="{'pagination__list-link--active':option.page_index===active_page_index}"
                   href="#"
                   v-on:click.prevent="setActivePage(option.page_index)">
                    {{option.page_number}}
                </a>
                <div v-else class="pagination__ellipses">
                    <span class="pagination__ellipsis">.</span>
                    <span class="pagination__ellipsis">.</span>
                    <span class="pagination__ellipsis">.</span>
                </div>
            </li>
        </ul>
        <a class="pagination__nav pagination__nav--next"
           href="#"
           :disabled="next_disabled"
           v-on:click.prevent="setActivePage(active_page_index+1)">
            Next page
        </a>
    </div>
</template>
<script lang="ts">
    import {PaginatedList, PaginationService} from '../services/PaginationService';
    import {PaginationOption} from '../contracts/AppContracts';
    import Vue from 'vue';

    export interface PaginationComponent extends Vue {
        setActivePage: (page_index: number) => void
    }

    export default Vue.extend({
        props: {
            /**
             * List of paginated items
             */
            paginated_items: {
                type: Array as () => PaginatedList<any>,
                required: true
            },
            /**
             * The active page index on the parent
             */
            parent_page_index: {
                type: Number,
                required: false,
                default: null
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The active page of the pagination
                 */
                active_page_index: 0
            };
        },
        computed: {
            /**
             * Whether the previous arrow should be disabled
             */
            previous_disabled: function () {
                return this.active_page_index === 0;
            },
            /**
             * Whether the next arrow should be disabled
             */
            next_disabled: function () {
                return this.active_page_index === this.paginated_items.length - 1;
            },
            /**
             * The items to display in the pagination
             */
            pagination_options: function (): PaginationOption[] {
                return PaginationService.paginationOptions(this.paginated_items, this.active_page_index);
            }
        },
        watch: {
            /**
             * Watch parent page index value and set it locally
             */
            parent_page_index: function (value) {
                this.active_page_index = value;
            }
        },
        /**
         * On component load, if the parent has a per-page index, use it
         */
        mounted: function () {
            if (this.parent_page_index !== null) {
                this.active_page_index = this.parent_page_index;
            }
        },
        methods: {
            /**
             * Set the active page within the paged result set
             */
            setActivePage: function (page_index: number) {
                if (page_index >= this.paginated_items.length || page_index < 0) {
                    return;
                }
                this.active_page_index = page_index;
                this.$emit('page-changed', page_index);
            }
        }
    });
</script>