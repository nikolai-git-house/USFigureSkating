import {FormValidator} from "../FormValidator";
import {ValidationRule} from "../ValidationRules";
import SkateTestDisciplineFormState from "./SkateTestDisciplineFormState";
import {SKIP_VALIDATION} from "../../config/AppConfig";

/**
 * Validator to be used with Skate Test Discipline Forms
 */
export class SkateTestDisciplineFormValidator extends FormValidator {

    protected rules: { [key: string]: ValidationRule[] } = {
        test: ['required'],
        club: ['required'],
        date: ['required', 'date_formatted', 'date_not_future']
    };
    protected messages: { [key: string]: string } = {
        required: "This field is required",
        date_formatted: "Enter a valid date in the format mm/dd/yyyy",
        date_not_future: "Enter a date that's not in the future",
    };


    constructor(form_data: SkateTestDisciplineFormState) {
        super(form_data);
        if (SKIP_VALIDATION) {
            this.rules = {};
        }
    }
}