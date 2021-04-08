import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {
    FetchEntityTeamServicePersonnelInformationAPIResponse,
    UpdateEntityCompetitionTeamServicePersonnelAPIPayload
} from '../../_contracts/CheckInAPIContracts';
import {CheckInCompetitionInterface} from '../../_contracts/CheckInContracts';
import {AbstractCheckInEntity} from '../../_models/CheckInEntities/AbstractCheckInEntity';
import CheckInService from '../../_services/CheckInService';
import {FetchActiveEntityTeamServicePersonnelInformationResponse} from '../_contracts/EntityCheckInServiceContracts';
import {EntityCheckInAPITransformer} from '../_transformers/EntityCheckInAPITransformer';

export class EntityCheckInTeamServicePersonnelService extends AbstractAPIService {
    /**
     * Fetch team service personnel information for an entity
     */
    static fetchEntityTeamServicePersonnelInformation(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface): Promise<FetchActiveEntityTeamServicePersonnelInformationResponse> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/team-service-personnel`,
            /**
             * Ensure all expected props are present
             */
            validateResponse: function (response_data: FetchEntityTeamServicePersonnelInformationAPIResponse): boolean {
                return !!response_data && !!response_data.competition_team_service_personnel_ids && !!response_data.team_service_personnel;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchEntityTeamServicePersonnelInformationAPIResponse): FetchActiveEntityTeamServicePersonnelInformationResponse {
                return EntityCheckInAPITransformer.transformFetchEntityTeamServicePersonnelInformationAPIResponseToFetchActiveEntityTeamServicePersonnelInformationResponse(response_data);
            }
        });
    }

    /**
     * Update the team service personnel selected for a competition for an entity
     */
    static updateActiveCompetitionTeamServicePersonnel(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, team_service_personnel_ids: number[]): Promise<void> {

        return AbstractAPIService.submitForAPISubmissionResponse({
            error_message: 'Error updating team service personnel.',
            payload: <UpdateEntityCompetitionTeamServicePersonnelAPIPayload>team_service_personnel_ids,
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/team-service-personnel`
        });
    }

    /**
     * Fetch team service personnel information for the active entity
     */
    public fetchActiveEntityTeamServicePersonnelInformation(): Promise<FetchActiveEntityTeamServicePersonnelInformationResponse> {
        return CheckInService.runFetch(EntityCheckInTeamServicePersonnelService.fetchEntityTeamServicePersonnelInformation);
    }

    /**
     * Update the team service personnel selected for a competition for the active entity
     */
    public updateActiveEntityCompetitionTeamServicePersonnel(team_service_personnel_ids: number[]): Promise<void> {
        return CheckInService.runSubmit(EntityCheckInTeamServicePersonnelService.updateActiveCompetitionTeamServicePersonnel, team_service_personnel_ids);
    }
}

export default new EntityCheckInTeamServicePersonnelService();