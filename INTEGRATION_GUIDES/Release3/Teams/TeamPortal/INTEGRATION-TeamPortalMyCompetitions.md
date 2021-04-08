# Team Portal Integration - My Competitions - Teams
This document summarizes integration notes surrounding the Team Portal "My Competitions - Teams" page contained within the Team Registration/Team Portal release.

## Templates
`src/views/pages/R.0_my-competitions-teams.php`

This new template file contains the markup necessary to render the My Competitions - Teams page. It consists solely 
of a Vue component element with no component properties.

## Competition ID Information
Each competition contained in the page endpoint response will contain a link to the "Select Team" page for the competition.
These links should be constructed such that the server side can set the active competition ID cookie as described in
`INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD:39` when loading the "Select Team" page.

## API
The following API endpoints are relevant to this page:

### Fetch My Competitions - Teams

**Purpose:** Fetch the data needed for the My Competitions - Teams page:
1. List of competitions for which any of the active user's managed teams are registered
1. Optional target and label for "Back" link in page header
1. URL to team registration root for link that displays when no competitions have yet been registered for

**Source:** My Competitions - Teams page load

**URL:** `GET: /api/user/managed-teams/competitions`

**Request Payload:** `none`

**Response:** `TeamsApi.FetchManagedTeamCompetitionsApiResponse`

**Notes:**
1. If the current user does not have sufficient permissions to view the information, or if the information can't be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading competitions.").
1. Competitions should be provided in the desired display order in the response
1. If the `competitions` property of the response, contains an empty array a message will display "Your team(s) are not registered for any competitions at this time."
    * If a `links.competition_registration` property is provided in the response, a link will appear below this message that directs the user to the provided URL.  
    This link should contain the URL for the root of Team Competition Registration ("Select Team" page).
1. If a `back_link` property is provided in the response, a "Back" link will appear at the top of the page with the respective properties populated

## Data Structures
The following data structures are relevant to this page.

```
export namespace TeamsApi {
    /**
     * API response when fetching data for the "My Competitions - Teams" page
     */
    export interface FetchManagedTeamCompetitionsApiResponse {
        competitions: TeamsData.MyCompetitionsTeamsCompetitionData[];       // The list of competitions for which any of the active user's managed teams is registered
        links?: { competition_registration: string; };                      // Object (for extensibility) containing a link to the root of team registration.  Populates a link that displays when competitions array above is empty.  If not provided, link will not show
        back_link?: BackLinkConfigurationData;                              // Optional configuration for "Back" link at the top of the page.  If not provided, back link will not show
    }
}

export namespace TeamsData {
    /**
     * Represents information about a competition on the My Competitions - Teams page
     */
    export interface MyCompetitionsTeamsCompetitionData extends
            CompetitionFoundationData,
            CompetitionFormattedDatesData,
            CompetitionIconData {
        links: {
            select_team: string;    // Link to select team page (next page in user flow when viewing a competition from this list)
        };
    }
}

/**
 * Configuration for a page's "Back" link
 */
export interface BackLinkConfigurationData {
    url: string;            // Link target for the back link
    label?: string;         // Label for the back link. If not provided, will default to "Back"
}
```