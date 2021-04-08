import {EmailFormStateConfiguration, EmailRecipientOptionCategory} from '../../EmailForm/_contracts/EmailFormContracts';
import {AbstractCheckInEntity} from '../_models/CheckInEntities/AbstractCheckInEntity';
import {CheckInSubEntityTeamCoach} from '../EntityCheckIn/_models/CheckInSubEntityTeamCoach';
import {CheckInCompetitionInterface} from './CheckInContracts';
import {CheckInEntityCheckInStatus, CheckInEntityList} from './CheckInEntityContracts';

/**
 * App service response when fetching check-in team coach information
 */
export interface FetchActiveEntityCoachInformationResponse {
    competition_coach_ids: number[];
    team_coaches: CheckInSubEntityTeamCoach[];
}

/**
 * App service response when fetching check-in index data
 */
export interface FetchCheckInEntitiesResponse extends CheckInEntityList {
}

/**
 * App service response when checking an entity in
 */
export interface CheckActiveEntityInResponse extends CheckInEntityCheckInStatus {
}

export interface CheckInServiceSubmitMethod {
    (entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface, payload: any): Promise<any>;
}

export interface CheckInServiceFetchMethod {
    (entity: AbstractCheckInEntity, competition: CheckInCompetitionInterface): Promise<any>;
}

/**
 * Service response when fetching email configurations for Check In form
 *
 * BCC values are required
 * CC key is required, but can be set to an empty array to hide the CC input
 */
export interface CheckInEmailConfiguration extends EmailFormStateConfiguration {
    bcc: EmailRecipientOptionCategory[];
    cc: EmailRecipientOptionCategory[];
}