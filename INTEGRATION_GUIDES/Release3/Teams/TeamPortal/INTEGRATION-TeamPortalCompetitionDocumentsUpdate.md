# Team Portal Integration - Competition Documents Update (2020-06-17)
This document summarizes integration notes surrounding changes related to "Competition Documents" as part of the
Team Registration/Team Portal release.

## Additions

### Templates
* `src/views/pages/competitions/R.2_competition-documents.php`
    * This new template file contains the markup necessary to render the Competition Documents page. It consists solely
      of a Vue component element with no component properties.

## Deprecations
Prior to this update, competition documents information was included as a `comeptition_documents` property in the
`ComeptitionInformaton` data structure. This update does not remove this property, but its use in this context has been deprecated.

Prior to this update, the completion status of an action competition document was changed by submitting information to the
"Update Competition Document Completion Status" API endpoint documented in `INTEGRATION_GUIDES/Release3/CompetitionDocuments/CompetitionDocumentsAPI.md:60`.
Though the endpoint URL has not changed, the payload for this endpoint has been changed from `ChangeCompetitionDocumentCompletionAPIPayload`
to `CompetitionPortalApi.ChangeActionCompetitionDocumentCompletionAPIPayload`. This change removes properties containing
information about the competition ID and document ID, as they are identified in the endpoint URL.

Note: Use of Competition Documents within the pre-existing context will retain usage of this legacy payload.

## Removals
The "Competition Documents" accordion has been removed from the "Competition Information" page.
   
* `src/views/pages/C.1.3.3_competition_information.php`
    * Removed component template binding
* `src/js/components/CompetitionInformation.vue`
    * Removed component registration
        
## API
The following API endpoints are relevant to this page:

### [New] Fetch Competition Portal Competition Documents

**Purpose:** Fetch information for the Competition Portal "Competition Documents" page

**Source:** Competition Portal "Competition Documents" page load

**URL:** `GET: /api/competitions/{competition_id}/documents` (Non-Team)
**URL:** `GET: /api/competitions/{competition_id}/teams/{team_id}/documents` (Teams)

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchCompetitionDocumentsApiResponse`
 
**Notes:**
1. There are two possible URLs for this endpoint.  The endpoint URL that is used depends on whether the active user is viewing the page on behalf of one of the teams they manage or on behalf of themselves.
1. If the current user does not have sufficient permissions to view the information, or if the information can't be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading competition documents.").
1. The `CompetitionPortalApi.FetchCompetitionDocumentsApiResponse` extends the `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` structure.  As such, the following should be taken into consideration:
    * Summary information about the relevant competition should be returned in the `competition_summary` property (to populate the page header)
    * A page "Back" link can be configured using the optional `back_link` property.
    * When returning information for a team, the optional `entity_summary` property should be populated with summary information about the team.
    * For non-teams, the `entity_summary` can be populated to display the respective page elements, but this particular usage 
      has not been planned for as of this writing and is not currently recommended.
1. The `competition_documents` property in the response uses existing data structures established during the prior "Competition Documents" release

### [Modified, Extended] Update Competition Document Completion Status 

**Purpose:** Update the completion status of an Action Competition Document

**Source:** Action document "complete" checkbox click

**URL:** [pre-existing, payload changes] `PUT: /api/competitions/{competition_id}/documents/{document.id}` (Non-team)
**URL:** [new] `PUT: /api/competitions/{competition_id}/teams/{team_id}/documents/{document.id}` (Team)

**Request Payload:** `CompetitionPortalApi.ChangeActionCompetitionDocumentCompletionAPIPayload`

**Response:** `APISubmissionResponse`
 
**Notes:**
1. There are two possible URLs for this endpoint.  The endpoint URL that is used depends on whether the active user is viewing the page on behalf of one of the teams they manage or on behalf of themselves.
1. The non-team endpoint existed before this release. However, this release changes the payload from a `ChangeCompetitionDocumentCompletionAPIPayload` to a `CompetitionPortalApi.ChangeActionCompetitionDocumentCompletionAPIPayload`:
    * The `competition_id` and `document_id` properties of the payload have been removed, since they are specified in the URL.
    * If the existing implementation of Competition Documents continues to be used (as a sub-component within Competition Information), the legacy payload will still be used.
1. If the submission is unsuccessful for any reason, the interface will display an error message. If a 2xx response code is sent with a value in the response `error` key, the provided message will display. Otherwise, a generic message will display (“Error updating document status.”)

## Data Structures
The following data structures are relevant to this document:


Note: `CompetitionDocumentsData` is a pre-existing data structure that has not been changed.

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
     * API response when fetching information for the Competition Portal "Competition Documents" page
     */
    export interface FetchCompetitionDocumentsApiResponse extends FetchCompetitionPortalCoreApiResponse{
        competition_documents: CompetitionDocumentsData;                        // The lists of action and reference documents for the competition
    }

    /**
     * Server payload when changing the completion status of a User's Action Competition Document
     */
    export type ChangeActionCompetitionDocumentCompletionAPIPayload = {
        is_complete: boolean;      // Whether the document is being marked complete (true) or incomplete (false)
    }
}

export namespace CompetitionPortalData {
    /**
     * Represents summary information about the active competition portal competition
     */
    export interface ActiveCompetitionSummary extends CompetitionHeadingData {
        id: number;                             // Unique identifier for the competition
        links: ActiveCompetitionSummaryLinks;   // Links for the competition
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
