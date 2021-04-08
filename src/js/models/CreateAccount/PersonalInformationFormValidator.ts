import {FormValidator} from "../FormValidator";
import {ValidationRule} from "../ValidationRules";
import {PersonalInformationFormState} from "./PersonalInformationFormState";
import {SKIP_VALIDATION} from "../../config/AppConfig";

/**
 * Validator to be used with Personal Information Forms
 */
export class PersonalInformationFormValidator extends FormValidator {

    protected rules: { [key: string]: ValidationRule[] } = {
        first_name: ['required'],
        last_name: ['required'],
        date_of_birth: ['required', 'date_formatted', 'date_not_future'],
        gender: ['required'],
        phone: ['required'],
        email: ['required', 'email'],
        captcha_value: ['required']
    };
    protected messages: { [key: string]: string } = {
        required: "This field is required",
        email: "Enter a valid email address",
        date_formatted: "Enter a valid date in the format mm/dd/yyyy",
        date_not_future: "Enter a date that's not in the future",
    };

    constructor(form_data: PersonalInformationFormState) {
        super(form_data);
        if (SKIP_VALIDATION) {
            this.rules = {};
        }
    }
}
