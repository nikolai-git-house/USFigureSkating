# Team Registration Integration - Event Selection
This document summarizes integration notes surrounding the Team Registration SPA Event Selection Page.

## Templates
No templates are associated with this component that require specific integration

## Cookies
This page relies on the cookies (team_id and competition_id) defined in `INTEGRATION_GUIDES/Release3/TeamRegistrationAndPortal/TeamRegistration/INTEGRATION-TeamRegistrationRegistrationShell.md:10` in
order to construct API endpoint URLs.

## Changes to Existing Files
To support the addition of this page, core functionality from SPD Competition Registration has been extracted into a mixin.
`src/js/components/CompetitionRegistration/EventSelection.vue`
    * The majority of the code for this component has been extracted into `src/js/mixins/EventSelectionMixin.ts`
    * Following extraction, component code has been updated to hook into mixin code
`src/sass/components/competition-registration/components/_event-card.scss`
    * New element has been added to `.event-card` block.
`src/sass/components/competition-registration/pages/_competition-registration-event-selection.scss`
    * New subelement added

## API
The following API endpoints are relevant to this step

### Fetch Event Selection

**Purpose:** Fetch data required to power the Event Selection Page

**Source:** Team Registration SPA Event Selection Page load

**URL:** `GET: /api/competition-registration/competitions/{competition_id}/teams/{team_id}/events`

**Request Payload:** `none`

**Response:** `TeamRegistrationApi.FetchEventSelectionApiResponse`

**Notes:**
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading event selection.").
1. The URL for this endpoint contains segments for the active team and competition IDs.  The client side relies on the cookies
mentioned above in order to construct these URLs.
1. In the case where only a single event is available for selection, the page will not load or perform differently from when there are multiple events available.

### Remove Event

**Purpose:** Remove an event from the team's selections

**Source:** Team Registration SPA Event Selection Page remove event button click

**URL:** `DELETE: /api/competition-registration/competitions/{competition_id}/teams/{team_id}/events/{event_id}`

**Request Payload:** `none`

**Response:** `TeamRegistrationApi.RemoveEventApiResponse`

**Notes:**
1. If the submission is unsuccessful, an error message will display in the UI. If a 2xx response code is sent with a value in the response `error` key, the provided message will display.
   Otherwise, a generic message will display (`Error removing event.`)
2. To align with participant Competition Registration, the updated list of events following the removal is included in the response.  Added and selected events need to be included in this response set.

### Add Event

**Purpose:** Add an event to the team's selections

**Source:** Team Registration SPA Event Selection Page add event button click

**URL:** `PUT: /api/competition-registration/competitions/{competition_id}/teams/{team_id}/events/{event_id}`

**Request Payload:** `none`

**Response:** `TeamRegistrationApi.AddEventApiResponse`

**Notes:**
1. If the submission is unsuccessful, an error message will display in the UI. If a 2xx response code is sent with a value in the response `error` key, the provided message will display.
   Otherwise, a generic message will display (`Error adding event.`)
2. To align with participant Competition Registration, the updated list of events following the removal is included in the response.  Added and selected events need to be included in this response set.



## Data Structures
The following data structures are relevant to the Team Registration SPA Event Selection Page:

```
export namespace TeamRegistrationApi {
    /**
     * API response when fetching information for the Event Selection page
     */
    export interface FetchEventSelectionApiResponse {
        events: TeamRegistrationData.EventSelectionEvent[];      // List of events for the page
    }
    /**
     * API response when removing an event
     */
    export interface RemoveEventApiResponse extends APISubmissionResponse{
        events: TeamRegistrationData.EventSelectionEvent[];      // The updated list of events for the page after the removal
    }
    /**
     * API response when adding an event
     */
    export interface AddEventApiResponse extends APISubmissionResponse{
        events: TeamRegistrationData.EventSelectionEvent[];      // The updated list of events for the page after the add
    }
}
export namespace TeamRegistrationData {
    /**
     * Represents an event available for selection, or already selected, by the current team
     */
    export type EventSelectionEvent = {
        id: number;                     // Unique identifier for the event
        is_registered_for: boolean;     // Whether the event has been registered for by the team
        is_selected: boolean;           // Whether the event has been selected, but not registered for, by the team
        judging_system: string;         // Judging system name
        music_required: boolean;        // Whether music is required
        name: string;                   // Name of the event
        ppc_required: boolean;          // Whether PPC is required
    }
}
```