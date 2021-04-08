# Team Portal Integration - Competition Schedule

This document summarizes integration notes surrounding changes and additions to the Competition Portal "Competition
Schedule" page contained within the Team Registration/Team Portal release.

## Background/Overview

This page was conceived and delivered as part of a previous release. As part of the the Team Portal release, new
functional requirements have been added to this page. Given the need for these additions and in the pursuit of reducing
future technical debt, revisions have been made to this page as part of this release.

### Summary of Revisions

1. Introduced new data flows to retrieve data for display on page:
   - Created new API endpoint to retrieve all necessary page data
     - Include response from previous API endpoint being contacted upon page load:
       - Get Competition Schedule
     - Add new competition portal core information (competition and entity summaries)
     - API endpoint changes introduce support for Team Portal information in page:
       - Endpoint URL to determine whether to provide information relative to the active user or one of their managed
         teams
       - Introduction of active entity summary information and competition summary information
         (`CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse`)
1. Revised page UI component:
   - Upgrade template markup (`src/js/CompetitionSchedule/CompetitionSchedule.vue`) to align with recent methodologies
     for Competition Portal pages
   - Updated page component (`src/js/CompetitionSchedule/CompetitionSchedule.vue`) to align with new data flows and
     modern architecture

## Changes to Prior Deliverables

- Page Template and Component (`src/js/CompetitionSchedule/CompetitionSchedule.vue`)
  - Structural revisions to support new data flows and to modernize page
  - Upgrade page to use recent competition portal page strategies
    - CompetitionPortalPage mixin
    - Remove HasVariableCompetitionHeading mixin
  - Load page data through new state action
  - Use more recent active competition ID detection

### New Server Side Requirements

As part of this release, support for Teams has been added to this page. As such, the appropriate "Active Object ID
Information" as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to be set server side when loading
the page. To be specific, the "Active Competition ID" cookie needs to be set in all cases when loading the page, and the
"Active Team ID" cookie needs to be set when loading the page for a team.

## API

The following API endpoints are relevant to this update:

### Overview

Prior to this update, two API endpoints were contacted upon page load in order to fetch data necessary for the page.

1. "Get Competition Schedule" (`INTEGRATION_GUIDES/16_INTEGRATION-SCHEDULE-ACCESS.md:130`)
1. "Fetch Competition Page Heading" (`INTEGRATION_GUIDES/Release3/ScheduleAccess/ScheduleAccessAPI.md:88`)

As part of this update, the practical intent for these endpoints have been merged into the new "Get Competition Portal
Competition Schedule" endpoint. The "Fetch Competition Page Heading" response has been superseded by the new
`CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure, which also includes new Team Portal data
necessary for the page.

### Get Competition Portal Competition Schedule

**Purpose:** Get information needed by the Competition Portal "CompetitionSchedule" page

**Source:** Competition Portal "CompetitionSchedule" page load

**URL (Non-Teams):** `/api/competitions/{competition_id}/competition-schedule`

**URL (Teams):** `/api/competitions/{competition_id}/teams/{team_id}/competition-schedule`

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchCompetitionScheduleApiResponse`

**Notes:**

1. This new endpoint should not be confused with the "Get Competition Schedule"
   (`INTEGRATION_GUIDES/16_INTEGRATION-SCHEDULE-ACCESS.md:130`) endpoint it is absorbing. This existing endpoint should
   be left in place, as it may still be needed by other pages/components.
1. There are two possible URLs for this endpoint. The endpoint URL that is used depends on whether the active user is
   viewing the page on behalf of one of the teams they manage or on behalf of themselves.
1. The endpoint response extends the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure. As such,
   the following should be taken into consideration:
   - Summary information about the relevant competition should be returned in the `competition_summary` property (to
     populate the page header)
   - A page "Back" link can be configured using the optional `back_link` property.
   - When returning information for a team, the optional `entity_summary` property should be populated with summary
     information about the team.
   - For non-teams, the `entity_summary` can be populated to display the respective page elements, but this particular
     usage has not been planned for as of this writing and is not currently recommended.
1. The `competition_schedule` property of the response should contain the exact same information returned by the "Get
   Competition Schedule" endpoint for a competition

## Data Structures

The following data structures are relevant to this page. Structures not documented here remain unchanged from their
previous iterations:

```
export namespace CompetitionPortalApi {
    /**
     * API response when fetching information for the Competition Portal "Competition Schedule" page
     */
    export interface FetchCompetitionScheduleApiResponse extends FetchCompetitionPortalCoreApiResponse {
        competition_schedule: FetchCompetitionScheduleAPIResponse;  // Information about the competition schedule
    }
}
```
