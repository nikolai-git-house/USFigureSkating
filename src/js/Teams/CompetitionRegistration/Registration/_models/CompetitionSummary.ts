interface CompetitionSummaryParams {
    id: number;
    name: string;
    icon: string;
    start_date_pretty: string;
    end_date_pretty: string;
    links: {
        cart: string;
    };
}

export class CompetitionSummary {
    id: number;
    name: string;
    icon: string;
    start_date_pretty: string;
    end_date_pretty: string;
    links: {
        cart: string;
    };

    constructor(params: CompetitionSummaryParams) {
        this.id = params.id;
        this.name = params.name;
        this.icon = params.icon;
        this.start_date_pretty = params.start_date_pretty;
        this.end_date_pretty = params.end_date_pretty;
        this.links = params.links;
    }
}