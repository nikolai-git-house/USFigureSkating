# 2020-10-12 Teams Series Registration Select Team

This document outlines integration requirements related to the “Series Registration” "Select Team" page

## Templates

`src/views/pages/series-registration/P.1.4_SelectTeam.php`

This new template file contains the markup necessary to render the page. It consists solely of a Vue component element
with no component properties.

## Server Side Requirements

The appropriate Series ID cookie as defined in `INTEGRATION_GUIDES/17_INTEGRATION-SERIES-REGISTRATION.md:75` needs to be
set server side when loading this page. The series ID cookie is used to contruct the endpoint URL used to populate the
page data.

## Functional Overview

Upon page load, the client-side will contact the "Fetch Series Registration Select Team" API endpoint to load baseline
information for the page. This endpoint will return:

- Summary series information for display in the page header
- The list of teams the current user manages from which the user can select a team to continue with
  - The data structure of these items extends the `TeamsData.ManagedTeam` schema. As such, documentation for basic
    configuration of these items can be found in
    `INTEGRATION_GUIDES/Release3/Teams/INTEGRATION-TeamRegistrationSelectTeam.md:53`
  - The button that displays on each team card can be configured to control the button text and URL.
    - The button text provided by the API should be dependent on the team's application status (see
      [TFS Item]()https://usfs.visualstudio.com/Phoenix%20-%20EMS%20-%20Extensions/_workitems/edit/17545/):
      - Team w/ no application- 'Start'
      - team w/ paid application- 'Update
      - team with unpaid application-'Continue'
    - The button URL should be configured to direct the user to the series application for the active series and the
      respective team

## Updates to Prior Deliverables

- `src/js/SeriesRegistration/_contracts/SeriesRegistrationApiContracts.ts`
  - Add/Update Contracts
- `src/js/SeriesRegistration/_contracts/SeriesRegistrationContracts.ts`
  - Add/Update Contracts
- `src/js/SeriesRegistration/_contracts/SeriesRegistrationDataContracts.ts`
  - Add/Update Contracts
- `src/js/SeriesRegistration/_contracts/SeriesRegistrationServiceContracts.ts`
  - Add/Update Contracts
- `src/js/SeriesRegistration/_services/SeriesRegistrationAPIService.ts`
  - Add new service method
- `src/js/SeriesRegistration/_store/SeriesRegistrationState.ts`
  - Add new state properties, action and mutators
- `src/js/SeriesRegistration/_transformers/SeriesRegistrationAPITransformer.ts`
  - Add new data transformation
- `src/js/SeriesRegistration/series-registration.ts`
  - Register new page component
- `src/js/Teams/_components/SelectTeamList.vue`
  - Extend component to support page requirements
- `src/js/Teams/_contracts/TeamsDataContracts.ts`
  - Export existing encapsulated interfaces
- `src/js/Teams/_models/ManagedTeam.ts`
  - Export existing encapsulated interface
- `src/sass/SeriesRegistration/_series-registration.scss`
  - Import new stylesheet

## New Files

## API

### Fetch Series Registration Select Team

**Purpose:** Fetch data to power the Series Registration Select Team page

**Source:** Series Registration Select Team Page Load

**URL:** `GET: /api/series-registration/{series_id}/managed-teams`

**Request Payload:** `none`

**Response:** `SeriesRegistrationApi.FetchTeamSelectApiResponse`

**Notes:**

1. If the current user does not have sufficient permissions to view the information, or if the information can't be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading
   teams.").
1. Efforts have been made to reuse or extend preexisting data structure where possible.
1. The `series` property of the response is used to populate the page header and back link.
1. The `teams` property of the response controls the list of teams on the page.
   - The individual items in the list extend the preexisting `TeamsData.ManagedTeam` schema.
   - The `selection_information` subproperty has been extended to feature a `button` property.
     - This property is required when `selection.information.is_selectable` is `true`
     - This property is not required when `selection.information.is_selectable` is `false`. However, if the information
       is provided anyway, there will be no adverse effects since the button will not display.
     - This property features a `text` subproperty that controls the text of the button. This should be configured to
       display text based on each team's application status ('Start,' 'Continue,' 'Update')
     - This property features a `url` subproperty controls the page the user is taken to when the button is clicked.
   - If an empty array is returned for this property, a message will display on the page ("You don't manage any teams
     eligible to apply for this series.")
1. The `series_id` URL segment is populated via the methodology outlined in
   `INTEGRATION_GUIDES/17_INTEGRATION-SERIES-REGISTRATION.md:75`

## Data Structures

The following are data structures relevant to the page. Referenced data structures that are not specifically outlined
remain unchanged from preexisting implementations.

```
export namespace SeriesRegistrationApi {
    /**
     * Server response when fetching the list of selectable teams for a team series
     */
    export interface FetchTeamSelectApiResponse {
        series: SeriesRegistrationData.SupageSeriesSummary;  // Summary information about series for page skeleton
        teams: SeriesRegistrationData.ManagedTeam[];         // List of teams to display in page
    }
}

export namespace SeriesRegistrationData {
    /**
     * Represents summary information about a series to populate a series subpage skeleton
     */
    export interface SupageSeriesSummary extends SeriesRegistrationSeriesCoreData {
        application_deadline_formatted: string;             // String formatted application deadline. Displays in page header
        links: {                                            // Links for the series
            overview: string;                               // Link to series overview. Populates "back" link in subpage header
        }
    }

    /**
     * Represents a team managed by the current user and its relevant series-related information
     */
    export type ManagedTeam = ManagedTeamSelectable | ManagedTeamNonSelectable;

    /**
     * Button configuration for a team
     */
    interface SelectTeamButton{
        text: string;           // The text to display for the button ('Continue,' 'Start,' 'Update')
        url: string;            // The URL target for the button
    }

    /**
     * Represents selection information for a team that is selectable on the page
     */
    interface SelectionInformationSelectableTeam extends TeamsData.SelectableTeamSelectionInformation {
        button: SelectTeamButton;   // Button configuration needs to be present
    }

    /**
     * Represents selection information for a team that is not selectable on the page
     */
    interface SelectionInformationNonselectableTeam extends TeamsData.NonSelectableTeamSelectionInformation {
        button?: SelectTeamButton;  // Button configuration does not need to be present.  Button will not display, so information can be included if desired.
    }

    /**
     * Represents a selectable team on the page.  Button displays and links to the relevant application.
     */
    export interface ManagedTeamSelectable extends TeamsData.ManagedTeam {
        selection_information: SelectionInformationSelectableTeam;
    }

    /**
     * Represents a non-selectable team on the page.  Notice displays in place of button
     */
    export interface ManagedTeamNonSelectable extends TeamsData.ManagedTeam {
        selection_information: SelectionInformationNonselectableTeam;
    }
}
```
