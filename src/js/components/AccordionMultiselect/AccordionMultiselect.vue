<template>
    <accordion class="accordion-multiselect accordion--select"
               :external_expand_check="is_expanded"
               v-on:accordion_toggle="handleAccordionClose">
        <span slot="trigger_text"
              class="accordion-multiselect__display_value">{{display_value}}</span>
        <div slot="expand_content"
             class="accordion-multiselect__content"
             v-on:click="isolateInteraction($event)"
             v-on:touchstart="isolateInteraction($event)">
            <div v-for="(section,index) in options"
                 :key="index"
                 class="accordion-multiselect__section">
                <ul class="accordion-multiselect__list">
                    <li v-for="(option,oindex) in section.options"
                        :key="`${index}_${oindex}`"
                        class="accordion-multiselect__list__item">
                        <div class="checkbox">
                            <label :for="`ams-${index}-${oindex}`"
                                   class="usfsa-checkbox">
                                <input :id="`ams-${index}-${oindex}`"
                                       v-model="local_value[index]"
                                       :value="option"
                                       type="checkbox">
                                <span class="usfsa-checkbox__text">{{option.label}}</span>
                            </label>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="accordion-multiselect__apply">
                <p v-if="show_error"
                   class="input-error">
                    *{{validation_message}}
                </p>
                <button class="button button--block"
                        v-on:click.prevent="apply">
                    Apply
                </button>
            </div>
        </div>
    </accordion>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {FormOption, FormOptionValue} from '../../contracts/AppContracts';
    import {AccordionMultiselect} from './_contracts';

    let uid = 0;
    export default Vue.extend({
        props: {
            /**
             * Text to display when all options are selected
             */
            all_display: {
                type: String,
                required: false
            },
            /**
             * The options configuration for the component
             *
             * Options broken down by section keys
             */
            options: {
                type: Object as () => AccordionMultiselect.OptionsConfiguration,
                required: true
            },
            /**
             * The string to display when the multiselect is open
             */
            select_title: {
                type: String,
                required: true
            },
            /**
             * The initial value of the component
             *
             * Values broken down by section keys to align with options property
             */
            value: {
                type: Object as () => AccordionMultiselect.ValueConfiguration,
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether an attempt has been made to apply the value
                 */
                apply_attempt: false,
                /**
                 * Whether the component is expanded
                 */
                is_expanded: false,
                /**
                 * The value local to the instance
                 */
                local_value: <AccordionMultiselect.ValueConfiguration>{},
                /**
                 * Unique ID for the component instance
                 */
                uid: uid++
            };
        },
        computed: {
            /**
             * The required order of options, indexed by section
             */
            option_orders: function (): { [key: string]: FormOptionValue[]; } {
                const result: { [key: string]: FormOptionValue[]; } = {};
                for (const i in this.options) {
                    if (Object.prototype.hasOwnProperty.call(this.options, i)) {
                        result[i] = this.options[i].options.map((option) => {
                            return option.value;
                        });
                    }
                }

                return result;
            },
            /**
             * The value to display in the output section
             */
            display_value: function (): string {
                const value: string[] = [];
                let all = true;
                if (!this.is_expanded) {
                    for (const i in this.local_value) {
                        if (Object.prototype.hasOwnProperty.call(this.local_value, i)) {
                            const section_values: FormOption[] = this.local_value[i].slice();

                            if (section_values.length != this.options[i].options.length) {
                                all = false;
                            }
                            // Reorder section values to match option order
                            section_values.sort((selected_option_a: FormOption, selected_option_b: FormOption) => {
                                const a_order_id = this.option_orders[i].indexOf(selected_option_a.value);
                                const b_order_id = this.option_orders[i].indexOf(selected_option_b.value);

                                return a_order_id - b_order_id;
                            });
                            for (let j = 0; j < section_values.length; j++) {
                                const option_value: FormOption = section_values[j];
                                value.push(option_value.label);
                            }
                        }
                    }
                }
                if (value.length === 0) {
                    return this.select_title;
                }
                if (all && this.all_display) {
                    return this.all_display;
                }

                return value.join(' + ');
            },
            /**
             * Whether to show the error message
             */
            show_error: function (): boolean {
                return this.apply_attempt && !this.valid;
            },
            /**
             * Whether the current local value represents a valid selection
             */
            valid: function () {
                for (const i in this.local_value) {
                    if (Object.prototype.hasOwnProperty.call(this.local_value, i)) {
                        const localValueElement = this.local_value[i];
                        if (localValueElement.length === 0) {
                            return false;
                        }
                    }
                }

                return true;
            },
            /**
             * The validation message to show
             */
            validation_message: function () {
                if (Object.keys(this.local_value).length > 1) {
                    return 'Select at least one option from each section.';
                }

                return 'Select at least one option.';
            }
        },
        watch: {
            /**
             * Add/remove click out listeners based on whether the element is expanded or not
             */
            is_expanded: function (value: boolean) {
                if (value) {
                    document.addEventListener('click', this.clickOut);
                    document.addEventListener('touchstart', this.clickOut);

                    return;
                }
                document.removeEventListener('click', this.clickOut);
                document.removeEventListener('touchstart', this.clickOut);
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
             * Apply selections
             */
            apply: function () {
                this.apply_attempt = true;
                if (!this.valid) {
                    return;
                }
                this.apply_attempt = false;
                this.is_expanded = false;
                this.$emit('input', {...this.local_value});
            },
            /**
             * Handle a click out when the accordion is open
             */
            clickOut: function (): void {
                if (this.is_expanded) {
                    this.is_expanded = false;
                    this.revert();
                }
            },
            /**
             * Event handler when child accordion component is toggled
             */
            handleAccordionClose: function () {
                this.is_expanded = !this.is_expanded;
                this.revert();
            },
            /**
             * Initialize the local value of the component based on the options available and the provided value
             */
            initializeLocalValue: function () {
                for (const value_key in this.options) {
                    if (Object.prototype.hasOwnProperty.call(this.options, value_key)) {
                        let value: FormOption[] = [];
                        if (Object.prototype.hasOwnProperty.call(this.value, value_key)) {
                            value = this.value[value_key].slice();
                        }
                        this.$set(this.local_value, value_key, value);
                    }
                }
            },
            /**
             * Isolate an interaction with the element
             */
            isolateInteraction: function (event: Event) {
                event.stopPropagation();
            },
            /**
             * Revert changes to selections
             */
            revert: function () {
                this.initializeLocalValue();
            }
        }
    });
</script>