# Compliance Header Integration - My Skaters

This document summarizes integration notes surrounding changes and additions to the Competition Portal "My Skaters" page
contained within the Compliance Header release.

## Background/Overview

This page was conceived and delivered as part of a previous release. Additionally, the USFS Dev Team introduced changes
to this page following Hawkeye delivery of code. As part of the the Compliance Header release, new functional
requirements have been added to this page, namely the display of detailed compliance information for the active user in
the page header. Given the need for these additions and in the pursuit of reducing future technical debt, foundational
revisions have been made to this page as part of this release.

### Summary of Revisions

1. Reintegration of changes to page introduced by USFS development team after Hawkeye delivery:
   - added `music_required` and `ppc_required` properties and related conditional display logic
1. Transferred inline page template to Vue page component template
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

1. My Skaters page Template (`src/views/pages/E.2_my_skaters.php`)
   - Reintegrated code added after Hawkeye delivery (noted above)
   - Removed page template markup (transferred to Vue component)
   - Removed obsolete page component properties (`inline-template` and `v-cloak`)
1. My Skaters page Component (`src/js/pages/MySkaters.vue` => `src/js/CompetitionPortal/_pages/MySkaters.vue`)
   - Moved file (as noted above)
   - Changed component registration location from `src/js/bootstrap.ts` to `src/js/CompetitionPortal/bootstrap.ts`
   - Imported page template markup
   - Upgrade page to use recent competition portal page strategies
     - HasDataDependencies mixin
     - CompetitionPortalPage mixin
   - Load page data through new state action
   - Use more recent active competition ID detection

### New Server Side Requirements

As part of this release, support for compliance information for the active user has been added to this page and its
methodologies have been upgraded to latest methodologies. As such, the appropriate "Active Object ID Information" as
defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to be set server side when loading the page. To be
specific, the "Active Competition ID" cookie needs to be set in all cases when loading the page.

## API

The following API endpoints are relevant to this update:

### Overview

#### Page Load

Prior to this update, one API endpoints was contacted upon page load in order to load data necessary for the skater list
on the page:

1. "Get Competition Skaters" `INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:386`

Additionally, the competition information header was populated with data loaded into the user's competition list.

As part of this update, a new endpoint has been added to load all necessary information to power the page.

### Fetch Competition Portal My Skaters

**Purpose:** Load data necessary for the Competition Portal "My Skaters" page

**Source:** Competition Portal "My Skaters" page load

**URL:** `GET:/api/competitions/{competition_id}/coach-skaters`

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchMySkatersApiResponse`

**Notes:**

1. Since this page only applies to coaches, there is only one URL for this endpoint (no teams corollary)
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message
   (`Error loading skater information.`).
1. The endpoint response extends the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure. As such,
   the following should be taken into consideration:
   - Summary information about the relevant competition should be returned in the `competition_summary` property (to
     populate the page header)
   - A page "Back" link can be configured using the optional `back_link` property.
   - The `entity_summary` property should be populated with summary information about the current user. Per current
     specifications, the `name` property should be excluded, but the `compliance` property should be populated with
     detailed compliance information about the active user.
1. This endpoint is partially composed of the responses contained by the following existing API endpoints:
   - "Get Competition Skaters" `INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:386`

Since the only existing use case for the existing "Get Competition Skaters" endpoint was for this page, this API
endpoint has been deprecated.

## Data Structures

The following data structures are relevant to this document.

Note, the `CoachSkaterData` schema was previously defined and remains unchanged as part of this release.

```
export namespace CompetitionPortalApi {
    /**
     * API response when fetching information for the Competition Portal "My Skaters" page
     */
    export interface FetchMySkatersApiResponse extends FetchCompetitionPortalCoreApiResponse {
        skaters: CoachSkaterData[];     // The list of skaters the active user coaches for the competition
    }
}
```
