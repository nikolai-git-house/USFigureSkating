# Team Portal Integration - Competition Portal Main Navigation

This document summarizes integration notes surrounding changes and additions to the Competition Portal Main page
Navigation links contained within the Team Registration/Team Portal release.

## Background/Overview

The navigation in question was originally developed in the first release of the project to contain a simple list of hard
coded links. This was updated during the Schedule Access release to populate based on data provided by an API endpoint.
Independently, the USFS team added additional supporting information to some navigation items, such as Practice Ice
messaging and registered event counts.

This release extends and overhauls the display of messaging within these links. These updates were designed to support
the messaging cases added by USFS as well as new contextual messaging.

For a (mostly) comprehensive visual representation of this messaging, see the
[Hawkeye Invision Prototype](https://publicishawkeye.invisionapp.com/d/#/console/19851721/415393845/comments).

## Data Structure Change

In order to support the addition of new messaging on the Competition Portal Main Page Navigation links, the data
structure types surrounding these items has changed from `CompetitionUserNavigationItemData[]` to
`DataNavigationLinkData.DataNavigationLink[]`.

Existing:

```
/**
 * Represents an item in the user navigation for a competition
 */
export interface CompetitionUserNavigationItemData {
    is_active: boolean;             // Whether the item is active
    label: string;                  // The label for the item
    url: string;                    // The URL for the item
    inactive_message?: string;      // The message to display by an inactive item when clicked
    ppc_deadline: string;           // (added by USFS)
    music_deadline: string;         // (added by USFS)
    no_practice_ice: boolean;       // (added by USFS)
    no_credits_purchased: boolean;  // (added by USFS)
    practice_ice_period: string;    // (added by USFS)
    registered_event_count: number; // (added by USFS)
    practice_ice_message: string;   // (added by USFS)
}
```

Replacement. Typings have been concatenated here to illustrate overall structure

```
/**
 * Represents a navigation link with optional supporting data
 */
export interface DataNavigationLink {
    label: string;                            // The primary label for the link ("Competition Schedule," "Practice Ice / Schedule," etc.)
    url: string;                              // URL for the link.  Although there are cases where the link is disabled and a URL isn't used, this should always be provided.  This can be set as '#' in disabled contexts.
    is_disabled?: boolean;                    // Whether the item is disabled/inactive
    is_complete?: boolean;                    // Whether the item should show a complete(`true`) or incomplete(`false`) icon.  No icon shows when property is absent
    data?: {                                  // Supporting data to display in the item.  Each item in the list displays on a new line
        content: string                             // Normal string content, or...
            |
            {                                       // ...an array of `StatusMessageData` items that display in a piped list (ex: "Skaters: 12 | Deadline: 20 days" where the "skaters" segment is green and the "deadline" segment is red.)
                text: string;                           // The message to display
                type_key:                               // Determines the display color of the text
                    null |                                  // Normal text
                    'info' |                                // Blue status text
                    'success' |                             // Green status text
                    'warning' |                             // Orange status text
                    'alert'                                 // Red status text
            }[];
        status_type?:                               // Status type to apply to `string` content messages.  Null or absent values result in default grey text.  'info' and 'warning' options are supported, but do not currently apply to any use cases
            null |                                      // Normal text
            'info' |                                    // Blue status text
            'success' |                                 // Green status text
            'warning' |                                 // Orange status text
            'alert';                                    // Red status text
        icon?:                                      // Icon to apply to the item. Overrides `status_type` if present
            'warning' |                                 // Warning icon. Standard text
            'scheduled' |                               // Scheduled icon.  Green text
            'pending' |                                 // Pending icon.  Orange text
            'incomplete' |                              // Incomplete (x) icon.  Red text
            'complete' |                                // Complete (√) icon.  Green text
            'new';                                      // "New" badge icon.  Standard text;
    }[];
}
```

## Migration

The following sections outline steps necessary to migrate from the existing structures to the new.

### Label and URL

The `label` and `url` properties are unchanged, so no migrations for these properties are required.

### Active/Inactive State

The `is_active` property has been replaced by the inverted `is_disabled` property. The `inactive_message` property has
been absorbed into a `data[0].content` property.

Original:

```
{
  "label": "Practice Ice / Schedule",
  "url": "/pages/practice-ice-schedule?id=1",
  "is_active": false,
  "inactive_message": "Practice Ice sales have not started yet. Try again later."
}
```

Migrated:

```
{
  "label": "Practice Ice / Schedule",
  "url": "/pages/practice-ice-schedule?id=1",
  "is_disabled": true,
  "data": [
    {
      "content": "Practice Ice sales have not started yet. Try again later."
    }
  ]
}
```

### Music and PPC

The `ppc_deadline` and `music_deadline` properties were added by USFS after Hawkeye delivery. Their purposes have been
absorbed into the `data` property. Discrete messaging needs to be provided, as the client-side no longer transforms or
formats these properties. Additionally, the menu item now supports iconography to communicate the overall completion
status

```
{
  "label": "Music & PPC",
  "url": "/pages/music-and-ppc?id=1",
  "is_complete": false,
  "data": [
    {
      "content": "Music Deadline: 20 days",
      "icon": "complete"
    },
    {
      "content": "PPC Deadline: 2 hours",
      "icon": "incomplete"
    }
  ]
}
```

### Practice Ice Period/Message

The `practice_ice_period` and `practice_ice_message` properties were added by USFS after Hawkeye delivery. Their
purposes have been absorbed into the `data` property. Discrete messaging needs to be provided, as the client-side no
longer transforms or formats these properties.

```
{
  "label": "Practice Ice / Schedule",
  "url": "/pages/practice-ice-schedule?id=1",
  "data": [
    {
      "content": "Pre-Purchase Begins: 6 days"
    }
  ]
}
```

### No Practice Ice

The `no_practice_ice` property was added by USFS after Hawkeye delivery. Its purpose has been absorbed into the `data`
property. Additionally, the new `is_disabled` property should likely be set to `true` in this context.

```
{
  "label": "Practice Ice / Schedule",
  "url": "/pages/practice-ice-schedule?id=1",
  "is_disabled": true,
  "data": [
    {
      "content": "Practice Ice is not offered through EMS at this competition."
    }
  ]
}
```

### Practice Ice Credits

The `no_credits_purchased` property was added by USFS after Hawkeye delivery. Its purpose has been absorbed into the
`data` property.

```
{
  "label": "Practice Ice / Schedule",
  "url": "/pages/practice-ice-schedule?id=1",
  "data": [
    {
      "content": "0 credits purchased"
    }
  ]
}
```

Additionally, this update introduces the ability to list out purchased and unscheduled credits, as well as including
this information alongside a Practice Ice Period/Message

```
{
  "label": "Practice Ice / Schedule",
  "url": "/pages/practice-ice-schedule?id=1",
  "data": [
    {
      "content": "Pre-Purchase Closes: 12 hours",
      "status_type": "alert"
    },
    {
      "content": "Purchased: UPI: 4 / OPI: 3 / WU: 5"
    },
    {
      "content": "Unscheduled: UPI: 4 / OPI: 3 / WU: 5"
    }
  ]
}
```

### Registered Event Count

The `registered_event_count` property was added by USFS after Hawkeye delivery. Its purpose has been absorbed into the
`data` property. Discrete messaging needs to be provided, as the client-side no longer transforms or formats this
property.

```
{
  "label": "Competition Information",
  "url": "/pages/competition-information?id=1",
  "data": [
    {
      "content": "2 Registered Events."
    }
  ]
}
```

## API Changes

### Fetch Competition Portal Main (`INTEGRATION_GUIDES/Release3/Teams/TeamPortal/INTEGRATION-CompetitionPortalMain.md:40`)

Within the response to this endpoint, there is a `competition: ViewCompetitionData` property.

The `user_navigation` property of this structure has changed type from `CompetitionUserNavigationListData` to
`DataNavigationLinkData.DataNavigationLink[]` and needs to be updated as noted above and extended to contain display of
newly desired information.

## Data Structures

The following data structures are relevant to this update.

```
export namespace DataNavigationLinkData {
    /**
     * Represents a navigation link with optional supporting data
     */
    export interface DataNavigationLink {
        label: string;                                // The primary label for the link ("Competition Schedule," "Practice Ice / Schedule," etc.)
        url: string;                                  // URL for the link.  Although there are cases where the link is disabled and a URL isn't used, this should always be provided.  This can be set as '#' in disabled contexts.
        is_disabled?: boolean;                        // Whether the item is disabled/inactive
        is_complete?: boolean;                        // Whether the item should show a complete(`true`) or incomplete(`false`) icon.  No icon shows when property is absent
        data?: DataNavigationLinkSupportingDatum[];   // Supporting data to display in the item
    }

    /**
     * Represents supporting data/content for a navigation link
     *
     * Single line of informational data
     */
    export interface DataNavigationLinkSupportingDatum {
        content: string | MultiStatusMessage;       // The content of the line.  Either a string, or a series of `StatusMessageData` items points to display in an inline list
        status_type?: StatusMessageTypeKeyData;     // Status type to apply to `string` content messages.  Null or absent values result in default grey text.  'info' and 'warning' options are supported, but do not currently apply to any use cases
        icon?: DataNavigationLinkDataIconData;      // Icon to apply to the item. Overrides `status_type` effects if present
    }

    /**
     * Represents a series of status items to display in an inline list separated by pipes.
     *
     * ex: "Skaters: 12 | Deadline: 20 days" where the "skaters" segment is green and the "deadline" segment is red.
     */
    interface MultiStatusMessage extends Array<StatusMessageData> {}

    /**
     * A content icon supported by the component
     */
    export type DataNavigationLinkDataIconData =
        'warning' |     // Warning icon. Standard text
        'scheduled' |   // Scheduled icon.  Green text
        'pending' |     // Pending icon.  Orange text
        'incomplete' |  // Incomplete (x) icon.  Red text
        'complete' |    // Complete (√) icon.  Green text
        'new';          // New badge icon.  Standard text
}


/**
* PRE-EXISTING SUPPORT STRUCTURES
*/
export type StatusMessageTypeKeyData =
   null | // Normal text
   'info' |            // Blue status text
   'success' |         // Green status text
   'warning' |         // Orange status text
   'alert';            // Red status text

export type StatusMessageData = {
   text: string;                         // The message to display
   type_key: StatusMessageTypeKeyData;   // Determines the display color of the text
}
```

## File Changes
The following changes have been made to previously-delivered files:

- CompetitionUserNavigation (`src/js/components/CompetitionUserNavigation/CompetitionUserNavigation.vue`)
  - Updated to use new `DataNavigationLink` component instead of `DataNavigationLink`
- Deleted obsolete CompetitionUserNavigation-related structures/files:
  - `src/js/components/CompetitionUserNavigation/CompetitionUserNavigationContracts.ts`
  - `src/js/components/CompetitionUserNavigation/CompetitionUserNavigationDataContracts.ts`
  - `src/js/components/CompetitionUserNavigation/CompetitionUserNavigationLink.vue`
- Adjusted "View Competition" (Competition Portal Main) page component
  - Typing adjustments to facilitate usage of new navigation data structures
- Adjusted View Competition Model (`src/js/pages/ViewCompetition/ViewCompetitionCompetition.ts`)
  - Use new types for user navigation
  - Remove obsolete interface extension
  - Update API transformation (`src/js/pages/ViewCompetition/ViewCompetitionTransformer.ts:22`)
