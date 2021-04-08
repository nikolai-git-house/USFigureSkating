<template>
    <div class="shift-selection-filters practice-ice-filters">
        <div class="practice-ice-filter">
            <span class="field-label practice-ice-filter__label">
                View:
            </span>
            <div class="practice-ice-filter__control">
                <accordion-multiselect v-model="view_compliance_filters"
                                       :options="available_view_compliance_filters"
                                       all_display="All Shift Types"
                                       select_title="Select View"></accordion-multiselect>
            </div>
        </div>
        <div class="practice-ice-filter">
            <span class="field-label practice-ice-filter__label">
                Date:
            </span>
            <div class="practice-ice-filter__control">
                <accordion-multiselect v-model="date_filters"
                                       :options="available_date_filters"
                                       all_display="All Dates"
                                       select_title="Select Date(s)"></accordion-multiselect>
            </div>
        </div>
        <div class="practice-ice-filter">
            <div class="practice-ice-filter__span">
                <label for="filter_position"
                       class="sr-only">
                    Search for Shift Positions
                </label>
                <input id="filter_position"
                       v-model="free_filter"
                       placeholder="Search for Shift Positions"
                       type="text"
                       name="filter_position"
                       class="form-field form-field--search form-field--reduced-right">
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {FormOption} from '../../../../../../contracts/AppContracts';
    import {VolunteerShiftSelection} from '../../_contracts';
    import {AccordionMultiselect} from '../../../../../../components/AccordionMultiselect/_contracts';

    export default Vue.extend({
        props: {},
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The local value of the component
                 */
                local_value: <VolunteerShiftSelection.ShiftSelectionSelectedFilters>{
                    dates: [],
                    statuses: [],
                    compliance_requirements: []
                }
            };
        },
        computed: {
            /**
             * The free text filter on page
             */
            free_filter: {
                /**
                 * Get free filter value from state
                 */
                get: function (): string | null {
                    return this.$store.state.competition_portal.volunteer.shift_selection.free_filter;
                },
                /**
                 * Set free filter value in state
                 */
                set: function (value: string | null) {
                    const payload = (value && value.trim()) || null;
                    this.$store.commit('competition_portal/volunteer/shift_selection/setFreeFilter', payload);
                    this.$emit('change');
                }
            },
            /**
             * The available filters
             */
            filters_available: function (): VolunteerShiftSelection.ShiftSelectionAvailableFilters {
                return this.$store.state.competition_portal.volunteer.shift_selection.filters_available;
            },
            /**
             * The selected filters
             */
            filters_selected: function (): VolunteerShiftSelection.ShiftSelectionSelectedFilters {
                return this.$store.state.competition_portal.volunteer.shift_selection.filters_selected;
            },
            /**
             * Available options for view and compliance filters
             */
            available_view_compliance_filters: function (): AccordionMultiselect.OptionsConfiguration {
                return {
                    statuses: this.filters_available.statuses,
                    compliance_requirements: this.filters_available.compliance_requirements
                };
            },
            /**
             * Interface with multiselect component for view and compliance filter values
             */
            view_compliance_filters: {
                /**
                 * Get value
                 */
                get: function (): AccordionMultiselect.ValueConfiguration {
                    return {
                        statuses: this.local_value.statuses,
                        compliance_requirements: this.local_value.compliance_requirements
                    };
                },
                /**
                 * Set value
                 */
                set: function (value: AccordionMultiselect.ValueConfiguration) {
                    this.local_value.statuses = value.statuses;
                    this.local_value.compliance_requirements = value.compliance_requirements;
                    this.reportChange();
                }
            },
            /**
             * Available options for date filters
             */
            available_date_filters: function (): AccordionMultiselect.OptionsConfiguration {
                return {
                    dates: this.filters_available.dates
                };
            },
            /**
             * Interface with multiselect component for date filter values
             */
            date_filters: {
                /**
                 * Get value
                 */
                get: function (): AccordionMultiselect.ValueConfiguration {
                    return {
                        dates: this.local_value.dates
                    };
                },
                /**
                 * Set value
                 */
                set: function (value: AccordionMultiselect.ValueConfiguration) {
                    this.local_value.dates = value.dates;
                    this.reportChange();
                }
            }
        },
        /**
         * Lifecycle hook - component created
         */
        created: function () {
            this.initializeLocalValue();
        },
        methods: {
            /**
             * Report a change to the filter value
             */
            reportChange: function () {
                const payload: VolunteerShiftSelection.ShiftSelectionSelectedFilters = {
                    ...this.local_value
                };
                this.$store.commit('competition_portal/volunteer/shift_selection/setFiltersSelected', payload);
                this.$emit('change');
            },
            /**
             * Ensure the local value has keys to track all available filter groups, and that the initial values are set to those provided
             */
            initializeLocalValue: function () {
                for (const i in this.filters_available) {
                    if (Object.prototype.hasOwnProperty.call(this.filters_available, i)) {
                        let value: FormOption[] = [];
                        if (Object.prototype.hasOwnProperty.call(this.filters_selected, i)) {
                            value = this.filters_selected[i].slice();
                        }
                        this.$set(this.local_value, i, value);
                    }
                }
            }
        }
    });
</script>