<template>
    <div class="member-search-results-header">
        <div class="member-search-results-header__summary">
            <p class="member-search-results-header__result-description">
                Viewing
                <span class="member-search-results-header__result-span">{{current_spread.start}}-{{current_spread.end}}</span>
                of
                <span class="member-search-results-header__result-count">{{total_count}}</span>
                items
            </p>
            <a class="member-search-results-header__edit-link back-link"
               href="#"
               v-on:click.prevent="edit_handler">
                Edit Search
            </a>
        </div>
        <div class="member-search-results-header__per-page">
            <div class="form-group">
                <label for="per_page" class="sr-only">Select Results Per Page</label>
                <select id="per_page"
                        v-model="per_page"
                        class="form-field"
                        name="per_page">
                    <option v-for="option in per_page_options"
                            :key="option.value"
                            :value="option.value">
                        {{option.label}}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    /* eslint-disable */

    import Vue from "vue";

    /**
     * Extension of My Coaches search results header intended to function as an abstract member search results.
     * See source:
     * src/js/pages/MyCoaches/MyCoachesSearchResultsHeader.vue
     */
    export default Vue.extend({
        props: {
            edit_handler: {
                required: true,
                type: Function
            }
        },
        mounted: function () {
            this.per_page = this.default_per_page;
        },
        data: function () {
            let per_page: number | "all" = 10;
            return {
                per_page: per_page
            }
        },
        computed: {
            total_count: function (): number {
                return this.$store.getters['member_search/result_count'];
            },
            current_spread: function () {
                return this.$store.getters['member_search/current_spread'];
            },
            per_page_options: function () {
                return this.$store.getters['member_search/per_page_options'];
            },
            default_per_page: function () {
                return this.per_page_options[0].value;
            },
        },
        watch: {
            per_page: function (value) {
                this.$store.commit('member_search/setPerPage', value);
                this.$store.commit('member_search/setActivePageIndex', 0);
            }
        }
    });
</script>