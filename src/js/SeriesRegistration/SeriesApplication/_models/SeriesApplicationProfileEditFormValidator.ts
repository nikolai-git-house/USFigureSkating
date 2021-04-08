import {FormValidator} from '../../../models/FormValidator';
import {ValidationRule} from '../../../models/ValidationRules';

export class SeriesApplicationProfileEditFormValidator extends FormValidator {

    protected rules: { [p: string]: ValidationRule[]; } = {
        email: ['required', 'email']
    };

    protected messages: { [key: string]: string | Function; } = {
        required: 'This field is required',
        email: 'Enter a valid email address'
    };
}