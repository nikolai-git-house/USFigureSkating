# Team Registration Integration - Team Verification
This document summarizes integration notes surrounding the Team Registration SPA Team Verification Page.

## Templates
No templates are associated with this component

## Cookies
This page relies on the cookies (team_id and competition_id) defined in `INTEGRATION_GUIDES/Release3/TeamRegistrationAndPortal/TeamRegistration/INTEGRATION-TeamRegistrationRegistrationShell.md:10` in
order to construct API endpoint URLs.

## API
The following API endpoints are relevant to this step

### Fetch Team Verification

**Purpose:** Fetch data required to power the Team Verification Page

**Source:** Team Registration SPA Team Verification Page load

**URL:** `GET: /api/competition-registration/competitions/{competition_id}/teams/{team_id}`

**Request Payload:** `none`

**Response:** `TeamRegistrationApi.FetchTeamVerificationApiResponse`

**Notes:**
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading team verification.").
1. The URL for this endpoint contains segments for the active team and competition IDs.  The client side relies on the cookies
mentioned above in order to construct these URLs. 

### Update Team Name

**Purpose:** Change the team name

**Source:** Team Verification team name form submission

**URL:** `PUT: /api/competition-registration/competitions/{competition_id}/teams/{team_id}`

**Request Payload:** `TeamRegistrationApi.UpdateTeamNameApiPayload`

**Response:** `APISubmissionResponse`

**Notes:**
1. To construct the `team_id` segment of the endpoint URL, the client side will use the ID returned within the `team_profile` property of the "Fetch Team Verification" endpoint response
1. If the submission is unsuccessful, the interface will display an error message. If a 2xx response code is sent with a value in the response `error` key, the provided message will display. Otherwise, a generic message will display (“Error updating team name.”)
1. The intent of this endpoint is to constrain a team to changing its name during registration.  This is the reasoning for why a generic endpoint to update team profile information is not being used.


## Data Structures
The following data structures are relevant to this step

```
export namespace TeamRegistrationApi {
        /**
         * API response when fetching information to power the Team Verification step of the registration process
         */
        export interface FetchTeamVerificationApiResponse {
            team_profile: TeamRegistrationData.TeamProfile;     // Team profile information
        }
    
        /**
         * API payload when updating the team name
         */
        export interface UpdateTeamNameApiPayload {
            name: string;  // The updated team name to save
        }
}
export namespace TeamRegistrationData {
    /**
     * Represents team profile information for the team verification page
     */
    export interface TeamProfile extends EntityMembershipFieldData {
        level: string;                          // The level of the team
        name: string;                           // The name of the team
        id: string;                             // Unique identifier for the team.  Used to construct endpoint URL when changing team name
        club: string;                           // The name of the club associated with the team. "Individual Member" if team not associated with club
        member_number: MemberNumberData;        // The member # for the team
        membership_status: {                    // Information about the team's membership status
            active: boolean;                    // Whether the team has active membership
            validity_date_formatted: string;    // The formatted date through which the team's membership is valid
        };
        section?: string;                       // The name of the section the team belongs to, if applicable
    }
}
```