import {FormValidator, FormValidatorErrors, FormValidatorMessages, FormValidatorResult} from "../models/FormValidator";

import Vue from "vue";
import {FormState} from "../models/FormState";

/**
 * Mixin to be used as a foundation for a form.
 * Include form state data
 * Run validator against form state
 * Provide field class and message information based on validation state
 *
 */
export default Vue.extend({
    props: {
        /**
         * External error provided by parent
         */
        external_error: {
            type: String,
            required: false
        },
        /**
         * Whether parent is submitting emitted data
         */
        submitting: {
            type: Boolean,
            required: false
        }
    },
    data: function () {
        return {
            /**
             * The validator to use against the form data
             */
            validator_class: FormValidator,
            /**
             * State form data class
             */
            form_data: new FormState(),
            /**
             * Whether a submission attempt has been made
             */
            submit_attempt: false
        }
    },
    methods: {
        /**
         * Class to apply to a field.  Error and success states based on validation state
         */
        fieldClass: function (field_name: string) {
            if (!this.submit_attempt) {
                return;
            }
            if (field_name in this.errors) {
                return "has-error";
            }
            if (this.form_data[field_name]) {
                return "has-success";
            }
        },
        /**
         * Message to display for a field.  Based on validation state
         */
        fieldMessage: function (field_name: string) {
            if (!this.submit_attempt) {
                return;
            }
            if (field_name in this.messages) {
                return this.messages[field_name][0];
            }
        },
    },
    computed: {
        /**
         * The validation result on the form
         */
        validation_result: function (): FormValidatorResult {
            return new this.validator_class(this.form_data).validate();
        },
        /**
         * Validation errors on the form
         */
        errors: function (): FormValidatorErrors {
            return this.validation_result.errors;
        },
        /**
         * Validation messages on the form
         */
        messages: function (): FormValidatorMessages {
            return this.validation_result.messages;
        },
        /**
         * Whether the form is valid
         */
        valid: function (): boolean {
            return Object.keys(this.errors).length === 0;
        },
    },
    watch: {
        form_data: {
            handler: function () {
                this.$emit('changed');
            },
            deep: true
        }
    }
});


