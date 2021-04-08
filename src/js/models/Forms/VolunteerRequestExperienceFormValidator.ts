import {FormValidator, FormValidatorResult} from '../FormValidator';
import {ValidationRule} from '../ValidationRules';

export class VolunteerRequestExperienceFormValidator extends FormValidator {
    protected rules: { [key: string]: ValidationRule[]; } = {
    };

    protected messages: { [key: string]: string; } = {
    };

    /**
     * Validate the form
     *
     * Additional checks that at least one experience item has been selected
     */
    validate(): FormValidatorResult {
        const result = super.validate();

        if (!this.experienceItemChecked()) {
            this.ensureValidationResultFieldPresence('experience', result);
            result.errors.experience.push('required');
            result.messages.experience.push('Select at least one option.');
        }

        return result;
    }

    /**
     * Validate that at least 1 experience item has been checked
     */
    private experienceItemChecked() {
        return Object.keys(this.form_data.experience).length;
    }
}