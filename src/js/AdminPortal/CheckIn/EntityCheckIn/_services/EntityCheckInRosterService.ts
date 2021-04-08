import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {
    FetchEntityRosterInformationAPIResponse,
    UpdateEntityCompetitionRosterAPIPayload
} from '../../_contracts/CheckInAPIContracts';
import {CheckInCompetitionInterface} from '../../_contracts/CheckInContracts';
import {AbstractCheckInEntity} from '../../_models/CheckInEntities/AbstractCheckInEntity';
import CheckInService from '../../_services/CheckInService';
import {FetchActiveEntityRosterInformationResponse} from '../_contracts/EntityCheckInServiceContracts';
import {EntityCheckInAPITransformer} from '../_transformers/EntityCheckInAPITransformer';

export class EntityCheckInRosterService extends AbstractAPIService {

    /**
     * Fetch full roster and competition roster information for a check-in entity
     */
    static fetchEntityRosterInformation(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface): Promise<FetchActiveEntityRosterInformationResponse> {

        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/roster`,
            /**
             * Ensure the response contains the proper keys
             */
            validateResponse: function (response_data: FetchEntityRosterInformationAPIResponse) {
                return !!response_data.competition_roster_skater_ids && !!response_data.team_roster;
            },
            /**
             * Transform API data to APP data
             */
            transformResponse: function (response_data: FetchEntityRosterInformationAPIResponse): FetchActiveEntityRosterInformationResponse {
                return EntityCheckInAPITransformer.transformFetchEntityRosterInformationAPIResponseToFetchActiveEntityRosterInformationResponse(response_data);
            }
        });
    }

    /**
     * Update the team roster for a check-in entity
     */
    static updateEntityCompetitionRoster(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, roster_team_member_ids: number[]): Promise<void> {

        return AbstractAPIService.submitForAPISubmissionResponse({
            error_message: 'Error updating roster.',
            payload: <UpdateEntityCompetitionRosterAPIPayload>roster_team_member_ids,
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/roster`
        });
    }

    /**
     * Fetch full roster and competition roster information for the active check-in entity
     */
    public fetchActiveEntityRosterInformation(): Promise<FetchActiveEntityRosterInformationResponse> {
        return CheckInService.runFetch(EntityCheckInRosterService.fetchEntityRosterInformation);
    }

    /**
     * Update the team roster for the active check-in entity
     */
    public updateActiveEntityCompetitionRoster(roster_team_member_ids: number[]): Promise<void> {
        return CheckInService.runSubmit(EntityCheckInRosterService.updateEntityCompetitionRoster, roster_team_member_ids);
    }
}

export default new EntityCheckInRosterService();