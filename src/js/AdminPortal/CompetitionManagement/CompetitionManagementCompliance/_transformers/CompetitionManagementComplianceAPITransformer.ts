/* eslint-disable jsdoc/require-jsdoc */
import {EmailFormAPITransformer} from '../../../EmailForm/_transformers/EmailFormAPITransformer';
import {
    CompetitionManagementFetchCompetitionComplianceEntitiesAPIResponse,
    FetchComplianceEmailConfigurationAPIResponse
} from '../_contracts/CompetitionManagementComplianceAPIContracts';
import {
    CompetitionManagementComplianceEntityData,
    ComplianceRequirementsSummaryItemDisplayData
} from '../_contracts/CompetitionManagementComplianceDataContracts';
import {
    CompetitionManagementComplianceFetchResult,
    ComplianceEmailConfiguration
} from '../_contracts/CompetitionManagementComplianceServiceContracts';
import {
    CompetitionManagementComplianceEntity,
    CompetitionManagementComplianceEntityParameters
} from '../_models/CompetitionManagementComplianceEntity';
import {CompetitionManagementComplianceTransformer} from './CompetitionManagementComplianceTransformer';

export class CompetitionManagementComplianceAPITransformer {
    static transformComplianceEntities(response_data: CompetitionManagementFetchCompetitionComplianceEntitiesAPIResponse): CompetitionManagementComplianceEntity[] {
        return response_data.map((datum: CompetitionManagementComplianceEntityData) => {
            const params: CompetitionManagementComplianceEntityParameters = {
                ...datum,
                compliance_summary: datum.compliance_summary.map((compliance_item: ComplianceRequirementsSummaryItemDisplayData) => {
                    return {
                        ...compliance_item,
                        id: -1,
                        overridden: false
                    };
                })
            };

            return new CompetitionManagementComplianceEntity(params);
        });
    }

    /**
     * Transform Compliance Email Configuration.
     *
     * Base transformation
     * BCC must be undefined to prevent app-determined data from being overwritten
     */
    static transformFetchComplianceEmailConfiguration(data: FetchComplianceEmailConfigurationAPIResponse): ComplianceEmailConfiguration {
        return {
            ...EmailFormAPITransformer.transformFetchEmailConfiguration(data),
            bcc: false
        };
    }

    static transformFetchComplianceEntities(response_data: CompetitionManagementFetchCompetitionComplianceEntitiesAPIResponse): CompetitionManagementComplianceFetchResult {
        const entities = CompetitionManagementComplianceAPITransformer.transformComplianceEntities(response_data);

        return {
            entities,
            position_filters: CompetitionManagementComplianceTransformer.transformEntitiesToUniquePositionOptions(entities)
        };
    }
}