# 2020-10-11 Teams Series Registration Series Overview

This document outlines integration requirements related to the “Series Registration” Teams support on the Series
Overview Page.

## API Updates

### [Extended] Fetch Series Overview (`INTEGRATION_GUIDES/Release3/SeriesRegistration/SeriesOverviewAPI.md:7`)

**Response:** [Extended] `SeriesOverviewApi.FetchSeriesOverviewApiResponse`

This endpoint has been extended in order to achieve the following goals:

1. Differentiate between team and non-team series types.
1. Display list of team cards on the page when the series is a team series, and the active user has begun an application
   for one of the teams they manage.
1. Prevent users who do not manage teams from beginning a series application

The following changes have been made to facilitate these goals:

1. Added `is_team_series` subproperty to `series` property of the response.
1. Added new, optional `applied_teams` property. Made the `user_application` property of the response optional.

### Non-Team-Manager Use Case

It is possible to handle the case where the active user is not a team manager through configuration of existing code.
When this case arises, the following datapoints should be configured:

1. `series.status.message.type_key` => 'error'
1. `series.status.message.text` => '<message to display to users>'
1. `series.status.applications_open` => `false`

The end result of this is the "Start/Update Application" button will not show, the "Series Status" text in the header of
the page will display in red, and the supplied message will display, communicating to the user why they are not able to
start an application.

### Data Structure Changes

The following outlines changes to existing data structures to facilitate this update:

```
/**
 * Server response when fetching information for the Series Overview page
 */
export interface FetchSeriesOverviewApiResponse {
    series: SeriesOverviewData.SeriesData;                                      // Schema extended
    user_application?: SeriesApplicationData.SavedUserApplicationData | null;   // Property made optional.  If not provided, treated as null. Otherwise unchanged
    applied_teams?: SeriesOverviewData.SeriesAppliedTeamsData;                  // New property to control the display of teams where needed
}

export namespace SeriesOverviewData {
    /**
     * [UNCHANGED] Represents data related to a series for the Series Overview page
     */
    export interface SeriesData extends SeriesRegistrationSeriesCoreData {
        // Schema unchanged.  Change to core schema
    }

    /**
     * [NEW] Tracks teams that have been applied for a series
     */
    export interface SeriesAppliedTeamsData {
        teams: SeriesAppliedTeamData[];     // The list of applied teams for the series
    }

    /**
     * [NEW] Represents a team that has been applied to a series
     */
    export interface SeriesAppliedTeamData {
        id: string;                                                                 // Unique identifier for the team
        name: string;                                                               // Name of the team
        level: string;                                                              // Team level name
        levels: SeriesApplicationData.SavedUserApplicationDisciplineLevelData[];    // The levels within the team's application
        handbook?: {                                                          // Series team handbook, if applicables
            url: string;                                                      // URL to the series handbook for the team
            name: string;                                                     // Name of the handbook document to display on the page
        }
    }
}

/**
 * Represents core data shared across Series Registration Series types
 */
export interface SeriesRegistrationSeriesCoreData {
    // existing properties unchanged
    is_team_series?: boolean;                        // [NEW] Whether the series is a team series.  When not provided, will be treated as false.  Controls whether the team version of the series overview page should show
}
```
