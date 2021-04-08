# Compliance Header Integration (2020-07-28)

## Overview

This document aids in the process of integration of isolated frontend development assets with a backend environment for
the Competition Portal Compliance Header release. This update adds support for additional information to display in the
Competition/Entity/Compliance header present on Competition Portal pages.

## Changelog

Specific additions and changes to the codebase as part of this release have been documented in the changelog.

## Contents

This release includes the following primary components:

- [Extended] Competition Portal Team Header Component and associated schemas.
- [Revised] Competition Portal "My Skaters" page component and data flows
- [Revised] Competition Portal "My Coaches" page component and data flows
- [Revised] Competition Portal "My Schedule" page component and data flows
- [Revised] Competition Portal "Coach Schedule" page component and data flows
- [Revised] Competition Portal "Coach Competition Schedule" page component and data flows

# General

## Data Structure Documentation

In line with the previous release, this release utilizes a "documentation in place" strategy to document data
structures.

## Pages

Outside of client-side updates to the component displaying the information in this release, support for the extended
compliance header has been added to the following pages, with the following notes for integration:

- My Skaters Page `INTEGRATION_GUIDES/Release3/ComplianceHeader/INTEGRATION-ComplianceHeaderMySkaters.md`
- My Coaches Page `INTEGRATION_GUIDES/Release3/ComplianceHeader/INTEGRATION-ComplianceHeaderMyCoaches.md`
- My Schedule Page `INTEGRATION_GUIDES/Release3/ComplianceHeader/INTEGRATION-ComplianceHeaderMyScheduleCoachSchedule.md`
- Coach Schedule Page `INTEGRATION_GUIDES/Release3/ComplianceHeader/INTEGRATION-ComplianceHeaderMyScheduleCoachSchedule.md`

### Resolution Through Data Extensions

Support on the following pages has been added through extension of `PageEntityHeaderComplianceSummaryData` in API
response (see below). These pages have been already configured to load by fetching an API response that extends the
`CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` schema.

- Competition Portal Main
- Competition Information
- Practice Ice/Schedule
- Practice Ice Pre-Purchase
- Music & PPC
- Competition Contacts
- Competition Schedule
- Competition Documents

## Changes to Prior Deliverables

### [Extended] PageEntityHeaderComplianceSummaryData Schema

In order to facilitate the display of additional compliance information in Competition Portal pages, the
`PageEntityHeaderComplianceSummaryData` schema (contained within
`CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse.entity_summary.compliance`) has been extended to contain new
`supporting_description` and `role_items` properties:

```
/**
 * Represents summary information about an entity's compliance status to display in a page header
 */
export interface PageEntityHeaderComplianceSummaryData {
    // existing properties unchanged
    supporting_description?: StatusMessageData;         // Supporting status message for compliance ("Valid through: 10/2/2020")
    role_items?: PageEntityHeaderComplianceRoleData[];  // List of compliance items, grouped by role, for the entity to display in the page compliance header
}

/**
 * Represents compliance items, grouped by role, for display in the page compliance header
 */
interface PageEntityHeaderComplianceRoleData {
    role: string;                                   // The role ('Coach','Volunteer,' etc.) to which the compliance items belong.  Displays as heading for the list if the user has more than one role
    items: PageEntityHeaderComplianceItemData[];    // The list of compliance items
}

/**
 * Represents a single compliance/requirements item to display in the page compliance header
 *
 * Similar to CompetitionRosterData.ComplianceRequirementsItem (src/js/CompetitionPortal/_pages/CompetitionRoster/_contracts/CompetitionRosterDataContracts.ts:30)
 */
interface PageEntityHeaderComplianceItemData {
    name: string;                                      // The name of the item
    complete: boolean;                                 // Whether the item is complete
    is_membership?: boolean;                           // Whether the item is the "Membership" item.  Controls display of membership end date
    membership_expiration_date_formatted?: string;     // The formatted membership end date.  Displays when `is_membership` is true
}
```

When contacting an endpoint that returns a `CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse` for a non-team,
these two new properties should be populated. When contacting this endpoint for a team, they should not be provided.

### [Revised] My Skaters Page

Foundational changes to the My Skaters page have been made as part of this release. Full integration notes for these
changes can be found in `INTEGRATION_GUIDES/Release3/ComplianceHeader/INTEGRATION-ComplianceHeaderMySkaters.md`.

### [Revised] My Coaches Page

Foundational changes to the My Skaters page have been made as part of this release. Full integration notes for these
changes can be found in `INTEGRATION_GUIDES/Release3/ComplianceHeader/INTEGRATION-ComplianceHeaderMyCoaches.md`.

### [Revised] My Schedule/Coach Schedule Pages

Foundational changes to the My Schedule and Coach Schedule pages have been made as part of this release. Full
integration notes for these changes can be found in
`INTEGRATION_GUIDES/Release3/ComplianceHeader/INTEGRATION-ComplianceHeaderMyScheduleCoachSchedule.md`.

### [Revised] Coach Competition Schedule

Foundational changes to the Coach Competition Schedule page have been made as part of this release. Full integration notes for these
changes can be found in `INTEGRATION_GUIDES/Release3/ComplianceHeader/INTEGRATION-CoachCompetitionSchedule.md`.
