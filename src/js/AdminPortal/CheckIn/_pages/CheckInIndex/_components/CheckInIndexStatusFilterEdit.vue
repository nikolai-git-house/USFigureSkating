<template>
    <div class="check-in-index-status-filter-edit">
        <label for="filter_all" class="usfsa-checkbox">
            <input id="filter_all"
                   type="checkbox"
                   :checked="all_selected"
                   v-on:click.prevent="allClick($event.target.checked)">
            <span class="usfsa-checkbox__text">All <span class="text--highlight">({{filterCount('all')}})</span></span>
        </label>
        <div class="check-in-index-status-filter-edit__status-filters">
            <ul class="check-list">
                <li v-for="filter in available_filters" :key="filter.value">
                    <label :for="'filter_'+filter.value" class="usfsa-checkbox">
                        <input :id="'filter_'+filter.value"
                               v-model="selected_filters"
                               type="checkbox"
                               :value="filter">
                        <span class="usfsa-checkbox__text">{{filter.label}}<span class="text--highlight"> ({{filterCount(filter.value)}})</span></span>
                    </label>
                </li>
            </ul>
        </div>
        <button class="button button--block"
                :disabled="!valid"
                v-on:click.prevent="apply">
            Apply
        </button>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {CheckInIndexStatusFilter, CheckInIndexStatusFilterValue} from '../../../_contracts/CheckInContracts';

    export default Vue.extend({
        props: {
            /**
             * Active filters from parent
             */
            active_filters: {
                type: Array as () => CheckInIndexStatusFilter[],
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether the all filter is selected
                 */
                all_selected: false,
                /**
                 * All available filters
                 */
                available_filters: <CheckInIndexStatusFilter[]>[
                    {
                        label: 'Checked-In',
                        value: 'checked_in'
                    },
                    {
                        label: 'Not Checked-In',
                        value: 'not_checked_in'
                    },
                    {
                        label: 'Ineligible',
                        value: 'ineligible'
                    }
                ],
                /**
                 * List of locally selected filters
                 */
                selected_filters: <CheckInIndexStatusFilter[]>[]
            };
        },
        computed: {
            /**
             * Whether the currently selected state is valid
             */
            valid: function (): boolean {
                return this.selected_filters.length > 0;
            }
        },
        watch: {
            /**
             * Handle toggling of "All" filter checkbox when child filters change
             */
            selected_filters: function (newV: CheckInIndexStatusFilter[], oldV: CheckInIndexStatusFilter[]) {
                if (newV.length === 3) {
                    this.all_selected = true;
                }
                if (oldV.length == 3 && newV.length !== 0) {
                    this.all_selected = false;
                }
            }
        },
        /**
         * Upon creation, match active filters with locally selected filters
         */
        created: function () {
            this.selected_filters = this.active_filters;
        },
        methods: {
            /**
             * Handle click on "All" filter
             */
            allClick: function (checked: boolean) {
                this.all_selected = checked;
                if (checked) {
                    this.selected_filters = this.available_filters.slice();

                    return;
                }
                this.selected_filters = [];
            },
            /**
             * Apply filter selections.  Enforce available order even if selected in a different order
             */
            apply: function () {
                if (!this.valid) {
                    return;
                }
                const order: CheckInIndexStatusFilterValue[] = ['checked_in', 'not_checked_in', 'ineligible'];

                this.$emit('filters-changed', this.selected_filters.slice()
                    .sort((item1: CheckInIndexStatusFilter, item2: CheckInIndexStatusFilter) => {
                        return order.indexOf(item1.value) - order.indexOf(item2.value);
                    }));
            },
            /**
             * Get the count for a status filter
             */
            filterCount: function (filter_value: CheckInIndexStatusFilterValue): number {
                return this.$store.getters['checkin/checkin_entity_count'](filter_value);
            }
        }
    });
</script>