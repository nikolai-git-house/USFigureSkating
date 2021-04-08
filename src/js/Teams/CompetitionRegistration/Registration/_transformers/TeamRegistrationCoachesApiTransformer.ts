import {TeamRegistrationApi, TeamRegistrationData, TeamRegistrationService} from '../_contracts';
import {TeamCoach} from '../_models';

export class TeamRegistrationCoachesApiTransformer {

    static transformFetchCoaches(response: TeamRegistrationApi.FetchCoachesApiResponse): TeamRegistrationService.FetchCoachesServiceResponse {
        return {
            team_roster: response.team_coaches.map((member_data: TeamRegistrationData.TeamCoachData) => {
                return this.transformEntity(member_data);
            }),
            selected_roster_ids: response.selected_coach_ids.slice(),
            roster_maximum: parseInt(String(response.coach_maximum))
        };
    }

    private static transformEntity(data: TeamRegistrationData.TeamCoachData): TeamCoach {
        return new TeamCoach({
            ...data
        });
    }
}