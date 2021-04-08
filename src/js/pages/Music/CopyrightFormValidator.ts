import {FormValidator, FormValidatorResult} from "../../models/FormValidator";
import {CopyrightFormData} from "../../contracts/app/MusicContracts";
import {MaxValidationRule, ValidationRule} from "../../models/ValidationRules";

export class CopyrightFormValidator extends FormValidator {
    protected rules: { [key: string]: ValidationRule[] } = {
        duration_minutes: ['integer'],
        duration_seconds: ['integer', new MaxValidationRule(59)],
    };
    protected messages: { [key: string]: string | Function } = {
        integer: "Enter a number.",
        max: function (max_value: number) {
            return "Enter a maximum of " + max_value + ".";
        }
    };

    constructor(form_data: CopyrightFormData) {
        super(form_data);
    }

    validate(): FormValidatorResult {
        let result = super.validate();
        if (!this.validateFormNotNull()) {
            result.errors.global = ['form_empty'];
            result.messages.global = ['Fill out at least one field.']
        }
        return result;
    }

    /**
     * Validate that the form has at least one value entered
     */
    private validateFormNotNull() {
        for (let i in this.form_data) {
            let datum = this.form_data[i];
            if (datum) {
                return true;
            }
        }
        return false;
    }
}