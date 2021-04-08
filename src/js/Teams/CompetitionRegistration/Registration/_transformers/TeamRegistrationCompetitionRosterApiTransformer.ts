import {TeamRegistrationApi, TeamRegistrationData, TeamRegistrationService} from '../_contracts';
import {TeamRosterMember} from '../_models/TeamRosterMember';

export class TeamRegistrationCompetitionRosterApiTransformer {

    static transformFetchCompetitionRoster(response: TeamRegistrationApi.FetchCompetitionRosterApiResponse): TeamRegistrationService.FetchCompetitionRosterServiceResponse {
        return {
            team_roster: response.team_roster.map((member_data: TeamRegistrationData.TeamRosterMemberData) => {
                return this.transformRosterMember(member_data);
            }),
            selected_roster_ids: response.selected_roster_ids.slice(),
            roster_rules: response.roster_rules.slice(),
            per_skater_fee: parseFloat(String(response.per_skater_fee)) || null,
            roster_minimum: parseInt(String(response.roster_minimum)),
            roster_maximum: parseInt(String(response.roster_maximum))
        };
    }

    static transformRosterMember(data: TeamRegistrationData.TeamRosterMemberData): TeamRosterMember {
        return new TeamRosterMember({
            ...data
        });
    }
}