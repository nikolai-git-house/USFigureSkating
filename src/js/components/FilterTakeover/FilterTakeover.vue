<template>
    <div class="filter-takeover">
        <div class="grid-container">
            <h2 class="site-overlay__heading site-overlay__heading--large">
                Filter
            </h2>
            <div class="filter-takeover__body">
                <parented-checkbox-group v-for="(filter,key) in available_filters"
                                         :key="key"
                                         v-model="local_value[key]"
                                         :options="filter.options"
                                         :all_suffix="key|title_case_from_key"></parented-checkbox-group>
            </div>
            <div class="filter-takeover__apply">
                <p v-if="apply_attempt && !is_valid"
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
    import {FilterTakeover} from './_contracts';
    import {StringHelpers} from '../../helpers/StringHelpers';
    import {FormOption} from '../../contracts/AppContracts';

    export default Vue.extend({
        filters: {
            /**
             * Format a key into title case
             */
            title_case_from_key: function (value: string): string {
                return StringHelpers.titleCase(StringHelpers.displayFromKey(value));
            }
        },
        props: {
            /**
             * The available filters
             */
            available_filters: {
                type: Object as () => FilterTakeover.AvailableFilterConfiguration[],
                required: true
            },
            /**
             * The preselected filters
             */
            selected_filters: {
                type: Object as () => FilterTakeover.SelectedFilters,
                required: true
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
                 * The local value of the component
                 */
                local_value: <FilterTakeover.SelectedFilters>{}
            };
        },
        computed: {
            /**
             * Whether the currently selected filter set is valid
             */
            is_valid: function (): boolean {
                return !this.validation_error;
            },
            /**
             * The validation error for the current state of the component
             */
            validation_error: function (): string | null {
                const missing_fields: string[] = [];
                for (const i in this.available_filters) {
                    if (Object.prototype.hasOwnProperty.call(this.available_filters, i)) {
                        const filter = this.available_filters[i];
                        if (filter.required) {
                            if (!this.local_value[i].length) {
                                missing_fields.push(StringHelpers.titleCase(StringHelpers.displayFromKey(i)));
                            }
                        }
                    }
                }

                if (missing_fields.length) {
                    if (missing_fields.length === 1) {
                        return `Select at least one ${missing_fields[0]} option.`;
                    }
                    const last = missing_fields.pop();

                    return `Select at least one option for "${missing_fields.join('," "')}" and "${last}."`;
                }

                return null;
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
             * Apply filters
             */
            apply: function () {
                this.apply_attempt = true;
                if (!this.is_valid) {
                    return;
                }
                this.$emit('change', this.local_value);
            },
            /**
             * Ensure the local value has keys to track all available filter groups, and that the initial values are set to those provided
             */
            initializeLocalValue: function () {
                for (const i in this.available_filters) {
                    if (Object.prototype.hasOwnProperty.call(this.available_filters, i)) {
                        let value: FormOption[] = [];
                        if (Object.prototype.hasOwnProperty.call(this.selected_filters, i)) {
                            value = this.selected_filters[i].slice();
                        }
                        this.$set(this.local_value, i, value);
                    }
                }
            }
        }
    });
</script>