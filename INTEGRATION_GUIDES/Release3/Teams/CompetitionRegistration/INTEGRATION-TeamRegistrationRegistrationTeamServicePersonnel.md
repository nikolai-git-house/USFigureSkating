# Team Registration Integration - Team Service Personnel
This document summarizes integration notes surrounding the Team Registration SPA Team Service Personnel Page.

## Templates
No templates are associated with this component that require specific integration

## Cookies
This page relies on the cookies (team_id and competition_id) defined in `INTEGRATION_GUIDES/Release3/TeamRegistrationAndPortal/TeamRegistration/INTEGRATION-TeamRegistrationRegistrationShell.md:10` in
order to construct API endpoint URLs.

## Additional Notes
This page mirrors the strategies and data structures established in Admin Portal Team Check-in Team Service Personnel.

## API
The following API endpoints are relevant to this step

### Fetch Competition Team Service Personnel

**Purpose:** Fetch data required to power the Team Service Personnel Page

**Source:** Team Registration SPA Team Service Personnel Page load

**URL:** `GET: /api/competition-registration/competitions/{competition_id}/teams/{team_id}/team-service-personnel`

**Request Payload:** `none`

**Response:** `TeamRegistrationApi.FetchTeamServicePersonnelApiResponse`

**Notes:**
1. This endpoint has been modeled to reflect the Admin Portal "Entity Check-In Fetch Team Service Personnel" endpoint (`INTEGRATION_GUIDES/Release3/AdminPortal/AdminPortalAPI.md:495`)
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading team service personnel.").
1. The URL for this endpoint contains segments for the active team and competition IDs.  The client side relies on the cookies mentioned above in order to construct these URLs.
1. Data elements should be returned in the desired display order

### Update Competition Team Service Personnel

**Purpose:** Update the team service personnel list for a competition

**Source:** Edit team service personnel component "Confirm" button click

**URL:** `PUT: /api/competition-registration/competitions/{competition_id}/teams/{team_id}/team-service-personnel`

**Request Payload:** `TeamRegistrationApi.UpdateTeamServicePersonnelApiPayload`

**Response:** `APISubmissionResponse`

**Notes:**
1. This endpoint has been modeled to reflect the Admin Portal "Entity Check-In Team Coach Update" endpoint (`INTEGRATION_GUIDES/Release3/AdminPortal/AdminPortalAPI.md:476`)
1. If the submission is unsuccessful for any reason, the interface will display an error message above the “Confirm Team Service Personnel” button. If a 2xx response code is sent with a value in the response `error` key, the provided message will display. Otherwise, a generic message will display (“Error updating team service personnel.”)
1. The URL for this endpoint contains segments for the active team and competition IDs.  The client side relies on the cookies mentioned above in order to construct these URLs.
1. The frontend will rely on the backend to validate that all applicable roster requirements have been met. If there are errors resulting from this validation, a 2xx response code should be sent with a message indicating the validation errors in the response `error` key. This message will be displayed in the UI.

## Data Structures
The following data structures are relevant to the Team Registration SPA Team Service Personnel Page:

```
export namespace TeamRegistrationApi {
    /**
     * API response when fetching information for the Team Service Personnel page
     */
    export interface FetchTeamServicePersonnelApiResponse {
        team_service_personnel: TeamRegistrationData.TeamServicePersonData[];        // The team TSP list
        selected_team_service_personnel_ids: string[];                               // The IDs of the currently selected TSP
        team_service_personnel_maximum: number;                                      // The maximum amount of TSP allowed for selection
    }
    /**
     * Server payload to update the competition TSP list
     *
     * Array of numbers, which are the IDs from each TeamRegistrationData.TeamServicePersonnelData item intended for the TSP list
     */
    export interface UpdateTeamServicePersonnelApiPayload {
    }
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
        can_be_added_to_roster: boolean;                // Whether the member can be added to the competition TSP list
        cannot_be_added_to_roster_reason?: string;      // If the member can't be added to the competition TSP list, reason for why not ('Invalid age,' 'Ineligible to Participate,' etc)
    }
    
    /**
     * Represents information about a team service person associated with a team
     */
    export interface TeamServicePersonData extends AbstractTeamEntityData {
    }
}
```