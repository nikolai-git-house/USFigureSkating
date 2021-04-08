/**
 * Represents a competition used in Competition Management screens
 */
export interface CompetitionManagementCompetitionData extends CompetitionManagementCompetitionCoreData {
    announcement_url?: string;                                       // [OPTIONAL] URL for the Competition Announcement
    check_in_report_url: string;                                     // URL for Check-In Report
    compliance_report_link: string;                                  // Link to compliance report for competition
    directions?: {                                                   // [OPTIONAL] Array of Directions information for the competition.
        location_name: string;                                       // The name of the location
        link: string;                                                // Directions link URL
    }[];
    index_links: CompetitionManagementCompetitionIndexLinkData[];    // Links to show on the competition management index page
    team_roster_can_be_edited: boolean;                              // Whether the team roster can be edited in Check-In
    website_url?: string;                                            // [OPTIONAL] URL for the Competition Website
}

/**
 * Shared core for competition management competition data structures
 */
interface CompetitionManagementCompetitionCoreData {
    end_date_pretty: string;            // String representation of end date
    icon: string;                       // URL string linking to the Competition icon image
    id: number;                         // Unique identifier for the Competition
    location: {                         // Location information for the Competition
        city: string;                   // City competition is located in
        state: string;                  // State abbreviation for state Competition is located in
    };
    manage_link: string;                // Link to Competition Management Competition Index page for competition
    name: string;                       // The name of the Competition
    start_date_pretty: string;          // String representation of start date
}

/**
 * A key to load a competition management component without triggering a page refresh
 */
type CompetitionManagementComponentKeyData =
    'competition-information'
    | 'compliance'
    | 'competition-contacts'
    | 'check-in';

/**
 * Represents a link to display on the Competition Management Competition Index Page
 */
interface CompetitionManagementCompetitionIndexLinkData {
    component_link?: CompetitionManagementComponentKeyData;         // [Optional] Component key to open, if appropriate
    is_external?: boolean;                                          // [Optional] Whether the external icon should show with the link
    is_new_tab?: boolean;                                           // [Optional] Whether the link should open in a new browser tab
    label: string;                                                  // Label for the link
    url: string;                                                    // URL for the link
}

/**
 * Represents data for a competition on the competition management index page
 */
export interface CompetitionManagementIndexCompetitionData extends CompetitionManagementCompetitionCoreData {}

/**
 * Represents a key to indicate status state for a display item
 */
type InformationStatusKeyData =
    'default'       // Display the information with a default state
    | 'success'     // Display the information with a success (green) state
    | 'warning'     // Display the information with a warning (orange) state
    | 'error';      // Display the information with an error (red) state

/**
 * Represents a display datetime with an associated name/label
 */
interface CompetitionManagementNamedDateTimeData {
    date_time_formatted: string;         // The formatted datetime of the date
    name: string;                        // The name of the date
}

/**
 * Represents a display datetime with an associated name/label
 */
interface CompetitionManagementNamedDateTimeWithOptionalCostData {
    date_time_formatted: string;         // The formatted datetime of the date
    name: string;                        // The name of the date
    cost?: {                             // Associated cost/discount information
        label: string;                      // Name of the associated cost/discount
        value: number;                      // Dollar value of the associated cost/discount
    };
}

/**
 * Represents information about a deadline in a competition.
 *
 * ex: Music/PPC/Roster deadline
 */
interface CompetitionManagementCompetitionInformationDeadlinesData extends CompetitionManagementNamedDateTimeData {
    date_time_formatted: string;         // The formatted datetime of the deadline
    late_fee: string | null;             // The late fee associated with the deadline.  Null if no late fee should show
    name: string;                        // The name of the deadline
    relative_deadline: string;           // The relative time of the deadline (ie: "12 hours")
    show_in_summary: boolean;            // Whether to show the deadline in the accordion trigger on the
                                         // Competition Information page.  Given current designs,
                                         // should always be true.  However, this allows inclusion of
                                         // future additional deadlines that shouldn't show in the accordion trigger
    status: InformationStatusKeyData;    // Controls the display status color of the deadline
}

/**
 * Represents a datetime window
 */
interface CompetitionManagementCompetitionInformationWindowData {
    begin_date_time_formatted: string;     // The formatted start datetime of the window
    end_date_time_formatted: string;       // The formatted end datetime of the window
    name: string;                          // The name of the window
}

/**
 * Represents practice ice information for a competition
 */
type CompetitionManagementCompetitionInformationPracticeIceData = {
    status: {                                // The current status relative to the competition
        description: string;                 // Text description of the status ("Upcoming - Open Sales")
        status: InformationStatusKeyData;    // The display color for the status ("default" status is blue)
    };
    windows: CompetitionManagementCompetitionInformationWindowData[];    // Practice Ice Date windows
};

/**
 * Represents information about a competition's registrants
 */
type CompetitionManagementCompetitionInformationRegistrantsData = {
    registered: {                            // "Registered" amount for the competition
        amount: number;                      // The display amount
        status: InformationStatusKeyData;    // Controls the display color of this information
    };
    entries: {                               // "Entries" amount for the competition
        amount: number;                      // The display amount
        status: InformationStatusKeyData;    // Controls the display color of this information
    };
    entity_counts: {                         // Itemized entity counts (array)
        name: string;                        // The name of the entity ("Skaters," "Dance Teams," etc. )
        count: number;                       // The amount associated with the entity
    }[];
};

/**
 * Represents registration information about a competition
 */
type CompetitionManagementCompetitionInformationRegistrationData = {
    status: {                                           // The status of the competition's registration
        description: string;                            // The description of the registration status ("Closed")
        status: InformationStatusKeyData;               // Controls the display color of this information
    };
    dates: CompetitionManagementNamedDateTimeWithOptionalCostData[];    // The registration dates for the competition
};
/**
 * Represents volunteer information about a competition
 *
 * If windows array is empty, the "Volunteer Timeline" accordion on the Competition Information page will not show
 */
type CompetitionManagementCompetitionInformationVolunteersData = {
    windows: CompetitionManagementCompetitionInformationWindowData[];     // Information about the volunteer windows.
};

/**
 * Represents extended information about a Competition Management Competition
 */
export interface CompetitionManagementCompetitionInformationData {
    deadlines: CompetitionManagementCompetitionInformationDeadlinesData[];
    practice_ice: CompetitionManagementCompetitionInformationPracticeIceData;
    registrants: CompetitionManagementCompetitionInformationRegistrantsData;
    registration: CompetitionManagementCompetitionInformationRegistrationData;
    volunteers: CompetitionManagementCompetitionInformationVolunteersData;
}