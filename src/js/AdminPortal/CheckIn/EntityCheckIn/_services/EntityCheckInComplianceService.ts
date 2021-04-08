import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {ComplianceRequirementsSummaryItem} from '../../../_contracts/AdminPortalContracts';
import {FetchEntityComplianceAPIResponse, OverrideComplianceItemAPIPayload} from '../../_contracts/CheckInAPIContracts';
import {
    CheckInCompetitionInterface,
    ComplianceRequirementsSummaryItemOverridePayload
} from '../../_contracts/CheckInContracts';
import {AbstractCheckInEntity} from '../../_models/CheckInEntities/AbstractCheckInEntity';
import CheckInService from '../../_services/CheckInService';
import {FetchEntityComplianceResponse} from '../_contracts/EntityCheckInServiceContracts';
import {EntityCheckInAPITransformer} from '../_transformers/EntityCheckInAPITransformer';

export class EntityCheckInComplianceService extends AbstractAPIService {
    /**
     * Fetch compliance information for an entity
     */
    static fetchEntityCompliance(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface): Promise<ComplianceRequirementsSummaryItem[]> {

        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/compliance/${entity.id}`,
            /**
             * Ensure the response is an array of data
             */
            validateResponse: function (response_data: FetchEntityComplianceAPIResponse) {
                return typeof response_data === 'object';
            },
            /**
             * Transform the API data into app data
             */
            transformResponse: function (response_data: FetchEntityComplianceAPIResponse): FetchEntityComplianceResponse {
                return EntityCheckInAPITransformer.transformFetchEntityComplianceAPIResponseToFetchEntityComplianceResponse(response_data);
            }
        });
    }

    /**
     * Override a compliance item for an entity
     */
    static overrideEntityComplianceItem(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, payload: ComplianceRequirementsSummaryItemOverridePayload): Promise<void> {
        return AbstractAPIService.submitForAPISubmissionResponse({
            error_message: 'Error overriding compliance item.',
            payload: <OverrideComplianceItemAPIPayload>{
                compliance_item_id: payload.compliance_item.id,
                is_overridden: payload.overridden
            },
            url: `/api/competitions/${competition.id}/compliance/${entity.id}/override`
        });
    }

    /**
     * Fetch compliance information for the active entity
     */
    public fetchActiveEntityCompliance(): Promise<ComplianceRequirementsSummaryItem[]> {
        return CheckInService.runFetch(EntityCheckInComplianceService.fetchEntityCompliance);
    }

    /**
     * Override a compliance item for the active entity
     */
    public overrideActiveEntityComplianceItem(payload: ComplianceRequirementsSummaryItemOverridePayload): Promise<void> {
        return CheckInService.runSubmit(EntityCheckInComplianceService.overrideEntityComplianceItem, payload);
    }
}

export default new EntityCheckInComplianceService();