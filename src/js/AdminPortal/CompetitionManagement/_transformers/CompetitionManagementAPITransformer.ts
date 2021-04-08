/* eslint-disable jsdoc/require-jsdoc */
import {EmailRecipientOptionCategory} from '../../EmailForm/_contracts/EmailFormContracts';
import {EmailRecipientOptionCategoryData} from '../../EmailForm/_contracts/EmailFormDataContracts';
import {
    CompetitionManagementFetchCompetitionListAPIResponse,
    FetchActiveCompetitionManagementCompetitionAPIResponse,
    FetchCompetitionManagementCompetitionInformationAPIResponse
} from '../_contracts/CompetitionManagementAPIContracts';
import {CompetitionManagementIndexCompetition} from '../_contracts/CompetitionManagementContracts';
import {CompetitionManagementIndexCompetitionData} from '../_contracts/CompetitionManagementDataContracts';
import {
    CompetitionManagementFetchCompetitionListResult,
    FetchActiveCompetitionManagementCompetitionInformationResponse,
    FetchActiveCompetitionManagementCompetitionResponse
} from '../_contracts/CompetitionManagementServiceContracts';
import {CompetitionManagementCompetition} from '../_models/CompetitionManagementCompetition';
import {CompetitionManagementCompetitionInformation} from '../_models/CompetitionManagementCompetitionInformation';

export class CompetitionManagementAPITransformer {
    /**
     * Transform CompetitionManagementFetchCompetitionListAPIResponse into CompetitionManagementFetchCompetitionListResult
     */
    static transformCompetitionManagementIndexListResponse(response_data: CompetitionManagementFetchCompetitionListAPIResponse): CompetitionManagementFetchCompetitionListResult {
        return {
            upcoming: response_data.upcoming.map((competition_data: CompetitionManagementIndexCompetitionData) => {
                return CompetitionManagementAPITransformer.transformCompetitionManagementIndexCompetition(competition_data);
            }),
            past: response_data.past.map((competition_data: CompetitionManagementIndexCompetitionData) => {
                return CompetitionManagementAPITransformer.transformCompetitionManagementIndexCompetition(competition_data);
            })
        };
    }

    static transformEmailRecipientOptionCategory(data: EmailRecipientOptionCategoryData): EmailRecipientOptionCategory {
        return {
            ...data
        };
    }

    static transformFetchActiveCompetition(response_data: FetchActiveCompetitionManagementCompetitionAPIResponse): FetchActiveCompetitionManagementCompetitionResponse {
        return new CompetitionManagementCompetition(response_data);
    }

    static transformFetchActiveCompetitionInformation(response_data: FetchCompetitionManagementCompetitionInformationAPIResponse): FetchActiveCompetitionManagementCompetitionInformationResponse {
        return new CompetitionManagementCompetitionInformation(response_data);
    }

    private static transformCompetitionManagementIndexCompetition(data: CompetitionManagementIndexCompetitionData): CompetitionManagementIndexCompetition {
        return {
            ...data
        };
    }
}