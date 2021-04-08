import {CompetitionVolunteerCtaConfigurationData} from '../../../pages/ViewCompetition/ViewCompetitionDataContracts';
import {
    CategorizedVolunteerOpportunitiesData,
    VolunteerExperienceItemData,
    VolunteerOpportunityData
} from '../data/VolunteerOpportunitiesDataContracts';
import {
    CompletedEmergencyContactData,
    CountryFormOptionData,
    FormOptionData,
    FormOptionDataValue,
    ProvinceFormOptionData,
    StateFormOptionData
} from '../data/CommonDataContracts';
import {APISubmissionResponse} from './CommonAPIContracts';
import {AddressData} from '../../../models/CreateAccount/AddressFormState';
import {EmergencyContactData} from '../../../models/Forms/EmergencyContactFormState';
import {UserProfileData, UserWaiverData, UserWaiverSaveData} from '../data/CompetitionRegistrationDataContracts';
import {DataNavigationLinkData} from '../data';

/**
 * Response when retrieving core data to display Volunteer Opportunities page, including set of opportunity items and
 * search form options
 */
export interface FetchVolunteerOpportunitiesAPIResponse {
    opportunities: CategorizedVolunteerOpportunitiesData;   // The complete set of categorized opportunities to display
    search_form_options: {                                  // Options for the opportunity search form
        states: StateFormOptionData[];                      // State input options
        clubs: FormOptionData[];                            // Club input options
    };
}

/**
 * Response when retrieving information enabling a user to pursue an volunteer request opportunity
 */
export interface FetchVolunteerRequestDataAPIResponse {
    user_profile_form_options: {                            // Options for the user profile edit form
        states: StateFormOptionData[];
        countries: CountryFormOptionData[];
        provinces: ProvinceFormOptionData[];
    };
    user_profile: UserProfileData;                          // User's profile data.
    user_emergency_contact: EmergencyContactData;           // User's emergency contact data
    opportunity_request_form_options: FormOptionData[];     // Experience Options for the opportunity request form
    links: {                                                // Links to external pages from within Volunteer Request
        criminal_history_check: string;                         // Link URL for "criminal history records check" confirmation input link
        terms_and_conditions: string;                           // Link URL for "terms & conditions" confirmation input link
    };
    waivers?: {
        form_options: {
            relationships: FormOptionData[];                      // Form options for "relationship" input
        };
        user_waivers: UserWaiverData[];                           // List of waivers to display, and user's signing data relative to each
        introduction: string;                                     // Introductory text for "Waivers" section of request
    };
}

/**
 * API response when submitting a competition volunteer request
 */
export interface SubmitCompetitionVolunteerRequestAPIResponse extends APISubmissionResponse {
    confirmation_message: string;       // Message to display in the confirmation dialog ("Your request has been approved")
    volunteer_cta_configuration: CompetitionVolunteerCtaConfigurationData;      // The volunteer CTA configuration resulting from the submission
    competition_user_navigation?: DataNavigationLinkData.DataNavigationLink[];   // Updated (complete) user navigation for the competition portal main page resulting from the request.  If navigation does not need to update as a result of the request, do not include this property.
}

/**
 * Payload when submitting a volunteer request
 */
export interface SubmitVolunteerRequestAPIPayload {
    experience: VolunteerExperienceItemData[];          // Array of experience form options checked by the user,
                                                        // along with optional descriptions for each
    volunteer_skillset: string | null;                  // The volunteer skillset entered by the user
    confirmations: {                                    // Confirmation data for terms/consent checkboxes.  Both should
                                                        // always be true within a submission
        terms_and_conditions: boolean;
        criminal_history_consent: boolean;
    };
    waivers: UserWaiverSaveData[];                      // Information related to the user's waivers
}

/**
 * Response when submitting a volunteer request
 * Note: either the `opportunities` or `redirect_url` property must be non-null
 */
export interface SubmitVolunteerRequestAPISubmissionResponse extends APISubmissionResponse {
    opportunities: CategorizedVolunteerOpportunitiesData | null; // If the user is being redirected, this can be null
    redirect_url: string | null; // URL to which the user should be redirected following the submission.  If null, user
                                 // will be shown their requested opportunity in the "Requested Tab" on Volunteer
                                 // Opportunities page.
}

/**
 * Payload for searching for volunteer opportunities
 */
export interface VolunteerOpportunitySearchAPIPayload {
    state: FormOptionDataValue | null;  // The value of the selected FormOption for state
    club: FormOptionDataValue | null;   // The value of the selected FormOption for club
    competition_name: string | null;    // The value entered in the club input
    start_date: string | null;          // The entered start date in MM/DD/YYYY format
    end_date: string | null;            // The entered end date in MM/DD/YYYY format
}

/**
 * Response when searching for volunteer opportunities
 */
export interface VolunteerOpportunitySearchAPIResponse {
    opportunities: VolunteerOpportunityData[]; // List of volunteer opportunities that meet the search criteria
}

/**
 * Payload when updating a user's profile information related to a volunteer opportunity
 */
export interface VolunteerRequestUpdateUserProfileAPIPayload {
    profile: {                                        // The user's profile data
        address: AddressData;                         // Data for user's address
        cell_phone: string;                           // User's cell phone data.  Parsed from primary_phone property of UserProfile
        email: string;                                // User's email data.  Parsed from primary_email property of UserProfile
    };
    emergency_contact: CompletedEmergencyContactData; // The user's emergency contact data
}

/**
 * Response when updating a user's profile
 */
export interface VolunteerRequestUpdateUserProfileAPIResponse extends APISubmissionResponse{}