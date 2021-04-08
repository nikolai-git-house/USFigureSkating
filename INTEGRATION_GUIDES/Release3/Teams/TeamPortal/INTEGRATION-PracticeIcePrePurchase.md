# Team Portal Integration - Practice Ice Pre-Purchase

This document summarizes integration notes surrounding changes and additions to the Competition Portal "Practice Ice
Pre-Purchase" page contained within the Team Registration/Team Portal release.

## Background/Overview

This page was conceived and delivered as part of a previous release. Additionally, the USFS Dev Team introduced changes
to this page following Hawkeye delivery of code. As part of the the Team Portal release, new functional requirements
have been added to this page. Given the need for these additions and in the pursuit of reducing future technical debt,
revisions have been made to this page as part of this release.

Additionally, a new API endpoint has been created to facilitate adding credits to a team cart.

### Summary of Revisions

1. Reintegration of changes to page introduced by USFS development team after Hawkeye delivery:
    - updated `src/js/pages/PracticeIce/PracticeIcePrePurchase.vue` to include loading process handling
        - Included whitespace changes
    - added loading indicator to `src/views/pages/C.1.2.b_practice_ice_pre_purchase.php`
        - Included whitespace changes
    - Note: other changes made by USFS were either whitespace-only changes, or changes to files not impacted by this
      update
1. Introduced new data flows to retrieve data for display on page:
    - Created new API endpoint ("Get Practice Ice Pre-Purchase") to retrieve all necessary page data
        - Merge responses from individual API endpoints being contacted upon page load:
            - "Get Competition Information"
            - "Get Competition Schedule"
            - "Get Competition Credits"
            - "Get Skater Competition Schedule"
            - "Get Cart"
        - Add new competition portal core information (competition and entity summaries)
        - Add active sales window property
        - API endpoint changes introduce support for Team Portal information in page:
            - Endpoint URL to determine whether to provide information relative to the active user or one of their
              managed teams
            - Introduction of active entity summary information and competition summary information
              (`CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse`)
1. Revised page UI component:
    - Upgrade template markup (`src/views/pages/C.1.2.b_practice_ice_pre_purchase.php`) to align with recent
      methodologies for Competition Portal pages
    - Updated page component (`src/js/pages/PracticeIce/PracticeIcePrePurchase.vue`) to align with new data flows and
      modern architecture
1. Introduced new data flows when adding credits to a team cart

## Changes to Prior Deliverables

1. Page Template (`src/views/pages/C.1.2.b_practice_ice_pre_purchase.php`)
    - Reintegrated code added after Hawkeye delivery (noted above)
    - Structural revisions to support new data flows and to modernize page
    - Due complexity of sub-component imports, templates were not extracted into Vue component files (in order to reduce
      reintegration complexity)
1. Page Component (`src/js/pages/PracticeIce/PracticeIcePrePurchase.vue`)
    - Upgrade page to use recent competition portal page strategies
        - HasDataDependencies mixin
        - CompetitionPortalPage mixin
    - Load page data through new state action
    - Use more recent active competition ID detection
    - Update code style to adhere to modern conventions (eslint)
1. Page Component (`src/sass/elements/_page-heading.scss`, `src/js/components/Page.vue`)
    - Added support for page subtitles
1. Cart Files
    - Updated to facilitate new add team cart credits endpoint
        - `src/js/components/CreditPurchase.vue`
        - `src/js/services/CartService.ts`
        - `src/js/store/Modules/CartState.ts`

### New Server Side Requirements

As part of this release, support for Teams has been added to this page. As such, the appropriate "Active Object ID
Information" as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to be set server side when loading
the page. To be specific, the "Active Competition ID" cookie needs to be set in all cases when loading the page, and the
"Active Team ID" cookie needs to be set when loading the page for a team.

## API

The following API endpoints are relevant to this update:

### Overview

Prior to this update, multiple API endpoints were contacted upon page load in order to fetch data necessary for the
page.

1. "Get Competition Information" (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:390`)
1. "Get Competition Schedule" (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:490`)
1. "Get Competition Credits" (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:624`)
1. "Get Skater Competition Schedule" (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:563`)
1. "Get Cart" (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:859`, multiple extending iterations)

As part of this update, the responses for these endpoints have been merged into a new "Fetch Practice Ice Pre-Purchase"
endpoint. The response has been further extended to contain new Team Portal data necessary for the page.

Cart Note: The "Get Cart" API endpoint is currently being called when the client-side app loads within the root app
context. Removing this root call is not feasible at this time without introducing unintended side effects. As such, this
endpoint will still be called, but its response will be overwritten with information provided in the new extended API
response.

"Get Competition Schedule" Note: The data from this endpoint does not appear to be used on this page. However, to
prevent unintended side effects, its response has been merged into the combined API response.

### Get Practice Ice Pre-Purchase

**Purpose:** Get information necessary to display the Competition Portal "Practice Ice Pre-Purchase" page

**Source:** Competition Portal "Practice Ice Pre-Purchase" page load

**URL (Active User):** `GET:/api/competitions/{competition_id}/practice-ice-prepurchase`

**URL (Team):** `GET:/api/competitions/{competition_id}/teams/{team_id}/practice-ice-prepurchase`

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchPracticeIcePrePurchaseApiResponse`

**Notes:**

1. Except where otherwise noted, data structures defined in previous releases have not been changed.
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
    - **`cart`:** This should contain information typically returned by the "Get Skater Cart" API endpoint originally
      defined in `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:859` and extended in multiple subsequent releases. When
      called in the team context, it should return the cart for the applicable team.
    - **`competition_information`:** This should contain the information typically returned by the "Fetch Competition
      Information" endpoint, and should not require specific adjustments across contexts.
    - **`active_sales_window`:** This should be populated with the active sales window for the competition. This
      information was previously contained within the data returned by the "Get Competition List"
      (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:330`) endpoint. However, this source is unreliable in the expanding
      contexts of this page, so a dedicated property has been added to this endpoint response for it.
    - **`entity_credits`:** This should contain the response previously provided by the "Get Competition Credits"
      endpoint (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:624`). When called in a team context, the response should
      contain information relative to the team.
    - **`competition_schedule`:** This should contain the information typically returned by the "Get Competition
      Schedule" (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:490`) endpoint, and should not require specific adjustments
      across contexts.
    - **`entity_schedule`:** This should contain the information typically returned by the "Get Skater Competition
      Schedule" (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:563`) endpoint. When called in a team context, the response
      should contain information relative to the team.

### Add Credits to Team Cart

**Purpose:** Add credits to a team cart

**Source:** "Practice Ice Pre-Purchase" page "add to cart" button click

**URL:** `POST: /api/cart/teams/{team_id}/credits`

**Request Payload:** see `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:959`

**Response:** `ApiSubmissionResponse`

**Notes:**

1. This endpoint has identical functionality to the "Add Credits to Skater Cart" endpoint. This new endpoint exists
   solely to specify cases when credits should be added to a specific team's cart rather than the active user's

## Data Structures

The following data structures are relevant to this page. Structures not documented here remain unchanged from their
previous iterations:

```
export namespace CompetitionPortalApi {
    /**
     * API response when fetching information for the Competition Portal "Practice Ice Pre-Purchase Sales" page
     */
    export interface FetchPracticeIcePrePurchaseApiResponse extends FetchCompetitionPortalCoreApiResponse {
        cart: CartDataV3;                                         // The cart relative to practice ice for the specified entity.
        competition_information: CompetitionInformationData;      // Additional information about the specified competition.
        active_sales_window: CompetitionActiveSalesWindowData;    // The active sales window for the specified competition.
        entity_credits: SkaterCompetitionCreditData;              // Information about competition credits/packages for the specified entity.
        competition_schedule: CompetitionScheduleData;            // Information about the competition schedule. Although it appears this is not being used, it's been retained to avoid introducing hidden breaking changes
        entity_schedule: {                                        // Information about the entity's competition schedule.  See: INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:305
            sessions: ScheduledSessionData[];
            events: SkaterEventData[];
        };
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