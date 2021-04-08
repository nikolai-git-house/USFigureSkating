# Team Portal Integration - Team Personnel
This document summarizes integration notes surrounding the Team Portal "Competition Team Personnel" page contained within the Team Registration/Team Portal release.

## Templates
`src/views/pages/competitions/R.4_competition-team-personnel.php`

This new template file contains the markup necessary to render the Competition Team Personnel page. It consists solely
of a Vue component element with no component properties.

### Server Side Requirements
The appropriate "Active Object ID Information" as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs
to be set server side when loading this page. To be specific, the "Active Competition ID" and the "Active Team ID" cookies
need to be set in all cases when loading the page.

## Functional Overview
### Page Load
Upon page load, the client-side will contact the "Fetch Competition Team Personnel" API endpoint to baseline information for the page.
This endpoint will return:

* Competition Portal core information (Competition Summary, Entity Summary, Back Link Configuration)
* Lists of the actively selected competition team personnel (Coaches, Prop Crew, Team Service Personnel).  Each list item contains:
    * Summary information about the entity (name, member #, ID, etc)
    * Compliance information about the entity
    * Whether the entity is ineligible to participate
* Whether the active team can select prop crew to attend the competition

### Personnel Edit
When the user clicks the add/edit button for any of the team personnel types, the client-side will contact an endpoint to
fetch information to power the Edit screen for that personnel type:

* Coaches => "Fetch Available Competition Coaches"
* Prop Crew => "Fetch Available Competition Prop Crew"
* Team Service Personnel => "Fetch Available Competition Team Service Personnel"

This endoint will return:

* The full list of that personnel type from which the user can modify their selections for who will be attending the competition
    * The information about each entity in this list is less substantial than the information returned by the "Fetch Competition Personnel" endpoint.
* The maximum number of that personnel type the user can select

After this endpoint is contacted for the first time, its response will be cached client-side and the endpoint will not
be contacted again upon subsequent loads of the edit screen of that personnel type until the page is refreshed/reloaded.

### Personnel Edit Confirm
When the user clicks the confirm button on the Edit screen for a personnel type, the client-side will contact an endpoint
to save their selections as well as load updated information about the selected personnel.

* Coaches => "Update Competition Coaches"
* Prop Crew => "Update Competition Prop Crew"
* Team Service Personnel => "Update Competition Team Service Personnel"

The payload for these endpoints will be an array containing the IDs of the selected personnel.  The response for these endpoints
will contain the updated list of selected competition personnel of the specified type resulting from the update (aligns
with the data structures from "Fetch Competition Team Personnel").

## API
The following API endpoints are relevant to this page:


### Fetch Competition Team Personnel

**Purpose:** Fetch information for the Competition Portal "Competition Team Personnel" page

**Source:** "Competition Team Personnel" page load

**URL:** `GET:/api/competitions/{competition_id}/teams/{team_id}/competition-personnel`

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchCompetitionPersonnelApiResponse`

**Notes:**
1. Since this page only applies to teams, there is only one URL for this endpoint. The competition_id and team_id segments of the URL are constructed using the "Active Object ID Information" outlined above
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading team personnel.").
1. The API response extends the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure.  As such, it contains information about the active competition, team (entity), and may contain an optional "Back" link configuration.
1. Within each sub-property of the `competition_team_personnel` property of the response, data elements should be returned in the desired display order.


### Fetch Available Competition Coaches

**Purpose:** Fetch information necessary to power the "Edit Competition Coaches" component on the "Competition Team Personnel" page

**Source:** "Competition Team Personnel" page "Edit"/"Add" Coaches button click

**URL:** `GET:/api/competitions/{competition_id}/teams/{team_id}/available-competition-personnel/coaches`

**Request Payload:** `none`

**Response:** `CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailableCoachesApiResponse`

**Notes:**
1. Since this page only applies to teams, there is only one URL for this endpoint. The competition_id and team_id segments of the URL are constructed using the "Active Object ID Information" outlined above
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading team coaches list.").
1. List entities should be returned in the desired display order
1. It's important that the coaches returned by the "Fetch Competition Team Personnel" endpoint are in the response list, and that their IDs match.
1. Once this endpoint is contacted for the first time, its response will be cached client-side and it will not be contacted again until the page is refreshed/reloaded


### Fetch Available Competition Team Service Personnel

**Purpose:** Fetch information necessary to power the "Edit Competition Team Service Personnel" component on the "Competition Team Personnel" page

**Source:** "Competition Team Personnel" page "Edit"/"Add" Team Service Personnel button click

**URL:** `GET:/api/competitions/{competition_id}/teams/{team_id}/available-competition-personnel/team-service-personnel`

**Request Payload:** `none`

**Response:** `CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailableTeamServicePersonnelApiResponse`

**Notes:**
1. Since this page only applies to teams, there is only one URL for this endpoint. The competition_id and team_id segments of the URL are constructed using the "Active Object ID Information" outlined above
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading team team service personnel list.").
1. List entities should be returned in the desired display order
1. It's important that the team service personnel returned by the "Fetch Competition Team Personnel" endpoint are in the response list, and that their IDs match.
1. Once this endpoint is contacted for the first time, its response will be cached client-side and it will not be contacted again until the page is refreshed/reloaded


### Fetch Available Competition Prop Crew

**Purpose:** Fetch information necessary to power the "Edit Competition Prop Crew" component on the "Competition Team Personnel" page

**Source:** "Competition Team Personnel" page "Edit"/"Add" Prop Crew button click

**URL:** `GET:/api/competitions/{competition_id}/teams/{team_id}/available-competition-personnel/prop-crew`

**Request Payload:** `none`

**Response:** `CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailablePropCrewApiResponse`

**Notes:**
1. Since this page only applies to teams, there is only one URL for this endpoint. The competition_id and team_id segments of the URL are constructed using the "Active Object ID Information" outlined above
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading team prop crew list.").
1. List entities should be returned in the desired display order
1. It's important that the prop crew returned by the "Fetch Competition Team Personnel" endpoint are in the response list, and that their IDs match.
1. Once this endpoint is contacted for the first time, its response will be cached client-side and it will not be contacted again until the page is refreshed/reloaded


### Update Competition Coaches

**Purpose:** Update the list of coaches a team manager has identified as attending a competition with their team

**Source:** "Competition Team Personnel" page "Edit Coaches" component "Confirm" button click.

**URL:** `PATCH:/api/competitions/{competition_id}/teams/{team_id}/competition-personnel/coaches`

**Request Payload:** `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelCoachesApiPayload`

**Response:** `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelCoachesApiResponse`

**Notes:**
1. Since this page only applies to teams, there is only one URL for this endpoint. The competition_id and team_id segments of the URL are constructed using the "Active Object ID Information" outlined above
1. If the submission is unsuccessful for any reason, the interface will display an error message above the “Confirm Coaches” button. If a 2xx response code is sent with a value in the response `error` key, the provided message will display. Otherwise, a generic message will display (“There was an error saving the selected coaches.”)
1. The `competition_coaches` response property should contain coaches in the desired display order.


### Update Competition Team Service Personnel

**Purpose:** Update the list of team service personnel a team manager has identified as attending a competition with their team

**Source:** "Competition Team Personnel" page "Edit Team Service Personnel" component "Confirm" button click.

**URL:** `PATCH:/api/competitions/{competition_id}/teams/{team_id}/competition-personnel/team-service-personnel`

**Request Payload:** `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelTeamServicePersonnelApiPayload`

**Response:** `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelTeamServicePersonnelApiResponse`

**Notes:**
1. Since this page only applies to teams, there is only one URL for this endpoint. The competition_id and team_id segments of the URL are constructed using the "Active Object ID Information" outlined above
1. If the submission is unsuccessful for any reason, the interface will display an error message above the “Confirm Team Service Personnel” button. If a 2xx response code is sent with a value in the response `error` key, the provided message will display. Otherwise, a generic message will display (“There was an error saving the selected team service personnel.”)
1. The `competition_team_service_personnel` response property should contain team service personnel in the desired display order.


### Update Competition Prop Crew

**Purpose:** Update the list of prop crew a team manager has identified as attending a competition with their team

**Source:** "Competition Team Personnel" page "Edit Prop Crew" component "Confirm" button click.

**URL:** `PATCH:/api/competitions/{competition_id}/teams/{team_id}/competition-personnel/prop-crew`

**Request Payload:** `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelPropCrewApiPayload`

**Response:** `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelPropCrewApiResponse`

**Notes:**
1. Since this page only applies to teams, there is only one URL for this endpoint. The competition_id and team_id segments of the URL are constructed using the "Active Object ID Information" outlined above
1. If the submission is unsuccessful for any reason, the interface will display an error message above the “Confirm Prop Crew” button. If a 2xx response code is sent with a value in the response `error` key, the provided message will display. Otherwise, a generic message will display (“There was an error saving the selected prop crew.”)
1. The `competition_prop_crew` response property should contain prop crew in the desired display order.

## Data Structures
The following data structures are relevant to this document:

Notes:
1. Structures in the `TeamRegistrationData` namespace were added in the Team Competition Registration release and are unchanged as part of this update.
1. Structures in the `CompetitionPortalApi` namespace have been added in prior segments of this release and are unchanged as part of this update.
1. The `APISubmissionResponse` structure was defined in a prior release and remains unchanged as part of this update

```
export namespace CompetitionTeamPersonnelApi {
    /**
     * API Response when fetching information for the Competition Portal "Competition Team Personnel" page
     */
    export interface FetchCompetitionPersonnelApiResponse extends CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse {
        competition_team_personnel: CompetitionTeamPersonnelData.CompetitionTeamPersonnel;      // Categorized lists of competition team personnel selected for the competition
        has_prop_crew: boolean;                                                                 // Whether prop crew is applicable to the current team
    }

    /**
     * API response when fetching information to enable the edit coaches screen on the "Competition Team Personnel" page
     */
    export interface FetchTeamPersonnelAvailableCoachesApiResponse {
        team_coaches: TeamRegistrationData.TeamCoachData[];     // The full list of available entities
        coach_maximum: number;                                  // The maximum number of entities allowed for selection
    }

    /**
     * API response when fetching information to enable the edit prop crew screen on the "Competition Team Personnel" page
     */
    export interface FetchTeamPersonnelAvailablePropCrewApiResponse {
        prop_crew: TeamRegistrationData.TeamServicePersonData[];        // The full list of available entities
        prop_crew_maximum: number;                                      // The maximum number of entities allowed for selection
    }

    /**
     * API response when fetching information to enable the edit team service personnel screen on the "Competition Team Personnel" page
     */
    export interface FetchTeamPersonnelAvailableTeamServicePersonnelApiResponse {
        team_service_personnel: TeamRegistrationData.PropCrewPersonData[];      // The full list of available entities
        team_service_personnel_maximum: number;                                 // The maximum number of entities allowed for selection
    }

    /**
     * API payload when updating selected coaches for a competition
     */
    export interface UpdateCompetitionTeamPersonnelCoachesApiPayload extends Array<string> {}

    /**
     * API payload when updating selected prop crew for a competition
     */
    export interface UpdateCompetitionTeamPersonnelPropCrewApiPayload extends Array<string> {}

    /**
     * API payload when updating selected team service personnel for a competition
     */
    export interface UpdateCompetitionTeamPersonnelTeamServicePersonnelApiPayload extends Array<string> {}

    /**
     * API response after updating coach selections
     */
    export interface UpdateCompetitionTeamPersonnelCoachesApiResponse extends APISubmissionResponse {
        competition_coaches: CompetitionTeamPersonnelData.CompetitionTeamPerson[];
    }

    /**
     * API response after updating prop crew selections
     */
    export interface UpdateCompetitionTeamPersonnelPropCrewApiResponse extends APISubmissionResponse {
        competition_prop_crew: CompetitionTeamPersonnelData.CompetitionTeamPerson[];
    }

    /**
     * API response after updating team service personnel selections
     */
    export interface UpdateCompetitionTeamPersonnelTeamServicePersonnelApiResponse extends APISubmissionResponse {
        competition_team_service_personnel: CompetitionTeamPersonnelData.CompetitionTeamPerson[];
    }
}

export namespace CompetitionTeamPersonnelData {
    /**
     * Represents a person associated with a team for a competition (coach, team service person, prop crew)
     */
    export interface CompetitionTeamPerson {
        id: string;                                     // Unique identifier for the person
        first_name: string;                             // First name for the person
        last_name: string;                              // Last name for the person
        is_compliant: boolean;                          // Whether the person is compliant for the person
        is_ineligible: boolean;                         // Whether the person is ineligible to participate
        member_number: MemberNumberData;                // The person's member number
        compliance_summary: StatusSummaryItemData[];    // Summary of the person's compliance information
    }

    /**
     * Represents the full collection of CompetitionTeamPersons associated with a team for a competition
     */
    export interface CompetitionTeamPersonnel {
        coaches: CompetitionTeamPerson[];                   // The list of coaches associated with the team for the competition
        team_service_personnel: CompetitionTeamPerson[];    // The list of team service personnel associated with the team for the competition
        prop_crew?: CompetitionTeamPerson[];                // The list of prop crew associated with the team for the competition
    }
}

/**
 * Represents an item within the status summary (such as compliance/requirements summary) for an entity
 */
export interface StatusSummaryItemData {
    name: string;           // Name of the status item
    complete: boolean;      // Whether the item is complete
}
```