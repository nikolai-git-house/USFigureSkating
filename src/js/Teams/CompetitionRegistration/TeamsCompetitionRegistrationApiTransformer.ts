import {
    TeamsCompetitionRegistration,
    TeamsCompetitionRegistrationApi,
    TeamsCompetitionRegistrationData,
    TeamsCompetitionRegistrationService
} from './_contracts';
import {CompetitionListCompetition} from './_models';

export class TeamsCompetitionRegistrationApiTransformer {
    static transformFetchCompetitionListApiResponse(data: TeamsCompetitionRegistrationApi.FetchCompetitionListApiResponse): TeamsCompetitionRegistrationService.FetchCompetitionListServiceResponse {
        return {
            competitions: data.competitions.map((competition_data: TeamsCompetitionRegistrationData.CompetitionListCompetitionData): CompetitionListCompetition => {
                return this.transformCompetitionListCompetition(competition_data);
            }),
            team: this.transformTeamSummary(data.team)
        };
    }

    private static transformCompetitionListCompetition(competition_data: TeamsCompetitionRegistrationData.CompetitionListCompetitionData) {
        return new CompetitionListCompetition({
            ...competition_data,
            series: competition_data.series ? competition_data.series : null,
            end_date_ts: competition_data.end_date_ts * 1000,
            start_date_ts: competition_data.start_date_ts * 1000
        });
    }

    private static transformTeamSummary(team: TeamsCompetitionRegistrationData.TeamSummaryData): TeamsCompetitionRegistration.TeamSummary {
        return {
            ...team
        };
    }
}