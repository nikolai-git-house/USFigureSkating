import {SeriesStandings} from './_contracts';

export namespace SeriesStandingsConstants {
    export const GRANULAR_FILTER_FIELD_OPTIONS: SeriesStandings.StandingsGranularFilterFieldOption[] = [
        {
            label: 'Skater Name',
            value: 'skater_name',
            type: 'text'
        },
        {
            label: 'Club Name',
            value: 'club_name',
            type: 'text'
        },
        {
            label: 'Competition Earned',
            value: 'competition_earned',
            type: 'text'
        },
        {
            label: 'National Ranking',
            value: 'national_rank',
            type: 'number_range'
        }
    ];
}