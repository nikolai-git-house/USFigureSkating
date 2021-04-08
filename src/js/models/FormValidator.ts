import {
    validateConfirmed,
    validateCreditCardNumber,
    validateCVC,
    validateDateFormatted,
    validateDateNotFuture,
    validateEmail,
    validateEqual,
    validateInteger,
    validateMax,
    validateMaxLength,
    validateMinLength,
    validateNullableEmail,
    validateRequired
} from './ValidationFunctions';
import {ValidationRule} from './ValidationRules';

export type FormValidatorErrors = { [key: string]: string[] };
export type FormValidatorMessages = { [key: string]: string[] };
export type FormValidatorResult = {
    errors: FormValidatorErrors,
    messages: FormValidatorMessages
};


export class FormValidator {

    protected static validators: { [key: string]: Function } = {
        required: function (value: any) {
            return validateRequired(value, false);
        },
        /**
         *
         * Right now we're allowing a lot of input through with the goal of not displaying errors for fringe case zip codes
         */
        zip: function (value: any) {
            return validateMinLength(value, 5) && validateMaxLength(value, 10);
            // return validateZipCode(value);
        },
        cvc: function (value: any) {
            return validateCVC(value);
        },
        credit_card_number: function (value: any) {
            return validateCreditCardNumber(value)
        },
        integer: function (value: any) {
            return validateInteger(value);
        },
        max: function (value: any, limit: number) {
            return validateMax(value, limit);
        },
        email: function (value: any) {
            return validateEmail(value);
        },
        nullable_email: function (value: any) {
            return validateNullableEmail(value);
        },
        equal: function (value: any, match_field: string) {
            return validateEqual(value, match_field);
        },
        min_length: function (value: any, limit: number) {
            return validateMinLength(value, limit);
        },
        date_formatted: function (value: any) {
            return validateDateFormatted(value)
        },
        date_not_future: function (value: any) {
            return validateDateNotFuture(value);
        },
        confirmed: function (value: any) {
            return validateConfirmed(value);
        }
    };

    protected form_data: { [key: string]: any };
    protected rules: { [key: string]: ValidationRule[] } = {};
    protected messages: { [key: string]: string | Function } = {
        "required": "This field is required"
    };


    constructor(form_data: { [key: string]: any }) {
        this.form_data = form_data
    }

    validate(): FormValidatorResult {
        let errors: FormValidatorErrors = {};
        let messages: FormValidatorMessages = {};
        for (let field in this.rules) {
            let field_rules = this.rules[field];
            for (let i = 0; i < field_rules.length; i++) {
                let field_rule = field_rules[i].toString();
                let formDatum = this.form_data[field];
                if (!this.validateRule(field_rule, formDatum)) {


                    this.addError(errors, field, field_rule);
                    this.addMessage(messages, field, field_rule);
                }
            }
        }
        return {
            errors,
            messages
        }
    }

    protected validateRule(rule_params: string, value: any) {
        let split = rule_params.split(':');
        let rule = split[0];
        let attributes = split[1];
        /**
         * If rule is equal, get the value of the field from data for comparison
         */
        if (rule === "equal") {
            attributes = this.form_data[attributes];
        }
        return FormValidator.validators[rule](value, attributes);
    }

    protected addMessage(messages: FormValidatorMessages, field: string, field_rule: string) {
        let split = field_rule.split(':');
        let rule = split[0];
        let attributes = split[1];
        if (!messages.hasOwnProperty(field)) {
            messages[field] = [];
        }
        let message_def = this.messages[rule];
        let message = typeof message_def === 'string' ? message_def : message_def(attributes);
        messages[field].push(message);
    }

    protected addError(errors: FormValidatorErrors, field: string, field_rule: string) {
        let split = field_rule.split(':');
        let rule = split[0];
        if (!errors.hasOwnProperty(field)) {
            errors[field] = [];
        }
        errors[field].push(rule);
    }

    /**
     * Ensure a validation result has the necessary foundation for a field's errors and messages
     * If errors and messages properties don't contain a key for a field, add baseline
     */
    protected ensureValidationResultFieldPresence(field_key: string, result: FormValidatorResult) {
        if (!result.errors[field_key]) {
            result.errors[field_key] = [];
        }
        if (!result.messages[field_key]) {
            result.messages[field_key] = [];
        }
    }
}
