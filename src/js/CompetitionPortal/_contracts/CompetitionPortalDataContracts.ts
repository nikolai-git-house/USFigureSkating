import {CompetitionHeadingData} from '../../contracts/data/CompetitionFieldDataContracts';
import {TeamsData} from '../../Teams/_contracts';
import {LinkConfigurationData, MemberNumberData, StatusMessageData} from '../../contracts/data/DataContracts';

export namespace CompetitionPortalData {
    /**
     * Represents summary information about the active competition portal competition
     */
    export interface ActiveCompetitionSummary extends CompetitionHeadingData {
        id: number;                             // Unique identifier for the competition
    }

    /**
     * Represents a team managed by the active user registered for a particular competition
     */
    export interface CompetitionRegisteredManagedTeam extends TeamsData.ManagedTeam {
        links: {
            competition_portal: string;         // Link to view the appropriate competition portal as the team
        };
    }

    /**
     * Represents summary information about an entity's compliance status to display in a page header
     */
    export interface PageEntityHeaderComplianceSummaryData {
        status: StatusMessageData;                          // Status text to display (including color configuration)
        link?: LinkConfigurationData;                       // Link to apply to status text, if desired/appropriate,
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

    /**
     * Summary information about the active entity (team, participant, etc) viewing a Competition Portal page
     */
    export interface ActiveEntitySummary {
        compliance?: PageEntityHeaderComplianceSummaryData;     // Information about the entity's compliance, if applicable
        name?: string;                                          // Name of the entity to display, if applicable.
                                                                // Note: Design assets include "<name> - <level>" for teams,
                                                                // and no name display for participant entities
    }

    /**
     * Represents collected information about a competition for the Competition Portal Competition Information page
     */
    export interface CompetitionInformation {
        registered_events: CompetitionInformationRegisteredEvent[];   // List of events the specified entity is registered for.  Displays in dedicated accordion
        practice_ice: {                                               // Collected Practice Ice information
            instructions: string;                                     // HTML content for "Practice Ice Instructions" accordion
            terminology: string;                                      // HTML content for "Practice Ice Terminology" accordion
            not_offered: boolean;                                     // Whether Practice Ice is not offered via EMS for the competition.  Results in singular message in "Practice Ice Prices & Timeline" accordion.  If provided, pricing_message, event_pricing and sales_windows property information will not display (functionality in place not altered)
            pricing_message?: string;                                 // Message to display in "Practice Ice Prices & Timeline" accordion in place of pricing and sales window information
            event_pricing?: CompetitionInformationEventPricing[];     // Pricing information to display in "Practice Ice Prices & Timeline" accordion
            sales_windows?: PracticeIceSalesWindow[];                 // Sales window information to display in "Practice Ice Prices & Timeline" accordion.  Sales windows in the past should not be included in this list
        };
    }

    /**
     * Represents summary information about a practice ice sales window
     */
    export interface PracticeIceSalesWindow {
        name: string;                           // Name of the sales window
        start_datetime_formatted: string;       // Formatted string representing the start datetime of the window
        end_datetime_formatted: string;         // Formatted string representing the end datetime of the window
        is_active: boolean;                     // Whether the window is currently active
    }

    /**
     * Information about an individual credit available for purchase
     */
    export interface CompetitionInformationEventPricingCredit {
        name: string;   // The name of the credit ("OPI")
        cost: number;   // The cost of the credit
    }

    /**
     * Information about a credit package available for purchase
     */
    export interface CompetitionInformationEventPricingCreditPackage {
        cost: number;           // The cost of the package
        summary: string;        // Summary of the package ("UPI:1, OPI:2")
    }

    /**
     * Represents practice ice pricing information about an event for display on the Competition Portal Competition Information page
     */
    export interface CompetitionInformationEventPricing {
        event_name: string;                                                              // The name of the event the pricing information applies to
        available_credits: CompetitionInformationEventPricingCredit[];                   // Pricing information about credits available for purchase for the event
        available_credit_packages?: CompetitionInformationEventPricingCreditPackage[];   // Pricing information about credit packages available for purchase for the event.  Note: This property should not be provided outside of the pre-purchase sales window to maintain existing functionality
    }

    /**
     * Information about an event an entity is registered for.  Displays in list on Competition Information page
     */
    export type CompetitionInformationRegisteredEvent = {
        name: string;           // Name of the event
        id: number | string;    // Unique identifier for the event.  Used to key list items.  Not used in logical comparisons
    };

    /**
     * Represents a team managed by the active user registered for a particular competition
     */
    export interface CompetitionSelectableEntity {
        name: string;                           // The name of the entity.  It's recommended that " (Myself)" is appended to the item for the active user
        id: string;                             // Unique identifier for the entity
        level?: string;                         // Level for the entity, if applicable
        member_number: MemberNumberData;        // The member # for the entity
        membership_status: {                    // Information about the entity's membership status
            active: boolean;                    // Whether the entity has active membership
            validity_date_formatted: string;    // The formatted date through which the entity's membership is valid
        };
        links: {
            competition_portal: string;         // Link to view the appropriate competition portal as the entity
        };
    }
}