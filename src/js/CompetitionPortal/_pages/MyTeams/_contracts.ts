import {Teams} from '../../../Teams/_contracts';

export namespace MyTeamsPage {

    export interface Team extends Teams.SelectTeamListComponentTeam {
        links: {
            competition_portal: string;
        };
    }

}