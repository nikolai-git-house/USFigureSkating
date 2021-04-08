<template>
    <div class="competition-filter">
        <div class="competition-filter__field">
            <div class="form-group">
                <label for="filter_field" class="field-label sr-only">
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
        <div v-if="filter_field" class="competition-filter__term">
            <div v-if="filter_field.type==='state'" class="form-group">
                <label class="sr-only" for="state_filter">
                    Select State
                </label>
                <select id="state_filter"
                        v-model="filter_term[0]"
                        class="form-field form-field--reduced-right"
                        name="filter_term">
                    <option disabled
                            :value="null">
                        Select State
                    </option>
                    <option v-for="state_option in state_filter_options"
                            :key="state_option.value"
                            :value="state_option.value">
                        {{state_option.label}}
                    </option>
                </select>
                <p class="help-text">
                    Only states with available competitions will display.
                </p>
            </div>
            <div v-else-if="filter_field.type==='date_range'" class="form-row form-row--range">
                <div class="form-column">
                    <div class="form-group">
                        <label for="date_min" class="sr-only">Start Date</label>
                        <date-input-extended
                                id="date_min"
                                v-model="filter_term[0]"
                                placeholder="Min Date"
                                class="form-field form-field--search form-field--reduced-right"
                                type="text"
                                name="filter_term">
                        </date-input-extended>
                        <p class="help-text">
                            Format: M/D or M/D/YY
                        </p>
                    </div>
                </div>
                <div class="form-row--range__separator">
                    to
                </div>
                <div class="form-column">
                    <div class="form-group">
                        <label for="date_max" class="sr-only">End Date</label>
                        <date-input-extended
                                id="date_max"
                                v-model="filter_term[1]"
                                placeholder="Max Date"
                                class="form-field form-field--search form-field--reduced-right"
                                type="text"
                                name="filter_term">
                        </date-input-extended>
                        <p class="help-text">
                            Format: M/D or M/D/YY
                        </p>
                    </div>
                </div>
                <div class="form-row__help">
                    <p class="help-text">
                        Competitions with dates within entered range will display.
                    </p>
                </div>
            </div>
            <div v-else class="form-group">
                <label class="sr-only" for="filter_term">
                    {{filter_field.label}}
                </label>
                <input
                        id="filter_term"
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
    import {FormOption} from '../../contracts/AppContracts';
    import {CompetitionFilterFieldOptions} from './CompetitionFilterConstants';
    import {
        CompetitionFilterServiceParams,
        CompetitionFilterFieldOption,
        CompetitionFilterTermValue,
        CompetitionFilterTermValueSegment,
        FilterableCompetition
    } from './CompetitionFilterContracts';
    import CompetitionFilterService from './CompetitionFilterService';
    import {DateInputParsedValue} from '../DateInputExtended/DateInputExtendedContracts';

    export default Vue.extend({
        props: {
            /**
             * The unfiltered source list of competitions
             */
            competitions: {
                type: Array as () => FilterableCompetition[],
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The options available for the filter field
                 */
                field_options: <CompetitionFilterFieldOption[]>CompetitionFilterFieldOptions,
                /**
                 * The selected field_option to filter against
                 */
                filter_field: <CompetitionFilterFieldOption | null>null,
                /**
                 * The currently entered filter term
                 */
                filter_term: <CompetitionFilterTermValue>[null, null]
            };
        },
        computed: {
            /**
             * Whether a filter term has been entered
             */
            filter_entered: function (): boolean {
                for (let i = 0; i < this.filter_term.length; i++) {
                    const filter_term: CompetitionFilterTermValueSegment = this.filter_term[i];
                    if (filter_term !== null && filter_term !== '') {
                        if (typeof filter_term === 'object') {
                            const value: DateInputParsedValue = filter_term.value;
                            if (value.day || value.month || value.year) {
                                return true;
                            }

                            // eslint-disable-next-line
                            continue;
                        }

                        return true;
                    }
                }

                return false;
            },
            /**
             * The list of filtered competitions based on current filters
             */
            filtered_competitions: function (): FilterableCompetition[] {
                const competition_list = this.competitions.slice();

                if (!this.filter_field || !this.filter_entered) {
                    return competition_list;
                }

                return CompetitionFilterService.filter(
                    <CompetitionFilterServiceParams>{
                        type: this.filter_field.type,
                        value: this.filter_term,
                        field: this.filter_field.value
                    },
                    competition_list
                );
            },
            /**
             * The placeholder for the filter input
             */
            input_placeholder: function (): string {
                if (this.filter_field) {
                    return 'Enter ' + this.filter_field.label;
                }

                return '';
            },
            /**
             * The options for the state filter input
             */
            state_filter_options: function (): FormOption[] {
                // Track states that have already been added to prevent duplicates
                const added_states: string[] = [];

                return this.competitions
                    .reduce((carry: FormOption[], competition: FilterableCompetition) => {
                        const competition_state: string = competition.state;

                        if (added_states.indexOf(competition_state) === -1) {
                            added_states.push(competition_state);
                            carry.push({
                                label: competition_state,
                                value: competition_state
                            });
                        }

                        return carry;
                    }, [])
                    .sort((item: FormOption, item2: FormOption) => {
                        return item.value.localeCompare(item2.value);
                    });
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
             * When filter term changes (and thus filtered competitions), emit state
             */
            filter_term: function () {
                this.emit();
            }
        },
        methods: {
            /**
             * Emit event containing list of competitions that pass current filters
             */
            emit: function () {
                this.$emit('input', this.filtered_competitions.slice());
            },
            /**
             * Reset to initial state
             */
            reset: function () {
                this.filter_field = null;
            }
        }
    });
</script>