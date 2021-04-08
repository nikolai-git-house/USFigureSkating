import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {
    EntityCommentAPISubmissionResponse,
    FetchEntityCommentsAPIResponse,
    SubmitEntityCommentAPIPayload
} from '../../_contracts/CheckInAPIContracts';
import {CheckInCompetitionInterface} from '../../_contracts/CheckInContracts';
import {AbstractCheckInEntity} from '../../_models/CheckInEntities/AbstractCheckInEntity';
import CheckInService from '../../_services/CheckInService';
import {
    FetchActiveEntityCommentsResponse,
    SubmitActiveEntityCommentResponse
} from '../_contracts/EntityCheckInServiceContracts';
import {EntityCheckInAPITransformer} from '../_transformers/EntityCheckInAPITransformer';

export class EntityCheckInCommentsService extends AbstractAPIService {
    /**
     * Fetch the list of check-in comments for an entity
     */
    static fetchEntityComments(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface): Promise<FetchActiveEntityCommentsResponse> {
        const url = `/api/competitions/${competition.id}/check-in/${entity.id}/comments`;

        return AbstractAPIService.fetchAndTransformResponse({
            url,
            /**
             * Ensure data is present
             */
            validateResponse: function (response_data: FetchEntityCommentsAPIResponse): boolean {
                return !!response_data;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchEntityCommentsAPIResponse): FetchActiveEntityCommentsResponse {
                return EntityCheckInAPITransformer.transformFetchEntityCommentsAPIResponseToFetchActiveEntityCommentsResponse(response_data);
            }
        });
    }

    /**
     * Submit a comment for an entity and return the transformed response
     */
    static submitEntityComment(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, comment: string): Promise<SubmitActiveEntityCommentResponse> {
        const url = `/api/competitions/${competition.id}/check-in/${entity.id}/comments`;

        return AbstractAPIService.submitWithTransformedResponse(
            {
                url,
                payload: <SubmitEntityCommentAPIPayload>{comment},
                error_message: 'Error saving comment.',
                /**
                 * Ensure the response contains the proper keys
                 */
                validateResponse: function (response_data: EntityCommentAPISubmissionResponse): boolean {
                    return !!response_data && !!response_data.success && !!response_data.comment;
                },
                /**
                 * Transform API data to App data
                 */
                transformResponse: function (response_data: EntityCommentAPISubmissionResponse): SubmitActiveEntityCommentResponse {
                    return EntityCheckInAPITransformer.transformEntityCommentAPISubmissionResponseToSubmitActiveEntityCommentResponse(response_data);
                }
            }
        );
    }

    /**
     * Fetch the check-in comments for the active entity
     */
    public fetchActiveEntityComments(): Promise<FetchActiveEntityCommentsResponse> {
        return CheckInService.runFetch(EntityCheckInCommentsService.fetchEntityComments);
    }

    /**
     * Submit a comment for the active entity and return the transformed response
     */
    public submitActiveEntityComment(comment: string): Promise<SubmitActiveEntityCommentResponse> {
        return CheckInService.runSubmit(EntityCheckInCommentsService.submitEntityComment, comment);
    }

}

export default new EntityCheckInCommentsService();