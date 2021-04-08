import {
    CompetitionClubData,
    CompetitionFoundationData,
    CompetitionIconData,
    CompetitionLocationData,
    CompetitionRegistrationOptionalDeadlineData,
    CompetitionSeriesData,
    CompetitionStartEndDateTimestampsData,
    CompetitionUserRegistrationStatusData
} from '../../contracts/data/CompetitionFieldDataContracts';

/**
 * Server response when fetching the list of competitions for the search competitions page
 */

export interface FetchSearchCompetitionListAPIResponse {
    competitions: SearchCompetitionsCompetitionData[];  // The list of competitions available to display
}

/**
 * Represents a competition on the search competitions page
 */
export interface SearchCompetitionsCompetitionData
    extends CompetitionFoundationData,
        CompetitionStartEndDateTimestampsData,
        CompetitionSeriesData,
        CompetitionIconData,
        CompetitionClubData,
        CompetitionLocationData,
        CompetitionRegistrationOptionalDeadlineData,
        CompetitionUserRegistrationStatusData {
    has_registration_deadline_warning: boolean;     // Whether the competition's registration deadline should be highlighted in red where displayed
    registration_deadline?: string;                 // Formatted deadline date date to display.  Exclude property when a registration deadline should not display
    view_competition_link: string;                  // URL for page to view the competition
}