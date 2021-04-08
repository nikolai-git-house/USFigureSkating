/* eslint-disable jsdoc/require-jsdoc */
import {EmailFormAPITransformer} from '../../EmailForm/_transformers/EmailFormAPITransformer';
import {
    CheckEntityInAPIResponse,
    FetchCheckInEmailConfigurationAPIResponse,
    FetchCheckInEntitiesAPIResponse,
    FetchCheckInEntityApiResponse
} from '../_contracts/CheckInAPIContracts';
import {CheckInEntityCheckInStatus} from '../_contracts/CheckInEntityContracts';
import {CheckInEntityCheckInStatusData, CheckInEntityInstanceData} from '../_contracts/CheckInEntityDataContracts';
import {
    CheckActiveEntityInResponse,
    CheckInEmailConfiguration,
    FetchCheckInEntitiesResponse
} from '../_contracts/CheckInServiceContracts';
import {CheckInEntityTransformer} from './CheckInEntityTransformer';
import {AbstractCheckInEntity} from '../_models/CheckInEntities/AbstractCheckInEntity';

export class CheckInAPITransformer {
    static transformCheckEntityInAPIResponseToCheckActiveEntityInResponse(data: CheckEntityInAPIResponse): CheckActiveEntityInResponse {
        return CheckInAPITransformer.transformCheckInEntityCheckInStatusDataToCheckInEntityCheckInStatus(data.status);
    }

    static transformCheckInEntityCheckInStatusDataToCheckInEntityCheckInStatus(data: CheckInEntityCheckInStatusData): CheckInEntityCheckInStatus {
        return {
            ...data
        };
    }

    /**
     * Transform CheckIn Email Configuration.
     *
     * Base core with both recipient keys filled.
     * BCC not allowed to be false
     */
    static transformFetchCheckInEmailConfiguration(response_data: FetchCheckInEmailConfigurationAPIResponse): CheckInEmailConfiguration {
        return EmailFormAPITransformer.transformFetchEmailConfiguration(response_data);
    }

    static transformFetchCheckInIndexDataAPIResponseToFetchCheckInIndexDataResponse(data: FetchCheckInEntitiesAPIResponse): FetchCheckInEntitiesResponse {
        return data.map((entity_data: CheckInEntityInstanceData) => {
            return CheckInEntityTransformer._entity(entity_data);
        });
    }

    /**
     * Transform fetch for entity check-in index screen for an entity
     */
    static transformFetchEntityCheckIn<I extends AbstractCheckInEntity>(response_data: FetchCheckInEntityApiResponse, entity: I) {
        entity.importCheckInData({
            ...response_data
        });

        return entity;
    }
}