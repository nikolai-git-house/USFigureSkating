import {FormValidator} from "../FormValidator";
import {EmergencyContactFormState} from "../Forms/EmergencyContactFormState";

/**
 * Validator to be used with Emergency Contact Forms
 * @note: Currently no validation in place.  Model created to maintain dependency conventions
 */
export class EmergencyContactFormValidator extends FormValidator {

    constructor(form_data: EmergencyContactFormState) {
        super(form_data);
    }
}
