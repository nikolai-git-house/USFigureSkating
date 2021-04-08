# Team Portal Integration - My Teams
This document summarizes integration notes surrounding the Team Portal "My Teams" page contained within the Team Registration/Team Portal release.

## Templates
`src/views/pages/competitions/R.1_my-teams.php`

This new template file contains the markup necessary to render the My Teams page. It consists solely 
of a Vue component element with no component properties.

## Competition and Team ID Information
Each team contained in the page endpoint response will contain a link to the Competition Portal Main page for the competition.
These links should be constructed such that the server side can set the active competition ID and active team ID cookies as described in
`INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD:37` when loading the Competition Portal Main page.

## API
The following API endpoints are relevant to this page:

### Fetch Competition Portal My Teams

**Purpose:** Fetch information for the Competition Portal "My Teams" page

**Source:** Team Portal "My Teams" page load

**URL:** `/api/user/managed-teams/competitions/{competition_id}/registered-teams`

**Request Payload:** `none`

**Response:** `TeamsApi.FetchMyTeamsApiResponse`

**Notes:**
1. If the current user does not have sufficient permissions to view the information, or if the information can't be found,
   a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading teams.").
1. The `teams` property of the response contains an array of structures that extend the `TeamsData.ManagedTeam` defined in the team
   registration release.  Unless there is a case where teams are non-selectable on this page, the
   `TeamsData.ManagedTeam.selection_information.is_selectable` property should always be set to true.
1. The response contains an optional property to configure the "Back" link on the top of the page
1. The `competition_id` segment of the url is populated from the cookie described in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD:39`


## Data Structures
The following data structures are relevant to this page.

```
export namespace CompetitionPortalApi {

    /**
     * API response when fetching information for the Competition Portal "My Teams" page
     */
    export interface FetchMyTeamsApiResponse {
        teams: CompetitionPortalData.CompetitionRegisteredManagedTeam[];        // The list of teams (managed by the current user) registered for the specified competition
        competition_summary: CompetitionPortalData.ActiveCompetitionSummary;    // Summary of the specified competition
        back_link?: BackLinkConfigurationData;                                  // Back link to apply to the page, if desired
    }
}

export namespace CompetitionPortalData {
    /**
     * Represents summary information about the active competition portal competition
     */
    export interface ActiveCompetitionSummary extends CompetitionHeadingData {
        id: number;                             // Unique identifier for the competition
    }

    /**
     * Represents a team managed by the active user registered for a particular competition
     */
    export interface CompetitionRegisteredManagedTeam extends TeamsData.ManagedTeam {
        links: {
            competition_portal: string;         // Link to view the appropriate competition portal as the team
        };
    }
}
```