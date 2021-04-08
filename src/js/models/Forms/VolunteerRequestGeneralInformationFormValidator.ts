import {AddressFormValidator} from '../CreateAccount/AddressFormValidator';
import {VolunteerRequestGeneralInformationFormState} from './VolunteerRequestGeneralInformationFormState';

export class VolunteerRequestGeneralInformationFormValidator extends AddressFormValidator {
    /**
     * VolunteerRequestGeneralInformationFormValidator constructor
     */
    constructor(form_data: VolunteerRequestGeneralInformationFormState) {
        super(form_data);
        this.messages.email = 'Enter a valid email address';
        this.rules.cell_phone = ['required'];
        this.rules.email = ['required', 'email'];
        this.rules.emergency_contact_name = ['required'];
        this.rules.emergency_contact_phone = ['required'];
        this.rules.emergency_contact_relationship = ['required'];
    }
}