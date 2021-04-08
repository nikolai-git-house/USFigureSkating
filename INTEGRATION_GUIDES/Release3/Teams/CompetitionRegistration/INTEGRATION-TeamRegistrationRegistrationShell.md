# Team Registration Integration - Registration Shell
This document summarizes integration notes surrounding the shell of the Team Registration SPA workflow.

## Templates
`src/views/pages/competition-registration-teams/Q.2_CompetitionRegistrationTeams.registration.php`

This new template file contains the markup necessary to render the Team Registration SPA. It contains a vue component
with optional parameters to specify a "back" link target from the first page in the workflow. 

## Cookies
The registration workflow relies on two cookies in order to construct appropriate API urls.  Both cookies should be set
prior to loading the page.  The Team ID Cookie is set client-side, but the Competition ID cookie needs to be set server-side
when loading the page.

1. Team ID Cookie
    * This cookie was documented in `INTEGRATION_GUIDES/Release3/Teams/INTEGRATION-TeamRegistrationSelectTeam.md:14`
    * The name of this cookie can be configured by setting `TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME` in  `src/js/config/AppConfig.ts`.
    * The default name of this cookie is `team_competition_registration_team_id`
1. Competition ID Cookie
    * This cookie contains the ID of the competition being registered for
    * The name of this cookie can be configured by setting `TEAM_REGISTRATION_COMPETITION_ID_COOKIE_NAME` in  `src/js/config/AppConfig.ts`.
    * The default name of this cookie is `team_competition_registration_competition_id`

## API
The following API endpoints are relevant to the Team Registration SPA Shell:

### Fetch Team Registration Shell

**Purpose:** Fetch data required across the entire team registration workflow

**Source:** Team registration load

**URL:** `/api/competition-registration/competitions/{competition_id}/teams/{team_id}/shell`

**Request Payload:** `none`

**Response:** `TeamRegistrationApi.FetchShellApiResponse`

**Notes:**
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading registration.").
1. The URL for this endpoint contains segments for the active team and competition IDs.  The cookies mentioned above are used to construct these URLs. 
1. The `team` property of the response contains two key data points used to configure the registration workflow:
    * `has_prop_crew` - Determines whether to show the "Prop Crew" step in the registration process
    * `initial_page` -  Optional property provides a control point to ensure a specific page in the process displays upon load.  If not provided in response, the first page of the workflow will display.
1. The `competition` property of the response contains a `links.cart` property to specify the URL to which the user should be directed following completion of the workflow.

## Data Structures
The following data structures are relevant to the Team Registration SPA Shell:

```
export namespace TeamRegistrationApi {
    /**
     * API response when fetching shell information to power the Team Registration workflow
     */
    export interface FetchShellApiResponse {
        competition: TeamRegistrationData.CompetitionSummary;   // Information about the active competition
        team: TeamRegistrationData.TeamSummary;                 // Information about the active team
    }
}
export namespace TeamRegistrationData {
    /**
     * Represents information about the active competition within the registration workflow
     */
    export interface CompetitionSummary extends CompetitionFoundationData, CompetitionIconData, CompetitionFormattedDatesData {
        links: {
            cart: string;  // Link to direct the user to following completion of the registration workflow
        };
    }

    /**
     * Represents information about the active team within the registration workflow
     */
    export interface TeamSummary {
        name: string;                   // The name of the team
        level: string;                  // The level of the team
        has_prop_crew: boolean;         // Whether the prop crew step displays in registration for the team
        initial_page?: PageKey;         // The page to display upon initial load. If not provided, the first page in the workflow will load
    }

    /**
     * A key indicating a workflow page step
     */
    export type PageKey =
        'team_verification' |
        'overview' |
        'event_selection' |
        'roster' |
        'coaches' |
        'team_service_personnel' |
        'prop_crew';
}
```