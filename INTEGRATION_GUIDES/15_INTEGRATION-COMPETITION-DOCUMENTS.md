# Competition Documents Integration

## Overview

This document aids in the process of integration of isolated frontend development assets with a backend environment for
the Competition Documents update. 

## Changelog

Specific additions and changes to the codebase as part of this release have been documented in the changelog.

## Contents

This release includes:

* [Updated] Competition Information Page and Supporting Structures
* [Added] Competition Documents Component

# General

## Data Structure Documentation

In line with the previous release, this release utilizes a "documentation in place" strategy to document data structures.
This includes updates to the `CompetitionInformationData` structure. 

## Code Structure

This update has maintained the code structures in place for the Skater/Coach portal. However, the new Competition Documents
component (`src/js/components/CompetitionDocuments.vue`) defines an HTML template within the component
instead of using an external inline-template. 

## Inline Integration Notes

There are no inline integration notes as part of this release.

## Templates

One template has been modified as part of this release:

* [Modified] Competition Information Page (`src/views/pages/C.1.3.3_competition_information.php`)
    * Addition of Competition Documents accordion
    * Refactor of existing markup to remove unnecessary extraneous markup
    * Addition of new page header styling to include a "back" link.
    * Change in code style (indentation/spacing) to adhere to new standards.
    * Addition of conditional-display blocks for upgraded loading state

# API

API endpoints and payloads are outlined in `INTEGRATION_GUIDES/Release3/CompetitionDocuments/CompetitionDocumentsAPI.md`

## API Changes

The "Get Competition Information" endpoint described in `INTEGRATION_GUIDES/2__INTEGRATION-BATCH2.md:251` is updated as
part of this release to include additional information for Competition Documents. Except where noted
in in `INTEGRATION_GUIDES/Release3/CompetitionDocuments/CompetitionDocumentsAPI.md`, this API endpoint remains unchanged.

This update also requires the addition of a new endpoint ("Update Competition Document Completion Status"). 