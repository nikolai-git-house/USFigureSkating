# Team Registration Integration - Competition List
This document summarizes integration notes surrounding the Team Registration Competition List page contained within the Team Registration/Team Portal release.

## Templates
`src/views/pages/competition-registration-teams/Q.1_CompetitionRegistrationTeams.competition-list.php`

This new template file contains the markup necessary to render the Team Registration Competition List page. 

The `<teams-competition-registration-index-page>` element contains two optional properties:
1. `back_link` - URL to use for the back link at the top of the page.
1.  `back_link_label` - Label to display for the back link, if one is provided.  If `back_link` is provided, and this
property is not, the label will be 'Back'.


## Active Team ID Cookie
Prior to loading this page, a cookie should have been set by the client side Select Team page containing the ID of the active team in the registration process. 
This cookie value is used to construct the API endpoint URL for this page

## API
The following API endpoints are relevant to this page:

### Fetch Team Registration Competition List

**Purpose:** Fetch the data needed for the Team Registration Competition List page

**Source:** Team Registration Competition List page load

**URL:** `GET: /api/competition-registration/teams/{team_id}`

**Request Payload:** `none`

**Response:** `TeamsCompetitionRegistrationApi.FetchCompetitionListApiResponse`

**Notes:**
1. The {team_id} segment will be determined by the property in the "Active Team ID Cookie" outlined above.
1. If the current user does not have sufficient permissions to view the information, or if the information can't be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading competitions.").
1. The `TeamsCompetitionRegistrationApi.FetchCompetitionListApiResponse` contains two properties:
    * `competitions` - The list of competitions to display on the page
    * `team` - Summary information about the team to display in the page header
1. If a competition is not registration-actionable for the current user/team, the competition should not be included in this response.  For example, if a competition only has one event the team is eligible to register for and registration has been completed, the competition is not actionable.

## Data Structures
The following data structures are relevant to this page.  Competition-related information largely re-uses existing data structures. 
Only new data structures are outlined below:

```
export namespace TeamsCompetitionRegistrationApi {
    /**
     * API response when fetching the competition list
     */
    export interface FetchCompetitionListApiResponse {
        competitions: TeamsCompetitionRegistrationData.CompetitionListCompetitionData[];    // The list of competitions
        team: TeamsCompetitionRegistrationData.TeamSummaryData;                             // Information about the active team
    }
}

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

/**
 * Field for a competition's series information
 */
interface CompetitionOptionalSeriesData {
    series?: { name: string; }[];     // Array of series for the competition, or undefined if not part of a series
}

/**
 * Field for a competition's qualifying/non-qualifying information
 */
interface CompetitionIsQualifyingData {
    is_qualifying: boolean;                 // Whether the competition is a qualifying competition
}
```