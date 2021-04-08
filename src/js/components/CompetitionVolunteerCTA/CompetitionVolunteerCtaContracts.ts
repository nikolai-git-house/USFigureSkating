/**
 * Configuration for CTA phase message that displays above button
 */
export type CompetitionVolunteerCtaPhaseMessage = {
    text: string;
    type: 'default' | 'success' | 'error';
};

/**
 * Configuration for CTA status message that displays below button
 */
export type CompetitionVolunteerCtaStatusMessage = {
    text: string;
    type_key: null | 'success' | 'warning' | 'alert';
};

/**
 * Configuration object for the CompetitionVolunteerCTA component
 */
export interface CompetitionVolunteerCtaConfiguration {
    actions: {
        request: {
            visible: boolean;
            enabled: boolean;
        };
        select_shifts: {
            visible: boolean;
            enabled: boolean;
            url: string;
        };
    };
    phase_message?: CompetitionVolunteerCtaPhaseMessage;
    status_message?: CompetitionVolunteerCtaStatusMessage;
}