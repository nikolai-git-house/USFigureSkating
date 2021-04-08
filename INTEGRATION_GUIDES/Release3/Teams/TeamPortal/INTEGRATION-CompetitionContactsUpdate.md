# Team Portal Integration - Competition Contacts Page
This document summarizes integration notes surrounding changes and additions to the Competition Portal "Competition Contacts" page
contained within the Team Registration/Team Portal release.

## Background/Overview
This page was conceived and delivered as part of a previous release.  Additionally, the USFS Dev Team introduced changes to this
page following Hawkeye delivery of code.  As part of the the Team Portal release, new functional requirements have been
added to this page.  Given the need for these additions and in the pursuit of reducing future technical debt,
revisions have been made to this page as part of this release.

### Summary of Revisions

1. Reintegration of changes to page introduced by USFS development team after Hawkeye delivery:
    - Replaced page intro verbiage
    - Added dynamic link targets to Contact email links
1. Introduced new data flows to retrieve data for display on page:
    - Extended existing API endpoint to provide new data needed by page
        - Use active team/competition ID information as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD:30`
        to construct endpoint URLs
        - API endpoint changes introduce support for Team Portal information in page:
            - Endpoint URL to determine whether to provide information relative to the active user or one of their managed
            teams
            - Introduction of active entity summary information
1. Revised page UI component:
    - Upgrade template markup to align with recent methodologies for Competition Portal pages
    - Moved HTML template markup from isolated markup partial to Vue component
    - Relocated component file
    - Changed location of page component registration
1. Revised client-side data processing
    - Use CompetitionPortal namespaced API Service and State module to interact with data
    - Deprecated previous API Service and State Module methods and properties

### Changes to Prior Deliverables

- Competition Contacts Template (`src/views/pages/E.2.1_Competition-contacts.php`)
    - Reintegrated code added after Hawkeye delivery (noted above)
    - Moved template HTML markup to Vue component file
    - Removed obsolete v-cloak attribute
- Competition Contacts Page Component (`src/js/components/CompetitionContacts.vue`)
    - Reintegrated code modified after Hawkeye delivery (supporting data/properties for markup changes)
    - Added component template (from standalone template file)
    - Moved file to `src/js/CompetitionPortal/_pages/CompetitionContacts.vue`
    - Moved component registration from `src/js/bootstrap.ts` to `src/js/CompetitionPortal/bootstrap.ts`
    - Data loading process revisions to use new API endpoint data and template changes to align with recent Competition Portal page structures/methodologies


### New Server Side Requirements
As part of this release, support for Teams has been added to this page.  As such, the appropriate "Active Object ID Information"
as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to be set server side when loading the page.
To be specific, the "Active Competition ID" cookie needs to be set in all cases when loading the page,
and the "Active Team ID" cookie needs to be set when loading the page for a team.

## API
The following API endpoints are relevant to this update:

### Overview
The "Get Competition Contacts" API endpoint defined in `INTEGRATION_GUIDES/5_a__INTEGRATION-API-R2.md:258` has been extended
as outlined below

### [Modified] Fetch Competition Contacts (fka "Get Competition Contacts")

**Purpose:** Fetch information to power the Competition Portal "Competition Contacts" page

**Source:** Competition Portal "Competition Contacts" page load

**URL:** [Unchanged] `GET: /api/competitions/{competition_id}/contacts` (Non-Team)
**URL:** [New] `GET: /api/competitions/{competition_id}/teams/{team_id}/contacts` (Team)

**Request Payload:** `none`

**Response:** [Extended] `CompetitionPortalApi.FetchCompetitionContactsApiResponse` (previous: `{contacts: CompetitionContactData[]}`)
 
**Notes:**
1. Existing properties and functionality surrounding this endpoint have not changed unless otherwise specified.
1. There are two possible URLs for this endpoint.  The endpoint URL that is used depends on whether the active user is viewing the page on behalf of one of the teams they manage or on behalf of themselves.
1. The API response has been extended to contain additional properties included in the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse`,
   namely summary information about the specified competition and the active entity, if applicable.

```
export namespace CompetitionPortalApi {

    /**
     * Contains information when fetching for data for a Competition Portal Page
     */
    export interface FetchCompetitionPortalCoreApiResponse {
        competition_summary: CompetitionPortalData.ActiveCompetitionSummary;    // Summary of the specified competition
        back_link?: BackLinkConfigurationData;                                  // Back link to apply to the page, if desired
        entity_summary?: CompetitionPortalData.ActiveEntitySummary;             // Summary information about the active entity (team, participant) viewing the page, if applicable
    }

    /**
     * API response when fetching information for the Competition Portal Competition Contacts page
     *
     * `contacts` property unchanged from prior releases.  Extension of `FetchCompetitionPortalCoreApiResponse` added.
     */
    export interface FetchCompetitionContactsApiResponse extends FetchCompetitionPortalCoreApiResponse {
        contacts: CompetitionContactData[];             // Array of competition contacts for the competition.  Unchanged from prior release
    }
}

export namespace CompetitionPortalData {
    /**
     * Represents summary information about the active competition portal competition
     */
    export interface ActiveCompetitionSummary extends CompetitionHeadingData {
        id: number;                             // Unique identifier for the competition
    }

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

// Unchanged from prior release
export type CompetitionContactData = {
    name: string;       // The contact's name
    role: string;       // The contact's role for the competition
    email: string;      // The contact's email address
}
```