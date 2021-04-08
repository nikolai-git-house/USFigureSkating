import {FormOptionDataValue} from './CommonDataContracts';

/**
 * Represents Volunteer Opportunities categorized by display location
 * Each categorization features Opportunities in the desired presentation order
 */
export interface CategorizedVolunteerOpportunitiesData {
    // Lists of opportunities
    upcoming: {                                 // Opportunities to show in "Upcoming" tab
        local: VolunteerOpportunityData[];      // Opportunities to show under "Local" heading in "Upcoming" tab
        usfs: VolunteerOpportunityData[];       // Opportunities to show under "U.S. Figure Skating" heading in "Upcoming" tab
    };
    requested: VolunteerOpportunityData[];      // Opportunities to show in "Requested" tab
}

/**
 * Represents a single selected experience item from the Volunteer Opportunity Experience form.
 * Includes the value of the selected checkbox, along with an optional description
 */
export interface VolunteerExperienceItemData {
    value: FormOptionDataValue;                 // The value of the selected VolunteerExperienceFormOptionData
    description: string | null;                 // The additional experience description entered by the user
}

/**
 * Represents a Volunteer Opportunity item (event/competition)
 */
export interface VolunteerOpportunityData {
    competition_id: number;                              // Unique identifier for the volunteer opportunity
    start_date_formatted: string;                        // Formatted start date for the opportunity
    end_date_formatted: string;                          // Formatted start date for the opportunity
    name: string;                                        // Name for the opportunity
    city: string;                                        // Location for the opportunity
    state: string;                                       // State abbreviation for the opportunity
    location_name: string | null;                        // Name of the location for the opportunity
    status: {
        text: string | null;                             // Status message to display to the user. When null, no status message displays
        type_key: null | 'success' | 'warning'| 'alert'; // Controls the color of the status message
                                                         // (success=green, warning=orange, alert=red)
                                                         // If null, and `text` is present, defaults to 'alert"
        is_open: boolean;                                // If true, "Request" button displays, allowing the user to submit a request
                                                         // Should be false when shift selection is available
    };
    print_schedule_url: string | null;                   // URL allowing user to print the schedule for the opportunity
                                                         // When not null, "print schedule" button displays
    shift_selection_url: string | null;                  // URL allowing user to access shift selection for the opportunity
                                                         // When not null, "Select Shifts" button displays
}