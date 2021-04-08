# Team Registration Integration - Competition Roster
This document summarizes integration notes surrounding the Team Registration SPA Competition Roster Page.

## Templates
No templates are associated with this component that require specific integration

## Cookies
This page relies on the cookies (team_id and competition_id) defined in `INTEGRATION_GUIDES/Release3/TeamRegistrationAndPortal/TeamRegistration/INTEGRATION-TeamRegistrationRegistrationShell.md:10` in
order to construct API endpoint URLs.

## Additional Notes
This page mirrors the strategies and data structures established in Admin Portal Team Check-in Roster.

## API
The following API endpoints are relevant to this step

### Fetch Competition Roster

**Purpose:** Fetch data required to power the Competition Roster Page

**Source:** Team Registration SPA Competition Roster Page load

**URL:** `GET: /api/competition-registration/competitions/{competition_id}/teams/{team_id}/competition-roster`

**Request Payload:** `none`

**Response:** `TeamRegistrationApi.FetchCompetitionRosterApiResponse`

**Notes:**
1. This endpoint has been modeled to reflect the Admin Portal "Entity Check-In Fetch Roster" endpoint (`INTEGRATION_GUIDES/Release3/AdminPortal/AdminPortalAPI.md:290`)
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading competition roster.").
1. The URL for this endpoint contains segments for the active team and competition IDs.  The client side relies on the cookies
mentioned above in order to construct these URLs.
1. Data elements should be returned in the desired display order

### Update Competition Roster

**Purpose:** Update the roster for a competition

**Source:** Edit roster component "Confirm" button click

**URL:** `PUT: /api/competition-registration/competitions/{competition_id}/teams/{team_id}/competition-roster`

**Request Payload:** `TeamRegistrationApi.UpdateCompetitionRosterApiPayload`

**Response:** `APISubmissionResponse`

**Notes:**
1. This endpoint has been modeled to reflect the Admin Portal "Entity Check-In Roster Update" endpoint (`INTEGRATION_GUIDES/Release3/AdminPortal/AdminPortalAPI.md:311`)
1. If the submission is unsuccessful for any reason, the interface will display an error message above the “Confirm Roster” button. If a 2xx response code is sent with a value in the response `error` key, the provided message will display. Otherwise, a generic message will display (“Error updating roster.”)
1. The URL for this endpoint contains segments for the active team and competition IDs.  The client side relies on the cookies
mentioned above in order to construct these URLs.
1. The frontend will rely on the backend to validate that all applicable roster requirements have been met. If there are errors resulting from this validation, a 2xx response code should be sent with a message indicating the validation errors in the response `error` key. This message will be displayed in the UI.

## Data Structures
The following data structures are relevant to the Team Registration SPA Competition Roster Page:

```
export namespace TeamRegistrationApi {
    /**
     * API response when fetching information for the Competition Roster page
     */
    export interface FetchCompetitionRosterApiResponse {
        team_roster: TeamRegistrationData.TeamRosterMemberData[];   // The full team roster
        selected_roster_ids: string[];                              // The IDs of the roster team members currently selected
        roster_rules: string[];                                     // The rules to display above the roster selection component
        per_skater_fee?: number;                                    // The fee per skater for the competition, if applicable.
        roster_minimum?: number;                                    // The minimum number of members to ensure a valid roster
        roster_maximum?: number;                                    // If provided, this will prevent users from adding members to the roster once this amount is reached.
                                                                    // In this case, when user has not selected the maximum amount, a message "You can select up to <x>" will display.
                                                                    // Additionally, when the maximum has been reached, a message "You have reached the max allowed" will display.
                                                                    // If this property is not provided, UI will not prevent user from adding members past the maximum and messages noted above will not display
    }
    /**
     * Server payload to update the competition roster
     *
     * Array of numbers, which are the IDs from each TeamRegistrationData.TeamRosterMemberData item intended for the competition roster
     */
    export interface UpdateCompetitionRosterApiPayload extends Array<number> {}
}
export namespace TeamRegistrationData {
    /**
     * Represents common information for a team entity (Skater, Coach, TSP, Prop Crew)
     */
    interface AbstractTeamEntityData {
        id: string;                                     // Unique identifier for the Skater
        last_name: string;                              // Member's last name
        first_name: string;                             // Member's first name
        member_number: MemberNumberData;                // Member's member number
        can_be_added_to_roster: boolean;                // Whether the member can be added to the competition roster
        cannot_be_added_to_roster_reason?: string;      // If the member can't be added to the competition roster, reason for why not ('Invalid age,' 'Ineligible to Participate,' etc)
    }

    /**
     * Represents information about a member in a team roster
     */
    export interface TeamRosterMemberData extends AbstractTeamEntityData {
        age: number;                                    // The age of the member
    }
}
```