# Team Portal Integration - Competition Portal Main
This document summarizes integration notes surrounding changes and additions to the Competition Portal Main page
contained within the Team Registration/Team Portal release.

## Changes to Prior Deliverables

### "Fetch View Competition Competition" API endpoint
This API endpoint added in the Schedule Access release and defined in `INTEGRATION_GUIDES/Release3/ScheduleAccess/ScheduleAccessAPI.md:28`
has been modified as part of this release.  The full summary of changes is outlined below.


### Navigation
In order to support the addition of extended messaging on the Competition Portal Main Navigation links, changes to the
surrounding data structures have been made as part of this release.

Full documentation surrounding these changes can be found in
`INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionPortalMainNavigation.md`

These changes result in the obsolescence of the `CompetitionUserNavigationListData` schema, so it and related structures
have been removed as part of this release.


### New Server Side Requirements
As part of this release, support for Teams has been added to this page.  As such, the appropriate "Active Object ID Information"
as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD:31` needs to be set server side when loading the page.
To be specific, the "Active Competition ID" cookie needs to be set in all cases when loading the page,
and the "Active Team ID" cookie needs to be set when loading the page for a team.


## Templates
No new templates have been added to support the changes to this page contained in this release. However, the following
minor changes have been implemented:

* `src/views/pages/O.2_view_competition.php`
    * The `back_link` component property has been removed.  This information will now be provided through API data.
    * The `v-cloak` attribute has been removed from the page component as it is no longer necessary.

## API

### [Modified] Fetch Competition Portal Main (fka "Fetch View Competition Competition")

**Purpose:** Fetch information to power the Competition Portal Main page

**Source:** Competition Portal Main page load

**URL:** [Changed] `GET: /api/competitions/{competition_id}/main` (Non-Team) (changed from `GET: /api/view-competition/{competition_id}`)
**URL:** [New] `GET: /api/competitions/{competition_id}/teams/{team_id}/main` (Teams)

**Request Payload:** `none`

**Response:** [Changed] `CompetitionPortalApi.FetchCompetitionMainApiResponse`

**Notes:**

1. There are two possible URLs for this endpoint.  The endpoint URL that is used depends on whether the active user is viewing the page on behalf of one of the teams they manage or on behalf of themselves.
1. [Unchanged] If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message (`Error loading competition information.`).
1. The API response for this endpoint has been modified to facilitate the requirements of this release in the following ways:
    * The expected response body has changed from `FetchViewCompetitionAPIResponse` to `CompetitionPortalApi.FetchCompetitionMainApiResponse`
        * In order to facilitate the addition of new information needed by this endpoint, the properties contained within
        the prior response (`ViewCompetitionData` structure) have been moved into a `competition` property of the new
        response.  The structure of this information remains unchanged except where otherwise specified.
        * The new response body contains the following new properties:
            * `back_link` - Allows the server side to specify a "Back" link for the page.  If no data is provided for this property,
            the "Back" link will not show.
            * `entity_summary` - Summary information about the entity viewing the page.  This should be populated with
            summary information when viewing the page as a team.  When viewing the page as the active user, information
            can be provided without issue.  However, this specific usage has not been specified as of this writing so
            its use is not currently recommended.

## Data Structures
The following data structures are relevant to this page.

```
export namespace CompetitionPortalApi {
    /**
     * API response when fetching information for the Competition Portal Main page
     */
    export interface FetchCompetitionMainApiResponse {
        competition: ViewCompetitionData;                                       // Information about the active competition.  Property contains previous response body (`FetchViewCompetitionAPIResponse/ViewCompetitionData`).
        back_link?: BackLinkConfigurationData;                                  // Back link to apply to the page, if desired
        entity_summary?: CompetitionPortalData.ActiveEntitySummary;             // Summary information about the active entity (team, participant) viewing the page, if applicable
    }
}
export namespace CompetitionPortalData {
    /**
     * Represents summary information about an entity's compliance status to display in a page header
     */
    export interface PageEntityHeaderComplianceSummaryData {
        status: StatusMessageData;      // Status text to display (including color configuration)
        link?: LinkConfigurationData;   // Link to apply to status text, if desired/appropriate
    }

    /**
     * Summary information about the active entity (team, participant, etc) viewing a Competition Portal page
     */
    export interface ActiveEntitySummary {
        compliance?: PageEntityHeaderComplianceSummaryData;     // Information about the entity's compliance, if applicable
        name?: string;                                          // Name of the entity to display, if applicable.
                                                                // Note: Design assets include "<name> - <level>" for teams,
                                                                // and no name display for participant entities
    }
}

/**
 * [Preexisting]
 */
interface ViewCompetitionData {
    user_navigation: DataNavigationLinkData.DataNavigationLink[] // changes documented in `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionPortalMainNavigation.md`
    // remaining properties unchanged

}

/**
 * [Preexisting]
 */
export type StatusMessageData = {
    text: string;       // The message to display
    type_key:           // Determines the display color of the text
        null |              // Normal text
        'info' |            // Blue status text
        'success' |         // Green status text
        'warning' |         // Orange status text
        'alert';            // Red status text
}

/**
 * Represents a configuration for a link
 */
export interface LinkConfigurationData {
    url: string;            // Link URL
    is_new_tab: boolean;    // Whether link should open in a new tab
}
```