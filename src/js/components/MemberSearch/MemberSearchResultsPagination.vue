<template>
    <div class="pagination">
        <a class="pagination__nav pagination__nav--previous"
           href="#"
           :disabled="previous_disabled"
           v-on:click.prevent="setActivePage(active_page_index-1)">
            Previous page
        </a>
        <ul class="pagination__list">
            <li v-for="(option, index) in pagination_options"
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
                    <span class="pagination__ellipsis">.</span><span class="pagination__ellipsis">.</span><span class="pagination__ellipsis">.</span>
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
    /* eslint-disable */
    import Vue from "vue";
    import {PaginationOption} from "../../contracts/AppContracts";

    /**
     * Extension of My Coaches search results pagination intended to function as an abstract member search results.
     * See source:
     * src/js/pages/MyCoaches/MyCoachesSearchResultsPagination.vue
     */
    export default Vue.extend({
        computed: {
            paginated_results: function () {
                return this.$store.getters['member_search/paginated_results'];
            },
            active_page_index: function () {
                return this.$store.state.member_search.active_page_index;
            },
            previous_disabled: function () {
                return this.active_page_index === 0;
            },
            next_disabled: function () {
                return this.active_page_index === this.paginated_results.length - 1;
            },
            pagination_options: function (): PaginationOption[] {
                return this.$store.getters['member_search/pagination_options'];
            }
        },
        methods: {
            /**
             * Set the active page within the paged result set
             */
            setActivePage: function (page_index: number) {
                if (page_index >= this.paginated_results.length || page_index < 0) {
                    return;
                }
                this.$store.commit('member_search/setActivePageIndex', page_index);
            }
        }
    });
</script>