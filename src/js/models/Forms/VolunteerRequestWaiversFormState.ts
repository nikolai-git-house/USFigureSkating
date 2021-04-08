import {FormState} from '../FormState';
import {UserWaiver} from '../../contracts/app/CompetitionRegistrationContracts';

export interface VolunteerRequestWaiversFormData {
    terms_agree: boolean;
    records_consent: boolean;
    waivers: UserWaiver[];
}
export class VolunteerRequestWaiversFormState extends FormState {
    terms_agree: boolean = false;
    records_consent: boolean = false;
    waivers: UserWaiver[] = [];

    /**
     * Export the form state
     */
    export(): VolunteerRequestWaiversFormData {
        return {
            terms_agree: this.terms_agree,
            records_consent: this.records_consent,
            waivers: this.waivers.slice()
        };
    }
}