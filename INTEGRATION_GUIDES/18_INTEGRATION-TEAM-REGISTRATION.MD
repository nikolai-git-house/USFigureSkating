# Team Registration Integration

## Overview
This document aids in the process of integration of isolated frontend development assets with a backend environment for
the Team Registration release.

## Changelog
Specific additions and changes to the codebase as part of this release have been documented in the changelog.

## Contents
This release includes the following primary components:

- [Changed] EMS Home - Added reactive page component to facilitate messaging surrounding "Competition Registration - Teams" link.
- [Added] Team Registration
    * Select Team
    * Competition List
    * Team Competition Registration SPA

# General

## Data Structure Documentation
In line with the previous release, this release utilizes a "documentation in place" strategy to document data structures.

## Individual Integration Documentation
The following elements of the release have dedicated integration information files:

- EMS Home `INTEGRATION_GUIDES/Release3/Teams/INTEGRATION-TeamRegistrationEMSHome.md`
- Team Registration Select Team `INTEGRATION_GUIDES/Release3/Teams/INTEGRATION-TeamRegistrationSelectTeam.md`
- Team Registration Competition List `INTEGRATION_GUIDES/Release3/Teams/INTEGRATION-TeamRegistrationCompetitionList.md`
- Team Registration SPA Shell `INTEGRATION_GUIDES/Release3/Teams/CompetitionRegistration/INTEGRATION-TeamRegistrationRegistrationShell.md`
- Team Verification `INTEGRATION_GUIDES/Release3/Teams/CompetitionRegistration/INTEGRATION-TeamRegistrationRegistrationTeamVerification.md`
- Registration Overview `INTEGRATION_GUIDES/Release3/Teams/CompetitionRegistration/INTEGRATION-TeamRegistrationRegistrationOverview.md`
- Event Selection `INTEGRATION_GUIDES/Release3/Teams/CompetitionRegistration/INTEGRATION-TeamRegistrationRegistrationEventSelection.md`
- Competition Roster `INTEGRATION_GUIDES/Release3/Teams/INTEGRATION-TeamRegistrationRegistrationCompetitionRoster.md`
- Competition Coaches `INTEGRATION_GUIDES/Release3/Teams/INTEGRATION-TeamRegistrationRegistrationCoaches.md`
- Team Service Personnel `INTEGRATION_GUIDES/Release3/Teams/INTEGRATION-TeamRegistrationRegistrationTeamServicePersonnel.md`
- Prop Crew `INTEGRATION_GUIDES/Release3/Teams/INTEGRATION-TeamRegistrationRegistrationPropCrew.md`
- Cart/E-Commerce `INTEGRATION_GUIDES/Release3/Teams/CompetitionRegistration/INTEGRATION-TeamRegistrationRegistrationCart&Ecommerce.md`

## Inline Integration Notes
As with previous releases, various templates contain `@integration` comments highlighting points relevant to integration.

The following files contain integration notes that should be reviewed:

* `src/views/layouts/main.php`
    * Add team competition registration script inclusion
* `src/views/pages/competition-registration-teams/Q.0_CompetitionRegistrationTeams.team-select.php`
    * Page "Back" link can be configured via a template property
* `src/views/pages/competition-registration-teams/Q.1_CompetitionRegistrationTeams.competition-list.php`
    * Page "Back" link can be configured via a template property
* `src/views/pages/competition-registration-teams/Q.2_CompetitionRegistrationTeams.registration.php`
    * Page "Back" link can be configured via a template property

## Scripts
As part of this release, a new script file has been added (`public/js/competition-registration-teams.js`). This script will need to be included
on Team Competition Registration pages. This script will not cause conflicts if included on other pages.