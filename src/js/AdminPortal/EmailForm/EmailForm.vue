<template>
    <div class="email-form">
        <email-form-index v-if="!active_recipient_select"></email-form-index>
        <email-form-recipient-select v-if="active_recipient_select==='cc'"
                                     v-model="form_data.cc"
                                     :categories="options_cc"
                                     :is_edit="is_edit_cc"
                                     :value="form_data.cc">
            {{cc_lead}}
        </email-form-recipient-select>

        <email-form-recipient-select v-if="active_recipient_select==='bcc'"
                                     v-model="form_data.bcc"
                                     :is_edit="is_edit_bcc"
                                     :is_each_required="is_each_bcc_required"
                                     :categories="options_bcc"
                                     :value="form_data.bcc">
            {{bcc_lead}}
        </email-form-recipient-select>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import FormMixin from '../../mixins/FormMixin';
    import {FormValidatorResult} from '../../models/FormValidator';
    import EmailFormIndex from './_components/EmailFormIndex.vue';
    import EmailFormRecipientSelect from './_components/EmailFormRecipientSelect.vue';
    import {AttachmentValidationRules, EmailRecipientOptionCategory} from './_contracts/EmailFormContracts';
    import {EmailFormFormState} from './_models/EmailFormFormState';
    import {
        AttachmentsValidationResult,
        EmailFormValidator,
        EmailFormValidatorResult
    } from './_models/EmailFormValidator';

    const vueClass = mixins(FormMixin);
    // @vue/component
    export default vueClass.extend({
        components: {
            EmailFormIndex,
            EmailFormRecipientSelect
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The active recipient select page, or null if index is active
                 */
                active_recipient_select: <'bcc' | 'cc' | null>null,
                /**
                 * Data for the form
                 */
                form_data: new EmailFormFormState(),
                /**
                 * Validator for the form
                 */
                validator_class: EmailFormValidator
            };
        },
        computed: {
            /**
             * The validation result for attachments
             */
            attachment_validation_errors: function (): AttachmentsValidationResult {
                return this.validation_outcome.attachments;
            },
            /**
             * Rules for attachment validation
             */
            attachment_validation_rules: function (): AttachmentValidationRules {
                return this.$store.state.email_form.attachment_rules;
            },
            /**
             * Lead text for bcc edit
             */
            bcc_lead: function () {
                return this.$store.state.email_form.bcc_lead;
            },
            /**
             * Lead text for cc edit
             */
            cc_lead: function (): string {
                const configured = this.$store.state.email_form.cc_lead;
                if (configured) {
                    return configured;
                }
                const categories = this.$store.state.email_form.recipient_options_cc.map((option: EmailRecipientOptionCategory) => {
                    return option.label.replace('All', '');
                });
                let last;
                if (categories.length > 1) {
                    last = categories.pop();
                }

                return `Please select ${categories.join(', ')}${last ? ` and ${last}` : ''} to CC`;
            },
            /**
             * Whether a recipient of each BCC category is required
             */
            is_each_bcc_required: function (): boolean {
                return this.$store.getters['email_form/is_each_bcc_required'];
            },
            /**
             * Whether BCC is in an edit state
             */
            is_edit_bcc: function (): boolean {
                return this.form_data.bcc.values.length > 0;
            },
            /**
             * Whether CC is in an edit state
             */
            is_edit_cc: function (): boolean {
                return this.form_data.cc.values.length > 0;
            },
            /**
             * The available selections for BCC
             */
            options_bcc: function (): EmailRecipientOptionCategory[] {
                return this.$store.getters['email_form/options_bcc'];
            },
            /**
             * The available selections for CC
             */
            options_cc: function (): EmailRecipientOptionCategory[] {
                return this.$store.getters['email_form/options_cc'];
            },
            /**
             * Whether the form is valid
             */
            valid: function (): boolean {
                return Object.keys(this.errors).length === 0 && !this.attachment_validation_errors;
            },
            /**
             * The global outcome from form validation
             */
            validation_outcome: function (): EmailFormValidatorResult {
                /* eslint-disable new-cap */
                return new this.validator_class(this.form_data)
                    .validateAll(this.attachment_validation_rules);
            },
            /**
             * The validation result on the form
             */
            validation_result: function (): FormValidatorResult {
                return this.validation_outcome.result;
            }
        },
        watch: {
            /**
             * When active view changes, emit page change event
             */
            active_recipient_select: function (val) {
                this.$emit('page-change', val || 'index');
            },
            /**
             * When recipients change, it's due to a button click. Close the recipient selection screen
             */
            'form_data.bcc.recipients': function () {
                this.active_recipient_select = null;
            },
            /**
             * When recipients change, it's due to a button click. Close the recipient selection screen
             */
            'form_data.cc.recipients': function () {
                this.active_recipient_select = null;
            }
        },
        /**
         * Upon component creation, set the email subject if a default is provided
         */
        created: function () {
            this.form_data = this.$store.state.email_form.form_data;
        },
        methods: {
            /**
             * Close any active subpages and return whether any were active
             */
            closeSubpages: function (): boolean {
                const was_open = this.active_recipient_select !== null;
                this.active_recipient_select = null;

                return was_open;
            },
            /**
             * Open one of the recipient selection screens
             */
            openRecipientSelect: function (value: 'bcc' | 'cc') {
                this.active_recipient_select = value;
            },
            /**
             * Do the submission
             */
            submit: function () {
                this.submit_attempt = true;
                if (!this.valid) {
                    return;
                }
                this.$emit('complete', this.form_data.export());
            },
            /**
             * Validation error message, if present, for an attachment by index
             */
            attachmentError: function (index: number): string | false {
                if (!this.submit_attempt) {
                    return false;
                }
                const field_name = index.toString();
                if (this.attachment_validation_errors && field_name in this.attachment_validation_errors) {
                    return this.attachment_validation_errors[field_name][0];
                }

                return false;
            },
            /**
             * Class to add to an attachment based on its validation result
             */
            attachmentClass: function (index: number): string | null {
                if (!this.submit_attempt) {
                    return null;
                }
                const field_name = index.toString();
                if ('attachments' in this.errors) {
                    return 'has-error';
                }
                if (this.attachment_validation_errors && field_name in this.attachment_validation_errors) {
                    return 'has-error';
                }

                return null;
            }
        }
    });
</script>