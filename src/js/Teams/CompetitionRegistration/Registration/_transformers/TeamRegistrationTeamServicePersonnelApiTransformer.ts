import {TeamRegistrationApi, TeamRegistrationData, TeamRegistrationService} from '../_contracts';
import {TeamServicePerson} from '../_models';

export class TeamRegistrationTeamServicePersonnelApiTransformer {

    static transformFetchTeamServicePersonnel(response: TeamRegistrationApi.FetchTeamServicePersonnelApiResponse): TeamRegistrationService.FetchTeamServicePersonnelServiceResponse {
        return {
            team_roster: response.team_service_personnel.map((member_data: TeamRegistrationData.TeamServicePersonData) => {
                return this.transformEntity(member_data);
            }),
            selected_roster_ids: response.selected_team_service_personnel_ids.slice(),
            roster_maximum: parseInt(String(response.team_service_personnel_maximum))
        };
    }

    private static transformEntity(data: TeamRegistrationData.TeamServicePersonData): TeamServicePerson {
        return new TeamServicePerson({
            ...data
        });
    }
}