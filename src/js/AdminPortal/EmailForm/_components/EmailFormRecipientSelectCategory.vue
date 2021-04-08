<template>
    <div class="email-form-recipient-select-category parented-checkbox-group">
        <div class="parented-checkbox-group__parent">
            <label :for="'category_' + category.value" class="usfsa-checkbox">
                <input :id="'category_' + category.value"
                       type="checkbox"
                       :name="'category_' + category.value"
                       :checked="all_selected"
                       v-on:click.prevent="allClick($event.target.checked)">
                <span class="usfsa-checkbox__text">{{category.label}}</span>
            </label>
        </div>
        <ul class="parented-checkbox-group__children">
            <li v-for="(item,item_index) in category.options"
                :key="item_index"
                class="parented-checkbox-group__children__child">
                <label :for="'category_' + category.value + 'item_'+item_index" class="usfsa-checkbox">
                    <input :id="'category_' + category.value + 'item_'+item_index"
                           v-model="selected_recipients"
                           type="checkbox"
                           :value="item"
                           :name="'category_' + category.value + 'item_'+item_index">
                    <span class="usfsa-checkbox__text"><span v-if="item.role">{{item.role}}: </span>{{item.label}}</span>
                </label>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {EmailRecipientOption, EmailRecipientOptionCategory} from '../_contracts/EmailFormContracts';

    export default Vue.extend({
        props: {
            /**
             * The source category option
             */
            category: {
                type: Object as () => EmailRecipientOptionCategory
            },
            /**
             * The pre-selected value
             */
            value: {
                type: Array as () => EmailRecipientOption[] | null
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Whether the all filter is selected
                 */
                all_selected: false,
                /**
                 * List of locally selected filters
                 */
                selected_recipients: <EmailRecipientOption[]>[]
            };
        },
        watch: {
            /**
             * Handle toggling of "All" filter checkbox when child selections change
             */
            selected_recipients: function (newV: EmailRecipientOption[], oldV: EmailRecipientOption[]) {
                if (newV.length === this.category.options.length) {
                    this.all_selected = true;
                }
                if (oldV.length == this.category.options.length && newV.length !== 0) {
                    this.all_selected = false;
                }
            }
        },
        /**
         * On component mount, set local data based on prop data
         */
        mounted: function () {
            if (this.value && this.value.length) {
                if (this.value[0].value === this.category.value) {
                    this.allClick(true);

                    return;
                }
                this.selected_recipients = this.value.slice();
            }
        },
        /**
         * On component update, emit change to value
         */
        updated: function () {
            if (this.all_selected) {
                const all_emit: EmailRecipientOption[] = [
                    {
                        label: this.category.label,
                        value: this.category.value
                    }
                ];
                this.$emit('input', all_emit);

                return;
            }
            this.$emit('input', this.selected_recipients);
        },
        methods: {
            /**
             * Handle click on "All" filter
             */
            allClick: function (checked: boolean) {
                this.all_selected = checked;
                if (checked) {
                    this.selected_recipients = this.category.options.slice();

                    return;
                }
                this.selected_recipients = [];
            }
        }
    });
</script>