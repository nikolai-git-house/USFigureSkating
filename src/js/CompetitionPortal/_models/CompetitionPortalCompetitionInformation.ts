/* eslint-disable jsdoc/require-jsdoc */
import {CompetitionInformationPage} from '../_pages/CompetitionInformation/_contracts';
import {CompetitionPortal} from '../_contracts';

interface ConstructorParams {
    registered_events: CompetitionPortal.CompetitionInformationRegisteredEvent[];
    practice_ice: {
        instructions: string;
        terminology: string;
        not_offered: boolean;
        pricing_message: string | null;
        event_pricing: CompetitionPortal.CompetitionInformationEventPricing[];
        sales_windows: CompetitionInformationPage.PracticeIceSalesWindow[];
    };
}

export class CompetitionPortalCompetitionInformation implements CompetitionInformationPage.CompetitionInformation {
    practice_ice: {
        instructions: string;
        terminology: string;
        not_offered: boolean;
        pricing_message: string | null;
        event_pricing: CompetitionPortal.CompetitionInformationEventPricing[];
        sales_windows: CompetitionPortal.PracticeIceSalesWindow[];
    };

    registered_events: CompetitionPortal.CompetitionInformationRegisteredEvent[];

    constructor(params: ConstructorParams) {
        this.registered_events = params.registered_events;
        this.practice_ice = params.practice_ice;
    }

    get practice_ice_instructions(): string {
        return this.practice_ice.instructions || '';
    }

    get practice_ice_terminology(): string {
        return this.practice_ice.terminology || '';
    }

    get no_practice_ice(): boolean {
        return this.practice_ice.not_offered;
    }

    get pricing_message(): string | null {
        return this.practice_ice.pricing_message;
    }

    get practice_ice_event_pricing(): CompetitionInformationPage.EventPricing[] {
        return this.practice_ice.event_pricing;
    }

    get practice_ice_sales_windows(): CompetitionInformationPage.PracticeIceSalesWindow[] {
        return this.practice_ice.sales_windows;
    }
}