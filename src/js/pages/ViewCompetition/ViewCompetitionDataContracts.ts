import {
    CompetitionFoundationData,
    CompetitionHeadingData,
    CompetitionUserNavigationFieldData
} from '../../contracts/data/CompetitionFieldDataContracts';
import {CompetitionRegistrationCtaConfigurationData} from '../../contracts/release3/data/CompetitionRegistrationDataContracts';

/**
 * Represents a status message to show in the Competition Volunteer CTA block
 *
 * ex: "Request Pending Approval"
 */
export type CompetitionVolunteerCtaStatusMessageData = {
    text: string;       // The message to display
    type_key:           // Determines the display color of the text
        null |              // Normal text
        'success' |         // Green status text
        'warning' |         // Orange status text
        'alert';            // Red status text
};
/**
 * Represents a phase message to show in the Competition Volunteer CTA block
 *
 * ex: "Your request has been approved, now select shifts"
 */
export type CompetitionVolunteerCtaPhaseMessageData = {
    text: string;       // The message to display
    type:               // Controls whether an icon shows at the beginning of the message
        'default' |         // no icon displays
        'success' |         // success icon displays
        'error';            // error icon displays
};

/**
 * Represents a configuration for a Competition Volunteer CTA block
 */
export interface CompetitionVolunteerCtaConfigurationData {
    actions: {                  // Configuration for actions on the block
        request: {                  // Configuration for the Volunteer Request button
            visible: boolean;           // Whether the request button should show
            enabled: boolean;           // Whether the request button should be enabled (vs disabled)
        };
        select_shifts: {            // Configuration for the Select Shifts button
            visible: boolean;           // Whether the select shifts button should show
            enabled: boolean;           // Whether the select shifts button should be enabled (vs disabled)
            url: string;                // The URL for shift selection.  Must be properly set when select shifts is visible and enabled
        };
    };
    phase_message?: CompetitionVolunteerCtaPhaseMessageData;    // The phase message to display above the button block in the CTA
    status_message?: CompetitionVolunteerCtaStatusMessageData;  // The status message to display below the button block in the CTA
}

/**
 * Represents data necessary to power the View Competition page
 */
export interface ViewCompetitionData extends CompetitionFoundationData, CompetitionHeadingData, CompetitionUserNavigationFieldData {
    is_ems: boolean;                    // Whether the competition is using EMS

    registration_cta_configuration?: CompetitionRegistrationCtaConfigurationData;       // Information about registering for the competition.
                                                                                        // Powers the "For Skaters" CTA block
                                                                                        // If not provided, CTA will not show
    team_registration_cta_configuration?: CompetitionRegistrationCtaConfigurationData;  // Information about registering for the competition for teams.
                                                                                        // Powers the "For Teams" CTA block
                                                                                        // If not provided, CTA will not show
    volunteer_cta_configuration?: CompetitionVolunteerCtaConfigurationData;             // Information about volunteering for the competition.
                                                                                        // Powers the "For Volunteers" CTA block
                                                                                        // If not provided, CTA will not show
    links: {
        select_competition_entity: string;                                                     // Link to the "Select Competition Entity" page for the competition
    };
}