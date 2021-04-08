import {Teams} from '../../../Teams/_contracts';

export namespace SelectEntityPage {

    export interface Entity extends Teams.SelectTeamListComponentTeam {
        links: {
            competition_portal: string;
        };
    }
}