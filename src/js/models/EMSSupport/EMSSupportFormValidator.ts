import {FormValidator, FormValidatorResult} from "../FormValidator";
import {ValidationRule} from "../ValidationRules";
import {EMSSupportFormData} from "./EMSSupportFormData";

export class EMSSupportFormValidator extends FormValidator {
    protected rules: { [key: string]: ValidationRule[] } = {
        email: ['required', 'email'],
        issue_type: ['required'],
        description: ['required'],
    };
    protected messages: { [key: string]: string | Function } = {
        required: "This field is required",
        email: "Enter a valid email address"
    };

    constructor(form_data: EMSSupportFormData) {
        super(form_data);
    }

    validate(): FormValidatorResult {
        let result = super.validate();
        if (!this.validateSubtype()) {
            result.errors.subtype = ['required'];
            result.messages.subtype = ['This field is required'];
        }
        return result;
    }

    private validateSubtype() {
        if (!this.form_data.issue_type || this.form_data.issue_type.subtypes.length === 0) {
            return true;
        }
        return Boolean(this.form_data.subtype);
    }
}