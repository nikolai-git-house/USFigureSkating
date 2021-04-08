# Team Portal Integration - Competition Information Page
This document summarizes integration notes surrounding changes and additions to the Competition Portal "Competition Information" page
contained within the Team Registration/Team Portal release.

## Background/Overview
This page was conceived and delivered as part of Release 1.  Additionally, the USFS Dev Team introduced changes to this
page following Hawkeye delivery of code.  As part of the the Team Portal release, new functional requirements have been
added to this page.  Given the need for these additions, the accumulation of complexity over time and a high potential
for modernization, this page has undergone substantial revisions as part of this release.  These revisions seek to streamline
and modernize the page without regressing on any existing points of functionality.

### Summary of Revisions

1. Reintegration of changes to page introduced by USFS development team after Hawkeye delivery:
    - Added "Registered Events" accordion and content
    - Added support for messaging when practice ice is not offered through EMS for a competition
1. Introduced new data flows to retrieve data for display on page:
    - Added new API endpoint for page-specific information
        - Use "Active Object ID Information" (active team/competition ID information) as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD`
        to construct endpoint URLs
        - Page previously relied on a composition of information from multiple API endpoints.  This singular endpoint
        seeks to reduce server loads and retrieve specific information for display rather than relying on client-side data 
        manipulation and logic.
        - API endpoint changes introduce support for Team Portal information in page:
            - Endpoint URL to determine whether to provide information relative to the active user or one of their managed teams
            - Introduction of active entity summary information
            - Alignment with recent competition portal page functionality
1. Revised page UI component:
    - Use new data structures stemming from introduction of new API endpoint
    - Align with recent methodologies for Competition Portal pages
    - Moved HTML template markup from isolated markup partial to Vue component
    - Relocated component file
    - Changed location of page component registration
    - Removed "Competition Documents" accordion (moved to standalone page as part of this release).

### Changes to Prior Deliverables

- Competition Information Template (`src/views/pages/C.1.3.3_competition_information.php`)
    - Reintegrated code added after Hawkeye delivery ("Registered Events" accordion, granular messaging)
    - Moved template HTML markup to Vue component file
    - Removed obsolete v-cloak attribute
- Competition Information Page Component (`src/js/components/CompetitionInformation.vue`)
    - Reintegrated code modified after Hawkeye delivery (supporting data/properties for markup changes)
    - Added component template (from standalone template file)
    - Moved file to `src/js/CompetitionPortal/_pages/CompetitionInformation/CompetitionInformation.vue`
    - Moved component registration from `src/js/bootstrap.ts` to `src/js/CompetitionPortal/bootstrap.ts`
    - Foundational revisions to use new API endpoint data, align with recent Competition Portal page structures/methodologies
      and remove code elements made obsolete by updates


### New Server Side Requirements
As part of this release, support for Teams has been added to this page.  As such, the appropriate "Active Object ID Information"
as defined in `INTEGRATION_GUIDES/19_INTEGRATION-TEAM-PORTAL.MD` needs to be set server side when loading the page.
To be specific, the "Active Competition ID" cookie needs to be set in all cases when loading the page,
and the "Active Team ID" cookie needs to be set when loading the page for a team.

Additionally, a new dedicated API endpoint has been created to provide information for this page.

## API
The following API endpoints are relevant to this update:

### Overview
Previously, the Competition Information page was populated through data retrieved from multiple API endpoints and manipulated
client-side. With the addition of new data requirements for the page and in the pursuit of reducing complexity and
server load, the following new API endpoint has been added.

### Fetch Competition Portal Competition Information

**Purpose:** Fetch information to power the Competition Portal "Competition Information" page

**Source:** Competition Portal "Competition Information" page load

**URL:** `GET: /api/competitions/{competition_id}/competition-information` (Non-Team)
**URL:** `GET: /api/competitions/{competition_id}/teams/{team_id}/competition-information` (Team)

**Request Payload:** `none`

**Response:** `CompetitionPortalApi.FetchCompetitionInformationApiResponse`

**Notes:**

1. There are two possible URLs for this endpoint.  The endpoint URL that is used depends on whether the active user is viewing the page on behalf of one of the teams they manage or on behalf of themselves.
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message (`Error loading competition information.`).
1. This new endpoint response is designed to retain the intent of the existing Competition Information page
   while affording more granular server-side controls.  This is achieved through specific data contained within the response's `competition_information` property:
    - `competition_information.registered_events` - Used to populate the "Registered Events" accordion.
        - This was previously achieved through a direct service call (`SkaterService.getRegisteredCompetitionEvents`, added by the USFS dev team) within the page component
       
    - `competition_information.practice_ice` - Contains information about practice ice for display on the page:
        - `instructions` - HTML content for display in the "Practice Ice Instructions" accordion.
            - This was previously contained within data returned by the "Get Competition Information" API endpoint `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:390,226`   
        - `terminology` - HTML content for display in the "Practice Ice Terminology" accordion
            - This was previously contained within data returned by the "Get Competition Information" API endpoint `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:390,227`
        - `not_offered` - If set to true, "Practice Ice is not offered through EMS at this competition." displays in the "Practice Ice Prices & Timeline" accordion and none of the remaining properties will display
            - This was previously added by the USFS dev team after Hawkeye delivery and included with data returned by the "Get Competition Information" endpoint
        - `pricing_message` - If provided, text content will display in the "Practice Ice Prices & Timeline" accordion, and event pricing information will not display
            - This was previously contained within data returned by the "Get Competition Information" API endpoint `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:390,231`
        - `event_pricing` - If provided, displays pricing information for events. Information is not filtered on page. To retain existing functionality, only pricing information for the events for which the specified entity is registered should show.  Additionally, package information should not be included unless the pre-purchase sales window has not ended.
            - This was previously determined by:
                1. Filtering the `skating_events` array returned by the "Get Competition Information" API endpoint (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:390,228`) to only contain the list of events with `display=true` (property added by USFS).
                2. Displaying information about individual credits based on the `credit_config` property of each event, with raw data formatting encapsulated on the client-side
                3. Displaying information about credit packages based on the `credit_packages` property of each event, with raw data formatting encapsulated on the client-side, but only if...
                    - The competition returned by the "Get Competition List" endpoint (`INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:330`) that the client-side determines is "active" has a `active_sales_window==='pre_purchase'`
            - Given the multiple divergent sources of information for these display points, this update drastically reduces complexity and technical debt.
              - The one trade-off is the server side will now need to enforce display logic, such as excluding credit package price information when the appropriate sales window is not open
        - `sales_windows` -  If provided, displays sales window information.  Information is not processed on page.  To retain existing functionality, only current/future sales windows should be included. A new `is_active` property has been added to identify the active sales window.
            - This was previously determined by:
                - Starting with the list of data contained in the `sales_windows` property of the "Get Competition Information" API endpoint `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:390,225`
                - Using a client-side date comparison to exclude sales windows that are in the past
                - Displaying a sales window in an active UI state when the client side determines the current time is between the start and end times of the sales window through date comparisons.
            - Similar to the `event_pricing` update, this should provide more precise server side control, reduce technical debt, and reduce overall complexity

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
     * API response when fetching information for the Competition Portal Competition Information page
     */
    export interface FetchCompetitionInformationApiResponse extends FetchCompetitionPortalCoreApiResponse {
        competition_information: CompetitionPortalData.CompetitionInformation;  // Specific information needed by Competition Information page content area
    }
}

export namespace CompetitionPortalData {
    /**
     * Represents collected information about a competition for the Competition Portal Competition Information page
     */
    export interface CompetitionInformation {
        registered_events: CompetitionInformationRegisteredEvent[];   // List of events the specified entity is registered for.  Displays in dedicated accordion
        practice_ice: {                                               // Collected Practice Ice information
            instructions: string;                                     // HTML content for "Practice Ice Instructions" accordion
            terminology: string;                                      // HTML content for "Practice Ice Terminology" accordion
            not_offered: boolean;                                     // Whether Practice Ice is not offered via EMS for the competition.  Results in singular message in "Practice Ice Prices & Timeline" accordion.  If provided, pricing_message, event_pricing and sales_windows property information will not display (functionality in place not altered)
            pricing_message?: string;                                 // Message to display in "Practice Ice Prices & Timeline" accordion in place of pricing and sales window information
            event_pricing?: CompetitionInformationEventPricing[];     // Pricing information to display in "Practice Ice Prices & Timeline" accordion.  See notes on interface documentation.
            sales_windows?: PracticeIceSalesWindow[];                 // Sales window information to display in "Practice Ice Prices & Timeline" accordion.  Sales windows in the past should not be included in this list
        };
    }

    /**
     * Information about an event an entity is registered for.  Displays in list on Competition Information page
     */
    export type CompetitionInformationRegisteredEvent = {
        name: string;           // Name of the event
        id: number|string;      // Unique identifier for the event.  Used to key list items.  Not used in logical comparisons
    };

    /**
     * Represents practice ice pricing information about an event for display on the Competition Portal Competition Information page
     */
    export interface CompetitionInformationEventPricing {
        event_name: string;                                                              // The name of the event the pricing information applies to
        available_credits: CompetitionInformationEventPricingCredit[];                   // Pricing information about credits available for purchase for the event
        available_credit_packages?: CompetitionInformationEventPricingCreditPackage[];   // Pricing information about credit packages available for purchase for the event.  Note: This property should not be provided outside of the pre-purchase sales window to maintain existing functionality
    }

    /**
     * Information about an individual credit available for purchase
     */
    export interface CompetitionInformationEventPricingCredit {
        name: string;   // The name of the credit ("OPI")
        cost: number;   // The cost of the credit
    }

    /**
     * Information about a credit package available for purchase
     */
    export interface CompetitionInformationEventPricingCreditPackage {
        cost: number;           // The cost of the package
        summary: string;        // Summary of the package ("UPI:1, OPI:2")
    }

    /**
     * Represents summary information about a practice ice sales window
     */
    export interface PracticeIceSalesWindow {
        name: string;                           // Name of the sales window
        start_datetime_formatted: string;       // Formatted string representing the start datetime of the window
        end_datetime_formatted: string;         // Formatted string representing the end datetime of the window
        is_active: boolean;                     // Whether the window is currently active
    }
}
```