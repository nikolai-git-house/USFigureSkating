# Team Portal Integration - Competition Roster

This document summarizes integration notes surrounding the Team Portal "Competition Roster" page contained within the
Team Registration/Team Portal release.

## Templates

`src/views/pages/competitions/R.5_competition-roster.php`

This new template file contains the markup necessary to render the Competition Roster page. It consists solely of a Vue
component element with no component properties.

### Server Side Requirements

The appropriate "Active Object ID Information" as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to
be set server side when loading this page. To be specific, the "Active Competition ID" and the "Active Team ID" cookies
need to be set in all cases when loading the page.

## Functional Overview

### Page Load

Upon page load, the client-side will contact the "Fetch Competition Roster" API endpoint to load baseline information
for the page. This endpoint will return:

- Competition Portal core information (Competition Summary, Entity Summary, Back Link Configuration)
- The list of members in the current competition roster (along with their compliance information)
- link URL to download the roster
- Whether editing of the roster should be disabled
- Roster rules (to enable validation of selected roster)
  - Minimum size (if applicable)
  - Maximum size (if applicable)
  - Roster rule display list (included due to conceptual link with other data points)

#### Roster Validation Display

The client-side displays a summary of the currently selected roster. If the selected roster size is smaller than the
minimum (if provided), a validation error will display. Additionally, if any of roster members' `is_ineligible` property
is `true`, a different validation message will display.

As of this writing, if editing of the roster is disabled, and either of the above validation states apply, the user will
see the appropriate validation error message but will be unable to correct the issue through the UI.

### Roster Edit

When the user clicks the "Edit Roster" button, the client-side will contact the "Fetch Competition Portal Team Roster"
endpoint to fetch information to power the "Edit Roster" overlay. This endpoint will return:

- The full team roster to populate the edit roster screen

After this endpoint is contacted for the first time, its response will be cached client-side and the endpoint will not
be contacted again upon subsequent loads of the edit screen until the page is refreshed/reloaded.

Note: This separate endpoint allows loading of the full team roster to facilitate the edit screen without loading full
compliance information for all members of the team.

### Roster Edit Confirm

When the user clicks the "Confirm Roster" button on the edit screen, the client-side will report the newly selected
roster to the "Update Competition Portal Competition Roster" API endpoint. This endpoint will return:

- Whether the submission was successful
- The updated competition roster resulting from the update (same schema as in "Page Load", to include compliance
  information about selected members).

## API

The following API endpoints are relevant to this page:

### Fetch Competition Portal Competition Roster

**Purpose:** Fetch information for the Competition Portal "Competition Roster" page

**Source:** "Competition Roster" page load

**URL:** `GET:/api/competitions/{competition_id}/teams/{team_id}/competition-roster`

**Request Payload:** `none`

**Response:** `CompetitionRosterApi.FetchCompetitionRosterApiResponse`

**Notes:**

1. Since this page only applies to teams, there is only one URL for this endpoint. The competition_id and team_id
   segments of the URL are constructed using the "Active Object ID Information" outlined above
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading
   competition roster.").
1. The API response extends the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure. As such, it
   contains information about the active competition, team (entity), and may contain an optional "Back" link
   configuration.
1. In the `competition_roster` property of the response, data elements should be returned in the desired display order.

### Fetch Competition Portal Team Roster

**Purpose:** Fetch the full team roster to enable editing the competition roster for a team

**Source:** Competition Portal "Competition Roster" page "Edit Roster" button click

**URL:** `GET:/api/competitions/{competition_id}/teams/{team_id}/team-roster`

**Request Payload:** `none`

**Response:** `CompetitionRosterApi.FetchTeamRosterApiResponse`

**Notes:**

1. Since this page only applies to teams, there is only one URL for this endpoint. The competition_id and team_id
   segments of the URL are constructed using the "Active Object ID Information" outlined above
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
   found, a non-2xx HTTP response code should be returned and the UI will display a generic message ("Error loading team
   roster.").
1. In the `team_roster` property of the response, data elements should be returned in the desired display order.
1. It's important that the roster members returned by the "Fetch Competition Portal Competition Roster" endpoint are in
   the response list, and that their IDs match.

### Update Competition Portal Competition Roster

**Purpose:** Save a user's modifications to their team competition roster

**Source:** Competition Portal "Competition Roster" page "Edit Roster" screen

**URL:** `PATCH:/api/competitions/{competition_id}/teams/{team_id}/competition-roster`

**Request Payload:** `CompetitionRosterApi.UpdateCompetitionRosterApiPayload`

**Response:** `CompetitionRosterApi.UpdateCompetitionRosterApiResponse`

**Notes:**

1. Since this page only applies to teams, there is only one URL for this endpoint. The competition_id and team_id
   segments of the URL are constructed using the "Active Object ID Information" outlined above
1. If the submission is unsuccessful for any reason, the interface will display an error message above the “Confirm
   Roster” button. If a 2xx response code is sent with a value in the response `error` key, the provided message will
   display. Otherwise, a generic message will display (“There was an error saving the competition roster.”)
1. The `competition_roster` response property should contain roster members in the desired display order.

## Data Structures

The following data structures are relevant to this page.

```
export namespace CompetitionRosterApi {
    /**
     * API Response when fetching information for the Competition Portal "Competition Roster" page
     */
    export interface FetchCompetitionRosterApiResponse extends CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse {
        competition_roster: CompetitionRosterData.CompetitionRosterMember[];    // The current selected roster for the competition
        download_link: string;                                                  // Link to download the roster
        roster_edit_disabled?: boolean;                                         // Whether editing the roster should be disabled
        roster_rules: string[];                                                 // The rules to display above the roster selection component
        roster_minimum?: number;                                                // The minimum number of members to ensure a valid roster
        roster_maximum?: number;                                                // If provided, this will prevent users from adding members to the roster once this amount is reached.
    }

    /**
     * API response when fetching the full team roster for the "Edit Roster" screen
     */
    export interface FetchTeamRosterApiResponse {
        team_roster: TeamRegistrationData.TeamRosterMemberData[];   // The full team roster
    }

    /**
     * API payload when updating the competition roster
     *
     * Array of selected member IDs
     */
    export interface UpdateCompetitionRosterApiPayload extends Array<string> {
    }

    /**
     * API response when updating the competition roster
     */
    export interface UpdateCompetitionRosterApiResponse extends APISubmissionResponse {
        competition_roster: CompetitionRosterData.CompetitionRosterMember[];    // The selected competition roster resulting from the update
    }
}

export namespace CompetitionRosterData {
    /**
     * Represents a member of the active competition roster for a team
     */
    export interface CompetitionRosterMember {
        id: string;                        // Unique identifier for the member
        first_name: string;                // first name for the member
        last_name: string;                 // last name for the member
        is_compliant: boolean;             // Whether the member is compliant
        is_ineligible: boolean;            // Whether the member is ineligible to participate
        member_number: MemberNumberData;   // Member number for the member
        age: number;                       // Age of the member
        compliance_requirements_summary: ComplianceRequirementsSection[]; // Summary about the member's compliance/requirements information
    }

    /**
     * Represents a section of a member's compliance/requirements information
     */
    interface ComplianceRequirementsSection {
        name: string;                           // The name of the section
        items: ComplianceRequirementsItem[];    // Items within the section
        is_complete: boolean;                   // Whether the overall section is complete
    }

    /**
     * Represents a single compliance/requirements item for a member
     */
    interface ComplianceRequirementsItem {
        name: string;                                      // The name of the item
        complete: boolean;                                 // Whether the item is complete
        is_membership?: boolean;                           // Whether the item is the "Membership" item.  Controls display of membership end date
        is_age_verification?: boolean;                     // Whether the item is the "Age Verified" item.  Controls display of supplementary information when not complete
        membership_expiration_date_formatted?: string;     // The formatted membership end date.  Displays when `is_membership` is true
    }
}
```