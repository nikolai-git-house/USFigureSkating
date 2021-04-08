import {SeriesStandings} from '../_contracts';
import {BaseFilterService} from '../../../services/BaseFilterService';

export class StandingsGranularFilterService extends BaseFilterService {
    static METHOD_MAP: { [key: string]: SeriesStandings.GranularFilterServiceFilterMethod; } = {
        skater_name: StandingsGranularFilterService.rowPassesParticipantNameFilter,
        club_name: StandingsGranularFilterService.rowPassesClubNameFilter,
        competition_earned: StandingsGranularFilterService.rowCompetitionEarnedFilter,
        national_rank: StandingsGranularFilterService.rowPassesNationalRankingFilter
    };

    /**
     * Whether a standings row passes a participant name filter
     */
    public static rowPassesParticipantNameFilter(standing_row: SeriesStandings.StandingsRow, filter_term: SeriesStandings.StandingsGranularFilterTerm): boolean {
        const term: string | null = filter_term[0];
        if (term) {
            return StandingsGranularFilterService.valuePassesStringFilter(standing_row.participant_name, term);
        }

        return true;
    }

    /**
     * Whether a standings row passes a club name filter
     */
    public static rowPassesClubNameFilter(standing_row: SeriesStandings.StandingsRow, filter_term: SeriesStandings.StandingsGranularFilterTerm): boolean {
        const term: string | null = filter_term[0];
        if (term) {
            return StandingsGranularFilterService.valuePassesStringFilter(standing_row.home_club, term);
        }

        return true;
    }

    /**
     * Whether a standings row passes a competition earned filter
     */
    public static rowCompetitionEarnedFilter(standing_row: SeriesStandings.StandingsRow, filter_term: SeriesStandings.StandingsGranularFilterTerm): boolean {
        const term: string | null = filter_term[0];
        if (term) {
            if (standing_row.competition_earned) {
                return StandingsGranularFilterService.valuePassesStringFilter(standing_row.competition_earned, term);
            }

            return false;
        }

        return true;
    }

    /**
     * Whether a standings row passes a national ranking filter
     */
    public static rowPassesNationalRankingFilter(standing_row: SeriesStandings.StandingsRow, filter_term: SeriesStandings.StandingsGranularFilterTerm): boolean {
        const min_parsed = parseInt(String(filter_term[0]));
        const max_parsed = parseInt(String(filter_term[1]));
        const row_rank = parseInt(String(standing_row.national_rank));
        if (min_parsed && (row_rank && row_rank < min_parsed)) {
            return false;
        }
        if (max_parsed && (!row_rank || row_rank > max_parsed)) {
            return false;
        }

        return true;
    }

    /**
     * Whether a standings row passes a section key filter
     */
    public static rowPassesSectionFilter(standing_row: SeriesStandings.StandingsRow, filter_section_keys: SeriesStandings.SeriesSectionKey[]): boolean {
        return filter_section_keys.indexOf(standing_row.section_key) !== -1;
    }
}