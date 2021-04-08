# Team Portal Integration - Practice Ice Schedule

This document summarizes integration notes surrounding changes and additions to the Competition Portal "Practice Ice
Schedule" page contained within the Team Registration/Team Portal release.

## Background/Overview

This page was conceived and delivered as part of a previous release. Additionally, the USFS Dev Team introduced changes
to this page following Hawkeye delivery of code. As part of the the Team Portal release, new functional requirements
have been added to this page. Given the need for these additions and in the pursuit of reducing future technical debt,
revisions have been made to this page as part of this release.

### Summary of Revisions

1. Reintegration of changes to page introduced by USFS development team after Hawkeye delivery:
    - updated `src/js/pages/PracticeIce/RinkSchedule.vue` session message timeout and typescript annotation
    - updated page title on `src/views/pages/C.1.2_practice_ice.php`
    - Note: other changes made by USFS were either whitespace-only changes, or changes to files not impacted by this
      update
1. Introduced new data flows to retrieve data for display on page:
    - Extended existing endpoint ("Get Practice Ice Schedules") previously used solely for page schedules to retrieve
      all necessary page data
        - Retain existing response properties unchanged
        - Merge responses from additional API endpoints being contacted upon page load:
            - Get Competition Information
            - Get Cart
            - Get User Credits
        - Add new competition portal core information (competition and entity summaries)
        - Add active sales window property
        - API endpoint changes introduce support for Team Portal information in page:
            - Endpoint URL to determine whether to provide information relative to the active user or one of their
              managed teams
            - Introduction of active entity summary information and competition summary information
              (`CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse`)
1. Revised page UI component:
    - Upgrade template markup (`src/views/pages/C.1.2_practice_ice.php`) to align with recent methodologies for
      Competition Portal pages
    - Updated page component (`src/js/pages/PracticeIce/PracticeIceSchedule.vue`) to align with new data flows and
      modern architecture
    - Updated page sub-component (`src/js/pages/PracticeIce/RinkSchedule.vue`) to disable session selection when viewed
      in a team context.
    - Updated page to hide checkout/credits footer when viewed in a team context.

## Changes to Prior Deliverables

-   Page Template (`src/views/pages/C.1.2_practice_ice.php`)
    -   Reintegrated code added after Hawkeye delivery (noted above)
    -   Structural revisions to support new data flows and to modernize page
    -   Due complexity of sub-component imports, templates were not extracted into Vue component files (in order to
        reduce reintegration complexity)
-   Page Component (`src/js/pages/PracticeIce/PracticeIceSchedule.vue`)
    -   Upgrade page to use recent competition portal page strategies
        -   HasDataDependencies mixin
        -   CompetitionPortalPage mixin
    -   Load page data through new state action
    -   Use more recent active competition ID detection
-   Rink Schedule Sub-component (`src/js/pages/PracticeIce/RinkSchedule.vue`)
    -   Added logic to disable session selection when viewing as a team.
-   Stylesheet (`src/sass/pages/_practice-ice.scss`)
    -   Changes to support markup revisions

### New Server Side Requirements

As part of this release, support for Teams has been added to this page. As such, the appropriate "Active Object ID
Information" as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to be set server side when loading
the page. To be specific, the "Active Competition ID" cookie needs to be set in all cases when loading the page, and the
"Active Team ID" cookie needs to be set when loading the page for a team.

## API

The following API endpoints are relevant to this update:

### Overview

Prior to this update, four API endpoints were contacted upon page load in order to fetch data necessary for the page.

1. "Get Competition Information" (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:390`)
1. "Get Practice Ice Schedules" (`INTEGRATION_GUIDES/10__INTEGRATION-PRACTICE-ICE-SCHEDULE-UPDATE.md:33`)
1. "Get Competition Credits" (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:624`)
1. "Get Cart" (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:859`, multiple extending iterations)

As part of this update, the responses for these endpoints have been merged into the "Get Practice Ice Schedules"
endpoint. The response has been further extended to contain new Team Portal data necessary for the page.

Cart Note: The "Get Cart" API endpoint is currently being called when the client-side app loads within the root app
context. Removing this root call is not feasible at this time without introducing unintended side effects. As such, this
endpoint will still be called, but its response will be overwritten with information provided in the new extended API
response.

### [Extended] Get Practice Ice Schedules

This endpoint was defined in `INTEGRATION_GUIDES/10__INTEGRATION-PRACTICE-ICE-SCHEDULE-UPDATE.md:33`. It has been
extended for this release as follows:

**Purpose:** Get information necessary to display the Competition Portal "Practice Ice" page

**Source:** Competition Portal "Practice Ice" page load

**URL (Active User):** [Unchanged] `GET:/api/competitions/{competition_id}/practice-ice-schedules`

**URL (Team):** [New] `GET:/api/competitions/{competition_id}/teams/{team_id}/practice-ice-schedules`

**Request Payload:** `none`

**Response:** [Extended] `CompetitionPortalApi.FetchPracticeIceScheduleApiResponse` (formerly
`PracticeIceSchedulesData`)

**Notes:**

1. Except where otherwise noted, the response data of this endpoint remains unchanged.
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
1. Response body notes:
    - **`PracticeIceSchedulesData`:** The new response extends the previous response type of `PracticeIceSchedulesData`.
      When the endpoint is called from a non-team context, no changes will be necessary to the `competition_schedule`
      and `mapped_skater_schedule` properties. When called from a team context, the `mapped_skater_schedule` property
      should contain information relative to the team.
    - **`competition_information`:** The new response contains a `competition_information` property. This should contain
      the information typically returned by the "Fetch Competition Information" endpoint, and should not require
      specific adjustments across contexts.
    - **`active_sales_window`:** The response contains a new `active_sales_window` property. This should be populated
      with the active sales window for the competition. This information was previously contained within the data
      returned by the "Get Competition List" (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:330`) endpoint. However, this
      source is unreliable in the expanding contexts of this page, so a dedicated property has been added to this
      endpoint response for it.
    - **`entity_credits`:** The new response contains a `entity_credits` property. This should contain the response
      previously provided by the "Get Competition Credits" endpoint (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:624`).
      When called in a team context, the response should contain information relative to the team. As of this writing,
      credit use and display is disabled on the page. As such, this information is not currently being used in a team
      context, so empty representations of their structures can be provided with no ill effects.
    - **`cart`:** The new response contains a `cart` property. This should contain information typically returned by the
      "Get Skater Cart" API endpoint originally defined in `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:859` and extended
      in multiple subsequent releases. When called in the team context, it should return the cart for the applicable
      team.


## Data Structures

The following data structures are relevant to this page.  Structures not documented here remain unchanged from their previous iterations:
```
export namespace CompetitionPortalApi {
    /**
     * API response when fetching information for the Competition Portal "Practice Ice/Schedule" page
     */
    export interface FetchPracticeIceScheduleApiResponse extends FetchCompetitionPortalCoreApiResponse, PracticeIceSchedulesData {
        cart: CartDataV3;                                         // The cart relative to practice ice for the specified entity.
        entity_credits: SkaterCompetitionCreditData;              // Information about competition credits/packages for the specified entity.
        competition_information: CompetitionInformationData;      // Additional information about the specified competition.
        active_sales_window: CompetitionActiveSalesWindowData;    // The active sales window for the specified competition.
    }
}

/**
 * A key to identify an active competition's sales window
 *
 * 2020-07-13 - enum defined from previous string type with guidelines for usage
 */
export type CompetitionActiveSalesWindowData =
    'open_sales' |
    'none' |
    'pre_purchase' |
    'selection' |
    'on_site';
```
