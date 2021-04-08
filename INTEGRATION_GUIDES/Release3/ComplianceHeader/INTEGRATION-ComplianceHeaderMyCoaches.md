# Compliance Header Integration - My Coaches

This document summarizes integration notes surrounding changes and additions to the Competition Portal "My Coaches" page
contained within the Compliance Header release.

## Background/Overview

This page was conceived and delivered as part of a previous release. Additionally, the USFS Dev Team introduced changes
to this page following Hawkeye delivery of code. As part of the the Compliance Header release, new functional
requirements have been added to this page, namely the display of detailed compliance information for the active user in
the page header. Given the need for these additions and in the pursuit of reducing future technical debt, foundational
revisions have been made to this page as part of this release.

### Summary of Revisions

1. Reintegration of changes to page introduced by USFS development team after Hawkeye delivery:
   - Revised page header lead text
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

1. My Coaches page Template (`src/views/pages/E.3_my-coaches.php`)
   - Reintegrated code added after Hawkeye delivery (noted above)
   - Upgraded markup structure to adhere to support latest Competition Portal structures
   - Note: due to complexity present in sub-component template imports and to prevent integration complexity, the page
     component template has not been transferred to the Vue component and the component location has not been changed.
1. My Coaches page Component (`src/js/pages/MyCoaches/MyCoaches.vue`)
   - Upgrade page to use recent competition portal page strategies
     - HasDataDependencies mixin
     - CompetitionPortalPage mixin
   - Load page data through new state action
   - Use more recent active competition ID detection
   - Update code style to adhere to recent lint rules
   - Set state properties for active competition ID to facilitate Coach replacement and search functionality
1. My Coaches page stylesheet (`src/sass/pages/_my-coaches.scss`)
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

Prior to this update, one API endpoint was contacted upon page load in order to load data necessary for the coach list
on the page:

1. "Get Competition Event Coaches" `INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:480`

Additionally, the competition information header was populated with data loaded into the user's competition list.

As part of this update, a new endpoint has been added to load all necessary information to power the page.

#### Coach Search, Adding, Removing and Replacing Coaches

The endpoints related to searching, adding, removing and replacing coaches have not been changed as part of this
release.

### Fetch Competition Portal My Coaches

**Purpose:** Load data necessary for the Competition Portal "My Coaches" page

**Source:** Competition Portal "My Coaches" page load

**URL:** `GET:/api/competitions/{competition_id}/my-coaches`

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchMyCoachesApiResponse`

**Notes:**

1. Since this page only applies to skaters, there is only one URL for this endpoint (no teams corollary)
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message
   (`Error loading coach information.`).
1. The endpoint response extends the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure. As such,
   the following should be taken into consideration:
   - Summary information about the relevant competition should be returned in the `competition_summary` property (to
     populate the page header)
   - A page "Back" link can be configured using the optional `back_link` property.
   - The `entity_summary` property should be populated with summary information about the current user. Per current
     specifications, the `name` property should be excluded, but the `compliance` property should be populated with
     detailed compliance information about the active user.
1. This endpoint is partially composed of the responses contained by the following existing API endpoints:
   - "Get Competition Event Coaches" `INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:480`

Since the only existing use case for the existing "Get Competition Event Coaches" endpoint was for this page, this API
endpoint has been deprecated.

## Data Structures

The following data structures are relevant to this document.

Note, the `SkaterCoachedEventCategoryData` schema was previously defined and remains unchanged as part of this release.

```
export namespace CompetitionPortalApi {
    /**
     * API response when fetching information for the Competition Portal "My Coaches" page
     *
     * see: INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:479
     */
    export interface FetchMyCoachesApiResponse extends FetchCompetitionPortalCoreApiResponse {
        event_categories: SkaterCoachedEventCategoryData[]; // The event categories and their associated coaches a skater has for a given competition
    }
}
```
