import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {FetchEntityCoachedSkatersAPIResponse} from '../../_contracts/CheckInAPIContracts';
import {CheckInCompetitionInterface} from '../../_contracts/CheckInContracts';
import {AbstractCheckInEntity} from '../../_models/CheckInEntities/AbstractCheckInEntity';
import CheckInService from '../../_services/CheckInService';
import {FetchCheckInCoachedSkatersResponse} from '../_contracts/EntityCheckInServiceContracts';
import {EntityCheckInAPITransformer} from '../_transformers/EntityCheckInAPITransformer';

export class EntityCheckInSkatersService extends AbstractAPIService {

    /**
     * Fetch the list of coached skaters for an entity
     */
    static fetchCoachedSkaters(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface): Promise<FetchCheckInCoachedSkatersResponse> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/skaters`,
            /**
             * Verify response data contains an array
             */
            validateResponse: function (response_data: FetchEntityCoachedSkatersAPIResponse) {
                return typeof response_data === 'object';
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchEntityCoachedSkatersAPIResponse): FetchCheckInCoachedSkatersResponse {
                return EntityCheckInAPITransformer.transformFetchEntityCoachedSkatersAPIResponseToFetchCheckInCoachedSkatersResponse(response_data);
            }
        });
    }

    /**
     * Fetch the list of coached skaters for the active entity
     */
    public fetchActiveEntityCoachedSkaters(): Promise<FetchCheckInCoachedSkatersResponse> {
        return CheckInService.runFetch(EntityCheckInSkatersService.fetchCoachedSkaters);
    }
}

export default new EntityCheckInSkatersService();