# Team Registration Integration - Select Team
This document summarizes integration notes surrounding the Select Team page contained within Team Registration

## Templates
`src/views/pages/competition-registration-teams/Q.0_CompetitionRegistrationTeams.team-select.php`

This new template file contains the markup necessary to render the Team Registration Select Team page.

The `<select-team-page>` element contains two optional properties:
1. `back_link` - URL to use for the back link at the top of the page.
1.  `back_link_label` - Label to display for the back link, if one is provided.  If `back_link` is provided, and this
property is not, the label will be 'Back'.

## Client Side Responsibilities
When a team is selected, the client side will set a cookie containing the selected team's id in order to construct downstream endpoint URLs. 
If the name of this cookie needs to be changed, it can be configured by changing the `TEAM_REGISTRATION_TEAM_ID_COOKIE_NAME` value in
`src/js/config/AppConfig.ts:48`.  The client side will not clear this cookie value, but simply overwrite it on subsequent visits to 
the select team page.

## API
The following API endpoints are relevant to this page:

### Fetch Managed Teams

**Purpose:** Fetch information about the teams managed by the current user to enable team selection

**Source:** Team Registration Select Team page load

**URL:** `GET: api/user/managed-teams`

**Request Payload:** `none`

**Response:** `TeamsApi.FetchManagedTeamsApiResponse`

**Notes:**
1. If the current user does not have sufficient permissions to view the information, or if the information can't be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading teams.").
1. In the event a team is not selectable, a `not_selectable_link` link target can be provided that turns the displayed `is_not_selectable_reason` into a link in the UI.  These links will always open in a new browser tab.

## Data Structures
The following data structures are relevant to this page.

```
export namespace TeamsApi {
    /**
     * API response when fetching list of user managed teams for team selection
     */
    export interface FetchManagedTeamsApiResponse {
        teams: TeamsData.ManagedTeam[];          // List of teams the current user must choose from in order to begin registration
        selection_links: TeamsData.SelectTeamLinks;  // Set of links to which user can be redirected following the selection of a team
    }
}

export namespace TeamsData {
    /**
     * Represents information about a team within the list from which a manager must choose in order to begin team registration
     */
    export interface ManagedTeam extends EntityMembershipFieldData {
        level: string;                          // The level of the team
        name: string;                           // The name of the team
        id: string;                             // Unique identifier for the team
        member_number: MemberNumberData;        // The member # for the team
        membership_status: {                    // Information about the team's membership status
            active: boolean;                    // Whether the team has active membership
            validity_date_formatted: string;    // The formatted date through which the team's membership is valid
        };
        selection_information:                  // Data supporting whether the team can be selected to begin registration
            SelectableTeamSelectionInformation | NonSelectableTeamSelectionInformation;
    }

    /**
     * Represents selection information about a team who can be selected for registration
     */
    interface SelectableTeamSelectionInformation {
        is_selectable: true;                    // Indicates the team can be selected
    }

    /**
     * Represents selection information about a team who cannot be selected for registration
     */
    interface NonSelectableTeamSelectionInformation {
        is_selectable: false;                   // Indicates the team cannot be selected
        is_not_selectable_reason: string;       // Description of why the team cannot be selected (eg: "Renew Membership")
        not_selectable_link?: string;           // Link applied to the not selectable reason in the UI
    }

    /**
     * Represents links to which a user can be redirected after selecting a team
     */
    export type SelectTeamLinks = {
        competition_registration: string;       // Link to teams competition registration
    }
}
```