# Shift Selection Integration - Shift Selection

This document summarizes integration notes surrounding the Competition Portal "Shift Selection" page contained within
the Shift Selection release.

## Templates

`src/views/pages/competitions/S.1_shift-selection.php`

This new template file contains the markup necessary to render the Shift Selection page. It consists solely of a Vue
component element with no component properties.

### Server Side Requirements

The appropriate "Active Object ID Information" as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to
be set server side when loading this page. To be specific, the "Active Competition ID" cookie need to be set when
loading the page.

## Functional Overview

### Page Load

Upon page load, the client-side will contact the "Fetch Competition Portal Shift Selection" API endpoint to load
information for the page. This endpoint will return:

- Competition Portal core information (Competition Summary, Entity Summary, Back Link Configuration)
- The complete volunteer schedule
  - Consists of a list of shifts, and a list of locations
- Key list of shifts previously selected by the user
- Links relevant to the page
- Whether the active user is compliant

The client-side will build out the list of date filters based on the unique `VolunteerShiftSelectionData.Shift.date_ts`
and the corresponding `VolunteerShiftSelectionData.Shift.date_formatted` values returned in the `schedule.shifts`
property. It will also exclude any of these filters from the default set of selections if the `date_ts` property (a unix
timestamp in seconds representing 12:00:00AM UTC on the day the shift occurs) is not greater than or equal to the
corresponding timestamp of the current date. However, if none of the filters meet this criterion (ie: all shifts are in
the past), all date filters will be selected by default.

### Select Shift

When the user clicks the "Select" button for a shift, the client-side will contact the "Select Volunteer Shift" endpoint
to report the intended selection. The client-side expects a response indicating whether the selection was successful as
well as changes to the shift resulting from the shift selection to update the UI.

### Remove Shift

When the user clicks the "Remove" button for a shift, the client-side will contact the "Remove Volunteer Shift" endpoint
to report the intended removal. The client-side expects a response indicating whether the removal was successful as well
as changes to the shift resulting from the shift removal to update the UI.

## API

The following API endpoints are relevant to this page:

### Fetch Competition Portal Shift Selection

**Purpose:** Fetch information for the Competition Portal "Shift Selection" page

**Source:** "Shift Selection" page load

**URL:** `GET:/api/competitions/{competition_id}/volunteer-shift-selection`

**Request Payload:** `none`

**Response:** `CompetitionPortalVolunteerApi.FetchShiftSelectionApiResponse`

**Notes:**

1. Since this page only applies to active users, there is only one URL for this endpoint. The competition_id segment of
   the URL is constructed using the "Active Object ID Information" outlined above
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading
   shift selection.").
1. The API response extends the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure. As such, it
   contains information about the active competition and entity, and may contain an optional "Back" link configuration.
1. In the `schedule` property of the response, data elements for locations should be returned in the desired display
   order.
1. The client-side will automatically sort all shifts in the `schedule` property in order based on their
   `start_datetime_ts` property.
1. If shift selection is not yet available for the competition, the `schedule` property can be omitted from the response
   and a notice will display on the page ("Shift selection is not currently available.")
1. The `selected_shifts` property contains a key indicating the shifts the user has previously selected and the relative
   status of the selections. This property can be omitted if the user has not selected any shifts (the client-side will
   use an empty array)
1. The `date_ts` property of each shift should be a unix timestamp in seconds representing 12:00:00 AM UTC on date in
   which the shift occurs. This value is used to construct the date filters on the page, and is also used to determine
   the initial set of selected date filters.

### Select Volunteer Shift

**Purpose:** Report user intent to select a volunteer shift

**Source:** "Shift Selection" page shift card "select" button click

**URL:** `POST:/api/competitions/{competition_id}/volunteer-schedule/shifts/{shift_id}`;

**Request Payload:** `none`

**Response:** `CompetitionPortalVolunteerApi.SelectVolunteerShiftApiResponse`

**Notes:**

1. Since this page only applies to active users, there is only one URL for this endpoint. The competition_id segment of
   the URL is constructed using the "Active Object ID Information" outlined above
1. The `shift_id` URL segment contains the ID of the shift being selected.
1. If the submission is unsuccessful for any reason, the UI will display an error message. If a 2xx response code is
   sent with a value in the response `error` key, the provided message will display. Otherwise, a generic message will
   display (“Error selecting shift.”)
1. The `result` property of the response contains information about the shift resulting from the selection. This
   information is used to update the UI:
   - `open_positions` - The number of open positions following the selection
   - `openings_status` - Controls the color of the openings displayed in the UI
   - `selection_result` - Whether the result from the selection is the shift entering pending or approved status

### Remove Volunteer Shift

**Purpose:** Report user intent to remove a volunteer shift

**Source:** "Shift Selection" page shift card "remove" button click

**URL:** `DELETE:/api/competitions/{competition_id}/volunteer-schedule/shifts/{shift_id}`

**Request Payload:** `none`

**Response:** `CompetitionPortalVolunteerApi.RemoveVolunteerShiftApiResponse`

**Notes:**

1. Since this page only applies to active users, there is only one URL for this endpoint. The competition_id segment of
   the URL is constructed using the "Active Object ID Information" outlined above
1. The `shift_id` URL segment contains the ID of the shift being removed.
1. If the submission is unsuccessful for any reason, the UI will display an error message. If a 2xx response code is
   sent with a value in the response `error` key, the provided message will display. Otherwise, a generic message will
   display (“Error removing shift.”)
1. The `result` property of the response contains information about the shift resulting from the removal. This
   information is used to update the UI:
   - `open_positions` - The number of open positions following the removal
   - `openings_status` - Controls the color of the openings displayed in the UI
1. This endpoint is also used by the "My Volunteer Schedule" page

## Data Structures

The following data structures are relevant to this page.

```
export namespace CompetitionPortalVolunteerApi {
    /**
     * API response when fetching information for the Competition Portal Volunteer "Shift Selection" page
     */
    export interface FetchShiftSelectionApiResponse extends CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse {
        links: {                                                                // Links for shift selection
            download_schedule: string;                                              // Link to download the full schedule
            user_compliance: string;                                                // Link to location where user can review/resolve compliance issues
        };
        schedule?: {                                                             // Volunteer schedule information.  If not provided, "Shift selection is not currently available" will display
            locations: VolunteerShiftSelectionData.Location[];                      // The locations for the schedule (in desired display order)
            shifts: VolunteerShiftSelectionData.Shift[];                            // The shifts for the schedule. Shifts will be ordered client-side by ascending `start_datetime_ts`
        };
        selected_shifts?: VolunteerShiftSelectionData.SelectedShiftStatus[];    // Key indicating the shifts selected by the users and the corresponding status of each (approved, pending, denied, etc)
        user_is_compliant: boolean;                                             // Whether the user is compliant
        selection_open: boolean;                                                // Whether selection is open
    }

    /**
     * API response when selecting a volunteer shift
     */
    export interface SelectVolunteerShiftApiResponse extends APISubmissionResponse {
        result: VolunteerShiftSelectionData.ShiftSelectionChangeSelectedResponseData;      // Information about the shift following the selection
    }

    /**
     * API response when removing a volunteer shift
     */
    export interface RemoveVolunteerShiftApiResponse extends APISubmissionResponse {
        result: VolunteerShiftSelectionData.ShiftSelectionChangeRemovedResponseData;       // Information about the shift following the removal
    }
}

export namespace VolunteerShiftSelectionData {
    /**
     * Represents a location in the shift selection schedule
     */
    export interface Location {
        id: string;         // Unique Identifier for the location
        name: string;       // Name of the location
    }

    /**
     * Represents information about a user-selected shift
     */
    export interface SelectedShiftStatus {
        shift_id: string;                       // The ID of the shift
        status: SelectedShiftStatusKey;         // The status of the shift selection relative to the user (approved, denied, pending)
    }

    /**
     * Represents a shift in shift selection schedule
     */
    export interface Shift extends CompetitionPortalVolunteerData.VolunteerShift {
        date_ts: number;                        // Unix timestamp representing the date of the shift at 12:00AM UTC.  Used for filtering
        date_formatted: string;                 // String representation of the shift date.  Used for filtering
        location_id: string;                    // ID for the shift's location.  Used to display shift within proper location in UI
        start_datetime_ts: number;              // Unix timestamp representing the start of the shift UTC.  Used to order shifts and for conflict detection.
        end_datetime_ts: number;                // Unix timestamp representing the end of the shift UTC.  Used for conflict detection.
    }

    /**
     * Represents information about a volunteer shift following its selection or removal
     */
    interface ShiftSelectionChangeResponseData {
        open_positions: number;                     // The open positions for the shift following the action
        openings_status: StatusMessageTypeKeyData;  // Controls the UI text color of the openings in the UI
    }

    /**
     * Represents information about a volunteer shift following its selection
     */
    export interface ShiftSelectionChangeSelectedResponseData extends ShiftSelectionChangeResponseData {
        selection_result: 'pending' | 'approved';    // Whether the selection resulted in the shift being in approved or pending status
    }

    /**
     * Represents information about a volunteer shift following its removal
     */
    export interface ShiftSelectionChangeRemovedResponseData extends ShiftSelectionChangeResponseData {
    }

    /**
     * Options for a selected shift's status
     */
    export type SelectedShiftStatusKey =
        | 'approved'                // Shift has been selected and approved
        | 'pending'                 // Shift has been selected and is pending approval
        | 'denied'                  // Shift has been selected and denied
}

export namespace CompetitionPortalVolunteerData {
    /**
     * Represents core information about a volunteer shift
     */
    export interface VolunteerShift {
        description: string;                            // The long-form description of the shift
        end_time_formatted: string;                     // The formatted end time for the shift ("9:00 AM")
        id: string;                                     // Unique identifier for the shift. Used to construct API endpoint URLs
        location_name: string;                          // Name of the location for the shift
        open_positions: number;                         // The number of open positions for the shift
        openings_status: StatusMessageTypeKeyData;      // Controls the color of text in which open_positions is displayed
        position_title: string;                         // The title of the shift position
        requires_compliance: boolean;                   // Whether the shift requires compliance
        start_time_formatted: string;                   // The formatted start time for the shift ("8:00 AM")
        total_positions: number;                        // The total number of positions the shift can accept
    }
}
```
