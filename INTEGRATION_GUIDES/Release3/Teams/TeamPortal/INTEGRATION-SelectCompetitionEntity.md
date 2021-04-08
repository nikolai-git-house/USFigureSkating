# Team Portal Integration - Select Competition Entity

This document summarizes integration notes surrounding workflow updates surrounding the Search Competitions pathway into
the Competition Portal Main Page as part of the Team Registration/Team Portal release.

## Overview

With the addition of Competition Portal access for teams, it is now possible for a user to access Competition Portal
pages as themselves (active user) or as one of the teams they manage that is registered for the competition.

Prior to this update, there is not a way for a user to identify that they would like to view a competition as one of the
teams they manage from the "Search Competitions" page. This update adds functionality to support this use case by
directing the user to a new page where they will select which entity they would like to view the competition as.

## Search Competitions Updates

The "Search Competitions" page loads its data through the "Fetch Competition Search Competitions" API endpoint defined
in `INTEGRATION_GUIDES/Release3/ScheduleAccess/ScheduleAccessAPI.md:7`. Each competition in the list of returned data
contains a `view_competition_link` property.

This property needs to be extended server side to return a link to this new "Select Competition Entity" page in the case
where the active user has one or more teams registered for the competition. This link needs to be constructed such that
the server side can set the "Active Competition ID" cookie as described in
`INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` when loading the "Select Competition Entity" page.

For users that don't manage any teams registered for a competition, the `view_competition_link` should take the user
directly to the competition portal main page (self view) for the respective competition.

## Functionality Overview

When this new page loads, it will contact the "Fetch Competition Selectable Entities" API endpoint to fetch data in
order to display a list of the entities they can choose from in order to view the competition, as well as summary
information about the competition.

The first item in this list should always be the active user as themselves. The name of this
`CompetitionPortalData.CompetitionSelectableEntity` should be the active user's name with "(Myself)" appended, if
desired.

Each item in the list of entities contains a `links.competition_portal` property. This should be a link to the
Competition Portal Main page and should be constructed so that the server side can set the appropriate "Active Object ID
Information" as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD`. Specifically, the link should be
constructed so that the "Active Competition ID" cookie can be set in all cases, and the "Active Team ID" cookie can be
set for team entities.

## Templates

`src/views/pages/competitions/R.0.5_select-competition-entity.php`

This new template file contains the markup necessary to render the "Select Competition Entity" page. It consists solely
of a Vue component element with no component properties.

## API

The following API endpoints are relevant to this page:

### Fetch Competition Selectable Entities

**Purpose:** Fetch information to power the "Select Competition Entity" page, including summary information about the
competition and a list of entities the active user can choose to view the specified competition as

**Source:** "Select Competition Entity" page load

**URL:** `GET: /api/competitions/{competition_id}/entity-select`

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchEntitySelectApiResponse`

**Notes:**

1.  If the current user does not have sufficient permissions to view the information, or if the information can't be
    found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading
    competition registrant information.").
1.  The `CompetitionPortalApi.FetchEntitySelectApiResponse` extends the
    `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure. As such, the following should be taken into
    consideration:
    - Summary information about the relevant competition should be returned in the `competition_summary` property (to
      populate the page header)
    - A page "Back" link can be configured using the optional `back_link` property.
    - Since an "active entity" has not been determined at this point, the `entity_summary` should not be included in
      this response.
1.  The `competition_id` segment of the url is populated from the cookie described in
    `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD`
1.  The `entities` property of the response contains a list of `CompetitionPortalData.CompetitionSelectableEntity`
    items. Though this data structure is unique, it closely mirrors the `TeamsData.ManagedTeam` structure in order to
    closely align with the "My Teams" and "Select a team to register" pages. In this context, the `level` property is
    optional (to support display of the active user), the `selection_information` property removed, and the addition of
    a `links` property.
1.  Items in the `entities` property should be returned in the desired display order. It's recommended that the first
    item in the list represents the active user and features "(Myself)" appended to the end of their name.
1.  The `links.competition_portal` property of each item in the `entities` list should be constructed such that the
    server side can set the "Active Competition ID" and "Active Team ID" (if appropriate) cookies as described in
    `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` when loading the Competition Portal Main page. Note: The link for
    the active user should ensure the "Active Team ID" is not present when loading the subsequent page.

## Data Structures

The following data structures are relevant to this page.

```
export namespace CompetitionPortalApi {
  /**
   * API response when fetching information for the Competition Portal "Select Competition Entity" page
   */
  export interface FetchEntitySelectApiResponse extends FetchCompetitionPortalCoreApiResponse {
      entities: CompetitionPortalData.CompetitionSelectableEntity[];  // The list of entities (managed teams and user's self) the active user can choose to view the competition as.
  }
}

export namespace CompetitionPortalData {
    /**
     * Represents a team managed by the active user registered for a particular competition
     */
    export interface CompetitionSelectableEntity {
        name: string;                           // The name of the entity
        id: string;                             // Unique identifier for the entity
        level?: string;                         // Level for the entity, if applicable
        member_number: MemberNumberData;        // The member # for the entity
        membership_status: {                    // Information about the entity's membership status
            active: boolean;                    // Whether the entity has active membership
            validity_date_formatted: string;    // The formatted date through which the entity's membership is valid
        };
        links: {
            competition_portal: string;         // Link to view the appropriate competition portal as the entity
        };
    }
}
```
