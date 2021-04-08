import {
    CompetitionTeamPersonnel,
    CompetitionTeamPersonnelApi,
    CompetitionTeamPersonnelData,
    CompetitionTeamPersonnelService
} from '../_contracts';
import {CompetitionPortalTeamPerson} from '../_models';
import {TeamRegistrationData} from '../../../../Teams/CompetitionRegistration/Registration/_contracts';
import {
    PropCrewMember,
    TeamCoach,
    TeamServicePerson
} from '../../../../Teams/CompetitionRegistration/Registration/_models';
import {CompetitionPortalApiTransformer} from '../../../_transformers/CompetitionPortalApiTransformer';

export class CompetitionTeamPersonnelApiTransformer {
    /**
     * Transform API response when fetching Competition Team Personnel page
     */
    static transformFetchTeamPersonnel(response: CompetitionTeamPersonnelApi.FetchCompetitionPersonnelApiResponse): CompetitionTeamPersonnelService.FetchTeamPersonnelServiceResponse {
        return {
            ...CompetitionPortalApiTransformer.transformFetchCompetitionPortalCore(response),
            competition_team_personnel: this.transformCompetitionTeamPersonnel(response.competition_team_personnel),
            has_prop_crew: response.has_prop_crew
        };
    }

    /**
     * Transform a selected competition team personnel person
     */
    public static transformCompetitionTeamPerson(data: CompetitionTeamPersonnelData.CompetitionTeamPerson): CompetitionPortalTeamPerson {
        return new CompetitionPortalTeamPerson({
            ...data
        });
    }

    /**
     * Transform API response when fetching available coaches when editing the competition roster on the Competition Team Personnel page
     */
    static transformFetchTeamPersonnelAvailableCoaches(response: CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailableCoachesApiResponse): CompetitionTeamPersonnelService.FetchTeamPersonnelTeamRosterServiceResponse {
        return {
            roster: response.team_coaches.map((member_data: TeamRegistrationData.TeamCoachData) => {
                return new TeamCoach({
                    ...member_data
                });
            }),
            roster_config: {
                max: response.coach_maximum
            }
        };
    }

    /**
     * Transform API response when fetching available TSP when editing the competition roster on the Competition Team Personnel page
     */
    static transformFetchTeamPersonnelAvailableTeamServicePersonnel(response: CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailableTeamServicePersonnelApiResponse): CompetitionTeamPersonnelService.FetchTeamPersonnelTeamRosterServiceResponse {
        return {
            roster: response.team_service_personnel.map((member_data: TeamRegistrationData.TeamCoachData) => {
                return new TeamServicePerson({
                    ...member_data
                });
            }),
            roster_config: {
                max: response.team_service_personnel_maximum
            }
        };
    }

    /**
     * Transform API response when fetching available PC when editing the competition roster on the Competition Team Personnel page
     */
    static transformFetchTeamPersonnelAvailablePropCrew(response: CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailablePropCrewApiResponse): CompetitionTeamPersonnelService.FetchTeamPersonnelTeamRosterServiceResponse {
        return {
            roster: response.prop_crew.map((member_data: TeamRegistrationData.TeamCoachData) => {
                return new PropCrewMember({
                    ...member_data
                });
            }),
            roster_config: {
                max: response.prop_crew_maximum
            }
        };
    }

    /**
     * Transform the full set of team personnel associated with a team for a competition
     */
    private static transformCompetitionTeamPersonnel(data: CompetitionTeamPersonnelData.CompetitionTeamPersonnel): CompetitionTeamPersonnel.CompetitionTeamPersonnel {

        return {
            coaches: data.coaches.map((entity_data) => {
                return this.transformCompetitionTeamPerson(entity_data);
            }),
            team_service_personnel: data.team_service_personnel.map((entity_data) => {
                return this.transformCompetitionTeamPerson(entity_data);
            }),
            prop_crew: data.prop_crew ? data.prop_crew.map((entity_data) => {
                return this.transformCompetitionTeamPerson(entity_data);
            }) : []
        };
    }
}