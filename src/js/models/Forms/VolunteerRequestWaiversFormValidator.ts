import {FormValidator, FormValidatorResult} from '../FormValidator';
import {ValidationRule} from '../ValidationRules';

export class VolunteerRequestWaiversFormValidator extends FormValidator {
    protected rules: { [key: string]: ValidationRule[]; } = {
        terms_agree: ['confirmed'],
        records_consent: ['confirmed']
    };

    protected messages: { [key: string]: string; } = {
        confirmed: 'This field is required'
    };

    /**
     * Validate the form
     *
     * Additional checks that at least one experience item has been selected
     */
    validate(): FormValidatorResult {
        const result = super.validate();
        if (!this.waiversComplete()) {
            this.ensureValidationResultFieldPresence('waivers', result);
            result.errors.waivers.push('complete');
            result.messages.waivers.push('All waivers must be completed.');
        }

        return result;
    }

    /**
     * Whether all waivers are complete
     */
    private waiversComplete() {
        for (let i = 0; i < this.form_data.waivers.length; i++) {
            const waiver = this.form_data.waivers[i];
            if (!waiver.status.name || !waiver.status.relationship) {
                return false;
            }
        }

        return true;
    }
}