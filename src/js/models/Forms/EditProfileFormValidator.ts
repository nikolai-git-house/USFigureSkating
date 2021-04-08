import {FormValidator} from "../FormValidator";
import {ValidationRule} from "../ValidationRules";
import {EditProfileFormState} from "./EditProfileFormState";

export class EditProfileFormValidator extends FormValidator {
    protected rules: { [key: string]: ValidationRule[] } = {
        first_name: ["required"],
        last_name: ["required"],
        birth_date: ['required', 'date_formatted', 'date_not_future'],
        primary_email: ["nullable_email"],
        secondary_email: ["nullable_email"],
    };

    protected messages: { [key: string]: string } = {
        required: "This field is required",
        nullable_email: "Enter a valid email address",
        date_formatted: "Enter a valid date in the format mm/dd/yyyy",
        date_not_future: "Enter a date that's not in the future",
    };

    constructor(form_data: EditProfileFormState) {
        super(form_data);
    }
}