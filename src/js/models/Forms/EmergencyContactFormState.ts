import {FormState} from '../FormState';

/**
 * Exported EmergencyContactFormState data.
 */
export interface EmergencyContactData {
    name: string; // The name of the emergency contact
    relationship: string; // The relationship to the user of the emergency contact
    phone: string; // The phone number of the emergency contact
}

/**
 * Class to track state of Emergency Contact Form data
 */
export class EmergencyContactFormState extends FormState {
    name: string | null = null;
    relationship: string | null = null;
    phone: string | null = null;

    /**
     * Export the form data state.
     */
    export(): EmergencyContactData {
        return {
            name: this.name ? this.name : '',
            relationship: this.relationship ? this.relationship : '',
            phone: this.phone ? this.phone : ''
        };
    }
}