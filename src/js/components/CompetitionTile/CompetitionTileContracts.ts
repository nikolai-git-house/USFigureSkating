export type CompetitionSeries = { name: string; };

export interface CompetitionTileCompetition {
    icon: string;
    name: string;
    start_date: string;
    end_date: string;
    city: string;
    state: string;
    club: string;
    series: CompetitionSeries[] | null;
}