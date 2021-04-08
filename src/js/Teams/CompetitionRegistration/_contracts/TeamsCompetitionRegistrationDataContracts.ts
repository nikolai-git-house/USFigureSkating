import {
    CompetitionClubData,
    CompetitionFoundationData,
    CompetitionIconData,
    CompetitionIsQualifyingData,
    CompetitionLocationData,
    CompetitionOptionalSeriesData,
    CompetitionStartEndDateTimestampsData
} from '../../../contracts/data/CompetitionFieldDataContracts';
import {CompetitionRegistrationCtaConfigurationData} from '../../../contracts/release3/data/CompetitionRegistrationDataContracts';

export namespace TeamsCompetitionRegistrationData {
    /**
     * Represents a competition in the list of available competitions for team registration
     */
    export interface CompetitionListCompetitionData extends CompetitionFoundationData,
        CompetitionIconData,
        CompetitionLocationData,
        CompetitionClubData,
        CompetitionStartEndDateTimestampsData,
        CompetitionOptionalSeriesData,
        CompetitionIsQualifyingData,
        CompetitionRegistrationCtaConfigurationData {
        // CompetitionFoundationData...
        id: number;         // Unique Identifier for the competition
        name: string;       // Competition name

        // CompetitionIconData...
        icon: string;       // URL for competition icon

        // CompetitionLocationData...
        city: string;       // City for the competition
        state: string;      // State for the competition

        // CompetitionClubData...
        club: string;       // Host club name

        // CompetitionStartEndDateTimestampsData...
        end_date_ts: number;        // unix timestamp representing 12:00:00am UTC on the end date.
        //      For example, if the intended start date is 6/1 ET,
        //      the returned timestamp will need 4 hours subtracted to account
        //      for the difference between ET and UTC
        start_date_ts: number;      // unix timestamp representing 12:00:00am UTC on the start date.
                                    //      For example, if the intended end date is 6/3 in ET, the returned
                                    //      timestamp will need 4 hours subtracted to account for the difference
                                    //      between ET and UTC

        // CompetitionOptionalSeriesData...
        series?: { name: string; }[];     // Array of series for the competition, or undefined if not part of a series

        // CompetitionIsQualifyingData...
        is_qualifying: boolean;      // Whether the competition is a qualifying competition

        // CompetitionRegistrationCtaConfigurationData...
        competition_registration_status: 'open' | 'late' | 'future';    // the competition's registration window status
        has_registration_deadline_warning: boolean;                     // Whether the competition's registration deadline should be highlighted in red
        registration_deadline: string;                                  // string to display as the registration deadline
        user_registration_link: string;                                 // the link the active user should be directed to when selecting a competition
        user_registration_status: 'registered' | 'in_progress' | 'new'; // the active user's status relative to registering for the competition
    }

    /**
     * Represents summary data about the active team during registration
     */
    export interface TeamSummaryData {
        name: string;       // The name of the team
        level: string;      // The level of the team
    }
}