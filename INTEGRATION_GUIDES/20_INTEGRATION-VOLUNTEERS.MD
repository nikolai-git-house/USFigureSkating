# Volunteers (Shift Selection) (2020-08-19)

## Overview

This document aids in the process of integration of isolated frontend development assets with a backend environment for
the Volunteers release.

## Changelog

Specific additions and changes to the codebase as part of this release have been documented in the changelog.

## Contents

This release includes the following primary components:

- [Added] My Volunteer Schedule
- [Added] Shift Selection Page
- [New Configuration] Competition Portal Main page

# General

## Data Structure Documentation

In line with the previous release, this release utilizes a "documentation in place" strategy to document data
structures.

## Inline Integration Notes

No new inline integration notes are present in this release.

## Templates

The following templates are relevant to this release.

- [ADDED] `src/views/pages/competitions/S.0_volunteer-schedule.php`
  - New "My Volunteer Schedule" page
- [ADDED] `src/views/pages/competitions/S.1_shift-selection.php`
  - New "Shift Selection" page

# Scripts

As part of this release, a new script source directory `src/js/CompetitionPortal/Volunteers` has been added. This
directory was created in the spirit of source modularity. This source directory is built through its `bootstrap.ts`
file, which has been imported into the `src/js/CompetitionPortal/bootstrap.ts` file. This will ultimately compile into
the `main.js` asset file.

## Individual Integration Documentation

The following elements of the release have dedicated integration information files:

- Competition Portal Main `INTEGRATION_GUIDES/Release3/Volunteers/INTEGRATION-CompetitionPortalMain.md`
- Shift Selection `INTEGRATION_GUIDES/Release3/Volunteers/INTEGRATION-ShiftSelection.md`
- My Volunteer Schedule `INTEGRATION_GUIDES/Release3/Volunteers/INTEGRATION-MyVolunteerSchedule.md`

## New Files

- Volunteer-related scripts
  - `src/js/CompetitionPortal/Volunteers/**/*.*`
- Volunteer-related stylesheets
  - `src/sass/CompetitionPortal/Volunteers/**/*.*`
- Volunteer Templates
  - `src/views/pages/competitions/S.0_volunteer-schedule.php`
  - `src/views/pages/competitions/S.1_shift-selection.php`
- Filter Takeover files
  - `src/js/components/FilterTakeover/**/*.*`
- Accordion Multiselect files
    - `src/js/components/AccordionMultiselect/**/*.*`
    - `src/sass/components/_accordion-multiselect.scss`
- Filter Button Element stylesheet
  - `src/sass/elements/_filter-button.scss`

## Changes to Prior Deliverables

- `src/js/CompetitionPortal/bootstrap.ts`
  - Added Volunteer bootstrap file import
- `src/js/bootstrap.ts`
  - Added registration of new `FilterTakeover` component
  - Added registration of new `AccordionMultiselect` component
- App Notice
  - Added support for "danger" style variant
  - Files:
    - `src/js/components/AppNotice.vue`
    - `src/js/contracts/AppContracts.ts`
    - `src/js/store/Modules/AppState.ts`
- `src/js/components/CompetitionFilter/CompetitionFilterService.ts`
  - Fixed issue in which filter criteria containing regex characters resulted in an error
- Confirm Action Overlay Component
  - Changed icon class used in component
  - Added support for promise-based confirmation actions
  - Files:
    - `src/sass/components/_confirm-action-overlay.scss`
    - `src/js/components/ConfirmActionOverlay.vue`
    - `src/js/contracts/AppContracts.ts`
    - `src/js/store/Modules/AppState.ts`
- `src/js/helpers/StringHelpers.ts`
  - Added supporting string helpers for release changes
- `src/sass/CompetitionPortal/index.scss`
  - Added Volunteers stylesheet import
- `src/sass/abstracts/_icons.scss`
  - Added new icons (x3)
- `src/sass/base/_typography.scss`
  - Added new text atomic class (`.text--underline`)
- `src/sass/main.scss`
  - Added import of new `filter_button` element stylesheet
  - Added import of new `accordion-multiselect` component stylesheet
- `src/sass/components/practice-ice/_practice-ice-rink-name-carousel.scss`
  - Fine-tune adjustments to prevent text highlighting during interaction
