import {CompetitionTeamPersonnelAccordion} from '.';

export namespace CompetitionTeamPersonnelPage {
    /**
     * A person for display on the "Competition Team Personnel" page
     */
    export interface Person extends CompetitionTeamPersonnelAccordion.Person {
    }

    /**
     * The comprehensive list of selected team personnel for a competition used by the "Competition Team Personnel" page
     */
    export interface CompetitionTeamPersonnel {
        coaches: CompetitionTeamPersonnelPage.Person[];
        team_service_personnel: CompetitionTeamPersonnelPage.Person[];
        prop_crew: CompetitionTeamPersonnelPage.Person[];

        [key: string]: CompetitionTeamPersonnelPage.Person[];
    }
}