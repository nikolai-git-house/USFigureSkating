# Team Series Integration (2020-10-13)

## Overview

This document aids in the process of integration of isolated frontend development assets with a backend environment for
the Team Series release. This update adds support for teams to the series workflow.

## Changelog

Specific additions and changes to the codebase as part of this release have been documented in the changelog.

## Contents

This release includes the following primary components, each with their own integration documentation:

- [Extended] Series Overview - Team Support -
  `INTEGRATION_GUIDES/Release3/SeriesRegistration/Teams/TeamsSeriesOverviewUpdates.md`
- [Added] Series Select Team Page - `INTEGRATION_GUIDES/Release3/SeriesRegistration/Teams/TeamSeriesSelectTeam.md`
- [Extended] Series Application - Team Support -
  `INTEGRATION_GUIDES/Release3/SeriesRegistration/Teams/TeamSeriesApplication.md`

# General

## Data Structure Documentation

In line with the previous release, this release utilizes a "documentation in place" strategy to document data
structures.

## Series Overview

Support for Team Series has been added to the series overview page. This has been accomplished through:

1. Addition of `applied_teams` optional property and associated schemas to
   `SeriesOverviewApi.FetchSeriesOverviewApiResponse`
1. Change to make `user_application` property of `SeriesOverviewApi.FetchSeriesOverviewApiResponse` optional.
1. Addition of `is_team_series` to `SeriesOverview.Series` schema.
1. Updates of `SeriesOverviewPage.vue` page component to:
   - Change property used to determine overall page display state (`user_application`=>`application_exists`)
   - When in team context, display cards related to registered teams instead of user application disciplines (new
     `SeriesOverviewApplicationTeam` subcomponent)
   - When in team context, display dedicated page CTA for teams (new `SeriesOverviewTeamCta` component)
1. Note - when a non-team manager accesses the page, the `series.status.applications_open` property of the response
   should be set to `false`, even if the application window is open, in order to hide the start application button

## Select Team

As part of this release, a select team page relative to Series Registration has been added.

To ensure users navigate to this page from a team Series Overview page, the `series.links.application` property of the
"Fetch Series Overview" API response should be set to this select team page URL for the appropriate series.

This select team page has very similar data structures to those that have been delivered in the past. The one exception
is each item in the list's `selection_information` property now has an optional `button` property. This property will
allow you to control the button text and URL for each item on the page. The button text should be configured according
to business requirements based on the respective team's application status relative to the series.

## Series Application

Support for Team Series has been added to the series application page as part of this release.

When loading a series application page for a team, a cookie needs to be set server side containing the ID of the team
selected for the page. When this cookie is present, the series application will act in team mode:

1. The page will contact a new API endpoint to load page data, with the team id used in a URL segment.
1. Data flows and processing are largely unchanged, but feature some differences for teams.

   - Profile information contains a different but overlapping set of properties as the individual participant version of
     the series application page.
   - The cards on the page will continue to be populated with the items in the
     `series.application_configuration.disciplines` property of the API response. Each of these items should be named
     according to the cards that display on the page.
   - Support for `coach_limit` property values of `0` has been added to the page.
   - When loading a saved application, the `coaches` and `partners` properties of saved disciplines are not needed for
     teams since their values will always be empty.

1. When saving an application, the client side will contact a new API endpoint featuring the active team id in a URL
   segment.
   - The API payload is the same as the participant version, only non-applicable properties have been removed (related
     to coaches and partners)

# Changes to Prior Deliverables

This changeset contains extensions and revisions to a substantial amount of series-related files. As such, the PR diff
is the best place to visualize the suite of changes.

## Teams

1. The `src/js/Teams/_components/SelectTeamList.vue` component has been extended to allow overriding the button that
   displays through a component slot.
1. Various team-related contracts have been exported from their associated files for use within series code.
