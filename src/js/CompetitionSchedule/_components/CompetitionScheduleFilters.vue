<template>
    <div class="competition-schedule-filters">
        <div class="competition-schedule-filter form-group">
            <span class="field-label competition-schedule-filter__label">View:</span>
            <div class="competition-schedule-filter__control">
                <accordion ref="view-accordion" class="accordion--select">
                    <span slot="trigger_text">{{view_label}}</span>
                    <div slot="expand_content" class="">
                        <parented-checkbox-group
                                class="parented-checkbox-group--small"
                                :options="filter_options.views"
                                :value="selected_filters.views"
                                v-on:input="pending_view_filters = $event">
                        </parented-checkbox-group>
                        <p v-if="view_error" class="input-error">
                            * Please select a view
                        </p>
                        <button class="button button--block" v-on:click.prevent="applyViewSelections">
                            Apply
                        </button>
                    </div>
                </accordion>
            </div>
        </div>
        <div class="competition-schedule-filter form-group">
            <label for="date_filter" class="field-label competition-schedule-filter__label">Date:</label>
            <div class="competition-schedule-filter__control">
                <select id="date_filter"
                        v-model="selected_filters.date"
                        name="date_filter"
                        class="form-field">
                    <option v-for="filter in filter_options.dates"
                            :key="filter.value"
                            :value="filter">
                        {{filter.label}}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {AccordionComponentInterface} from '../../contracts/AppContracts';
    import {
        CompetitionScheduleFilterActiveFilters,
        CompetitionScheduleFilterOptions,
        CompetitionScheduleFilterViewFilter
    } from '../_contracts/CompetitionScheduleContracts';

    export default Vue.extend({
        props: {
            /**
             * Filters available for selection
             */
            filter_options: {
                type: Object as () => CompetitionScheduleFilterOptions,
                required: true
            },
            /**
             * Initial selected filters
             */
            value: {
                type: Object as () => CompetitionScheduleFilterActiveFilters,
                required: false
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * View filters that have been selected, but not yet applied
                 */
                pending_view_filters: <CompetitionScheduleFilterViewFilter[]>[],
                /**
                 * Selected and applied filters
                 */
                selected_filters: <CompetitionScheduleFilterActiveFilters>{
                    date: {
                        label: 'All Dates',
                        value: null
                    },
                    views: []
                },
                /**
                 * Whether there is an error applying the view filter selections
                 */
                view_error: <boolean>false
            };
        },
        computed: {
            /**
             * Label for view select input in closed state
             */
            view_label: function (): string {
                const view_filter = this.selected_filters.views;
                if (view_filter.length === 3) {
                    return 'All';
                }

                return view_filter
                    .map((item: CompetitionScheduleFilterViewFilter) => {
                        return item.label;
                    })
                    .join(' + ');
            }
        },
        watch: {
            /**
             * Clear view error on form input change
             */
            pending_view_filters: function () {
                this.view_error = false;
            },
            selected_filters: {
                deep: true,
                /**
                 * Watch selected filters for change, and emit input event
                 */
                handler: function (value: CompetitionScheduleFilterActiveFilters) {
                    this.$emit('input', value);
                }
            }
        },
        /**
         * Upon creation, set initial default values, triggering emission of initial value
         */
        created: function () {
            let default_date_value = this.filter_options.dates[0];
            let default_view_value = this.filter_options.views.slice();
            if (this.value) {
                if (this.value.date.value) {
                    default_date_value = this.value.date;
                }
                if (this.value.views.length) {
                    default_view_value = this.value.views.slice();
                }

            }
            this.selected_filters.date = default_date_value;
            this.selected_filters.views = default_view_value;
        },
        methods: {
            /**
             * Handle click event on apply view selections button
             */
            applyViewSelections: function () {
                if (!this.pending_view_filters.length) {
                    this.view_error = true;

                    return;
                }
                this.selected_filters.views = this.pending_view_filters.slice();
                const accordion = <AccordionComponentInterface | undefined> this.$refs['view-accordion'];
                if (accordion) {
                    accordion.close();
                }
            }
        }
    });
</script>