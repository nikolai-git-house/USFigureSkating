import {CompetitionVolunteerCtaConfiguration} from '../../components/CompetitionVolunteerCTA/CompetitionVolunteerCtaContracts';
import {
    CountryFormOption,
    EmergencyContact,
    FormOption,
    ProvinceFormOption,
    SearchResult,
    StateFormOption
} from '../AppContracts';
import {UserProfile} from './UserContracts';
import {UserWaiver} from './CompetitionRegistrationContracts';
import {DataNavigationLink} from '../../CompetitionPortal/_models';

/**
 * Categorization wrapper for volunteer opportunity events
 */
export interface CategorizedVolunteerOpportunityEvents {
    local: VolunteerOpportunityEvent[];
    usfs: VolunteerOpportunityEvent[];
}

/**
 * Exported data from volunteer opportunities search form
 */
export interface ExportedVolunteerRequestSearchForm {
    state: StateFormOption | null;
    club: FormOption | null;
    event_name: string | null;
    start_date: string | null;
    end_date: string | null;
}

/**
 * App response when fetching volunteer opportunities
 */
export interface FetchVolunteerOpportunitiesResponse {
    opportunities: VolunteerRequestCategorizedOpportunities;
    search_form_options: {
        states: StateFormOption[];
        clubs: FormOption[];
    };
}

/**
 * App response when fetching volunteer opportunity data for a single opportunity
 */
export interface FetchVolunteerRequestDataResponse {
    user_profile_form_options: {
        states: StateFormOption[];
        countries: CountryFormOption[];
        provinces: ProvinceFormOption[];
    };
    user_profile: UserProfile;
    user_emergency_contact: EmergencyContact;
    opportunity_request_form_options: FormOption[];
    links: VolunteerRequestLinks;
    waivers: {
        form_options: {
            relationships: FormOption[];
        };
        user_waivers: UserWaiver[];
        lead: string;
    };
}

/**
 * App Service response when submitting a volunteer request for a competition
 */
export interface SubmitCompetitionVolunteerRequestServiceResponse {
    confirmation_message: string;
    volunteer_cta_configuration: CompetitionVolunteerCtaConfiguration;
    user_navigation?: DataNavigationLink[];
}

/**
 * App response when submitting a volunteer request
 */
export interface SubmitVolunteerRequestSubmissionResponse {
    opportunities: VolunteerRequestCategorizedOpportunities | null;
    redirect_url: string | null;
}

/**
 * State response when completing a volunteer request
 */
export interface VolunteerRequestCompletionResponse {
    redirect_url?: string;
}

/**
 * State response when completing a standalone volunteer request
 */
export interface VolunteerRequestStandaloneCompletionResponse extends VolunteerRequestCompletionResponse {
    message: string;
}

/**
 * Object to configure Volunteer Opportunities State module
 */
export interface VolunteerOpportunitiesStateConfiguration {
    is_standalone?: boolean;

    [key: string]: any;
}

/**
 * A volunteer opportunity item
 */
export interface VolunteerOpportunityEvent extends SearchResult {
    competition_id: number;
    start_date_formatted: string;
    end_date_formatted: string;
    name: string;
    city: string;
    state: string;
    location_name: string | null;
    status: {
        text: string | null;
        type_key: null | 'success' | 'warning' | 'alert';
        is_open: boolean;
    };
    print_schedule_url: string | null;
    shift_selection_url: string | null;
}

/**
 * App response when searching for opportunities
 */
export interface VolunteerOpportunitySearchResponse {
    opportunities: VolunteerOpportunityEvent[];
}

/**
 * Full opportunities categorization structure
 */
export interface VolunteerRequestCategorizedOpportunities {
    upcoming: CategorizedVolunteerOpportunityEvents;
    requested: VolunteerOpportunityEvent[];
}

/**
 * Exported data structure from general information form
 */
export interface VolunteerRequestGeneralInformationFormData {
    country: string;
    street: string;
    street_2: string;
    city: string;
    state: string;
    province: string;
    zip: string;
    email: string;
    cell_phone: string;
    emergency_contact: {
        name: string;
        relationship: string;
        phone: string;
    };
}

/**
 * Links to other resources from within Volunteer Opportunities
 */
export type VolunteerRequestLinks = {
    [key: string]: string;
    criminal_history_check: string;
    terms_and_conditions: string;
};