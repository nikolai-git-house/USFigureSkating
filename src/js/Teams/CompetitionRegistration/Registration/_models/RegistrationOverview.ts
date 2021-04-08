import {TeamRegistration} from '../_contracts';

interface RegistrationOverviewParams {
    registration_information: string[];
    rulebook_year: string;
    pricing_tables: TeamRegistration.PricingTableBinding[];
}

export class RegistrationOverview {
    registration_information: string[];
    rulebook_year: string;
    pricing_tables: TeamRegistration.PricingTableBinding[];

    constructor(params: RegistrationOverviewParams) {
        this.registration_information = params.registration_information;
        this.rulebook_year = params.rulebook_year;
        this.pricing_tables = params.pricing_tables;
    }
}