export namespace CompetitionPortal {
    export type CompetitionInformationRegisteredEvent = {
        name: string;
        id: number | string;
    };

    export interface CompetitionInformationEventPricingCredit {
        name: string;
        cost: number;
    }

    export interface CompetitionInformationEventPricingCreditPackage {
        cost: number;
        summary: string;
    }

    export interface CompetitionInformationEventPricing {
        event_name: string;
        available_credits: CompetitionInformationEventPricingCredit[];
        available_credit_packages?: CompetitionInformationEventPricingCreditPackage[];
    }

    export interface PracticeIceSalesWindow {
        name: string;
        start_datetime_formatted: string;
        end_datetime_formatted: string;
        is_active: boolean;
    }
}