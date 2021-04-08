import {PracticeIceSchedulesData, ScheduledSessionMapData} from "../contracts/data/PracticeIceSchedulesDataContracts";
import {IndexedSessions, PracticeIceSchedulesStateArgs, SkaterScheduleStateArgs} from "../contracts/AppContracts";
import {CompetitionSchedule} from "../models/Competition/CompetitionSchedule";
import {SessionDataAdaptor} from "./SessionDataAdaptor";
import {Session} from "../models/Sessions/Session";
import {FacililtyDataAdaptor} from "./FacilityDataAdaptor";
import {RinkDataAdaptor} from "./RinkDataAdaptor";
import {SkaterEventDataAdaptor} from "./SkaterEventDataAdaptor";
import {ScheduledSession} from "../models/Sessions/ScheduledSession";


export class PracticeIceSchedulesDataAdaptor {
    private raw_data: PracticeIceSchedulesData;
    private indexed_sessions: IndexedSessions = {};
    private sessions_array: Session[];


    /**
     * Save raw data.  Parse sessions and created indexed session collection
     */
    constructor(raw_data: PracticeIceSchedulesData) {
        this.raw_data = raw_data;
        if (!this.dataValid(raw_data)) {
            console.error("Invalid Practice Ice Schedules Data");
            throw "Invalid Practice Ice Schedules Data";
        }
        let sessions = SessionDataAdaptor.adaptArray(this.raw_data.competition_schedule.sessions);
        this.sessions_array = sessions;
        this.indexed_sessions = sessions.reduce(function (accumulator: IndexedSessions, session: Session) {
            accumulator[session.id] = session;
            return accumulator;
        }, {});
    }

    /**
     * Get the CompetitionSchedule from the data
     */
    public getCompetitionSchedule(): CompetitionSchedule {
        let competition_data = this.raw_data.competition_schedule;
        let facilities_array = FacililtyDataAdaptor.adaptArray(competition_data.facilities);
        let rinks_array = RinkDataAdaptor.adaptFullArray(competition_data.rinks);
        return new CompetitionSchedule(facilities_array, rinks_array, this.sessions_array);
    }

    /**
     * Get the SkaterScheduleStateArgs from the data
     */
    public getSkaterScheduleArguments(): SkaterScheduleStateArgs {
        let skater_data = this.raw_data.mapped_skater_schedule;
        return {
            sessions: this.getScheduledSessionsFromMap(skater_data.scheduled_session_maps),
            events: SkaterEventDataAdaptor.adaptArray(skater_data.events)
        };
    }

    /**
     * Get the ScheduledSession objects based on the provided map data
     */
    private getScheduledSessionsFromMap(session_map: ScheduledSessionMapData[]) {
        let self = this;
        return session_map.map(function (data: ScheduledSessionMapData) {
            return self.adaptSkaterScheduledSession(data);
        });
    }

    /**
     * Build a ScheduledSession object from provided data
     */
    private adaptSkaterScheduledSession(scheduled_session_data: ScheduledSessionMapData): ScheduledSession {
        let session_instance = this.getSession(scheduled_session_data);
        return new ScheduledSession({
            session: session_instance,
            scheduled_as: scheduled_session_data.scheduled_as,
            scheduled_event_id: scheduled_session_data.scheduled_event_id
        });
    }

    /**
     * Adapt complete PracticeIceSchedulesData into PracticeIceSchedulesStateArgs
     */
    static adapt(raw_data: PracticeIceSchedulesData): PracticeIceSchedulesStateArgs {
        let instance = new PracticeIceSchedulesDataAdaptor(raw_data);
        return {
            competition_schedule: instance.getCompetitionSchedule(),
            skater_schedule_args: instance.getSkaterScheduleArguments()
        }
    }

    /**
     * Get the full session object from a provided map
     */
    private getSession(scheduled_session_map_data: ScheduledSessionMapData): Session {
        if (this.indexed_sessions.hasOwnProperty(String(scheduled_session_map_data.session_id))) {
            return this.indexed_sessions[scheduled_session_map_data.session_id];
        }
        console.error('Unable to find complete session data for skater scheduled session map.');
        throw('Unable to find complete session data for skater scheduled session map.');
    }

    private dataValid(raw_data: any) {
        let required: { [key: string]: string[] } = {
            competition_schedule: [
                "sessions",
                "facilities",
                "rinks",
            ],
            mapped_skater_schedule: [
                'scheduled_session_maps',
                'events',
            ]
        };

        for (let i in required) {
            let requiredElement = required[i];
            if (!raw_data.hasOwnProperty(i)) {
                return false;
            }

            if (typeof requiredElement === 'object') {
                for (let j = 0; j < requiredElement.length; j++) {
                    let requiredElementElement = requiredElement[j];
                    if (!raw_data[i].hasOwnProperty(requiredElementElement)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}