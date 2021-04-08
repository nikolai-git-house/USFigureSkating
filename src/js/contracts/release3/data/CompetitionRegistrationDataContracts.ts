/* eslint-disable */
import {FormOptionValue} from "../../AppContracts";
import {
    AssignableMemberData,
    CountryFormOptionData,
    FormOptionData,
    FormOptionDataValue,
    ProvinceFormOptionData,
    StateFormOptionData
} from "./CommonDataContracts";
/* ===========================================================================================================
*                                              Profile
* ===========================================================================================================*/
/**
 * Information about a user's eligibilty
 */
type UserEligibilityData = {
    description: string;                    // Description of the user's eligibility, "Eligible Member"
    status_description: string;             // Description of the user's statue, "Active"
};

/**
 * Information about a user's home club
 */
export type UserClubInformationData = {
    name: string;                               // The name of the user's home club
    membership_validity_formatted?: string;     // [Optional] A description of the user's validity in relation to the club ("Valid Through: 6/30/2019")
}

/**
 * Information related to a user's email
 */
type EmailRecordData = {
    value: string;          // The user's email address
    opt_out: boolean;       // Whether the user has opted out
    publish: boolean;       // Whether the user has opted in to publish in the directory
}

/**
 * Information related to a user's phone
 */
type PhoneRecordData = {
    value: string;                      //  The user's phone number
    carrier: FormOptionData | null;     //  The full FormOptionData for the mobile carrier, if data was entered
}

/**
 * Information about a user's LTS Programs and information
 */
interface UserLTSInformationData  {
    summary: UserLTSInformationSummaryData  // A summary of the user's affiliations
    programs: FormOptionData[];             // Array of FormOptions representing the Programs the user is affiliated with.
                                            // Used in "Select Representation" takeover during competition registration
}

export interface UserLTSInformationSummaryData  {
    description: string;                    // Text summary of the user's affiliations ("Multiple Programs Exist")
    validity_date_formatted?: string;       // [Optional] Text representation of validity range ("Valid through 6/30/2019")
}

/**
 * Data representing a user's profile
 */
export interface UserProfileData {
    first_name: string;
    last_name: string;
    full_name: string;                                              // The user's combined full name
    middle_name: string | null;
    pronunciation_firstname: string | null;
    pronunciation_lastname: string | null;
    is_us_citizen: boolean;
    eligibility: UserEligibilityData;                               // Information about the user's eligibility
    prefix: FormOptionData | null;                                  // The full FormOptionData for the user's selected prefix, if data present
    suffix: FormOptionData | null;                                  // The full FormOptionData for the user's selected suffix, if data present
    member_number: string;                                          // The user's member number
    home_club: UserClubInformationData | null;                      // Information about the user's home club, if applicable
    region_name: string;                                            // The name of the user's region
    section_name: string;                                           // The name of the user's section
    gender: "male" | "female";                                      // The user's gender
    birth_date: {                                                   // The user's birthdate...
        formatted: string;                                          //      ...as a formatted string ("6/28/1979")
        timestamp: number;                                          //      ...as a unix timestamp
    };
    primary_email: EmailRecordData | null;                          //  The user's primary email data
    secondary_email: EmailRecordData | null;                        //  The user's secondary email data
    primary_phone: PhoneRecordData | null;                          //  The user's primary phone data
    lts_programs: UserLTSInformationData | null;                    //  Information about the user's LTS Programs, if applicable
    address: {
        street: string;
        street_2: string | null;
        city: string;
        state: StateFormOptionData | null;                          //  The full FormOptionData for the user's state, if applicable/available
        country: CountryFormOptionData | null;                      //  The full FormOptionData for the user's country, if available
        province: ProvinceFormOptionData | null;                    //  The full FormOptionData for the user's province, if available/applicable
        zip_code: number | string | null;
    };
}

/**
 * The data structure submitted when a user edits their profile
 */
export interface EditUserProfileFormData {
    prefix: FormOptionValue | null;                    // [optional] The value of the selected "prefix" FormOption
    first_name: string;                                // The entered first name value
    pronunciation_firstname: string | null;            // [optional] The entered first name pronunciation value
    middle_name: string | null;                        // [optional] The entered middle name value
    last_name: string;                                 // The entered last name value
    pronunciation_lastname: string | null;             // [optional] The entered last name pronunciation value
    suffix: FormOptionValue | null;                    // [optional] The value of the selected "suffix" FormOption
    birth_date: string;                                // The entered birth date ("MM/DD/YYYY")
    primary_email: string | null;                      // [optional] The entered primary email value
    publish_primary_email: boolean;                    // The entered publish primary email value
    opt_out_primary_email: boolean;                    // The entered opt out primary email value
    secondary_email: string | null;                    // [optional] The entered secondary email value
    publish_secondary_email: boolean;                  // The entered publish secondary email value
    opt_out_secondary_email: boolean;                  // The entered opt out secondary email value
    primary_phone: string | null;                      // [optional] The entered primary phone value
    primary_phone_carrier: FormOptionValue | null;     // [optional] The value of the selected "primary phone carrier" FormOption
}


/* ===========================================================================================================
*                                              Waivers
* ===========================================================================================================*/
/**
 * Data submitted when signing a waiver
 */
export interface UserWaiverSaveData {
    id: number;                                     //  The ID of the waiver being saved
    name: string;                                   //  The name entered by the user on the waiver form
    relationship: FormOptionDataValue;              //  The value of the relationship FormOption selected by the user
}

/**
 * Represents a waiver that can be signed by the active user, as well as the active user's status information relative to the waiver
 */
export interface UserWaiverData {
    id: number;                                 //  Identifier for the waiver
    name: string;                               //  Name of the waiver
    file_url: string;                           //  URL for the waiver download file
    status: {                                   //  The active user's relationship to the waiver...
        name: string | null;                    //      ...The name signed to the waiver
        relationship: FormOptionValue | null;   //      ...The value from the selected FormOption for relationship
    };
}


/* ===========================================================================================================
*                                              Competitions
* ===========================================================================================================*/
/**
 * Represents core data for a competition registration competition
 * Data extended by various implementations of registration competitions
 */
export interface CompetitionRegistrationCompetitionCoreData {
    id: number;                             // Unique ID for the competition
    icon: string;                           // url for competition icon
    name: string;                           // Competition name
    city: string;                           // City for the competition
    state: string;                          // State for the competition
    club: string;                           // Host club
    start_date_ts: number;                  // unix timestamp representing 12:00:00am UTC on the start date.  Used in competition list search
                                            //      For example, if the intended start date is 6/1 ET,
                                            //      the returned timestamp will need 4 hours subtracted to account
                                            //      for the difference between ET and UTC
    end_date_ts: number;                    // unix timestamp representing 12:00:00am UTC on the end date.  Used in competition list search
                                            //      For example, if the intended end date is 6/3 in ET, the returned
                                            //      timestamp will need 4 hours subtracted to account for the difference
                                            //      between ET and UTC
    registration_links: {                   // Links to various competition registration pages for the competition
        overview: string;                   // URL for "Registration Overview" page
        profile: string;                    // URL for "My Profile" page
        skate_test: string;                 // URL for "My Skate Tests" page
        partner_events: string;             // URL for "Partner Events" page
        partner_identification: string;     // URL for "My Partners" page
        event_selection: string;            // URL for "Event Selection" page
        coach_information: string;          // URL for "My coaches" page
        waivers: string;                    // URL for "Waivers" page
        cart: string;                       // URL for Cart Review page
    };
    has_partner_events: boolean;            // Whether the competition is configured to support partner events
}
/* eslint-enable */
/**
 * Represents data required to power a competition registration CTA
 */
export interface CompetitionRegistrationCtaConfigurationData {
    action_blocked_message?: string;                                            // Message to display in place of action button. If provided, no action button will display
    competition_registration_status: 'open' | 'late' | 'future' | 'closed';     // The competition's registration window status
    has_registration_deadline_warning: boolean;                                 // Whether the competition's registration deadline should be highlighted in red
    registration_deadline: string;                                              // string to display as the registration deadline
    user_registration_link: string;                                             // the link the active user should be directed to when selecting a competition
    user_registration_status: 'registered' | 'in_progress' | 'new';             // the active user's status relative to registering for the competition
}
/* eslint-disable */
/**
 * Represents a competition for the competition registration index list
 */
export interface CompetitionRegistrationListCompetitionData extends CompetitionRegistrationCompetitionCoreData, CompetitionRegistrationCtaConfigurationData {
    is_qualifying: boolean;                                         // Whether the competition is a qualifying competition
    series: { name: string; }[] | null;                             // series data, or null if not part of a series
}

/**
 * Represents information about the active registration competition
 */
export interface CompetitionRegistrationActiveCompetitionData {
    competition: CompetitionRegistrationCompetitionCoreData;    // The core data for the competition
    information: {                                              // Additional information about the competition
        overview: string[];                                     // Info to display in the "Registration Information" tray on the overview page. Each string item in the array displays as a bullet point
    };
    available_partner_events: FormOptionData[];                 // FormOptions for available partner event disciplines.  Used on "Partner Events" page
}

/**
 * Represents data for a single row in the registration overview pricing table
 */
export interface CompetitionPriceRowData {
    [key: string]: string | number | null;

    category: string;                   // The name of the discipline/category
    first_price: number | null;         // First price amount
    second_price: number | null;        // Second price amount
    third_price: number | null;         // Third price amount
    combined_price: number | null;      // Combined price amount
}

/**
 * Represents full registration pricing information for a competition
 */
export interface CompetitionPricesData {
    six_point_zero: CompetitionPriceRowData[];      // The price rows for 6.0
    ijs: CompetitionPriceRowData[];                 // The price rows for IJS
}


/* ===========================================================================================================
*                                              Partner Identification
* ===========================================================================================================*/
/**
 * Represents information about a member selected as a user's partner for a category of events in Competition Registration
 *
 * Currently no properties beyond base interface
 */
interface CategorySkatingPartnerData extends AssignableMemberData {
}

/**
 * Represents information about a category of skating events for a user in Competition Registration,
 * and the member currently set as the user's partner for that category for the competition
 */
export interface PartnerIdentificationCategoryData {
    id: number;                                     // Identifier for the category
    name: string;                                   // Name of the category
    partner: CategorySkatingPartnerData | null;     // Information about the currently assigned partner
}


/* ===========================================================================================================
*                                              Event selection
* ===========================================================================================================*/
/**
 * Represents information about an available event for selection during Competition Registration "Event Selection"
 */
export interface EventSelectionEventData {
    id: number;                     // Unique identifier for the event
    name: string;                   // Name of the event
    is_registered_for: boolean;     // Whether the active user is registered for the event
    is_selected: boolean;           // Whether the active user has selected the event, but does not yet have a paid registration
    judging_system: "IJS" | "6.0";  // Judging system for the event
    category: string;               // Name of the category to which the event belongs.  Used to populate the event type search input and filter events based on its value
                                    // Category names are not restricted, but should remain consistent across each instance of EventSelectionEventData
}

/**
 * Represents a brief summary of a selected partner's relationship to a selected event and whether the partner meets
 * requirements to participate in the event
 */
export interface PartnerSkateTestSummaryData {
    event: {                                        // Information about the event
        name: string;                               // Name of the event
        id: number;                                 // Identifier for the event
        requirements: {                             // Participation requirements for the event
            minimum_skate_tests: string[] | null;   // List of minimum skate test requirements for the event
            maximum_skate_tests: string[] | null;   // List of maximum skate test requirements for the event
            minimum_age: number | null;             // Minimum age requirement for the event
            maximum_age: number | null;             // Maximum age requirement for the event
        };
    };
    partner: {                                      // Information about the partner selected for the event
        name: string;                               // Name of the partner
        id: number;                                 // Partner identifier
        meets_requirements: boolean;                // Whether the partner meets requirements for the event
    };
}

/**
 * Represents a user's Representation selection from "Select Representation"
 */
export interface RepresentationSelectionData {
    representation_type: "lts_program" | "home_club";       // Whether the user has chosen to represent their home club or an LTS program
    lts_program: FormOptionDataValue | null;                // The FormOptionValue of the LTS Program selected by the user, if they chose to represent an LTS program
}