# Admin Contact Required Roles 2020-08-28

## Purpose

This document aids in the process of integration of isolated frontend development assets with a backend environment for
an update to Admin Portal Competition Contacts to facilitate functionality preventing removal of the last Chair
instance.

## Changelog

Specific additions and changes to the codebase as part of this release have been documented in the changelog.

## Summary of Changes

This update adds functionality to prevent removal of the last instance of specified roles in the Admin Portal
Competition Contacts page. This addition was made through the following changes:

### API

1. Addition of `required_roles` property to `CompetitionManagementContactsFetchAPIResponse` returned by the "Competition
   Management Contacts Fetch Entities" API endpoint (`INTEGRATION_GUIDES/Release3/AdminPortal/AdminPortalAPI.md:619`).
   - The change has been formulated to be non breaking. No roles will be treated as required (ie: all entities can be
     removed) if property is not provided.

### Client App

1. Admin Competition Contacts Page Component
   (`src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_components/CompetitionManagementContactsIndex.vue`)
   - UI updates to display delete icon as disabled on the last instance of entities in required roles
   - Add notice to display when disabled delete icon is clicked
1. Updated contracts and transformations to facilitate new datapoint:
   - `src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_contracts/CompetitionManagementContactsAPIContracts.ts`
   - `src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_contracts/CompetitionManagementContactsContracts.ts`
   - `src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_contracts/CompetitionManagementContactsServiceContracts.ts`
   - `src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_transformers/CompetitionManagementContactsAPITransformer.ts`
1. Update state module
   (`src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_store/CompetitionManagementContactsState.ts`)
   - Add tracking of required role keys
   - Add getter to determine whether an entity can be removed
1. Add `--delete--disabled` `icon-button` element style variant
   - `src/sass/base/_overrides.scss`

### Templates

No Template updates are part of this changeset.

## Integration Steps

1. Import ClientApp changes:
   - [Modified]
     `src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_components/CompetitionManagementContactsIndex.vue`
   - [Modified]
     `src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_contracts/CompetitionManagementContactsAPIContracts.ts`
   - [Modified]
     `src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_contracts/CompetitionManagementContactsContracts.ts`
   - [Modified]
     `src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_contracts/CompetitionManagementContactsServiceContracts.ts`
   - [Modified]
     `src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_store/CompetitionManagementContactsState.ts`
   - [Modified]
     `src/js/AdminPortal/CompetitionManagement/CompetitionManagementContacts/_transformers/CompetitionManagementContactsAPITransformer.ts`
   - [Modified] `src/sass/base/_overrides.scss`
1. Make API changes outlined below

## API Changes

### [Extended] "Competition Management Contacts Fetch Entities"

The `CompetitionManagementContactsFetchAPIResponse` returned by the "Competition Management Contacts Fetch Entities"
endpoint (`INTEGRATION_GUIDES/Release3/AdminPortal/AdminPortalAPI.md:619`) has been extended to include a
`required_roles` property. This property is used to indicate roles for entities that are required (the last instance of
an entity for this role should not be able to be deleted).

Notes:

1. This change is non-breaking. If the `required_roles` property is not returned in the response, the client side will
   not prevent the removal of any entities in either of the page lists.
1. If the `required_roles` property is returned in the response, but either of the subproperties (`contacts`,
   `officials`) is not provided, no entities within the list corresponding with the absent property will be prevented
   from being deleted.

```
/**
 * Server response when fetching Competition Management Contacts
 */
export interface CompetitionManagementContactsFetchAPIResponse {
    // Previous Properties Unchanged
    required_positions?: {                                          // Lists of `CompetitionManagementContactPositionKeyData` (for each entity list type) for positions for which the last instance of that position should be prevented from being removed
        contacts?: CompetitionManagementContactPositionKeyData[];       // Positions within the contacts list.  If not provided, all positions will be treated as always removable
        officials?: CompetitionManagementContactPositionKeyData[];      // Positions within the officials list.  If not provided, all positions will be treated as always removable
    }
}
```
