import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {
    FetchEntityTeamCoachInformationAPIResponse,
    UpdateEntityCompetitionTeamCoachesAPIPayload
} from '../../_contracts/CheckInAPIContracts';
import {CheckInCompetitionInterface} from '../../_contracts/CheckInContracts';
import {FetchActiveEntityCoachInformationResponse} from '../../_contracts/CheckInServiceContracts';
import {AbstractCheckInEntity} from '../../_models/CheckInEntities/AbstractCheckInEntity';
import CheckInService from '../../_services/CheckInService';
import {EntityCheckInAPITransformer} from '../_transformers/EntityCheckInAPITransformer';

export class EntityCheckInTeamCoachesService extends AbstractAPIService {
    /**
     * Fetch information about an entity's Coaches
     */
    static fetchEntityCoachInformation(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface): Promise<FetchActiveEntityCoachInformationResponse> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/team-coaches`,
            /**
             * Ensure the response contains the proper keys
             */
            validateResponse: function (response_data: FetchEntityTeamCoachInformationAPIResponse): boolean {
                return !!response_data && !!response_data.competition_coach_ids && !!response_data.team_coaches;
            },
            /**
             * Transform API data to APP data
             */
            transformResponse: function (response_data: FetchEntityTeamCoachInformationAPIResponse): FetchActiveEntityCoachInformationResponse {
                return EntityCheckInAPITransformer.transformFetchEntityTeamCoachInformationAPIResponseToFetchActiveEntityCoachInformationResponse(response_data);
            }
        });
    }

    /**
     * Update the coach roster for a check-in entity
     */
    static updateEntityCompetitionTeamCoaches(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, competition_coach_ids: number[]): Promise<void> {

        return AbstractAPIService.submitForAPISubmissionResponse({
            error_message: 'Error updating coaches.',
            payload: <UpdateEntityCompetitionTeamCoachesAPIPayload>competition_coach_ids,
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/team-coaches`
        });
    }

    /**
     * Fetch team coach information for the active entity
     */
    public fetchActiveEntityCoachInformation(): Promise<FetchActiveEntityCoachInformationResponse> {
        return CheckInService.runFetch(EntityCheckInTeamCoachesService.fetchEntityCoachInformation);
    }

    /**
     * Update the team coach roster for the active check-in entity
     */
    public updateActiveEntityCompetitionTeamCoaches(coach_ids: number[]): Promise<void> {
        return CheckInService.runSubmit(EntityCheckInTeamCoachesService.updateEntityCompetitionTeamCoaches, coach_ids);
    }

}

export default new EntityCheckInTeamCoachesService();