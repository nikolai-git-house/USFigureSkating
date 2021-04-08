# Team Registration Integration - Registration Overview
This document summarizes integration notes surrounding the Team Registration SPA Registration Overview Page.

## Templates
No templates requiring integration are associated with this component

## Cookies
This page relies on the cookies defined in `INTEGRATION_GUIDES/Release3/TeamRegistrationAndPortal/TeamRegistration/INTEGRATION-TeamRegistrationRegistrationShell.md:10` in 
order to construct API endpoint URLs.

## API
The following API endpoints are relevant to this step

### Fetch Registration Overview

**Purpose:** Fetch data required to power the Registration Overview Page

**Source:** Team Registration SPA Registration Overview Page load

**URL:** `GET: /api/competition-registration/competitions/{competition_id}/teams/{team_id}/registration-overview`

**Request Payload:** `none`

**Response:** `TeamRegistrationApi.FetchRegistrationOverviewApiResponse`

**Notes:**
1. If the current user does not have sufficient permissions to view the information, or if the information can’t be found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading registration overview.").
1. The URL for this endpoint contains segments for the active team and competition IDs.  The client side relies on the cookies
mentioned above in order to construct these URLs. 

## Data Structures
The following data structures are relevant to the Team Registration SPA Registration Overview Page.

```
export namespace TeamRegistrationApi {
    /**
     * API response when fetching information to power the Registration Overview step of the registration process
     */
    export interface FetchRegistrationOverviewApiResponse {
        registration_information: string[];                          // Bullet point items for "Registration information" drawer.  Supports HTML
                                                                     // Note: if anchor elements are provided in HTML, they will automatically be assigned
                                                                     // the following attributes: `target="_blank"` and `rel="noopener noreferrer"`
        rulebook_year: string;                                       // The active rulebook year. Ex: "2019 - 2020"
        price_information: TeamRegistrationData.PricingTable[];      // Information to display in pricing tables
    }
}
export namespace TeamRegistrationData {
    /**
     * Represents data to populate a pricing table
     */
    export interface PricingTable {
        config: PricingTableConfiguration;  // Configuration for the table
        rows: PricingRow[];                 // Row data for table
    }

    /**
     * Represents configuration data for a pricing table
     */
    interface PricingTableConfiguration {
        title: string;              // Title to display above table
        column_names: string[];     // List of column names for the table
        null_row_message: string;   // Message to display in a row when the row contains only null values
    }

    /**
     * Represents a row within a pricing table
     */
    export interface PricingRow {
        label: string;              // Label for the row.  First column to display for the row
        values: (number | null)[];  // Values for remaining columns in table
    }
}
```