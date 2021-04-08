<template>
    <div class="email-form-recipient-select fixed-footer-offset">
        <div class="email-form__page-title">
            <h1 class="email-form__page-title__text">
                {{current_label}} Recipients
            </h1>
            <p class="email-form__page-title__lead">
                <slot></slot>
            </p>
        </div>
        <div class="email-form-recipient-select__content">
            <email-form-recipient-select-category v-for="(category,index) in categories"
                                                  :key="category.value"
                                                  v-model="selected_recipients.recipients[index]"
                                                  :category="category">
            </email-form-recipient-select-category>
            <div class="fixed-footer">
                <div class="fixed-footer__content">
                    <p v-if="!valid && submit_attempt" class="input-error">
                        At least one option from each category is required.
                    </p>
                    <button class="button button--large button--primary button--block" v-on:click.prevent="complete">
                        {{current_label}} Recipients
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {EmailRecipientOptionCategory} from '../_contracts/EmailFormContracts';
    import {CategoryIndexedRecipients} from '../_models/CategoryIndexedRecipients';
    import EmailFormRecipientSelectCategory from './EmailFormRecipientSelectCategory.vue';

    export default Vue.extend({
        components: {
            EmailFormRecipientSelectCategory
        },
        props: {
            /**
             * The available category options
             */
            categories: {
                type: Array as () => EmailRecipientOptionCategory[]
            },
            /**
             * Indicates one selection from each category is required
             */
            is_each_required: {
                type: Boolean,
                default: false
            },
            /**
             * Whether edit mode is active
             */
            is_edit: {
                type: Boolean,
                default: false
            },
            /**
             * The source value
             */
            value: {
                type: Object as () => CategoryIndexedRecipients,
                required: false
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The locally-tracked selected recipients.
                 * On load, clone passed value if present
                 */
                selected_recipients: <CategoryIndexedRecipients> this.value ? this.value.clone() : new CategoryIndexedRecipients(),
                submit_attempt: false
            };
        },
        computed: {
            /**
             * Current action label
             */
            current_label: function () {
                if (this.is_edit) {
                    return 'Update';
                }

                return 'Add';
            },
            /**
             * Whether the selections are valid
             */
            valid: function (): boolean {
                if (!this.is_each_required) {
                    return true;
                }

                return this.selected_recipients.is_each_selected && this.selected_recipients.length === this.categories.length;
            }
        },
        methods: {
            /**
             * Complete the form element and emit selected value
             */
            complete: function () {
                this.submit_attempt = true;
                if (!this.valid) {
                    return;
                }
                this.$emit('input', this.selected_recipients);
            }
        }
    });
</script>