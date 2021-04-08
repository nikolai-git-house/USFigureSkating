export interface MyCompetitionsTeamsPageCompetition {
    id: number;
    icon: string;
    name: string;
    start_date_pretty: string;
    end_date_pretty: string;
    links: {
        select_team: string;
    };
}