# Compliance Header Integration - My Schedule

This document summarizes integration notes surrounding changes and additions to the Competition Portal "My Schedule" and "Coach Schedule"
pages contained within the Compliance Header release.

## Background/Overview

These pages were conceived and delivered as part of a previous release. Additionally, the USFS Dev Team introduced
changes to these pages following Hawkeye delivery of code. As part of the the Compliance Header release, new functional
requirements have been added to these pages, namely the display of detailed compliance information for the active user
in the page header. Given the need for these additions and in the pursuit of reducing future technical debt,
foundational revisions have been made to these pages as part of this release.

The two pages in question ("My Schedule" and "Coach Schedule") both use the same page component
(`src/js/pages/MySchedule.vue`=>`src/js/CompetitionPortal/_pages/MySchedule.vue`), but each have their own unique page
templates (`src/views/pages/C.1.1_my_schedule.php`,`src/views/pages/H.1.2_coach-schedule.php`).

### Summary of Revisions

1. Reintegration of changes to page introduced by USFS development team after Hawkeye delivery:
   - added Competition Schedule download link
   - add framework download schedule links to templates
1. Moved Vue page component to new location in file structure. Changed bootstrap registration of page component.
1. Introduced new data flows to retrieve data for display on page:
   - Created new API endpoint to retrieve necessary page-specific data
     - New endpoint composes response from existing API endpoint with core Competition Portal information
     - API endpoint changes introduce support for Compliance Header information in page:
       - Introduction of active entity summary information and competition summary information
         (`CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse`)
1. Revised page UI component:
   - Upgrade template markup to align with recent methodologies for Competition Portal pages
   - Updated page to align with new data flows

## Changes to Prior Deliverables

1. My/Coach Schedule page Templates (`src/views/pages/C.1.1_my_schedule.php`,
   `src/views/pages/H.1.2_coach-schedule.php`)
   - Reintegrated code added after Hawkeye delivery (noted above)
   - Upgraded markup structure to adhere to support latest Competition Portal structures
   - Note: due to multiple pages using the same page component and differences existing between their templates, the
     component template has not been transferred to the Vue component.
   - Added competition/compliance header
1. My Schedule page Component (`src/js/pages/MySchedule.vue`=>`src/js/CompetitionPortal/_pages/MySchedule.vue`)
   - Moved file (as noted above)
   - Changed component registration location from `src/js/bootstrap.ts` to `src/js/CompetitionPortal/bootstrap.ts`
   - Upgrade page to use recent competition portal page strategies
     - HasDataDependencies mixin
     - CompetitionPortalPage mixin
   - Load page data through new state action

### New Server Side Requirements

As part of this release, support for compliance information for the active user has been added to this page and its
methodologies have been upgraded to latest methodologies. As such, the appropriate "Active Object ID Information" as
defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to be set server side when loading the page. To be
specific, the "Active Competition ID" cookie needs to be set in all cases when loading the page.

## API

The following API endpoints are relevant to this update:

### Overview

#### Page Load

Prior to this update, one API endpoint was contacted to load the schedule data for display on the page. The API endpoint
being contacted depended on the context in which the page loaded:

- Coach Schedule - "Get Competition Coached Skater Schedule" `INTEGRATION_GUIDES/9__INTEGRATION-COACH_SCHEDULE.md:30`
- My Schedule - "Get Skater Competition Schedule" `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:563`

Prior to this update, these pages did not feature the competition header.

As part of this update, new endpoints have been added to load all necessary information to power each version of this
page.

### Fetch Competition Portal Coach Schedule

**Purpose:** Fetch information necessary for the "Coach Schedule" page

**Source:** "Coach Schedule" page load

**URL:** `GET:/api/competitions/{competition_id}/my-schedule/coach`

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchMyScheduleCoachApiResponse`

**Notes:**

1. Since this page only applies to coaches, there is only one URL for this endpoint (no teams corollary)
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message
   (`Error loading schedule.`).
1. The endpoint response extends the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure. As such,
   the following should be taken into consideration:
   - Summary information about the relevant competition should be returned in the `competition_summary` property (to
     populate the page header)
   - A page "Back" link can be configured using the optional `back_link` property.
   - The `entity_summary` property should be populated with summary information about the current user. Per current
     specifications, the `name` property should be excluded, but the `compliance` property should be populated with
     detailed compliance information about the active user.
1. This endpoint is partially composed of the responses contained by the following existing API endpoints:
   - "Get Competition Coached Skater Schedule" `INTEGRATION_GUIDES/9__INTEGRATION-COACH_SCHEDULE.md:30`

The "Get Competition Coached Skater Schedule" endpoint has multiple uses, some of which are still used following this
update, so this endpoint is NOT deprecated as part of this release

### Fetch Competition Portal My Schedule

**Purpose:** Fetch information necessary for the "My Schedule" page

**Source:** "My Schedule" page load

**URL:** `GET:/api/competitions/{competition_id}/my-schedule`

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchMyScheduleSkaterApiResponse`

**Notes:**

1. Since this page only applies to skaters, there is only one URL for this endpoint (no teams corollary)
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message
   (`Error loading schedule.`).
1. The endpoint response extends the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure. As such,
   the following should be taken into consideration:
   - Summary information about the relevant competition should be returned in the `competition_summary` property (to
     populate the page header)
   - A page "Back" link can be configured using the optional `back_link` property.
   - The `entity_summary` property should be populated with summary information about the current user. Per current
     specifications, the `name` property should be excluded, but the `compliance` property should be populated with
     detailed compliance information about the active user.
1. This endpoint is partially composed of the responses contained by the following existing API endpoints:
   - "Get Skater Competition Schedule" `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:563`

The "Get Skater Competition Schedule" was previously only used in this context, so it has been deprecated as part of this release.

## Data Structures

The following data structures are relevant to this document.

Note, all data structures not explicitly outlined below remain unchanged as part of this release.

```
export namespace CompetitionPortalApi {
    /**
     * API response when fetching information for the Competition Portal "My Schedule (Coach)" page
     *
     * see: INTEGRATION_GUIDES/9__INTEGRATION-COACH_SCHEDULE.md:30
     */
    export interface FetchMyScheduleCoachApiResponse extends FetchCompetitionPortalCoreApiResponse {
        coach_schedule?: {                          // Information about the coach's skaters' schedule for the competition
            sessions: SessionData[];                // The sessions a coach's skaters are assigned to for the competition
            skater_session_map: SkaterSessionMap;   // Map tying the skater names to the appropriate sessions
        };
        schedule_available: boolean;                // Whether the schedule is available
    }

    /**
     * API response when fetching information for the Competition Portal "My Schedule (Skater)" page
     *
     * see: INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:563
     */
    export interface FetchMyScheduleSkaterApiResponse extends FetchCompetitionPortalCoreApiResponse {
        skater_schedule?: {                         // Information about the skater's schedule for the competition
            sessions: ScheduledSessionData[];       // The skater registered sessions for the competition
            events: SkaterEventData[];              // The skater registered events for the competition
        };
        schedule_available: boolean;                // Whether the schedule is available
    }
}
```
