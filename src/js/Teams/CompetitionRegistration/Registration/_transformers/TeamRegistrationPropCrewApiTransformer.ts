import {TeamRegistrationApi, TeamRegistrationData, TeamRegistrationService} from '../_contracts';
import {TeamServicePerson} from '../_models';

export class TeamRegistrationPropCrewApiTransformer {

    static transformFetchPropCrew(response: TeamRegistrationApi.FetchPropCrewApiResponse): TeamRegistrationService.FetchPropCrewServiceResponse {
        return {
            team_roster: response.prop_crew.map((member_data: TeamRegistrationData.TeamServicePersonData) => {
                return this.transformEntity(member_data);
            }),
            selected_roster_ids: response.selected_prop_crew_ids.slice(),
            roster_maximum: parseInt(String(response.prop_crew_maximum))
        };
    }

    private static transformEntity(data: TeamRegistrationData.TeamServicePersonData): TeamServicePerson {
        return new TeamServicePerson({
            ...data
        });
    }
}