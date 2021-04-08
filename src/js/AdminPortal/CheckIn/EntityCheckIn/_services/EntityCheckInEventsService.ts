import {AbstractAPIService} from '../../../../services/AbstractAPIService';
import {
    FetchEntityEventsAPIResponse,
    OverrideCheckInEventSegmentMusicPpcItemAPIPayload
} from '../../_contracts/CheckInAPIContracts';
import {CheckInCompetitionInterface, CheckInEventSegmentStatusOverridePayload} from '../../_contracts/CheckInContracts';
import {AbstractCheckInEntity} from '../../_models/CheckInEntities/AbstractCheckInEntity';
import CheckInService from '../../_services/CheckInService';
import {FetchCheckInEventsResponse} from '../_contracts/EntityCheckInServiceContracts';
import {EntityCheckInAPITransformer} from '../_transformers/EntityCheckInAPITransformer';

export class EntityCheckInEventsService extends AbstractAPIService {
    /**
     * Fetch the check-in events list for an entity
     */
    static fetchEvents(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface): Promise<FetchCheckInEventsResponse> {

        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/events`,
            /**
             * Verify response data contains an array
             */
            validateResponse: function (response_data: FetchEntityEventsAPIResponse): boolean {
                return typeof response_data === 'object';
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchEntityEventsAPIResponse): FetchCheckInEventsResponse {
                return EntityCheckInAPITransformer.transformFetchEntityEventsAPIResponseToFetchCheckInEventsResponse(response_data);
            }
        });
    }

    /**
     * Mark an event PPC item as viewed/not-viewed for an entity
     */
    static overrideEntityEventPPCStatus(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, payload: CheckInEventSegmentStatusOverridePayload): Promise<void> {

        return AbstractAPIService.submitForAPISubmissionResponse({
            error_message: 'Error saving PPC override.',
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/override-ppc`,
            payload: <OverrideCheckInEventSegmentMusicPpcItemAPIPayload>{
                event_id: payload.segment.event_id,
                segment_id: payload.segment.id,
                is_overridden: payload.is_overridden
            }
        });
    }

    /**
     * Mark an event Music item as viewed/not-viewed for an entity
     */
    static overrideEntityEventSegmentMusicStatus(entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, payload: CheckInEventSegmentStatusOverridePayload): Promise<void> {

        return AbstractAPIService.submitForAPISubmissionResponse({
            url: `/api/competitions/${competition.id}/check-in/${entity.id}/override-music`,
            payload: <OverrideCheckInEventSegmentMusicPpcItemAPIPayload>{
                event_id: payload.segment.event_id,
                segment_id: payload.segment.id,
                is_overridden: payload.is_overridden
            },
            error_message: 'Error saving Music override.'
        });
    }

    /**
     * Fetch the check-in events list for the active entity
     */
    public fetchActiveEntityEvents(): Promise<FetchCheckInEventsResponse> {
        return CheckInService.runFetch(EntityCheckInEventsService.fetchEvents);
    }

    /**
     * Mark an event PPC item as viewed/not-viewed for the active entity
     */
    public overrideActiveEntityEventPPCStatus(payload: CheckInEventSegmentStatusOverridePayload): Promise<void> {
        return CheckInService.runSubmit(EntityCheckInEventsService.overrideEntityEventPPCStatus, payload);
    }

    /**
     * Mark an event Music item as viewed/not-viewed for the active entity
     */
    public overrideActiveEntityEventSegmentMusicStatus(payload: CheckInEventSegmentStatusOverridePayload): Promise<void> {
        return CheckInService.runSubmit(EntityCheckInEventsService.overrideEntityEventSegmentMusicStatus, payload);
    }
}

export default new EntityCheckInEventsService();