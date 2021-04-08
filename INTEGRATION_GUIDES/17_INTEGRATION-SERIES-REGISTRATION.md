# Series Registration Integration

## Overview
This document aids in the process of integration of isolated frontend development assets with a backend environment for
the Series Registration release.

## Changelog
Specific additions and changes to the codebase as part of this release have been documented in the changelog.

## Contents
This release includes the following primary components:

- [Added] "Series Information" page
- [Added] "Series Overview" page
- [Added] "Series Application" page
- [Added] Self-contained "Skate Tests" component
- [Added] Self-contained "Skate Tests" component
- [Added] Root level "Confirm Action" overlay component - allows interrupting a user action with a confirmation overlay on the app root level
- [Added] Root level "Notice" overlay component
- [Added] Self-contained "Member Search Takeover" component
- [Changed] Added EMS Home to primary navigation main menu
- [Changed] Modified Cart to support Series Registration Items
- [Fixed] Added missing preventDefault on member search ineligible warning notice click event
- [Fixed] Added AutoSuggest component input debounce to improve performance in Edge/IE
- [Security] Updated NPM dependencies to resolve security issues

# General

## Data Structure Documentation
In line with the previous release, this release utilizes a "documentation in place" strategy to document data structures.

## Code Structure
This update has maintained the overall file structures in place for the Skater/Coach portal. However-- in line with
recent updates-- conceptually linked files (components, contracts, transformers, support classes, etc for a given site
element) are grouped together in the most applicable directory.

## Inline Integration Notes
As with previous releases, various templates contain `@integration` comments highlighting points relevant to integration.

The following files contain integration notes that should be reviewed:

* `src/views/layouts/main.php`
    * Add series registration script inclusion
* `src/views/pages/P.1_series_registration_index.php`
    * Configuration option for "Back" link target and label
* `src/js/SeriesRegistration/_components/SeriesApplication/SeriesApplicationProfile.vue:~111`
    * `club_autosuggest_configuration` controls the functionality for the skate test club input. See
    `INTEGRATION_GUIDES/12_INTEGRATION-COMPETITION-REGISTRATION.md:118` for more information about this configuration
* `src/views/layouts/partials/header.php:37`
    * Added "EMS Home" link requires a target

## Scripts

As part of this release, a new script file has been added (`public/js/series-registration.js`). This script will need to be included
on Series-Registration-related pages. This script will not cause conflicts if included on other pages.

## Templates
The following templates are relevant to this release.  Those that are [Modified] will require integration updates:

* [MODIFIED] `src/views/layouts/main.php`
    * Add series registration script call
    * Add confirm action overlay
    * Add app notice component
* [ADDED] `src/views/pages/P.1_series_registration_index.php`
    * New "Series Information" page
* [ADDED] `src/views/pages/P.1.2_Series_Overview.php`
    * New "Series Application" page
* [ADDED] `src/views/pages/P.1.1_Series_Application.php`
    * New "Series Overview" page
* [ADDED] `src/views/pages/P.1.3_Standings.php`
    * New "Series Standings" page
* [MODIFIED] `src/views/layouts/partials/header.php`
    * Add EMS Home link to primary navigation
    
## Current Series Determination
Various API endpoints feature URLs with segments that reference a Series ID.  In order to determine the appropriate Series ID
to use when constructing these endpoint URLs, the client side needs to know the ID of the current Series.

In order to facilitate this, a cookie must be set containing the value of the current Series ID when loading a Series
Registration page for a specific Series.  The `SERIES_REGISTRATION_COOKIE_NAME` constant in
`src/js/config/AppConfig.ts:43` will need to be updated to reflect the name of the cookie containing this information.

# API
API endpoints and payloads are outlined in:
 1. General - `INTEGRATION_GUIDES/Release3/SeriesRegistration/SeriesRegistrationAPI.md`
 1. Series Application - `INTEGRATION_GUIDES/Release3/SeriesRegistration/SeriesApplicationAPI.md`
 1. Series Overview - `INTEGRATION_GUIDES/Release3/SeriesRegistration/SeriesOverviewAPI.md`
 1. Cart - `INTEGRATION_GUIDES/Release3/SeriesRegistration/Cart&Ecommerce.md`
API example payloads and responses are outlined in `INTEGRATION_GUIDES/Release3/SeriesRegistration/SeriesRegistrationAPIExamples.md`

## API Changes
Changes to the cart API have been made and are outlined in`INTEGRATION_GUIDES/Release3/SeriesRegistration/Cart&Ecommerce.md`