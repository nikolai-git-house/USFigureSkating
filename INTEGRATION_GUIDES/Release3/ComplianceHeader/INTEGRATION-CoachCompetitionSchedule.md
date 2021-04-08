# Compliance Header Integration - Coach Competition Schedule

This document summarizes integration notes surrounding changes and additions to the Competition Portal "Coach
Competition Schedule" page contained within the Compliance Header release.

## Background/Overview

This page was conceived and delivered as part of a previous release. Additionally, the USFS Dev Team introduced changes
to this page following Hawkeye delivery of code. As part of the the Compliance Header release, new functional
requirements have been added to this page, namely the display of detailed compliance information for the active user in
the page header. Given the need for these additions and in the pursuit of reducing future technical debt, foundational
revisions have been made to this page as part of this release.

### Summary of Revisions

1. Reintegration of changes to page introduced by USFS development team after Hawkeye delivery:
   - add framework download schedule links to templates
1. Introduced new data flows to retrieve data for display on page:
   - Created new API endpoint to retrieve necessary page-specific data
     - New endpoint composes response from existing API endpoint with core Competition Portal information
     - API endpoint changes introduce support for Compliance Header information in page:
       - Introduction of active entity summary information and competition summary information
         (`CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse`)
1. Revised page UI component:
   - Upgrade template markup to align with recent methodologies for Competition Portal pages
   - Updated page to align with new data flows
   - Update code style to adhere to latest linting rules

## Changes to Prior Deliverables

1. Coach Competition Schedule page Template (`src/views/pages/H.1_competition-schedule.php`)
   - Reintegrated code added after Hawkeye delivery (noted above)
   - Upgraded markup structure to adhere to support latest Competition Portal structures
     - Note: due to complexity present in sub-component template imports and to prevent integration complexity, the page
       component template has not been transferred to the Vue component and the component location has not been changed.
1. Coach Competition Schedule page Component (`src/js/pages/CoachCompetitionSchedule.vue`)
   - Upgrade page to use recent competition portal page strategies
     - HasDataDependencies mixin
     - CompetitionPortalPage mixin
   - Load page data through new state action
   - Use more recent active competition ID detection
   - Update code style to adhere to recent lint rules
1. Competition Schedule page stylesheet (`src/sass/pages/_competition-schedule.scss`)
   - Style changes necessitated by page markup upgrade

### New Server Side Requirements

As part of this release, support for compliance information for the active user has been added to this page and its
active competition ID detection have been upgraded to latest methodologies. As such, the appropriate "Active Object ID
Information" as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to be set server side when loading
the page. To be specific, the "Active Competition ID" cookie needs to be set in all cases when loading the page.

## API

The following API endpoints are relevant to this update:

### Overview

#### Page Load

Prior to this update, three API endpoints were contacted upon page load in order to load data necessary for the page.

1. "Get Competition Information"
1. "Get Competition Schedule"
1. "Get Coached Skater Schedule"

Additionally, the competition information header was not previously present on ths page.

As part of this update, a new endpoint has been added to load all necessary information to power the page.

### Fetch Competition Portal Coach Competition Schedule

**Purpose:** Load data necessary for the Competition Portal "Competition Schedule (Coach)" page

**Source:** Competition Portal "Competition Schedule (Coach)" page load

**URL:** `GET:/api/competitions/{competition_id}/coach-competition-schedule`

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchCoachCompetitionScheduleApiResponse`

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

   - "Get Competition Information" - (defined `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:390`, subsequently extended)
   - "Get Competition Schedule" - (defined `INTEGRATION_GUIDES/2__INTEGRATION-BATCH2.md:258`, subsequently extended)
   - "Get Competition Coached Skater Schedule" - (defined `INTEGRATION_GUIDES/9__INTEGRATION-COACH_SCHEDULE.md:30`)

Since this change removes the only remaining usages for the "Get Competition Coached Skater Schedule, "Get Competition
Schedule" and "Get Competition Information" endpoints, they have been deprecated as part of this release.

## Data Structures

The following data structures are relevant to this document.

Note, data structures not specified below remain unchanged from previous releases.

```
export namespace CompetitionPortalApi {
    /**
     * API response when fetching information for the Competition Portal "Competition Schedule (Coach)" page
     */
    export interface FetchCoachCompetitionScheduleApiResponse extends FetchCompetitionPortalCoreApiResponse {
        competition_schedule: FetchCompetitionScheduleAPIResponse;  // Information about the competition schedule
        competition_information: CompetitionInformationData;        // Additional information about the specified competition.
        coached_skater_schedule: {                                  // Information about the coach's skaters' schedule for the competition
            sessions: SessionData[];                                // The sessions a coach's skaters are assigned to for the competition
            skater_session_map: SkaterSessionMap;                   // Map tying the skater names to the appropriate sessions
        };
    }
}
```
