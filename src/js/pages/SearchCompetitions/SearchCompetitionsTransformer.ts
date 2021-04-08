/* eslint-disable new-cap, jsdoc/require-jsdoc */
import {UTCDateFormatNoYear} from '../../helpers/time';
import {
    FetchSearchCompetitionListAPIResponse,
    SearchCompetitionsCompetitionData
} from './SearchCompetitionsAPIContracts';
import {SearchCompetitionsCompetition} from './SearchCompetitionsContracts';

export class SearchCompetitionsTransformer {

    static transformFetchSearchCompetitionList(data: FetchSearchCompetitionListAPIResponse): SearchCompetitionsCompetition[] {
        return data.competitions.map((competition_data: SearchCompetitionsCompetitionData): SearchCompetitionsCompetition => {
            const converted_end_date = competition_data.end_date_ts * 1000;
            const converted_start_date = competition_data.start_date_ts * 1000;
            const core: SearchCompetitionsCompetition = {
                city: competition_data.city,
                club: competition_data.club,
                end_date: UTCDateFormatNoYear(new Date(converted_end_date)),
                end_date_ts: converted_end_date,
                has_registration_deadline_warning: competition_data.has_registration_deadline_warning,
                icon: competition_data.icon,
                id: competition_data.id,
                name: competition_data.name,
                series: competition_data.series,
                start_date: UTCDateFormatNoYear(new Date(converted_start_date)),
                start_date_ts: converted_start_date,
                state: competition_data.state,
                user_registration_status: competition_data.user_registration_status,
                view_competition_link: competition_data.view_competition_link
            };
            if (competition_data.registration_deadline) {
                core.registration_deadline = competition_data.registration_deadline;
            }

            return core;
        });
    }
}