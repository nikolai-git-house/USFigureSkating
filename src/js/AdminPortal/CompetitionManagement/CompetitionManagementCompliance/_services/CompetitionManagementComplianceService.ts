import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {EmailFormServiceInterface, SubmitEmailPayload} from '../../../EmailForm/_contracts/EmailFormContracts';
import {
    CompetitionManagementFetchCompetitionComplianceEntitiesAPIResponse,
    FetchComplianceEmailConfigurationAPIResponse,
    SubmitComplianceEmailAPIPayload
} from '../_contracts/CompetitionManagementComplianceAPIContracts';
import {
    CompetitionManagementComplianceServiceCompetition,
    SubmitComplianceEmailPayload
} from '../_contracts/CompetitionManagementComplianceContracts';
import {
    CompetitionManagementComplianceFetchResult,
    CompetitionManagementComplianceServiceFetchMethod,
    CompetitionManagementComplianceServiceSubmitMethod,
    ComplianceEmailConfiguration
} from '../_contracts/CompetitionManagementComplianceServiceContracts';
import {CompetitionManagementComplianceAPITransformer} from '../_transformers/CompetitionManagementComplianceAPITransformer';

export class CompetitionManagementComplianceService extends AbstractAPIService implements EmailFormServiceInterface {
    /**
     * The active competition being worked with
     */
    private _active_competition: CompetitionManagementComplianceServiceCompetition | null = null;

    /**
     * Active competition accessor
     */
    get active_competition(): CompetitionManagementComplianceServiceCompetition | null {
        return this._active_competition;
    }

    /**
     * Set the active competition
     */
    set active_competition(value: CompetitionManagementComplianceServiceCompetition | null) {
        this._active_competition = value;
    }

    /**
     * Fetch compliance entity information for a competition
     */
    static fetchCompetitionComplianceEntities(competition: CompetitionManagementComplianceServiceCompetition): Promise<CompetitionManagementComplianceFetchResult> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/compliance`,
            /**
             * Validate that the response has expected properties
             */
            validateResponse: function (response_data: CompetitionManagementFetchCompetitionComplianceEntitiesAPIResponse) {
                return !!response_data && typeof response_data === 'object';
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: CompetitionManagementFetchCompetitionComplianceEntitiesAPIResponse): CompetitionManagementComplianceFetchResult {
                return CompetitionManagementComplianceAPITransformer.transformFetchComplianceEntities(response_data);

            }
        });
    }

    /**
     * Fetch email recipient options for email form
     */
    static fetchEmailConfiguration(competition: CompetitionManagementComplianceServiceCompetition): Promise<ComplianceEmailConfiguration> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/compliance/email`,
            /**
             * Validate that the response contains intended props
             */
            validateResponse: function (response_data: FetchComplianceEmailConfigurationAPIResponse) {
                return !!response_data;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchComplianceEmailConfigurationAPIResponse): ComplianceEmailConfiguration {
                return CompetitionManagementComplianceAPITransformer.transformFetchComplianceEmailConfiguration(response_data);
            }
        });
    }

    /**
     * Submit a compliance email for a competition
     */
    private static submitEmail(competition: CompetitionManagementComplianceServiceCompetition, data: SubmitComplianceEmailPayload): Promise<void> {
        return AbstractAPIService.submitForAPISubmissionResponse({
            error_message: 'Error sending email.',
            payload: <SubmitComplianceEmailAPIPayload>data,
            url: `/api/competitions/${competition.id}/compliance/email`
        });
    }

    /**
     * Public accessor
     */
    public fetchCompetitionComplianceEntities() {
        return this.runFetch(CompetitionManagementComplianceService.fetchCompetitionComplianceEntities);
    }

    /**
     * Public accessor
     */
    public fetchEmailConfiguration(): Promise<ComplianceEmailConfiguration> {
        return this.runFetch(CompetitionManagementComplianceService.fetchEmailConfiguration);
    }

    /**
     * Run a fetch method using active state
     */
    public runFetch(method: CompetitionManagementComplianceServiceFetchMethod): Promise<any> {
        if (!this.active_competition) {
            throw 'no active competition';
        }

        if (typeof method === 'function') {
            return method(this.active_competition);
        }
        console.error('Invalid compliance service GET method call');
        throw 'invalid method call';
    }

    /**
     * Run a submit method using active state
     */
    public runSubmit(method: CompetitionManagementComplianceServiceSubmitMethod, payload: any): Promise<any> {

        if (!this.active_competition) {
            throw 'no active competition';
        }
        if (typeof method === 'function') {
            return method(this.active_competition, payload);
        }
        console.error('Invalid compliance service POST method call');
        throw 'invalid method call';
    }

    /**
     * Public accessor to send email for active competition
     */
    submitEmail(data: SubmitEmailPayload): Promise<void> {
        return this.runSubmit(CompetitionManagementComplianceService.submitEmail, data);
    }
}

export default new CompetitionManagementComplianceService();