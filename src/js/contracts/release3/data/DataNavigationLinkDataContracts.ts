import {StatusMessageData, StatusMessageTypeKeyData} from '../../data/DataContracts';

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