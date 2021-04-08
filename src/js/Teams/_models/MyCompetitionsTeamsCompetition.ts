import {MyCompetitionsTeamsPageCompetition} from '../_pages/_contracts/MyCompetitionsTeamsPageContracts';

interface MyCompetitionsTeamsCompetitionParams {
    end_date_pretty: string;
    icon: string;
    id: number;
    links: { select_team: string; };
    name: string;
    start_date_pretty: string;
}

export class MyCompetitionsTeamsCompetition implements MyCompetitionsTeamsPageCompetition {
    end_date_pretty: string;
    icon: string;
    id: number;
    links: { select_team: string; };
    name: string;
    start_date_pretty: string;

    constructor(params: MyCompetitionsTeamsCompetitionParams) {
        this.end_date_pretty = params.end_date_pretty;
        this.icon = params.icon;
        this.id = params.id;
        this.links = params.links;
        this.name = params.name;
        this.start_date_pretty = params.start_date_pretty;
    }
}