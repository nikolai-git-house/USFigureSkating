# Team Portal Integration (2020-06-17)

## Overview
This document aids in the process of integration of isolated frontend development assets with a backend environment for
the Team Portal release.

## Changelog
Specific additions and changes to the codebase as part of this release have been documented in the changelog.

## Contents
This release includes the following primary components:

- [Added] My Competitions - Teams page
- [Added] My Teams page
- [Modified] Competition Portal Main page
- [Added] Competition Documents Page
- [Modified] Competition Portal "Competition Contacts" page
- [Modified] Competition Portal "Competition Information" page
- [Added] Competition Portal "Select Competition Entity" page
- [Added] Competition Team Personnel page
- [Modified] Competition Portal "Music & Planned Program Content" page
- [Modified] Competition Portal "Practice Ice Schedule" page
- [Modified] Competition Portal "Practice Ice Pre-Purchase" page
- [Added] Competition Roster page
- [Modified] Competition Portal "Competition Schedule" page

# General

## Data Structure Documentation
In line with the previous release, this release utilizes a "documentation in place" strategy to document data structures.

## Inline Integration Notes
As with previous releases, various templates contain `@integration` comments highlighting points relevant to integration.

The following files contain integration notes that should be reviewed:

* `src/views/layouts/partials/header.php`
    * New main menu item for "My Competitions - Teams" needs a link target

## Active Object ID Information

### Active Competition ID
At various points within Competition Portal pages, the client-side requires information about the active competition ID upon
page load in order to construct appropriate endpoint URLs.  The server-side does not need to track the state of the
active ID; it simply needs to provide this information when loading a page specific to a competition.

The name of the cookie containing this information can be configured by changing the `COMPETITION_PORTAL_ACTIVE_COMPETITION_ID_COOKIE_NAME` value in `src/js/config/AppConfig.ts:56`.

The following Competition Portal pages will use this cookie, regardless of whether they are being viewed as the active user or a team:

* "My Teams"
* "Select Competition Entity"
* "Competition Portal Main"
* "Competition Documents"
* "Competition Contacts"
* "Competition Information"
* "Competition Team Personnel"
* "Music & Planned Program Content"
* "Practice Ice Schedule"
* "Practice Ice Pre-Purchase"
* "Competition Roster"
* "Competition Schedule"


### Active Team ID
At various points within Competition Portal pages, the client-side requires information about the active team ID upon
page load in order to construct appropriate endpoint URLs.  The server-side does not need to track the state of the
active ID; it simply needs to provide this information when loading a page being viewed as a team.

The name of the cookie containing this information can be configured by changing the `COMPETITION_PORTAL_ACTIVE_TEAM_ID_COOKIE_NAME` value in `src/js/config/AppConfig.ts:60`.

The following Competition Portal pages will use this cookie:

* "Competition Portal Main"
* "Competition Documents"
* "Competition Contacts"
* "Competition Information"
* "Competition Team Personnel"
* "Music & Planned Program Content"
* "Practice Ice Schedule"
* "Practice Ice Pre-Purchase"
* "Competition Roster"
* "Competition Schedule"


## Templates
The following templates are relevant to this release.  Those that are [Modified] will require integration updates:

* [MODIFIED] `src/views/pages/N.0_EMS_Home.php`
    * Added target to "My Competitions - Teams" menu item link
* [MODIFIED] `src/views/layouts/partials/header.php`
    * Added "My Competitions - Teams" menu item
* [ADDED] `src/views/pages/R.0_my-competitions-teams.php`
    * New "My Competitions - Teams" page
* [ADDED] `src/views/pages/competitions/R.0.5_select-competition-entity.php`
    * New "Select Competition Entity" page
* [ADDED] `src/views/pages/R.1_my-teams.php`
    * New "My Teams" page
* [ADDED] `src/views/pages/competitions/R.2_competition-documents.php`
    * New "Competition Documents" page
* [MODIFIED] `src/views/pages/C.1.3.3_competition_information.php`
    * Removed "Competition Documents" accordion    
    * Removed component template (moved to Vue component file)
    * Removed obsolete `v-cloak` attribute from component element
* [MODIFIED] `src/views/pages/E.2.1_Competition-contacts.php`
    * Removed component template (moved to Vue component file)
* [ADDED] `src/views/pages/competitions/R.4_competition-team-personnel.php`
    * New "Competition Team Personnel" page
* [MODIFIED] `src/views/pages/F.1_PPC.php`
    * Revised component markup structure
* [MODIFIED] `src/views/pages/partials/ppc-element-form.php`
    * Added Transition Description input
* [MODIFIED] `src/views/pages/partials/ppc-element.php`
    * Added Transition Description display
* [MODIFIED] `src/views/pages/C.1.2_practice_ice.php`
    * Revised component markup structure
* [ADDED] `src/views/pages/competitions/R.5_competition-roster.php`
    * New "Competition Roster" page

# Scripts
As part of this release, a new script source directory `src/js/CompetitionPortal` has been added. This directory was created in the
spirit of source modularity.  Although existing Competition Portal script source files have not been migrated to
this directory, it will house new additions starting from 2020-06-13 that are specific to the Competition Portal. During
compilation, this directory is merged into `public/js/main.js`, so no new `<script>` tags will need to be added to any templates
to load these scripts.


## Individual Integration Documentation
The following elements of the release have dedicated integration information files:

- My Competitions - Teams `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-TeamPortalMyCompetitions.md`
- My Teams `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-TeamPortalMyTeams.md`
- Select Competition Entity `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-SelectCompetitionEntity.md`
- Competition Portal Main `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionPortalMain.md`
- Competition Documents `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-TeamPortalCompetitionDocumentsUpdate.md`
- Competition Contacts `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionContactsUpdate.md`
- Competition Information `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionInformationUpdate.md`
- Competition Team Personnel `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-TeamPortalCompetitionTeamPersonnel.md`
- Music & PPC `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-MusicPpcUpdate.md`
- Practice Ice Schedule `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-PracticeIceSchedule.md`
- Practice Ice Pre-Purchase `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-PracticeIcePrePurchase.md`
- Competition Roster `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-TeamPortalCompetitionRoster.md`
- Competition Schedule `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionSchedule.md`
- Competition Portal Main Navigation `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionPortalMainNavigation.md`
- Competition Portal Main CTAs `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionPortalMainCTAs.md`

## Changes to Prior Deliverables

### Competition Portal Main page
In order to facilitate updates supporting Teams, as well as additional user-agnostic changes to the Competition Portal
Main page ('View Competition'), various changes have been made to the Competition Portal Main page and its supporting API
endpoint. Full documentation of these changes can be found in `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionPortalMain.md`.
These changes include but are not limited to:

* Changed Fetch endpoint URL
* Revised Fetch endpoint response structure
* Changed data structures surrounding user navigation links

### Competition Documents
Prior to this release, Competition Documents existed as a sub-component within the "Competition Information" page. As
part of this release, it has been extracted from this location to create a standalone page.  The specific changes
surrounding this update are documented in `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-TeamPortalCompetitionDocumentsUpdate.md`

### Competition Portal "Competition Contacts" page
Revisions to the Competition Contacts page have been made as part of this release.  The full set of changes
are documented in `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionContactsUpdate.md`.

### Competition Portal "Competition Information" page
Foundational revisions to the Competition Information page have been made as part of this release.  The full set of changes
are documented in `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionInformationUpdate.md`.

### Competition Portal "Music & Planned Program Content" page
Foundational revisions to the Competition Information page have been made as part of this release.  The full set of changes
are documented in `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-MusicPpcUpdate.md`.

### Competition Portal "Practice Ice Schedule" page
Foundational revisions to the Practice Ice Schedule page have been made as part of this release.  The full set of changes
are documented in `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-PracticeIceSchedule.md`.

### Competition Portal "Practice Ice Pre-Purchase" page
Foundational revisions to the Practice Ice Pre-Purchase page have been made as part of this release.  The full set of changes
are documented in `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-PracticeIcePrePurchase.md`.

### Competition Portal "Competition Schedule" page
Foundational revisions to the Competition Schedule page have been made as part of this release.  The full set of changes
are documented in `INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionSchedule.md`.

### Additional Changes
* `src/views/layouts/partials/header.php`
    * Added main menu link to "My Competitions - Teams"