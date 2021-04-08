/* eslint-disable jsdoc/require-jsdoc */
import {MusicDataAdaptor} from '../../../../adaptors/MusicDataAdaptor';
import {SkaterCoachedEventCategoryCollection} from '../../../../models/Collections/SkaterCoachedEventCollection';
import {
    EntityCommentAPISubmissionResponse,
    FetchEntityCoachedSkatersAPIResponse,
    FetchEntityCommentsAPIResponse,
    FetchEntityComplianceAPIResponse,
    FetchEntityEventsAPIResponse,
    FetchEntityRosterInformationAPIResponse,
    FetchEntitySkaterCoachInformationAPIResponse,
    FetchEntitySkaterCoachSearchFormOptionsAPIResponse,
    FetchEntityTeamCoachInformationAPIResponse,
    FetchEntityTeamServicePersonnelInformationAPIResponse
} from '../../_contracts/CheckInAPIContracts';
import {CheckInEntityCoachedSkater, CheckInEvent, CheckInEventSegment} from '../../_contracts/CheckInContracts';
import {CheckInEventData, CheckInEventSegmentData} from '../../_contracts/CheckInDataContracts';
import {FetchActiveEntityCoachInformationResponse} from '../../_contracts/CheckInServiceContracts';
import {CheckInSkaterCoachedEventCategory} from '../../_models/CheckInSkaterCoachedEventCategory';
import {CheckInSubEntitySkaterParameters} from '../_contracts/CheckInSubEntityContracts';
import {
    CheckInEntityCoachedSkaterData,
    CheckInSubEntitySkaterCoachData,
    CheckInSubEntitySkaterData,
    CheckInSubEntityTeamCoachData,
    CheckInSubEntityTeamServicePersonnelData
} from '../_contracts/CheckInSubEntityDataContracts';
import {
    FetchActiveEntityCommentsResponse,
    FetchActiveEntityRosterInformationResponse,
    FetchActiveEntitySkaterCoachInformationResponse,
    FetchActiveEntitySkaterCoachSearchFormOptionsResponse,
    FetchActiveEntityTeamServicePersonnelInformationResponse,
    FetchCheckInCoachedSkatersResponse,
    FetchCheckInEventsResponse,
    FetchEntityComplianceResponse,
    SubmitActiveEntityCommentResponse
} from '../_contracts/EntityCheckInServiceContracts';
import {CheckInSubEntitySkater} from '../_models/CheckInSubEntitySkater';
import {CheckInSubEntitySkaterCoach} from '../_models/CheckInSubEntitySkaterCoach';
import {CheckInSubEntityTeamCoach} from '../_models/CheckInSubEntityTeamCoach';
import {CheckInSubEntityTeamServicePersonnel} from '../_models/CheckInSubEntityTeamServicePersonnel';

export class EntityCheckInAPITransformer {
    static transformCheckInEntityCoachedDataSkaterToCheckInEntityCoachedSkater(data: CheckInEntityCoachedSkaterData): CheckInEntityCoachedSkater {
        return {
            ...data
        };
    }

    static transformCheckInEventDataToCheckInEvent(data: CheckInEventData): CheckInEvent {
        return {
            ...data,
            segments: data.segments.map((event: CheckInEventSegmentData) => {
                return EntityCheckInAPITransformer.transformCheckInEventSegmentDataToCheckInEventSegment(event);
            })
        };
    }

    static transformCheckInSubEntitySkaterCoachDataToCheckInSubEntitySkaterCoach(data: CheckInSubEntitySkaterCoachData): CheckInSubEntitySkaterCoach {
        return new CheckInSubEntitySkaterCoach({
            ...data
        });
    }

    static transformCheckInSubEntitySkaterDataToCheckInSubEntitySkater(data: CheckInSubEntitySkaterData): CheckInSubEntitySkater {
        const params: CheckInSubEntitySkaterParameters = {
            ...data
        };

        return new CheckInSubEntitySkater(params);
    }

    static transformEntityCommentAPISubmissionResponseToSubmitActiveEntityCommentResponse(data: EntityCommentAPISubmissionResponse): SubmitActiveEntityCommentResponse {
        return {
            comment: {
                ...data.comment
            }
        };
    }

    static transformFetchEntityCoachedSkatersAPIResponseToFetchCheckInCoachedSkatersResponse(data: FetchEntityCoachedSkatersAPIResponse): FetchCheckInCoachedSkatersResponse {
        return data.map((item: CheckInEntityCoachedSkaterData) => {
            return EntityCheckInAPITransformer.transformCheckInEntityCoachedDataSkaterToCheckInEntityCoachedSkater(item);
        });
    }

    static transformFetchEntityCommentsAPIResponseToFetchActiveEntityCommentsResponse(data: FetchEntityCommentsAPIResponse): FetchActiveEntityCommentsResponse {
        return data.slice();
    }

    static transformFetchEntityComplianceAPIResponseToFetchEntityComplianceResponse(response_data: FetchEntityComplianceAPIResponse): FetchEntityComplianceResponse {
        return response_data.map((item) => {
            return {...item};
        });
    }

    static transformFetchEntityEventsAPIResponseToFetchCheckInEventsResponse(data: FetchEntityEventsAPIResponse): FetchCheckInEventsResponse {
        return data.map((item: CheckInEventData) => {
            return EntityCheckInAPITransformer.transformCheckInEventDataToCheckInEvent(item);
        });
    }

    static transformFetchEntityRosterInformationAPIResponseToFetchActiveEntityRosterInformationResponse(data: FetchEntityRosterInformationAPIResponse): FetchActiveEntityRosterInformationResponse {
        return {
            roster: data.team_roster.map((member: CheckInSubEntitySkaterData) => {
                return EntityCheckInAPITransformer.transformCheckInSubEntitySkaterDataToCheckInSubEntitySkater(member);
            }),
            active_roster_skater_ids: data.competition_roster_skater_ids.slice(),
            team_roster_rules: data.team_roster_rules || []
        };
    }

    static transformFetchEntitySkaterCoachInformationAPIResponseToFetchActiveEntitySkaterCoachInformationResponse(response_data: FetchEntitySkaterCoachInformationAPIResponse): FetchActiveEntitySkaterCoachInformationResponse {

        const params: CheckInSkaterCoachedEventCategory[] = response_data.map((event) => {
            return new CheckInSkaterCoachedEventCategory({
                ...event,
                coaches: event.coaches.map((coach_data: CheckInSubEntitySkaterCoachData): CheckInSubEntitySkaterCoach => {
                    return EntityCheckInAPITransformer.transformCheckInSubEntitySkaterCoachDataToCheckInSubEntitySkaterCoach(coach_data);
                })
            });

        });

        return new SkaterCoachedEventCategoryCollection(params);
    }

    static transformFetchEntitySkaterCoachSearchFormOptionsAPIResponseToFetchActiveEntitySkaterCoachSearchFormOptionsResponse(response_data: FetchEntitySkaterCoachSearchFormOptionsAPIResponse): FetchActiveEntitySkaterCoachSearchFormOptionsResponse {

        return response_data.states.slice();
    }

    static transformFetchEntityTeamCoachInformationAPIResponseToFetchActiveEntityCoachInformationResponse(data: FetchEntityTeamCoachInformationAPIResponse): FetchActiveEntityCoachInformationResponse {
        return {
            team_coaches: data.team_coaches.map((data: CheckInSubEntityTeamCoachData) => {
                return new CheckInSubEntityTeamCoach(data);
            }),
            competition_coach_ids: data.competition_coach_ids
        };
    }

    static transformFetchEntityTeamServicePersonnelInformationAPIResponseToFetchActiveEntityTeamServicePersonnelInformationResponse(data: FetchEntityTeamServicePersonnelInformationAPIResponse): FetchActiveEntityTeamServicePersonnelInformationResponse {
        return {
            ...data,
            team_service_personnel: data.team_service_personnel.map((item: CheckInSubEntityTeamServicePersonnelData) => {
                return EntityCheckInAPITransformer.transformTeamServicePersonnelData(item);
            })
        };
    }

    private static transformCheckInEventSegmentDataToCheckInEventSegment(event_data: CheckInEventSegmentData): CheckInEventSegment {
        return {
            ...event_data,
            music: event_data.music ? MusicDataAdaptor.adaptSavedMusicDataToMusic(event_data.music) : null
        };
    }

    private static transformTeamServicePersonnelData(item: CheckInSubEntityTeamServicePersonnelData): CheckInSubEntityTeamServicePersonnel {
        return new CheckInSubEntityTeamServicePersonnel({
            ...item
        });
    }
}