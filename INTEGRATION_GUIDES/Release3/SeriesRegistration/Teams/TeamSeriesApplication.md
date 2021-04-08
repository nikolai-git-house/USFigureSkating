# 2020-10-12 Teams Series Registration Application

This document outlines integration requirements related to the “Series Registration” Application page for teams

## Overview

The Team Series application functions nealy identical to the Participant version outlined in
`INTEGRATION_GUIDES/Release3/SeriesRegistration/SeriesApplicationAPI.md:1`. Minor data structure changes and overall
data configuration will allow this page to operate within a team series context.

## Templates

No new templates are needed for this page variant. The existing series application page template
`P.1.1_Series_Application.php` can be used if a new Razor Page needs to be created.

## Server Side Requirements

### Team ID Cookie

Various API endpoints feature URLs with segments that reference a Team ID. In order to determine the appropriate Team ID
to use when constructing these endpoint URLs, the client side needs to know the ID of the active Team.

In order to facilitate this, a cookie must be set containing the value of the current Team ID when loading this page for
a team. Registration page for a specific Series. The `SERIES_REGISTRATION_ACTIVE_TEAM_ID_COOKIE_NAME` constant in
`src/js/config/AppConfig.ts:64` will need to be updated to reflect the name of the cookie containing this information.

## Functional Overview

### Page Load

Upon page load, the client-side will check for a value in the Team ID Cookie mentioned above. If one is not found, the
page will retain its current functionality (individual participant).

If a value is present in the Team ID Cookie, the client-side will contact the new "Fetch Series Registration Series
Application (Team)" endpoint. This endpoint mirrors the existing "Fetch Series Registration Series Application" endpoint
(`INTEGRATION_GUIDES/Release3/SeriesRegistration/SeriesApplicationAPI.md:8`) with slight difference in data structures
specific for teams.

#### Profile

When loading the series application "Profile" tab for a team, the following differences from the existing page will be
present:

1. The name of the entity draws from `user_application_profile.name` instead of `user_application_profile.full_name`
1. The team level, drawn from the `user_application_profile.level` property, will display on the page.
1. The date of birth field will not display
1. The email field (and associated edit functionality) will not display.
1. The "Section Eligibility" info icon (and associated popup will not display).
1. All "Section Eligibility" section fields are optional within this context. If values are not provided by the API, the
   associated fields will not show.
1. The "Skate Tests" section will not display.

#### Application Configuration

Series applications within the team context are functionally identical to the Participant versions. The following
outlines a general guide for configuring data within a team series context:

1. The cards on the page are generated from each item in the `series.application_configuration.disciplines` property.
   Within a team context, although "discipline" is a misnomer, these discipline items should be configured to align with
   the desired cards on the page.
1. Each "discipline" should be configured with a `coach_limit` of `0` to ensure coach related information and fields do
   no appear on the cards.
1. Each "discipline" should be configured with a `partner_configuration.is_partnered` of `false` to ensure partner
   related information and fields do no appear on the cards.
1. Just like in the Participant version of the page, discipline information within the `user_application.disciplines`
   and `user_application_profile.series_level_eligibility` properties of the API response need to align with the
   disciplines in the `series.application_configuration.disciplines`.
1. As of this writing, only one "discipline" is available to a team at a given time. To ensure the other "discipline"
   displays the no-levels message, that discipline should be excluded from the
   `user_application_profile.series_level_eligibility` property.

#### Loading a Saved Application

When loading an existing application, the `user_application` property of the response has been slightly modified for the
team context. Within each discipline, the `coaches` and `partner` properties can be left undefined. They can be
configured as an empty array and null respectively, but the client-side supports the absence of these properties that
are not relevant within this context.

#### Saving an Application

Saving an application functions nearly identically to the Participant version. The only difference lies in that the
client-side contacts a new team-specific API endpoint, and that the request payload does not include properties that are
not relevant to the team context (partner and coach information).

## Updates to Prior Deliverables

1. Various files within the `src/js/SeriesRegistration/SeriesApplication/` namespace have been modified in order to
   support this updaye.
1. The SeriesRegistrationApiService (`rc/js/SeriesRegistration/_services/SeriesRegistrationAPIService.ts`) has been
   modified to support construction of team-specific endpoint URLs.
1. `src/js/config/AppConfig.ts` has been updated to contain a configuration for the new cookie supporting team
   identification
1. The `src/sass/SeriesRegistration/SeriesApplication/_components/_series-application-discipline.scss` page stylesheet
   has been updated to ensure optimal display given functional changes to the series application page.

## API

### Fetch Series Registration Series Application (Team)

**Purpose:** Fetch data for the series application page for a team

**Source:** Series Application (Team) page load

**URL:** `GET:/api/series-registration/{series_id}/teams/{team_id}/application`

**Request Payload:** `none`

**Response:** `SeriesApplicationApi.FetchTeamApplicationAPIResponse`

**Notes:**

1. If the current user does not have sufficient permissions to view the information, or if the information can't be
   found, a non-2xx HTTP response code should be returned and the page will display a generic message ("Error loading
   series application.").
1. Functionality surrounding corresponding endpoint for non-teams has not been changed.
1. The `series_id` URL segment is populated via the methodology outlined in
   `INTEGRATION_GUIDES/17_INTEGRATION-SERIES-REGISTRATION.md:75`
1. The `team_id` URL segment is populated via the methodology outlined above
1. Though the top level property names of the response are the same as the existing
   `SeriesApplicationApi.FetchApplicationAPIResponse`, there are a few notable differences:
   - The `user_application_profile` property is of the type `SeriesApplicationData.TeamApplicationProfileData` instead
     of `SeriesApplicationData.UserApplicationProfileData`
     - `skate_test_history` and `is_series_citizenship_ineligible` properties are not present on this schema
     - `home_club`, `region_name` and `section_name` properties are optional
     - Remaining data fields have been updated to be specific to teams
   - The `user_application` property has been slightly modified for teams.
     - The `disciplines` key is retained to create each card on the page. However, the `coaches` and `partner`
       properties of each item have been removed within this context
1. The `series.links` property of the response has been extended to include a `select_team` optional subproperty. When
   provided, this will populate the back link on the page rather than the series overview link.

### Save Series Application (Team)

**Purpose:** Save a team series application

**Source:** eries application save button click (team context)

**URL:** `POST: /api/series-registration/{series_id}/teams/{team_id}/application`

**Request Payload:** `SeriesApplicationApi.SaveApplicationTeamAPIPayload`

**Response:** `SeriesApplicationApi.SaveApplicationAPIResponse`

**Notes:**

1. This endpoint is functionally identical to the "Save Series Application"
   (`INTEGRATION_GUIDES/Release3/SeriesRegistration/SeriesApplicationAPI.md:144`) endpoint. The only difference is the
   removal of non-applicable properties within the submission payload.
1. The `series_id` URL segment is populated via the methodology outlined in
   `INTEGRATION_GUIDES/17_INTEGRATION-SERIES-REGISTRATION.md:75`
1. The `team_id` URL segment is populated via the methodology outlined above

## Data Structures

The following are data structures relevant to the page. Referenced data structures that are not specifically outlined
remain unchanged from preexisting implementations.

```
export namespace SeriesApplicationApi {
    /**
     * [New extraction] Abstract API response when fetching data for the team or individual application page
     */
    export interface FetchAbstractApplicationApiResponse {
        series: SeriesApplicationData.SeriesData;                                       // Information about the series
        user_application: SeriesApplicationData.SavedUserApplicationData | null;        // User's saved application for the series, if they have one
        user_application_profile: SeriesApplicationData.UserApplicationProfileData | SeriesApplicationData.TeamApplicationProfileData;     // User/Team's profile relative to the series
    }

    /**
     * [Unchanged, extracted base interface] Server response when fetching data for the "Series Application" page
     */
    export interface FetchApplicationAPIResponse extends FetchAbstractApplicationApiResponse {
        user_application_profile: SeriesApplicationData.UserApplicationProfileData;     // User's profile relative to the series
    }

    /**
     * Server response when fetching data for the "Series Application" page (team)
     */
    export interface FetchTeamApplicationAPIResponse extends FetchAbstractApplicationApiResponse {
        user_application_profile: SeriesApplicationData.TeamApplicationProfileData;     // Team's profile relative to the series
        user_application: SeriesApplicationData.SavedTeamApplicationData | null;        // Team's saved application for the series, if they have one
    }

    /**
     * Server payload when saving a series application (team)
     */
    export interface SaveApplicationTeamAPIPayload {
        disciplines: SeriesApplicationData.SaveApplicationDisciplineDataTeam[];  // List of disciplines corresponding to series configuration with user selections
    }
}
export namespace SeriesApplicationData {
    /**
     * Represents Series data required by the "Series Application" page
     */
    export interface SeriesData extends SeriesRegistrationSeriesCoreData {
        // existing properties unchanged
        links: {                                                    // Links for the series
            // existing properties unchanged
            select_team?: string;                                    // New - Link to select team page (back link in team context)
        };
    }

    /**
     * User profile information for a series application.
     */
    export interface TeamApplicationProfileData {
        name: string;                                                           // The team name
        level: string;                                                          // The team's level
        member_number: MemberNumberData;                                        // The teams's member number
        home_club?: UserClubInformationData | null;                             // Information about the team's home club, if applicable
        region_name?: string;                                                   // The name of the team's region, if applicable
        section_name?: string;                                                  // The name of the team's section, if applicable
        series_level_eligibility: DisciplineLevelEligibilityDataComplete;       // The team's level eligibility for all disciplines available on the series application
    }

    /**
     * Represents information about a discipline within a series application save submission
     */
    export interface SaveApplicationDisciplineDataTeam {
        discipline_id: number;        // The ID of the discipline
        level_ids: number[];          // The IDs of the selected levels
    }

    /**
     * Represents a saved team series application
     */
    export interface SavedTeamApplicationData {
        disciplines: SavedTeamApplicationDisciplineData[];  // List of disciplines within the saved application
    }

    /**
     * Represents a discipline within a saved team series application
     */
    export interface SavedTeamApplicationDisciplineData extends SavedApplicationDisciplineData {
        // no overrides of base interface.  Only discipline_id and levels properties should be present
    }

    /**
     * Represents a discipline within a saved application, whether for a team or individual
     */
    export interface SavedApplicationDisciplineData {
        discipline_id: number;                                          // Identifier of the associated discipline within the series application configuration
        coaches?: SavedUserApplicationDisciplineCoachData[];            // List of coaches selected for the discipline
        levels: SavedUserApplicationDisciplineLevelData[];              // List of levels selected for the  discipline
        partner?: SavedUserApplicationDisciplinePartnerData | null;     // Partner selected for the discipline.
    }
}
```
