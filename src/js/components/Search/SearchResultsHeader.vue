<template>
    <div class="search-results-header">
        <div class="search-results-header__summary">
            <p class="search-results-header__result-description">
                Viewing
                <span class="search-results-header__result-span">{{current_spread.start}}-{{current_spread.end}}</span>
                of
                <span class="search-results-header__result-count">{{result_count}}</span>
                items
            </p>
            <a class="search-results-header__edit-link back-link"
               href="#"
               v-on:click.prevent="editSearch">
                Edit Search
            </a>
        </div>
        <div class="search-results-header__per-page">
            <div class="form-group">
                <label for="search-results-per-page" class="sr-only">Per Page</label>
                <select id="search-results-per-page"
                        v-model="active_per_page"
                        class="form-field"
                        name="">
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
    import {FormOption, PerPageFormOption, PerPageOption, SearchResult} from '../../contracts/AppContracts';
    import SearchResultHelpers, {SearchResultsSpread} from '../../helpers/SearchResultHelpers';
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            /**
             * The active page index on the parent
             */
            active_page_index: {
                type: Number,
                required: true
            },
            /**
             * The active per page value on the parent
             */
            parent_per_page: {
                required: true,
                /**
                 * Validate passed prop to ensure it matches PerPageOption
                 */
                validator: function (value: any) {
                    return value === 'all' || typeof value === 'number' || value === null;
                }
            },
            /**
             * The full list of search results from the parent search component
             */
            search_results: {
                type: Array as () => SearchResult[],
                required: true
            }
        },
        computed: {
            /**
             * The active amount of items to display per page
             */
            active_per_page: {
                /**
                 * Get the value from passed prop
                 */
                get: function (): PerPageOption {
                    return <PerPageOption> this.parent_per_page;
                },
                /**
                 * When changing, emit the change event with the value
                 */
                set: function (value: PerPageOption) {
                    this.$emit('change-per-page', value);
                }
            },
            /**
             * Current begin and end page range
             */
            current_spread: function (): SearchResultsSpread {
                return SearchResultHelpers.getSpread(this.result_count, this.active_page_index, this.active_per_page);
            },
            /**
             * The default per page value
             */
            default_per_page: function (): PerPageOption {
                return this.per_page_options[0].value;
            },
            /**
             * The options for the per page input
             */
            per_page_options: function (): PerPageFormOption[] {
                const base_options = [10, 25];
                const result: FormOption[] = [];
                for (let i = 0; i < base_options.length; i++) {
                    const option = base_options[i];
                    if (option <= this.result_count) {
                        result.push({
                            label: String(option),
                            value: option
                        });
                    }
                }
                result.push({
                    label: 'All',
                    value: 'all'
                });

                return result;
            },
            /**
             * The count of total results
             */
            result_count: function (): number {
                return this.search_results.length;
            }
        },
        /**
         * On component mount, set the active per page to the parent if present or the default otherwise
         */
        mounted: function () {
            if (this.parent_per_page) {
                this.active_per_page = this.parent_per_page;

                return;
            }
            this.active_per_page = this.default_per_page;
        },
        methods: {
            /**
             * Handle click event on edit search link
             */
            editSearch: function () {
                this.$emit('edit-search');
            }
        }
    });
</script>