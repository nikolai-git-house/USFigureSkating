# Shift Selection Integration - My Volunteer Schedule

This document summarizes integration notes surrounding the Competition Portal "My Volunteer Schedule" page contained
within the Shift Selection release.

## Templates

`src/views/pages/competitions/S.0_volunteer-schedule.php`

This new template file contains the markup necessary to render the My Volunteer Schedule page. It consists solely of a
Vue component element with no component properties.

### Server Side Requirements

The appropriate "Active Object ID Information" as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to
be set server side when loading this page. To be specific, the "Active Competition ID" cookie need to be set when
loading the page.

## Functional Overview

### Page Load

Upon page load, the client-side will contact the "Fetch Competition Portal My Volunteer Schedule" API endpoint to load
information for the page. This endpoint will return:

- Competition Portal core information (Competition Summary, Entity Summary, Back Link Configuration)
- The current user's volunteer schedule, grouped by days
- Links relevant to the page
- Whether the active user is compliant

### Remove Shift

When the user clicks the "Remove" button for a shift, the client-side will contact the "Remove Volunteer Shift" endpoint
to report the intended removal. Although additional information is contained in this shared endpoint's response, the
client-side only expects a response indicating whether the removal was successful within this context.

## API

The following API endpoints are relevant to this page:

### Fetch Competition Portal My Volunteer Schedule

**Purpose:** Fetch information for the Competition Portal "My Volunteer Schedule" page

**Source:** "My Volunteer Schedule" page load

**URL:** `GET:/api/competitions/{competition_id}/volunteer-schedule`

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchMyVolunteerScheduleApiResponse`

**Notes:**

1. Since this page only applies to active users, there is only one URL for this endpoint. The competition_id segment of
   the URL is constructed using the "Active Object ID Information" outlined above
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading
   volunteer schedule.").
1. The API response extends the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure. As such, it
   contains information about the active competition and entity, and may contain an optional "Back" link configuration.
1. In the `schedule` property of the response, data elements for schedule days (and shifts within those days) should be
   returned in the desired display order.

### Remove Volunteer Shift

**Purpose:** Report user intent to remove a volunteer shift

**Source:** "My Volunteer Schedule" page shift card "remove" button click

**URL:** `DELETE:/api/competitions/{competition_id}/volunteer-schedule/shifts/{shift_id}`

**Request Payload:** `none`

**Response:** `CompetitionPortalVolunteerApi.RemoveVolunteerShiftApiResponse`

**Notes:**

1. Since this page only applies to active users, there is only one URL for this endpoint. The competition_id segment of
   the URL is constructed using the "Active Object ID Information" outlined above
1. The `shift_id` URL segment contains the ID of the shift being removed.
1. If the submission is unsuccessful, the interface will display an error message. If a 2xx response code is sent with a
   value in the response `error` key, the provided message will display. Otherwise, a generic message will display
   (“Error removing shift.”)
1. The `result` property of the response contains information about the shift resulting from the removal. This
   information is not used in this context since the shift is removed from the UI following a successful submission.
1. This endpoint is also used by the "Shift Selection" page

## Data Structures

The following data structures are relevant to this page.

```
export namespace CompetitionPortalVolunteerApi {
    /**
     * API response when fetching information for the Competition Portal "My Volunteer Schedule" page
     */
    export interface FetchMyVolunteerScheduleApiResponse extends CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse {
        links: {                                                        // Links present on the volunteer schedule page
            download_schedule: string;                                      // Link to download the user's volunteer schedule
            product_support: string;                                        // Link to EMS product support form
            user_compliance: string;                                        // Link to location where user can review/resolve compliance issues
        };
        schedule: MyVolunteerScheduleData.MyVolunteerScheduleDay[];     // The user's schedule
        user_is_compliant: boolean;                                     // Whether the user is compliant
        volunteer_contacts: CompetitionContactData[];                   // Volunteer contacts to display (in desired order)
    }
}

export namespace MyVolunteerScheduleData {
    /**
     * Represents a day in a user's volunteer schedule
     */
    export interface MyVolunteerScheduleDay {
        date_formatted: string;                 // The formatted date of the day in the schedule ("Mon 7/22")
        shifts: MyVolunteerScheduleShift[];     // The shifts in the user's schedule for that day (in order)
    }

    /**
     * A shift in a user's volunteer schedule
     */
    export interface MyVolunteerScheduleShift extends CompetitionPortalVolunteerData.VolunteerShift {
        is_approved: boolean;                   // Whether the shift is approved
        is_pending: boolean;                    // Whether the shift is pending
    }
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
