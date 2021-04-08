<template>
    <div class="standings-granular-filter two-tier-filter">
        <div class="two-tier-filter__field">
            <div class="form-group">
                <label for="filter_field"
                       class="field-label sr-only">
                    Search By
                </label>
                <select id="filter_field"
                        v-model="filter_field"
                        class="form-field form-field--reduced-right">
                    <option :value="null"
                            selected
                            disabled>
                        Search by:
                    </option>
                    <option v-for="option in field_options"
                            :key="option.value"
                            :value="option">
                        {{option.label}}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="filter_field"
             class="two-tier-filter__term">
            <div v-if="filter_field.type==='number_range'"
                 class="standings-granular-filter__national-rank">
                <div class="form-row form-row--range form-row--range--pre-labeled">
                    <div class="form-row--range__pre-label">
                        From
                    </div>
                    <div class="form-column">
                        <div class="form-group">
                            <label for="range_min"
                                   class="sr-only">Min
                            </label>
                            <input id="range_min"
                                   v-model="filter_term[0]"
                                   v-number-input
                                   type="text"
                                   class="form-field">
                        </div>
                    </div>
                    <div class="form-row--range__separator">
                        to
                    </div>
                    <div class="form-column">
                        <div class="form-group">
                            <label for="range_max"
                                   class="sr-only">Max
                            </label>
                            <input id="range_max"
                                   v-model="filter_term[1]"
                                   v-number-input
                                   type="text"
                                   class="form-field">
                        </div>
                    </div>
                </div>
            </div>
            <div v-else
                 class="form-group">
                <label class="sr-only"
                       for="filter_term">
                    {{filter_field.label}}
                </label>
                <input id="filter_term"
                       v-model="filter_term[0]"
                       :placeholder="input_placeholder"
                       class="form-field form-field--search form-field--reduced-right"
                       type="text"
                       name="filter_term">
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesStandings} from '../_contracts';
    import {SeriesStandingsConstants} from '../SeriesStandingsConstants';

    export default Vue.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The options available for the filter field
                 */
                field_options: <SeriesStandings.StandingsGranularFilterFieldOption[]>SeriesStandingsConstants.GRANULAR_FILTER_FIELD_OPTIONS,
                /**
                 * The selected field_option to filter against
                 */
                filter_field: <SeriesStandings.StandingsGranularFilterFieldOption | null>null,
                /**
                 * The currently entered filter term
                 */
                filter_term: <SeriesStandings.StandingsGranularFilterTerm>[null, null]
            };
        },
        computed: {
            /**
             * The placeholder for the filter input
             */
            input_placeholder: function (): string {
                if (this.filter_field) {
                    return 'Enter ' + this.filter_field.label;
                }

                return '';
            }
        },
        watch: {
            /**
             * Clear the filter term when the field changes
             */
            filter_field: function () {
                this.filter_term = [null, null];
            },
            /**
             * Watch the filter term for change, and report the filter to state
             */
            filter_term: {
                /**
                 * Compile filter and report to state
                 */
                handler: function (value: SeriesStandings.StandingsGranularFilterTerm) {
                    let primary_value = null;
                    let secondary_value = null;
                    const primary_segment = value[0];
                    const secondary_segment = value[1];
                    if (primary_segment) {
                        primary_value = primary_segment.trim() || null;
                    }
                    if (secondary_segment) {
                        secondary_value = secondary_segment.trim() || null;
                    }

                    const compiled_filter: SeriesStandings.StandingsGranularFilter = {
                        field: this.filter_field,
                        term: [primary_value, secondary_value]
                    };
                    this.$store.commit('series_standings/updateGranularFilter', compiled_filter);
                },
                deep: true
            }
        }
    });
</script>