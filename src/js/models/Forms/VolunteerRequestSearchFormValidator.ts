import {FormValidator, FormValidatorResult} from '../FormValidator';
import {ValidationRule} from '../ValidationRules';

export default class VolunteerRequestSearchFormValidator extends FormValidator {

    protected rules: { [key: string]: ValidationRule[]; } = {
        end_date: ['date_formatted'],
        start_date: ['date_formatted']
    };

    protected messages: { [key: string]: string; } = {
        date_formatted: 'Enter a valid date in the format mm/dd/yyyy'
    };

    /**
     * Run the validator
     */
    validate(): FormValidatorResult {
        const result = super.validate();

        if (!this.validateValuePresent()) {
            this.ensureValidationResultFieldPresence('global', result);
            result.errors.global.push('required');
            result.messages.global.push('Please enter search criteria.');
        }

        return result;
    }

    /**
     * Validate that at least one field has a value present
     */
    private validateValuePresent(): boolean {
        for (const i in this.form_data) {
            if (Object.prototype.hasOwnProperty.call(this.form_data, i)) {
                if (this.form_data[i]) {
                    return true;
                }
            }
        }

        return false;
    }
}