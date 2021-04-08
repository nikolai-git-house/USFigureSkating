<template>
    <div class="parented-checkbox-group">
        <div class="parented-checkbox-group__parent">
            <label :for="`pcb_all_${uid}`" class="usfsa-checkbox">
                <input :id="`pcb_all_${uid}`"
                       type="checkbox"
                       :checked="all_selected"
                       v-on:click.prevent="allClick">
                <span class="usfsa-checkbox__text">{{all_label}}</span>
            </label>
        </div>
        <ul class="parented-checkbox-group__children">
            <li v-for="(option,index) in options"
                :key="option.value"
                class="parented-checkbox-group__children__child">
                <label :for="`pcb_all_${uid}_${index}`" class="usfsa-checkbox">
                    <input :id="`pcb_all_${uid}_${index}`"
                           v-model="local_value"
                           type="checkbox"
                           :value="option">
                    <span class="usfsa-checkbox__text">{{option.label}}</span>
                </label>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {FormOption} from '../contracts/AppContracts';

    /**
     * Tracking ID to ensure unique IDs across all instances
     */
    let pcg_uid = 0;
    export default Vue.extend({
        props: {
            /**
             * Text to display after "All" in parent checkbox
             */
            all_suffix: {
                type: String,
                required: false
            },
            /**
             * Options for main list
             */
            options: {
                type: Array as () => FormOption[],
                required: true
            },
            /**
             * Initial value of component
             */
            value: {
                type: Array as () => FormOption[],
                default: () => {
                    return [];
                }
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Isolated local value of component
                 */
                local_value: this.value.slice(),
                /**
                 * UID for component
                 */
                uid: pcg_uid++
            };
        },
        computed: {
            /**
             * Label for "All" input
             */
            all_label: function (): string {
                if (this.all_suffix) {
                    return `All ${this.all_suffix}`;
                }

                return 'All';
            },
            /**
             * Whether all options are selected
             */
            all_selected: function (): boolean {
                return this.local_value.length === this.options.length;
            }
        },
        watch: {
            /**
             * Watch local value for change, and emit input event when it does
             */
            local_value: function (value) {
                this.$emit('input', value);
            }
        },
        methods: {
            /**
             * Handle click on all input
             */
            allClick: function () {
                if (this.all_selected) {
                    this.local_value = [];

                    return;
                }
                this.selectAll();
            },
            /**
             * Select all options
             */
            selectAll: function () {
                this.local_value = this.options.slice();
            }
        }
    });
</script>