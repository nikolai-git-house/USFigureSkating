import {AbstractAPIService} from '../../../services/AbstractAPIService';
import {EmailFormServiceInterface} from '../../EmailForm/_contracts/EmailFormContracts';
import {
    CheckEntityInAPIPayload,
    CheckEntityInAPIResponse,
    FetchCheckInEmailConfigurationAPIResponse,
    FetchCheckInEntitiesAPIResponse,
    FetchCheckInEntityApiResponse,
    SubmitCheckInEmailAPIPayload
} from '../_contracts/CheckInAPIContracts';
import {
    CheckEntityInPayload,
    CheckInCompetitionInterface,
    SubmitCheckInEmailPayload
} from '../_contracts/CheckInContracts';
import {
    CheckActiveEntityInResponse,
    CheckInEmailConfiguration,
    CheckInServiceFetchMethod,
    CheckInServiceSubmitMethod,
    FetchCheckInEntitiesResponse
} from '../_contracts/CheckInServiceContracts';
import {AbstractCheckInEntity} from '../_models/CheckInEntities/AbstractCheckInEntity';
import {CheckInAPITransformer} from '../_transformers/CheckInAPITransformer';

export class CheckInService extends AbstractAPIService implements EmailFormServiceInterface {
    /**
     * The active competition being worked with
     */
    private _active_competition: CheckInCompetitionInterface | null = null;

    /**
     * Active competition accessor
     */
    get active_competition(): CheckInCompetitionInterface | null {
        return this._active_competition;
    }

    /**
     * Set the active competition
     */
    set active_competition(value: CheckInCompetitionInterface | null) {
        this._active_competition = value;
    }

    /**
     * The active entity being worked on
     */
    private _active_entity: AbstractCheckInEntity | null = null;

    /**
     * Active entity accessor
     */
    get active_entity(): AbstractCheckInEntity | null {
        return this._active_entity;
    }

    /**
     * Set the active entity
     */
    set active_entity(value: AbstractCheckInEntity | null) {
        this._active_entity = value;
    }

    /**
     * Check an entity in
     */
    static checkEntityIn(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, app_payload: CheckEntityInPayload): Promise<CheckActiveEntityInResponse> {

        return AbstractAPIService.submitWithTransformedResponse({
            error_message: `Error checking the ${entity.entity_type_description} in.`,
            payload: <CheckEntityInAPIPayload>{
                ...app_payload
            },
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/check-in`,
            /**
             * Ensure submission was successful and it contains the proper data element
             */
            validateResponse: function (response_data: CheckEntityInAPIResponse) {
                return !!response_data && !!response_data.success && !!response_data.status;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: CheckEntityInAPIResponse): CheckActiveEntityInResponse {
                return CheckInAPITransformer.transformCheckEntityInAPIResponseToCheckActiveEntityInResponse(response_data);
            }
        });
    }

    /**
     *  Fetch the data needed for CheckIn Index Page
     */
    static fetchCheckInEntities(competition: CheckInCompetitionInterface): Promise<FetchCheckInEntitiesResponse> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/check-in`,
            /**
             * Validate that the response is an array
             */
            validateResponse: function (response_data: FetchCheckInEntitiesAPIResponse) {
                return !!response_data && typeof response_data === 'object';
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchCheckInEntitiesAPIResponse): FetchCheckInEntitiesResponse {
                return CheckInAPITransformer.transformFetchCheckInIndexDataAPIResponseToFetchCheckInIndexDataResponse(response_data);
            }
        });
    }

    /**
     * Undo check-in for an entity
     */
    static undoEntityCheckIn(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface): Promise<void> {
        return AbstractAPIService.submitForAPISubmissionResponse({
            error_message: `Error undoing the check-in for the ${entity.entity_type_description}.`,
            payload: null,
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/undo-check-in`
        });
    }

    /**
     * Fetch data necessary to initiate the check-in workflow for an entity
     */
    private static fetchEntityCheckIn<I extends AbstractCheckInEntity>(entity: I, competition: CheckInCompetitionInterface): Promise<I> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/check-in/${entity.id}`,
            /**
             * Validate that the response is an array
             */
            validateResponse: function (response_data: FetchCheckInEntityApiResponse) {
                return !!response_data && typeof response_data === 'object';
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchCheckInEntityApiResponse): I {
                return CheckInAPITransformer.transformFetchEntityCheckIn(response_data, entity);
            }
        });
    }

    /**
     * Fetch the email target options for a competition
     */
    private static fetchEmailConfiguration(competition: CheckInCompetitionInterface): Promise<CheckInEmailConfiguration> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/check-in/email`,
            /**
             * Validate that the response contains the necessary data
             */
            validateResponse: function (response_data: FetchCheckInEmailConfigurationAPIResponse) {
                return !!response_data && !!response_data.bcc;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchCheckInEmailConfigurationAPIResponse): CheckInEmailConfiguration {
                return CheckInAPITransformer.transformFetchCheckInEmailConfiguration(response_data);
            }
        });
    }

    /**
     * Submit an email for a Competition
     */
    private static submitCompetitionCheckInEmail(competition: CheckInCompetitionInterface, data: SubmitCheckInEmailPayload) {
        return AbstractAPIService.submitForAPISubmissionResponse({
            error_message: 'Error sending email.',
            payload: <SubmitCheckInEmailAPIPayload>data,
            url: `/api/competitions/${competition.id}/check-in/email`
        });
    }

    /**
     * Check the active entity in
     */
    public checkActiveEntityIn(payload: CheckEntityInPayload): Promise<CheckActiveEntityInResponse> {
        return this.runSubmit(CheckInService.checkEntityIn, payload);
    }

    /**
     *  Fetch the data needed for CheckIn Index Page
     */
    public fetchActiveCompetitionCheckInEntities(): Promise<FetchCheckInEntitiesResponse> {
        if (!this.active_competition) {
            throw 'no active competition';
        }

        return CheckInService.fetchCheckInEntities(this.active_competition);
    }

    /**
     * Fetch the email target options for the active competition
     */
    public fetchEmailConfiguration(): Promise<CheckInEmailConfiguration> {
        if (!this.active_competition) {
            throw 'no active competition';
        }

        return CheckInService.fetchEmailConfiguration(this.active_competition);
    }

    /**
     * Run a fetch method using active state
     */
    public runFetch(method: CheckInServiceFetchMethod): Promise<any> {
        if (!this.active_competition) {
            throw 'no active competition';
        }
        if (!this.active_entity) {
            throw 'no active entity';
        }
        if (typeof method === 'function') {
            return method(this.active_entity, this.active_competition);
        }
        console.error('Invalid check-in service GET method call');
        throw 'invalid method call';
    }

    /**
     * Run a submit method using active state
     */
    public runSubmit(method: CheckInServiceSubmitMethod, payload: any): Promise<any> {
        if (!this.active_entity) {
            throw 'no active entity';
        }
        if (!this.active_competition) {
            throw 'no active competition';
        }
        if (typeof method === 'function') {
            return method(this.active_entity, this.active_competition, payload);
        }
        console.error('Invalid check-in service POST method call');
        throw 'invalid method call';
    }

    /**
     * Submit an email for the active Competition
     */
    public submitActiveCompetitionCheckInEmail(data: SubmitCheckInEmailPayload) {
        if (!this._active_competition) {
            throw 'no active competition';
        }

        return CheckInService.submitCompetitionCheckInEmail(this._active_competition, data);
    }

    /**
     * Submit check-in email
     */
    public submitEmail(data: SubmitCheckInEmailPayload): Promise<void> {
        return this.submitActiveCompetitionCheckInEmail(data);
    }

    /**
     * Public accessor to undo check-in for an entity
     */
    public undoEntityCheckIn(entity: AbstractCheckInEntity): Promise<void> {
        if (!this._active_competition) {
            throw 'no active competition';
        }

        return CheckInService.undoEntityCheckIn(entity, this._active_competition);
    }

    /**
     * Public accessor to fetch entity check-in index data for an entity
     */
    fetchEntityCheckIn<I extends AbstractCheckInEntity>(entity: I): Promise<I> {
        if (!this._active_competition) {
            throw 'no active competition';
        }

        return CheckInService.fetchEntityCheckIn(entity, this._active_competition);
    }

}

const instance = new CheckInService();
export default instance;