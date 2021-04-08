import {FormState} from '../FormState';
import {VolunteerExperienceItemData} from '../../contracts/release3/data/VolunteerOpportunitiesDataContracts';
import {VolunteerRequestExperienceFormData} from './VolunteerRequestExperienceFormState';
import {VolunteerRequestWaiversFormData} from './VolunteerRequestWaiversFormState';
import {UserWaiver} from '../../contracts/app/CompetitionRegistrationContracts';

export interface VolunteerRequestFormData {
    experience: VolunteerExperienceItemData[];
    records_consent: boolean;
    skillset: string | null;
    terms_agree: boolean;
    waivers: UserWaiver[];
}

export class VolunteerRequestFormState extends FormState {
    experience: VolunteerExperienceItemData[] = [];
    records_consent: boolean = false;
    skillset: string = '';
    terms_agree: boolean = false;
    waivers: UserWaiver[] = [];

    /**
     * Export the form state
     */
    export(): VolunteerRequestFormData {
        return {
            experience: this.experience,
            records_consent: this.records_consent,
            skillset: this.skillset || null,
            terms_agree: this.terms_agree,
            waivers: this.waivers.slice()
        };
    }

    importExperience(form_data: VolunteerRequestExperienceFormData) {
        this.experience = form_data.experience;
        this.skillset = form_data.skillset || '';
    }

    importWaivers(form_data: VolunteerRequestWaiversFormData) {
        this.records_consent = form_data.records_consent;
        this.terms_agree = form_data.terms_agree;
        this.waivers = form_data.waivers.slice();
    }
}