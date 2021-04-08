import {FormOption, StateFormOption} from '../../contracts/AppContracts';
import {ExportedVolunteerRequestSearchForm} from '../../contracts/app/VolunteerOpportunitiesContracts';
import {FormState} from '../FormState';

export default class VolunteerRequestSearchFormState extends FormState {
    club: FormOption | null = null;
    end_date: string | null = null;
    event_name: string | null = null;
    start_date: string | null = null;
    state: StateFormOption | null = null;

    /**
     * Reset the form data
     */
    reset() {
        this.club = null;
        this.end_date = null;
        this.event_name = null;
        this.start_date = null;
        this.state = null;
    }

    /**
     * Export the form data
     */
    export(): ExportedVolunteerRequestSearchForm {
        return {
            club: this.club || null,
            end_date: this.end_date || null,
            event_name: this.event_name || null,
            start_date: this.start_date || null,
            state: this.state || null
        };
    }

    /**
     * Import from exported form data
     */
    import(search_criteria: ExportedVolunteerRequestSearchForm): void {
        const {
            club,
            end_date,
            event_name,
            start_date,
            state
        } = search_criteria;
        this.club = club;
        this.end_date = end_date;
        this.event_name = event_name;
        this.start_date = start_date;
        this.state = state;
    }
}