<template>
    <div class="standings-global-filter filter-takeover">
        <div class="grid-container">
            <h2 class="site-takeover__title site-takeover__title--large">
                Filter by Section, Levels and Disciplines
            </h2>
            <div class="filter-takeover__body">
                <parented-checkbox-group v-model="discipline_filter"
                                         :options="available_global_filters.disciplines"
                                         all_suffix="Disciplines"></parented-checkbox-group>
                <parented-checkbox-group v-model="level_filter"
                                         :options="available_global_filters.levels"
                                         all_suffix="Levels"></parented-checkbox-group>
                <parented-checkbox-group v-model="section_filter"
                                         :options="available_global_filters.sections"
                                         all_suffix="Sections"></parented-checkbox-group>
            </div>
            <div class=" filter-takeover__apply">
                <p v-if="apply_attempt && !valid"
                   class="input-error">
                    {{validation_error}}
                </p>
                <button class="button button--large button--block"
                        v-on:click.prevent="apply">
                    Apply
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesStandings} from '../_contracts';
    import {FormOption} from '../../../contracts/AppContracts';

    export default Vue.extend({
        /**
         * Reactive Data
         */
        data: function () {
            return {
                /**
                 * Whether there has been an attempt to apply filters
                 */
                apply_attempt: false,
                /**
                 * Locally-selected discipline filter
                 */
                discipline_filter: <FormOption[]>[],
                /**
                 * Locally-selected level filter
                 */
                level_filter: <FormOption[]>[],
                /**
                 * Locally-selected section filter
                 */
                section_filter: <SeriesStandings.SectionFilterFormOption[]>[]
            };
        },
        computed: {
            /**
             * The current active global filters
             */
            active_global_filters: function (): SeriesStandings.StandingsGlobalFilterSet {
                return this.$store.state.series_standings.active_global_filters;
            },
            /**
             * The current available global filters
             */
            available_global_filters: function (): SeriesStandings.StandingsGlobalFilterSet {
                return this.$store.state.series_standings.available_global_filters;
            },
            /**
             * The payload when reporting changes to state
             */
            state_payload: function (): SeriesStandings.StandingsGlobalFilterSet {
                return {
                    sections: this.section_filter,
                    disciplines: this.discipline_filter,
                    levels: this.level_filter
                };
            },
            /**
             * Whether the currently selected filter set is valid
             */
            valid: function (): boolean {
                return !this.validation_error;
            },
            /**
             * The validation error for the current state of the component
             */
            validation_error: function (): string | null {
                const missing_fields: string[] = [];
                if (this.discipline_filter.length === 0) {
                    missing_fields.push('discipline');
                }
                if (this.level_filter.length === 0) {
                    missing_fields.push('level');
                }
                if (this.section_filter.length === 0) {
                    missing_fields.push('section');
                }

                if (missing_fields.length) {
                    if (missing_fields.length === 1) {
                        return `Select at least one ${missing_fields[0]}.`;
                    }
                    const last = missing_fields.pop();

                    return `Select at least one ${missing_fields.join(', ')} and ${last}.`;
                }

                return null;
            }
        },
        /**
         * On component creation, reflect active filters in state locally
         */
        created: function () {
            this.section_filter = this.active_global_filters.sections.slice();
            this.discipline_filter = this.active_global_filters.disciplines.slice();
            this.level_filter = this.active_global_filters.levels.slice();
        },
        methods: {
            /**
             * Apply the selected filters
             */
            apply: function (): void {
                this.apply_attempt = true;
                if (!this.valid) {
                    return;
                }
                this.$store.commit('series_standings/setActiveGlobalFilters', this.state_payload);
                this.$emit('close');
            }
        }
    });
</script>