<template>
    <div class="competition-management-compliance-position-filters">
        <div class="grid-container">
            <h2 class="site-overlay__heading site-overlay__heading--large">
                {{title}}
            </h2>
            <div class="competition-management-compliance-position-filters__body">
                <div class="parented-checkbox-group">
                    <div class="parented-checkbox-group__parent">
                        <label for="compliance_both" class="usfsa-radio">
                            <input id="compliance_both"
                                   v-model="compliance_filter"
                                   type="radio"
                                   value="both">
                            <span class="usfsa-radio__text">All Compliance</span>
                        </label>
                    </div>
                    <ul class="parented-checkbox-group__children">
                        <li class="parented-checkbox-group__children__child">
                            <label for="compliance_compliant" class="usfsa-radio">
                                <input id="compliance_compliant"
                                       v-model="compliance_filter"
                                       type="radio"
                                       :value="true">
                                <span class="usfsa-radio__text">Compliant</span>
                            </label>
                        </li>
                        <li class="parented-checkbox-group__children__child">
                            <label for="compliance_noncompliant" class="usfsa-radio">
                                <input id="compliance_noncompliant"
                                       v-model="compliance_filter"
                                       type="radio"
                                       :value="false">
                                <span class="usfsa-radio__text">Non-Compliant</span>
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="parented-checkbox-group">
                    <div class="parented-checkbox-group__parent">
                        <label for="position_all" class="usfsa-checkbox">
                            <input id="position_all"
                                   type="checkbox"
                                   :checked="all_selected"
                                   v-on:click.prevent="allClick">
                            <span class="usfsa-checkbox__text">All Positions</span>
                        </label>
                    </div>
                    <ul class="parented-checkbox-group__children">
                        <li v-for="position_option in available_position_filters"
                            :key="position_option.value"
                            class="parented-checkbox-group__children__child">
                            <label :for="'position_'+position_option.value" class="usfsa-checkbox">
                                <input :id="'position_'+position_option.value"
                                       v-model="position_filter"
                                       type="checkbox"
                                       :value="position_option">
                                <span class="usfsa-checkbox__text">{{position_option.label}}</span>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="competition-management-compliance-position-filters__apply">
                <p v-if="apply_attempt && !valid" class="input-error">
                    Select at least one position
                </p>
                <button class="button button--large button--block" v-on:click.prevent="apply">
                    Apply
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {ALL_POSITION_FILTER} from '../_constants/CompetitionManagementConstants';
    import {
        CompetitionManagementCompliancePositionFiltersChangePayload,
        CompetitionManagementEntityComplianceFilter,
        CompetitionManagementEntityComplianceFreePositionFilters,
        CompetitionManagementEntityPositionFilter
    } from '../_contracts/component-contracts/CompetitionManagementCompliancePositionFiltersContracts';

    /**
     * Abstract component for filtering pages with compliance and position filters.  Options and selected filters
     * Provided externally to maintain abstraction
     */
    export default Vue.extend({
        props: {
            /**
             * The available position options
             */
            available_position_filters: {
                type: Array as () => CompetitionManagementEntityPositionFilter[],
                required: true
            },
            /**
             * The preselected filters
             */
            selected_filters: {
                type: Object as () => CompetitionManagementEntityComplianceFreePositionFilters,
                required: true
            },
            /**
             * The title of the overlay
             */
            title: {
                type: String,
                default: 'Filter Contacts'
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether there has been an attempt to apply filters
                 */
                apply_attempt: false,
                /**
                 * The locally selected compliance filter
                 */
                compliance_filter: <CompetitionManagementEntityComplianceFilter>'both',
                /**
                 * The locally selected position filter set
                 */
                position_filter: <CompetitionManagementEntityPositionFilter[]>[
                    {
                        ...ALL_POSITION_FILTER
                    }
                ]
            };
        },
        computed: {
            /**
             * Whether all positions are selected
             */
            all_selected: function (): boolean {
                return this.position_filter.length === this.available_position_filters.length;
            },
            /**
             * Whether the currently selected filter set is valid
             */
            valid: function (): boolean {
                return this.all_selected || this.position_filter.length > 0;
            }
        },
        /**
         * Upon creation, reflect state values in local state
         */
        created: function () {
            const selectedFilters = this.selected_filters;
            this.compliance_filter = selectedFilters.compliance;
            this.position_filter = selectedFilters.positions;
            if (selectedFilters.positions.length === 1 && selectedFilters.positions[0].value === ALL_POSITION_FILTER.value) {
                this.selectAll();
            }
        },
        methods: {
            /**
             * Handle click on all input
             */
            allClick: function () {
                if (this.all_selected) {
                    this.position_filter = [];

                    return;
                }
                this.selectAll();
            },
            /**
             * Apply filters
             */
            apply: function () {
                this.apply_attempt = true;
                if (!this.valid) {
                    return;
                }

                const payload: CompetitionManagementCompliancePositionFiltersChangePayload = {
                    positions: this.all_selected ? [{...ALL_POSITION_FILTER}] : this.position_filter,
                    compliance: this.compliance_filter
                };
                this.$emit('change', payload);
            },
            /**
             * Select all positions
             */
            selectAll: function () {
                this.position_filter = this.available_position_filters.slice();
            }
        }
    });
</script>