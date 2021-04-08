import {CompetitionScheduleData, SkaterEventData} from "./DataContracts";
import {SessionType} from "../AppContracts";

export type ScheduledSessionMapData = {
    session_id: number;
    scheduled_as: SessionType;
    scheduled_event_id: number;
}

/**
 * see: INTEGRATION_GUIDES/10__INTEGRATION-PRACTICE-ICE-SCHEDULE-UPDATE.md:20
 */
export type MappedSkaterScheduleData = {
    scheduled_session_maps: ScheduledSessionMapData[];
    events: SkaterEventData[];
}

/**
 * see: INTEGRATION_GUIDES/10__INTEGRATION-PRACTICE-ICE-SCHEDULE-UPDATE.md:33
 */
export type PracticeIceSchedulesData = {
    competition_schedule: CompetitionScheduleData;
    mapped_skater_schedule: MappedSkaterScheduleData;
}