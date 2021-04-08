import {FormValidator, FormValidatorResult} from "../FormValidator";
import {ValidationRule} from "../ValidationRules";
import {FederationInfoFormState} from "./FederationInfoFormState";

/**
 * Validator to be used with Federation Info Forms
 */
export class FederationInfoFormValidator extends FormValidator {

    protected rules: { [key: string]: ValidationRule[] } = {
        federation: ["required"]
    };

    constructor(form_data: FederationInfoFormState) {
        super(form_data);
    }

    /**
     * Override base validation to provide combined message for user type checkgroup
     */
    validate(): FormValidatorResult {
        let result = super.validate();
        if (!this.validateUserType()) {
            this.ensureValidationResultFieldPresence('user_type', result);
            result.errors.user_type.push('required');
            result.messages.user_type.push('Select at least one of the above');
        }
        return result;
    }

    /**
     * Validate user type checkgroup field
     */
    private validateUserType() {
        return this.validateRule('required', this.form_data.user_type);
    }
}