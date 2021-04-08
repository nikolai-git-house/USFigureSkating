import {FormValidator} from "../FormValidator";
import {EqualValidationRule, MinLengthValidationRule, ValidationRule} from "../ValidationRules";
import {PasswordFormState} from "./PasswordFormState";

/**
 * Validator to be used with Password Forms
 */
export class PasswordFormValidator extends FormValidator {

    protected rules: { [key: string]: ValidationRule[] } = {
        password: ["required", new MinLengthValidationRule(6)],
        password_confirm: ["required", new EqualValidationRule('password')],
    };
    protected messages = {
        "required": "This field is required",
        "equal": "Passwords do not match",
        "min_length": "Password is not long enough"
    };

    constructor(form_data: PasswordFormState) {
        super(form_data);
    }
}
