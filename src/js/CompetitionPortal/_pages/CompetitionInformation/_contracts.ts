import {CompetitionPortal} from '../../_contracts';

export namespace CompetitionInformationPage {

    export interface EventPricing extends CompetitionPortal.CompetitionInformationEventPricing {
    }

    export interface PracticeIceSalesWindow extends CompetitionPortal.PracticeIceSalesWindow {
    }

    export interface CompetitionInformation {
        registered_events: CompetitionPortal.CompetitionInformationRegisteredEvent[];
        practice_ice_instructions: string;
        practice_ice_terminology: string;
        no_practice_ice: boolean;
        pricing_message: string | null;
        practice_ice_event_pricing: EventPricing[];
        practice_ice_sales_windows: PracticeIceSalesWindow[];
    }
}