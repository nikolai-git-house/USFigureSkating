<template>
    <div class="check-in-index-filters">
        <div class="form-group">
            <label for="check_in_filter_search" class="sr-only">Search Input</label>
            <input id="check_in_filter_search"
                   v-model="filter_term"
                   placeholder="Search by Name, Member # or Role"
                   class="form-field form-field--search form-field--reduced-right">
        </div>
        <div class="form-group check-in-index-status-filter">
            <label class="field-label">Check-In Status</label>
            <accordion class="accordion--select"
                       :external_expand_check="status_select_active"
                       v-on:accordion_toggle="accordionToggle">
                <span slot="trigger_text"
                      class="check-in-index-status-filter__active-label accordion-trigger-raw">
                    <span v-if="selected_status_filters.length===3" class="check-in-index-status-filter__active-label__component">
                        All <span class="check-in-index-status-filter__active-label__component__count">({{filterCount('all')}})</span>
                    </span>
                    <span v-for="(selected_filter, index) in selected_status_filters"
                          v-else
                          :key="index"
                          class="check-in-index-status-filter__active-label__component">
                        {{index>0?'; ':''}}{{selected_filter.label}} <span class="check-in-index-status-filter__active-label__component__count">({{filterCount(selected_filter.value)}})</span>
                    </span>
                </span>
                <check-in-status-filter slot="expand_content"
                                        :active_filters="selected_status_filters"
                                        v-on:filters-changed="handleStatusFilterChange"></check-in-status-filter>
            </accordion>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {
        CheckInIndexFilterCriteria,
        CheckInIndexStatusFilter,
        CheckInIndexStatusFilterValue
    } from '../../../_contracts/CheckInContracts';
    import CheckInStatusFilter from './CheckInIndexStatusFilterEdit.vue';

    export default Vue.extend({
        components: {
            CheckInStatusFilter
        },
        props: {
            /**
             * Active filters from parent
             */
            active_filter_criteria: {
                type: Object as () => CheckInIndexFilterCriteria,
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The active free-text filter term
                 */
                filter_term: '',
                /**
                 * The selected status filters
                 */
                selected_status_filters: <CheckInIndexStatusFilter[]>[],
                /**
                 * Whether the status filter select element is active
                 */
                status_select_active: false
            };
        },
        watch: {
            /**
             * Watch for and emit change
             */
            selected_status_filters: function () {
                this.reportChange();
            },
            /**
             * Watch for and emit change
             */
            filter_term: function () {
                this.reportChange();
            }
        },
        /**
         * Upon creation, update local filters to match those of parent
         */
        created: function () {
            this.filter_term = this.active_filter_criteria.filter_term;
            this.selected_status_filters = this.active_filter_criteria.selected_status_filters.slice();
        },
        methods: {
            /**
             * Handle status filter accordion toggle
             */
            accordionToggle: function () {
                this.status_select_active = !this.status_select_active;
            },
            /**
             * Get the count for a status filter
             */
            filterCount: function (filter_value: CheckInIndexStatusFilterValue): number {
                return this.$store.getters['checkin/checkin_entity_count'](filter_value);
            },
            /**
             * Handle change of status filter selections
             */
            handleStatusFilterChange: function (filters: CheckInIndexStatusFilter[]) {
                this.selected_status_filters = filters;
                this.status_select_active = false;
            },
            /**
             * Emit change of filters
             */
            reportChange: function () {
                this.$emit('terms-updated', <CheckInIndexFilterCriteria>{
                    filter_term: this.filter_term,
                    selected_status_filters: this.selected_status_filters.slice()
                });
            }
        }
    });
</script>