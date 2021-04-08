import {MemberSearchParameters, MemberSearchResult} from '../../../../contracts/app/MemberSearchContracts';
import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {
    AddEntitySkaterCategoryCoachAPIPayload,
    AddEntitySkaterCategoryCoachAPIResponse,
    FetchEntitySkaterCoachInformationAPIResponse,
    FetchEntitySkaterCoachSearchFormOptionsAPIResponse,
    RemoveEntitySkaterCategoryCoachAPIPayload,
    ReplaceEntitySkaterCategoryCoachAPIPayload,
    ReplaceEntitySkaterCategoryCoachAPIResponse
} from '../../_contracts/CheckInAPIContracts';
import {CheckInCompetitionInterface} from '../../_contracts/CheckInContracts';
import {AbstractCheckInEntity} from '../../_models/CheckInEntities/AbstractCheckInEntity';
import CheckInService from '../../_services/CheckInService';
import {
    CheckInAddCoachResultPayload,
    CheckInAddSkaterCoachActionPayload,
    CheckInRemoveCoachActionPayload,
    CheckInReplaceCoachResultPayload,
    CheckInReplaceSkaterCoachActionPayload
} from '../_contracts/EntityCheckInContracts';
import {
    FetchActiveEntitySkaterCoachInformationResponse,
    FetchActiveEntitySkaterCoachSearchFormOptionsResponse
} from '../_contracts/EntityCheckInServiceContracts';
import {EntityCheckInAPITransformer} from '../_transformers/EntityCheckInAPITransformer';

export class EntityCheckInSkaterCoachesService extends AbstractAPIService {

    /**
     * Add a coach to a category for a check-in entity
     */
    static addEntityCategoryCoach(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, payload: CheckInAddSkaterCoachActionPayload): Promise<CheckInAddCoachResultPayload> {
        return EntityCheckInSkaterCoachesService.submitWithTransformedResponse(
            {
                error_message: 'Error adding coach.',
                payload: <AddEntitySkaterCategoryCoachAPIPayload>{
                    coach_id: payload.coach.id,
                    category_id: payload.category_id
                },
                url: `/api/competitions/${competition.id}/check-in/${entity.id}/skater-coaches`,
                /**
                 * Validate the submission was successful and updated coach is present
                 */
                validateResponse: function (response_data: AddEntitySkaterCategoryCoachAPIResponse) {
                    return !!response_data && !!response_data.success && !!response_data.coach;
                },
                /**
                 * Transform API data to App data
                 */
                transformResponse: function (response_data: AddEntitySkaterCategoryCoachAPIResponse): CheckInAddCoachResultPayload {
                    return {
                        coach: EntityCheckInAPITransformer.transformCheckInSubEntitySkaterCoachDataToCheckInSubEntitySkaterCoach(response_data.coach),
                        category_id: payload.category_id
                    };
                }
            }
        );
    }

    /**
     * Fetch coach-event assignment information for a skater check-in entity
     */
    static fetchEntitySkaterCoachInformation(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface): Promise<FetchActiveEntitySkaterCoachInformationResponse> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/skater-coaches`,
            /**
             * Ensure response is an array
             */
            validateResponse: function (response_data: FetchEntitySkaterCoachInformationAPIResponse): boolean {
                return typeof response_data === 'object';
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchEntitySkaterCoachInformationAPIResponse): FetchActiveEntitySkaterCoachInformationResponse {
                return EntityCheckInAPITransformer.transformFetchEntitySkaterCoachInformationAPIResponseToFetchActiveEntitySkaterCoachInformationResponse(response_data);
            }
        });
    }

    /**
     * Fetch search form options for check-in skater coach search for an active entity
     */
    static fetchEntitySkaterCoachSearchFormOptions(): Promise<FetchActiveEntitySkaterCoachSearchFormOptionsResponse> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: '/api/form-options/coaches',
            /**
             * Ensure the response contains the proper keys
             */
            validateResponse: function (response_data: FetchEntitySkaterCoachSearchFormOptionsAPIResponse): boolean {
                return !!response_data && !!response_data.states;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchEntitySkaterCoachSearchFormOptionsAPIResponse): FetchActiveEntitySkaterCoachSearchFormOptionsResponse {
                return EntityCheckInAPITransformer.transformFetchEntitySkaterCoachSearchFormOptionsAPIResponseToFetchActiveEntitySkaterCoachSearchFormOptionsResponse(response_data);
            }
        });
    }

    /**
     * Remove a coach from a category for an entity
     */
    static removeEntityCategoryCoach(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, app_payload: CheckInRemoveCoachActionPayload): Promise<void> {

        return AbstractAPIService.submitForAPISubmissionResponse(
            {
                error_message: 'Error removing coach.',
                method: 'delete',
                payload: <RemoveEntitySkaterCategoryCoachAPIPayload>{
                    coach_id: app_payload.coach_id,
                    category_id: app_payload.category_id
                },
                url: `/api/competitions/${competition.id}/check-in/${entity.id}/skater-coaches`
            }
        );
    }

    /**
     * Replace a coach from a category for an entity
     */
    static replaceActiveEntityCategoryCoach(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, payload: CheckInReplaceSkaterCoachActionPayload): Promise<CheckInReplaceCoachResultPayload> {
        return AbstractAPIService.submitWithTransformedResponse({
            error_message: 'Error replacing coach.',
            method: 'put',
            payload: <ReplaceEntitySkaterCategoryCoachAPIPayload>{
                coach_id: payload.coach.id,
                category_id: payload.category_id,
                replace_coach_id: payload.previous_coach_id
            },
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/skater-coaches`,
            /**
             * Validate the submission was successful and updated coach is present
             */
            validateResponse: function (response_data: AddEntitySkaterCategoryCoachAPIResponse) {
                return !!response_data && !!response_data.success && !!response_data.coach;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: ReplaceEntitySkaterCategoryCoachAPIResponse): CheckInReplaceCoachResultPayload {
                return {
                    category_id: payload.category_id,
                    coach: EntityCheckInAPITransformer.transformCheckInSubEntitySkaterCoachDataToCheckInSubEntitySkaterCoach(response_data.coach),
                    previous_coach_id: payload.previous_coach_id
                };
            }
        });
    }

    /**
     * Run the skater coach search
     */
    static submitSkaterCoachSearch(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, search_params: MemberSearchParameters): Promise<MemberSearchResult[]> {
        return AbstractAPIService.submitMemberSearch({
            payload: search_params,
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/skater-coaches/search`
        });
    }

    /**
     * Add a coach to a category for the active check-in entity
     */
    public addActiveEntityCategoryCoach(payload: CheckInAddSkaterCoachActionPayload): Promise<CheckInAddCoachResultPayload> {
        return CheckInService.runSubmit(EntityCheckInSkaterCoachesService.addEntityCategoryCoach, payload);
    }

    /**
     * Fetch coach-event assignment information for the active skater check-in entity
     */
    public fetchActiveEntitySkaterCoachInformation(): Promise<FetchActiveEntitySkaterCoachInformationResponse> {
        return CheckInService.runFetch(EntityCheckInSkaterCoachesService.fetchEntitySkaterCoachInformation);
    }

    /**
     * Fetch search form options for check-in skater coach search for the active entity
     */
    public fetchActiveEntitySkaterCoachSearchFormOptions(): Promise<FetchActiveEntitySkaterCoachSearchFormOptionsResponse> {
        return EntityCheckInSkaterCoachesService.fetchEntitySkaterCoachSearchFormOptions();
    }

    /**
     * Remove a coach from a category for the active entity
     */
    public removeActiveEntityCategoryCoach(payload: CheckInRemoveCoachActionPayload): Promise<void> {
        return CheckInService.runSubmit(EntityCheckInSkaterCoachesService.removeEntityCategoryCoach, payload);
    }

    /**
     * Replace a coach from a category for the active entity
     */
    public replaceActiveEntityCategoryCoach(payload: CheckInReplaceSkaterCoachActionPayload): Promise<CheckInReplaceCoachResultPayload> {
        return CheckInService.runSubmit(EntityCheckInSkaterCoachesService.replaceActiveEntityCategoryCoach, payload);
    }

    /**
     * Search for coaches to assign to the skater
     */
    public skaterCoachSearch(search_params: MemberSearchParameters): Promise<MemberSearchResult[]> {
        return CheckInService.runSubmit(EntityCheckInSkaterCoachesService.submitSkaterCoachSearch, search_params);
    }
}

export default new EntityCheckInSkaterCoachesService();