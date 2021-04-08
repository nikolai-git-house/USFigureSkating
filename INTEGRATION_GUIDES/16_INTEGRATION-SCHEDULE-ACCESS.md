# Schedule Access Integration

## Overview
This document aids in the process of integration of isolated frontend development assets with a backend environment for
the Schedule Access update.

## Changelog
Specific additions and changes to the codebase as part of this release have been documented in the changelog.

## Contents
This release includes the following primary components:

- [Added] Search Competitions page
- [Added] View Competition page (including Volunteer Request sub-component).
- [Added] User-Agnostic Competition Schedule page
- [Updated] Competition Contacts page component to ensure compatibility with Schedule Access flows
- [Changed] Existing "Competition Schedule" to "Coach Competition Schedule" to make room for new, role-agnostic Competition Schedule
- [Deprecated] Competition Detail page
- [Fixed] Sheet navigation on Coach Competition Schedule page

# General

## Data Structure Documentation
In line with the previous release, this release utilizes a "documentation in place" strategy to document data structures.

## Code Structure
This update has maintained the overall file structures in place for the Skater/Coach portal. However-- in line with
recent updates-- conceptually linked files (components, contracts, transformers, support classes, etc for a given site
element) are grouped together in the most applicable directory. For example, the CompetitionFilter component directory
has the following contents:

```
CompetitionFilter
│   │   ├── CompetitionFilterContracts.ts
│   │   ├── CompetitionFilterer.ts
│   │   └── CompetitionFilter.vue
```

## Inline Integration Notes
As with previous releases, various templates contain `@integration` comments highlighting points relevant to integration.

The following files contain integration notes that should be reviewed:

1. `src/views/pages/O.2_view_competition.php`
    * Component property attribute requires configuration
1. `src/views/pages/competition-registration/K.0_CompetitionRegistration.competition-list.php`
    * A new component relevant to this page has been introduced as part of this update.  A stub to integrate this new component
   has been added to this template, but leaving the template as is will not pose any issues.
1. `src/views/pages/M.1_volunteer-opportunities.php`
    * A note surrounding an optional architecture update has been added to this file
1. `src/js/CompetitionSchedule/CompetitionSchedule.vue:~238`
    * Configuration to set page lead text when multiple sheets aren't present can be set, if desired.
1. `src/views/pages/N.0_EMS_Home.php:18`
    * "Search Competitions" link has been added and requires a target

## "Competition Schedule" Change
Prior to this release, a page for "Competition Schedule" existed to show the overall competition schedule with additional coach
information included.  This release adds a new user-agnostic Competition Schedule page, so the existing page and related properties
needed to be renamed to create space for the new.

Template changes necessary to facilitate this update are included in the "Templates" section below.

Within the frontend demo site, the URL for the previous page has changed from `/competition-schedule` to `/coach-competition-schedule`.

The component tag for the existing competition schedule has changed from `<competition-schedule>` to `<coach-competition-schedule>`.

## Competition Detail/Profile Page Deprecation
This release features a new View Competition page that is intended to replace the existing Competition Detail/Profile page. 

The following Competition Detail/Profile code elements are deprecated as part of this release:
    * template `src/views/pages/C.1_competition_details.php`
    * page component `src/js/components/CompetitionDetail.vue`

Page layouts referencing `src/views/pages/C.1_competition_details.php` should now reference `src/views/pages/O.2_view_competition.php`
instead.


## Templates
The following templates are relevant to this release.  Those that are [Modified] will require integration updates:

* [MODIFIED] `src/views/layouts/partials/header.php`
    * Change existing "Competition Schedule" to "Coach Competition Schedule" in competition navigation
    * Add "Search Competitions" link
* [MODIFIED,DEPRECATED] `src/views/pages/C.1_competition_details.php`
    * Change existing "Competition Schedule" to "Coach Competition Schedule" in navigation
    * Replaced by `src/views/pages/O.2_view_competition.php`
* [MODIFIED] `src/views/pages/E.2.1_Competition-contacts.php`
    * Made updates to improve UI related to data loading as well as enable competition heading data population for non-user competitions
    * Note: the Vue component for this page (`src/js/pages/CompetitionContacts.vue`) has been rewritten as part of this release.
* [MODIFIED] `src/views/pages/H.1_competition-schedule.php`
    * Updated markup to mirror updates made to Practice Ice in release 3.2.3
    * Change page component element from `<competition-schedule>` to `<coach-competition-schedule>`
* [MODIFIED] `src/views/pages/N.0_EMS_Home.php`
    * Added link to Search Competitions page.
* [ADDED] `src/views/pages/O.1_search_competitions.php`
    * New Search Competitions page template
* [ADDED] `src/views/pages/O.2_view_competition.php`
    * New View Competition page template
* [ADDED] `src/views/pages/O.3_competition-schedule.php`
    * New Competition Schedule page template
* [MODIFIED] `src/views/pages/competition-registration/K.0_CompetitionRegistration.competition-list.php`
    * Added new component option stub (within commented code) for CTA block of competition tiles
* [DEPRECATED] `src/views/pages/partials/volunteer-opportunities/M.3_volunteer-opportunities-request.php`
    * Deprecated in favor of component file template
    
# API
API endpoints and payloads are outlined in `INTEGRATION_GUIDES/Release3/ScheduleAccess/ScheduleAccessAPI.md`

## API Changes
The following section outlines changes to existing API endpoints

### Fetch Volunteer Request Data
The `FetchVolunteerRequestDataAPIResponse` returned by the "Fetch Volunteer Request Data" endpoint has
been extended to include a `links` property.  This property is used to populate the "Terms & Conditions"
confirmation checkbox links within a Volunteer Request initiated from the View Competition page.

```
/**
 * Response when retrieving information enabling a user to pursue an volunteer request opportunity
 */
export interface FetchVolunteerRequestDataAPIResponse {
    // Previous Properties Unchanged
    links: {                                                // Links to external pages from within Volunteer Request
        criminal_history_check: string;                         // Link URL for "criminal history records check" confirmation input link
        terms_and_conditions: string;                           // Link URL for "terms & conditions" confirmation input link
    }
}

```
### Get Competition Schedule
The `CompetitionScheduleData` object returned by this endpoint (outlined in `INTEGRATION_GUIDES/2__INTEGRATION-BATCH2.md:258`)
has been extended to return additional optional data points required by the new Competition Schedule page, as well as 
return a dedicated response when the schedule is not yet available.