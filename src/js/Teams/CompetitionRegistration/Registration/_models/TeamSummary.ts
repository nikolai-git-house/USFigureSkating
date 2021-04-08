import {TeamRegistration} from '../_contracts';

interface TeamSummaryParams {
    name: string;
    level: string;
    has_prop_crew: boolean;
    initial_page?: TeamRegistration.StepKey;
}

export class TeamSummary {
    name: string;
    level: string;
    initial_page: TeamRegistration.StepKey = 'team_verification';
    has_prop_crew: boolean;

    constructor(params: TeamSummaryParams) {
        const {name, level, has_prop_crew, initial_page} = params;
        this.name = name;
        this.level = level;
        this.has_prop_crew = has_prop_crew;
        if (initial_page) {
            this.initial_page = initial_page;
        }
    }

    get summary_name(): string {
        return `${this.name} - ${this.level}`;
    }
}