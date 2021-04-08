import {TeamsData} from '../../Teams/_contracts';

/**
 * Represents core data shared across Series Registration Series types
 */
export interface SeriesRegistrationSeriesCoreData {
    icon: string;                                    // URL to the series icon
    id: number;                                      // Unique identifier for the series
    is_team_series?: boolean;                        // Whether the series is a team series.  When not provided, will be treated as false
    name: string;                                    // Name of the series
}

/**
 * Represents basic information about a Series for display on the "Series Information" page
 */
export interface SeriesRegistrationIndexSeriesData extends SeriesRegistrationSeriesCoreData {
    application_deadline_date_formatted: string;     // Formatted string of the application deadline
    links: {                                         // Links for the series
        overview: string;                            // Link to series overview page
    };
}

export namespace SeriesRegistrationData {
    /**
     * Represents summary information about a series to populate a series subpage skeleton
     */
    export interface SupageSeriesSummary extends SeriesRegistrationSeriesCoreData {
        application_deadline_formatted: string;             // String formatted application deadline. Displays in page header
        links: {                                            // Links for the series
            overview: string;                               // Link to series overview. Populates "back" link in subpage header
        };
    }

    /**
     * Represents a team managed by the current user and its relevant series-related information
     */
    export type ManagedTeam = ManagedTeamSelectable | ManagedTeamNonSelectable;

    /**
     * Button configuration for a team
     */
    interface SelectTeamButton{
        text: string;           // The text to display for the button ('Continue,' 'Start,' 'Update')
        url: string;            // The URL target for the button
    }

    /**
     * Represents selection information for a team that is selectable on the page
     */
    interface SelectionInformationSelectableTeam extends TeamsData.SelectableTeamSelectionInformation {
        button: SelectTeamButton;   // Button configuration needs to be present
    }

    /**
     * Represents selection information for a team that is not selectable on the page
     */
    interface SelectionInformationNonselectableTeam extends TeamsData.NonSelectableTeamSelectionInformation {
        button?: SelectTeamButton;  // Button configuration does not need to be present.  Button will not display, so information can be included if desired.
    }

    /**
     * Represents a selectable team on the page.  Button displays and links to the relevant application.
     */
    export interface ManagedTeamSelectable extends TeamsData.ManagedTeam {
        selection_information: SelectionInformationSelectableTeam;
    }

    /**
     * Represents a non-selectable team on the page.  Notice displays in place of button
     */
    export interface ManagedTeamNonSelectable extends TeamsData.ManagedTeam {
        selection_information: SelectionInformationNonselectableTeam;
    }
}