import {MemberSearchResult} from '../../../../contracts/app/MemberSearchContracts';
import {CheckInSubEntitySkaterCoach} from '../_models/CheckInSubEntitySkaterCoach';

export type EntityCheckInPageKey =
    'index'
    | 'compliance'
    | 'skaters'
    | 'events'
    | 'roster'
    | 'team_coaches'
    | 'skater_coaches'
    | 'team_service_personnel'
    | 'comments';

export interface CheckInAddSkaterCoachActionPayload {
    category_id: number;
    coach: MemberSearchResult;
}

export interface CheckInReplaceSkaterCoachActionPayload {
    category_id: number;
    coach: MemberSearchResult;
    previous_coach_id: number;
}

export interface CheckInRemoveCoachActionPayload {
    category_id: number;
    coach_id: number;
}

export interface CheckInAddCoachResultPayload {
    category_id: number;
    coach: CheckInSubEntitySkaterCoach;
}

export interface CheckInReplaceCoachResultPayload {
    category_id: number;
    coach: CheckInSubEntitySkaterCoach;
    previous_coach_id: number;
}

export interface CheckInRemoveCoachResultPayload {
    category_id: number;
    coach_id: number;
}