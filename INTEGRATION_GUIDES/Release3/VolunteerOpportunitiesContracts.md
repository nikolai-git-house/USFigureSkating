# API Contracts

## FetchVolunteerOpportunitiesAPIResponse

```
/**
 * Response when retrieving core data to display Volunteer Opportunities page, including set of opportunity items and
 * search form options
 */
export interface FetchVolunteerOpportunitiesAPIResponse {
    opportunities: CategorizedVolunteerOpportunitiesData; // The complete set of categorized opportunities to display
    search_form_options: {
        // Options for the opportunity search form
        states: StateFormOptionData; // State input options
        clubs: FormOptionData; // Club input options
    };
}
```

## FetchVolunteerRequestDataAPIResponse

If desired, user_emergency_contact and user_profile can be merged into a single object.

```
/**
 * Response when retrieving information enabling a user to pursue an volunteer request opportunity
 */
export interface FetchVolunteerRequestDataAPIResponse {
    user_profile_form_options: {
        // Options for the user profile edit form
        states: StateFormOptionData[];
        countries: CountryFormOptionData[];
        provinces: ProvinceFormOptionData[];
    };
    user_profile: UserProfileData; // User's profile data.  @todo: This current structure contains a lot of unused properties for this component.  Should it be reused, or should a similar buts smaller structure be used?
    user_emergency_contact: EmergencyContactData; // User's emergency contact data @todo: should this be merged with user profile?
    opportunity_request_form_options: VolunteerExperienceFormOptionData[]; // Experience Options for the opportunity request form
    links: {                                                // Links to external pages from within Volunteer Request
        criminal_history_check: string;                         // Link URL for "criminal history records check" confirmation input link
        terms_and_conditions: string;                           // Link URL for "terms & conditions" confirmation input link
    }
}
```

## VolunteerOpportunitySearchAPIPayload

```
/**
 * Payload for searching for volunteer opportunities
 */
export interface VolunteerOpportunitySearchAPIPayload {
    state: FormOptionDataValue | null; // The value of the selected FormOption for state
    club: FormOptionDataValue | null; // The value of the selected FormOption for club
    competition_name: string | null; // The value entered in the club input
    start_date: string | null; // The entered start date in MM/DD/YYYY format
    end_date: string | null; // The entered end date in MM/DD/YYYY format
}
```

## VolunteerOpportunitySearchAPIResponse

```
/**
 * Response when searching for volunteer opportunities
 */
export interface VolunteerOpportunitySearchAPIResponse {
    opportunities: VolunteerOpportunityData[]; // List of volunteer opportunities that meet the search criteria
}
```

## VolunteerRequestUpdateUserProfileAPIPayload

```
/**
 * Payload when updating a user's profile information related to a volunteer opportunity
 */
export interface VolunteerRequestUpdateUserProfileAPIPayload {
    profile: {
        // The user's profile data
        first_name: string; // User's first name
        last_name: string; // User's last name
        address: AddressData; // Data for user's address
        cell_phone: string; // User's cell phone data.  Parsed from primary_phone property of UserProfile
        email: string; // User's email data.  Parsed from primary_email property of UserProfile
    };
    emergency_contact: CompletedEmergencyContactData; // The user's emergency contact data
}
```

## APISubmissionResponse

```
/**
 * Represents a generic API response to a data submission
 */
export interface APISubmissionResponse {
    success: boolean;  // Whether the submission was successful
    error: string;     // Error message if the submission is unsuccessful
}
```

## SubmitVolunteerRequestAPIPayload

```
/**
 * Payload when submitting a volunteer request
 */
export interface SubmitVolunteerRequestAPIPayload {
    experience: VolunteerExperienceItemData[]; // Array of experience form options checked by the user, along with optional descriptions for each
    volunteer_skillset: string | null; // The volunteer skillset entered by the user
    confirmations: {
        // Confirmation data for terms/consent checkboxes
        terms_and_conditions: true;
        criminal_history_consent: true;
    };
}
```

## SubmitVolunteerRequestAPISubmissionResponse

```
/**
 * Response when submitting a volunteer request
 */
export interface SubmitVolunteerRequestAPISubmissionResponse extends APISubmissionResponse {
    opportunities: CategorizedVolunteerOpportunitiesData | null; // If the user is being redirected, this information is not needed
    redirect_url: string | null; // URL to which the user should be redirected following the submission.  If null, user will be shown "Requested Tab" on Volunteer Opportunities page
}
```

# Supporting Contracts

## CategorizedVolunteerOpportunitiesData

```
/**
 * Represents Volunteer Opportunities categorized by display location
 * Each categorization features Opportunities in the desired presentation order
 */
export interface CategorizedVolunteerOpportunitiesData {
    // Lists of opportunities
    upcoming: {
        // Opportunities to show in "Upcoming" tab
        local: VolunteerOpportunityData[]; // Opportunities to show under "Local" heading in "Upcoming" tab
        usfs: VolunteerOpportunityData[]; // Opportunities to show under "U.S. Figure Skating" heading in "Upcoming" tab
    };
    requested: VolunteerOpportunityData[]; // Opportunities to show in "Requested" tab
}
```

## VolunteerOpportunityData

```
/**
 * Represents a Volunteer Opportunity item (event/competition)
 */
export interface VolunteerOpportunityData {
    competition_id: number; // Unique identifier for the volunteer opportunity
    start_date_formatted: string; // Formatted start date for the opportunity
    end_date_formatted: string; // Formatted start date for the opportunity
    name: string; // Name for the opportunity
    city: string; // Location for the opportunity
    state: string; // State abbreviation for the opportunity
    location_name: string | null; // Name of the location for the opportunity
    status: {
        text: string; // Status text for the active user relative to the opportunity
        type_key: 'success' | 'alert'; // Type of alert message - controls the color of the alert (success=green, alert=red)
        is_open: boolean; // Whether the active user can begin a request for the opportunity
    };
    print_schedule_url: string | null; // URL allowing user to print the schedule for the opportunity.  Null if schedule printing is currently unavailable
    shift_selection_url: string | null; // URL allowing user to access shift selection for the opportunity.  Null if shift selection is unavailable
}

```

## FormOptionData

```
/**
 * Represents data for an option for use within a form
 */
export interface FormOptionData {
    label: string;                     // Value that displays to the user
    value: FormOptionDataValue;       // (primitive value) Value for the form option used for data tracking purposes
}
```

## StateFormOptionData

```
/**
 * Represents data for a form option for state selection
 */
export interface StateFormOptionData extends FormOptionData {
}
```

## CountryFormOptionData

```
/**
 * Represents data for a form option for country selection
 */
export interface CountryFormOptionData extends FormOptionData {
    is_usa: boolean;       // Whether the country is the United States.  Used within downstream app logic
    is_canada: boolean;    // Whether the country is Canada.  Used within downstream app logic
}
```

## ProvinceFormOptionData

```
/**
 * Represents data for a form option for province selection
 */
export interface ProvinceFormOptionData extends FormOptionData {
}
```

## UserProfileData

This data structure was established in a previous release and features properties unused in Volunteer Opportunities.  
If desired, a new data structure can be created to only feature necessary properties for this component.
Properties marked with an asterisk (\*) are required for Volunteer Opportunities.

primary_phone and primary_email are used to pre-populate the form fields "Cell Phone" and "Email" respectively.

```
/**
 * Data representing a user's profile
 */
export interface UserProfileData {
    * first_name: string;
    * last_name: string;
    * full_name: string;                                              // The user's combined full name
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
    * gender: "male" | "female";                                      // The user's gender
    * birth_date: {                                                   // The user's birthdate...
       * formatted: string;                                          //      ...as a formatted string ("6/28/1979")
        timestamp: number;                                          //      ...as a unix timestamp
    };
    * primary_email: EmailRecordData | null;                          //  The user's primary email data
    * secondary_email: EmailRecordData | null;                        //  The user's secondary email data
    * primary_phone: PhoneRecordData | null;                          //  The user's primary phone data
    lts_programs: UserLTSInformationData | null;                    //  Information about the user's LTS Programs, if applicable
    * address: {
      *  street: string;
      *  street_2: string | null;
      *  city: string;
      *  state: StateFormOptionData | null;                          //  The full FormOptionData for the user's state, if applicable/available
      *  country: CountryFormOptionData | null;                      //  The full FormOptionData for the user's country, if available
      *  province: ProvinceFormOptionData | null;                    //  The full FormOptionData for the user's province, if available/applicable
      *  zip_code: number | string | null;
    };
}
```

## EmergencyContactData

```
/**
 * Represents an emergency contact
 */
export interface EmergencyContactData {
    name: string; // The name of the emergency contact
    relationship: string; // The relationship to the user of the emergency contact
    phone: string; // The phone number of the emergency contact
}
```

## CompletedEmergencyContactData

Same as EmergencyContactData, but no properties will feature empty strings

## VolunteerExperienceFormOptionData

Form option that includes configurable placeholder text for additional information input.
If additional input placeholder text is static across all options, placeholder_text property can be removed

```
/**
 * Represents data for a form option for experience delineation on Volunteer Opportunities request form
 */
export interface VolunteerExperienceFormOptionData extends FormOptionData {
    placeholder_text: string | null; //@todo: is this needed? Placeholder text for additional information form input
}
```

## VolunteerExperienceItemData

```
/**
 * Represents a single selected experience item from the Volunteer Opportunity Experience form.
 * Includes the value of the selected checkbox, along with an optional description
 */
export interface VolunteerExperienceItemData {
    value: FormOptionDataValue; // The value of the selected VolunteerExperienceFormOptionData
    description: string | null; // The additional experience description entered by the user
}
```
