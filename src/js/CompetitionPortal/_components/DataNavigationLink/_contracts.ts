import {StatusMessage, StatusMessageTypeKey} from '../../../contracts/AppContracts';

export namespace DataNavigationLinkComponent {
    /**
     * A link for the component
     */
    export interface DataNavigationLink {
        label: string;                      //  The primary text label for the link
        url: string;                        //  The URL for the link
        is_disabled?: boolean;              //  Whether the link is disabled
        is_complete?: boolean;              //  Whether the link should show a complete/incomplete icon. Undefined results in no icon
        data?: DataNavigationLinkData[];    //  Data to display in content area
    }

    /**
     * Supporting data for the link
     */
    export interface DataNavigationLinkData {
        status_type?: StatusMessageTypeKey; // Status message type to control color of content
        icon?: DataNavigationLinkDataIcon;  // Icon to apply to the content
        content: string | StatusMessage[];  // Content to display.  Strings display straight-up, while arrays of status messages result in piped lists
    }

    /**
     * A content icon supported by the component
     */
    export type DataNavigationLinkDataIcon =
        'warning' |     // Warning icon. Standard text
        'scheduled' |   // Scheduled icon.  Green text
        'pending' |     // Pending icon.  Orange text
        'incomplete' |  // Incomplete (x) icon.  Red text
        'complete' |    // Complete (√) icon.  Green text.
        'new';          // New badge icon.  Standard texts
}