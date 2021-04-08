/**
 * Field when a competition has a club name to display
 */
import {DataNavigationLinkData} from '../release3/data';

export interface CompetitionClubData {
    club: string;       // Host club name
}

/**
 * Represents the simplest structure for a competition
 */
export interface CompetitionFoundationData {
    id: number;         // Unique Identifier for the competition
    name: string;       // Competition name
}

/**
 * Represents an object with data necessary to directly power the competition heading component
 */
export interface CompetitionHeadingData {
    announcement_url?: string;          // [OPTIONAL] URL for the Competition Announcement
    directions?: {                      // [OPTIONAL] Directions information for the competition.
        location_name: string;          // The name of the location
        link: string;                   // Directions link URL
    }[];
    end_date_pretty: string;            // String representation of end date
    icon: string;                       // URL string linking to the Competition icon image
    name: string;                       // The name of the Competition
    start_date_pretty: string;          // String representation of start date
    website_url?: string;               // [OPTIONAL] URL for the Competition Website
}

/**
 * Represents an object containing formatted competition start and end dates
 */
export interface CompetitionFormattedDatesData {
    end_date_pretty: string;            // String representation of end date
    start_date_pretty: string;          // String representation of start date
}

/**
 * Field for a competition icon
 */
export interface CompetitionIconData {
    icon: string;   // URL for competition icon
}

/**
 * Fields for a competition's location
 */
export interface CompetitionLocationData {
    city: string;       // City for the competition
    state: string;      // State for the competition
}

/**
 * Field for a competition's qualifying/non-qualifying information
 */
export interface CompetitionIsQualifyingData {
    is_qualifying: boolean;                 // Whether the competition is a qualifying competition
}

/**
 * Fields for a competition's registration deadline
 */
export interface CompetitionRegistrationDeadlineData {
    has_registration_deadline_warning: boolean;     // Whether the competition's registration deadline should be highlighted in red where displayed
    registration_deadline: string;                  // Formatted deadline date date to display
}

/**
 * Fields for a competition's registration deadline, where the registration deadline is nullable
 */
export interface CompetitionRegistrationOptionalDeadlineData {
    has_registration_deadline_warning: boolean;     // Whether the competition's registration deadline should be highlighted in red where displayed
    registration_deadline?: string;                  // Formatted deadline date date to display
}

/**
 * Field for a competition's series information
 */
export interface CompetitionSeriesData {
    series: { name: string; }[] | null;     // Array of series for the competition, or null if not part of a series
}

/**
 * Field for a competition's series information
 */
export interface CompetitionOptionalSeriesData {
    series?: { name: string; }[];     // Array of series for the competition, or undefined if not part of a series
}

/**
 * Fields when a competition has start and end dates in the form of timestamps.
 * Used when dates need to be used in calculations
 */
export interface CompetitionStartEndDateTimestampsData {
    end_date_ts: number;        // unix timestamp representing 12:00:00am UTC on the end date.
                                //      For example, if the intended start date is 6/1 ET,
                                //      the returned timestamp will need 4 hours subtracted to account
                                //      for the difference between ET and UTC
    start_date_ts: number;      // unix timestamp representing 12:00:00am UTC on the start date.
                                //      For example, if the intended end date is 6/3 in ET, the returned
                                //      timestamp will need 4 hours subtracted to account for the difference
                                //      between ET and UTC
}

/**
 *  Field for user navigation for a competition
 */
export interface CompetitionUserNavigationFieldData {
    user_navigation: DataNavigationLinkData.DataNavigationLink[];  // The navigation list items for the user in relation to the competition
}

/**
 * Field for a user's registration status relative to a competition
 */
export interface CompetitionUserRegistrationStatusData {
    user_registration_status: 'registered' | 'in_progress' | 'new';     // the active user's status relative to registering for the competition
}