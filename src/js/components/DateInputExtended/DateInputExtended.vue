<template>
    <input ref="input"
           type="text"
           v-on:input="handleInput">
</template>
<script lang="ts">
    import Vue from 'vue';
    import {DateInputCompleteValue, DateInputInputProcessorResult} from './DateInputExtendedContracts';
    import {DateInputInputProcessor} from './DateInputInputProcessor';

    export default Vue.extend({
        props: {
            /**
             * Whether to use a 4-digit year instead of a 2-digit year when formatting
             */
            four_digit_year: {
                default: false,
                type: Boolean
            }
        },
        methods: {
            /**
             * Handle user input into form field
             * 1. process input
             * 2. write format back to input element
             * 3. report value change
             */
            handleInput: function (e: Event): void {
                const event_target = <HTMLInputElement>e.target;
                const processor_result: DateInputInputProcessorResult = this.processInput(event_target.value);
                this.writeInputValue(processor_result.formatted);
                this.reportValue(processor_result);
            },
            /**
             * Process input value
             */
            processInput: function (input: string): DateInputInputProcessorResult {
                return DateInputInputProcessor.processInput(input, this.four_digit_year ? 4 : 2);
            },
            /**
             * Report value change
             *
             * Strip trailing slashes from formatted input
             */
            reportValue: function (processor_result: DateInputInputProcessorResult): void {
                const component_value: DateInputCompleteValue = {
                    value: processor_result.value,
                    formatted: processor_result.formatted.replace(/\/$/, ''),
                    clean: processor_result.clean
                };
                this.$emit('input', component_value);
            },
            /**
             * Write value to input
             */
            writeInputValue: function (value: string): void {
                const input = this.$refs.input as HTMLInputElement;
                input.value = value;
            }
        }
    });
</script>