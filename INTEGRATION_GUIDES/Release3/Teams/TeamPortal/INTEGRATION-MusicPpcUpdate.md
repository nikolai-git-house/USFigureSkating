# Team Portal Integration - Music & PPC

This document summarizes integration notes surrounding changes and additions to the Competition Portal "Music & Planned
Program Content" page contained within the Team Registration/Team Portal release.

## BREAKING CHANGE

As noted below, the endpoint to retrieve PPC form options has been changed. See "Loading PPC" below

## Background/Overview

This page was conceived and delivered as part of a previous release. Additionally, the USFS Dev Team introduced changes
to this page following Hawkeye delivery of code. As part of the the Team Portal release, new functional requirements
have been added to this page. Given the need for these additions and in the pursuit of reducing future technical debt,
revisions have been made to this page as part of this release.

### Summary of Revisions

1. Reintegration of changes to page introduced by USFS development team after Hawkeye delivery:
    - updated typings surrounding various element `id` fields to be strings instead of numbers
    - import of added rhythm and theme features
    - Copied latest versions of USFS template files
1. Introduced new data flows to retrieve data for display on page:
    - Created new API endpoint to retrieve necessary page data
        - New endpoint composes two previous endpoints contacted on page load into a single endpoint
        - API endpoint changes introduce support for Team Portal information in page:
            - Endpoint URL to determine whether to provide information relative to the active user or one of their
              managed teams
            - Introduction of active entity summary information and competition summary information
              (`CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse`)
1. Added support for Transition Descriptions
    - When a PPC Element with a `is_transition` property of `true` is selected, the user must enter a "Description" of
      the transition. Data points supporting this have been added to loading Saved PPC as well as the API payload when
      saving PPC.
1. Revised page UI component:
    - Upgrade template markup to align with recent methodologies for Competition Portal pages
    - Updated page to align with new data flows
1. Revised endpoints surrounding loading and editing:
    - PPC
    - Music
    - Themes
    - Rhythms

## Changes to Prior Deliverables

1. Music and PPC page Template (`src/views/pages/F.1_PPC.php`)
    - Reintegrated code added after Hawkeye delivery (noted above)
    - Structural revisions to support new data flows and to modernize page
    - Due complexity of sub-component imports, templates were not extracted into Vue component files (in order to reduce
      reintegration complexity)
1. Music and PPC page Component (`src/js/pages/MusicAndPPC.vue`)
    - Upgrade page to use recent competition portal page strategies
        - HasDataDependencies mixin
        - CompetitionPortalPage mixin
    - Load page data through new state action
    - Use more recent active competition ID detection
1. Music and PPC page styles (`src/sass/pages/music-and-ppc.scss`) - Revisions to adjust styles to facilitate markup
   updates to page

### New Server Side Requirements

As part of this release, support for Teams has been added to this page. As such, the appropriate "Active Object ID
Information" as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to be set server side when loading
the page. To be specific, the "Active Competition ID" cookie needs to be set in all cases when loading the page, and the
"Active Team ID" cookie needs to be set when loading the page for a team.

## API

The following API endpoints are relevant to this update:

### Overview

#### Page Load

Prior to this update, two API endpoints were contacted upon page load in order to load data necessary for the page.

1. Get Competition Information
1. Get Active User Skater Event Segments

As part of this update, the responses for these two endpoints have been combined into a single endpoint that also
contains new data necessary for the page.

#### Loading PPC

Prior to this update, when a user opens PPC, two API endpoints were contacted:

1. Get PPC (get the active user's PPC for an event) (`INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:604`)
1. Get PPC Form Options (`INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:206`)

These two endpoints have been retained with the following changes:

1. Get PPC (`/api/competitions/<id>/ppc{params}`)
    - Added team endpoint variant (`/api/competitions/<id>/teams/<id>/ppc{params}`)
1. Get PPC Form Options (BREAKING CHANGE) (`/api/ppc-element-options`)
    - In order to support the team version of this endpoint, the singles endpoint URL has been changed to
      `/api/competitions/<id>/ppc-element-options`
    - Added team version (`/api/competitions/<id>/teams/<id>/ppc-element-options`)

Additionally, the "PPC Element" structure defined in `INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:164` has been
extended to include an optional `transition_description` property. This should be populated with the appropriate
information when the "PPC Move" (`INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:48`) associated with the element has
`is_transition` = `true`. Note: This `is_transition` property was already in place.

#### Saving PPC

The endpoint to save PPC (`/api/competitions/<id>/ppc/save`) has been extended to support teams
(`/api/competitions/<id>/teams/<id>/ppc/save`).

Additionally, the API payload when saving PPC has been extended to include an optional `transition_description` property
for each "PPC Element" within the `ppc` key. This field will be present and populated when the "PPC Move" for the
element has a `is_transition` value of `true`.

#### Music

The endpoint to load music (`/api/competitions/<id>/music{params}`) has been extended to support teams
(`/api/competitions/<id>/teams/<id>/music{params}`)

Similarly, the endpoint to save music (`/api/competitions/<id>/music/save`) has been extended to support teams
(`/api/competitions/<id>/teams/<id>/music/save`)

#### Rhythms

The endpoint to load rhythms (`/api/competitions/<id>/rhythms{params}`) has been extended to support teams
(`/api/competitions/<id>/teams/<id>/rhythms{params}`)

Similarly, the endpoint to save rhythms (`/api/competitions/<id>/rhythms/save`) has been extended to support teams
(`/api/competitions/<id>/teams/<id>/rhythms/save`)

#### Theme

The endpoint to load theme (`/api/competitions/<id>/theme{params}`) has been extended to support teams
(`/api/competitions/<id>/teams/<id>/theme{params}`)

Similarly, the endpoint to save theme (`/api/competitions/<id>/theme/save`) has been extended to support teams
(`/api/competitions/<id>/teams/<id>/theme/save`)

### Fetch Music and PPC

**Purpose:** Load data necessary for the "Music and PPC" page

**Source:** "Music and PPC" page load

**URL (NonTeam):** `GET:/api/competitions/{competition_id}/music-and-ppc`

**URL (Team):** `GET:/api/competitions/{competition_id}/teams/{team_id}/music-and-ppc`

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchMusicAndPpcApiResponse`

**Notes:**

1. There are two possible URLs for this endpoint. The endpoint URL that is used depends on whether the active user is
   viewing the page on behalf of one of the teams they manage or on behalf of themselves.
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message
   (`Error loading music and ppc.`).
1. The endpoint response extends the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure. As such,
   the following should be taken into consideration:
    - Summary information about the relevant competition should be returned in the `competition_summary` property (to
      populate the page header)
    - A page "Back" link can be configured using the optional `back_link` property.
    - When returning information for a team, the optional `entity_summary` property should be populated with summary
      information about the team.
    - For non-teams, the `entity_summary` can be populated to display the respective page elements, but this particular
      usage has not been planned for as of this writing and is not currently recommended.
1. This endpoint is partially composed of the responses contained by the following existing API endpoints:

    - Get Competition Information
    - Get Active User Skater Event Segments

## Data Structures

The following data structures are relevant to this document:

```
export namespace CompetitionPortalApi {
    /**
     * API response when fetching information for the Competition Portal "Music & PPC" page
     */
    export interface FetchMusicAndPpcApiResponse extends FetchCompetitionPortalCoreApiResponse {
        entity_event_segments: SkaterSkatingEventSegmentData[];     // see `INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:576`
        competition_information: CompetitionInformationData;        // see `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:390`
    }
}
```
