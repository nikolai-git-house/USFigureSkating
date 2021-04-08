import {SessionCollection} from "../Collections/SessionCollection";
import {SessionSchedule} from "./SessionSchedule";
import {ScheduledSession} from "../Sessions/ScheduledSession";
import {Session} from "../Sessions/Session";
import {ScheduledSessionCollection} from "../Collections/ScheduledSessionCollection";

export type SkaterSessionMap = {
    [key: number]: string[];
}

/**
 * A coach's schedule based on the sessions of the skaters they're coaching for a competition.
 */
export class CoachSkatersSchedule {
    sessions: SessionCollection;
    skater_session_map: SkaterSessionMap;
    private _schedule: SessionSchedule;

    constructor(sessions: SessionCollection, skater_session_map: SkaterSessionMap) {
        this.sessions = sessions;
        this.skater_session_map = skater_session_map;
        this._schedule = this._createSchedule(sessions);
    }

    get schedule(): SessionSchedule {
        return this._schedule;
    }

    static blank(): CoachSkatersSchedule {
        return new CoachSkatersSchedule(new SessionCollection([]), {});
    }

    /**
     * Get the skaters for a given session_id in the schedule
     */
    public getSessionSkaters(session_id: number): string[] {
        if (this.skater_session_map.hasOwnProperty(String(session_id))) {
            return this.skater_session_map[session_id];
        }
        return [];
    }

    /**
     * Create a schedule from the supplied session collection.
     *
     * Creates spoofed Scheduled Session from Session's first credit_type and event_id to work with SessionSchedule API
     *  - These properties are not used in the CoachSkatersSchedule context, so their arbitrary construction will not pose issues as of this writing
     */
    private _createSchedule(sessions: SessionCollection) {
        return new SessionSchedule(
            new ScheduledSessionCollection(
                sessions.all().map(
                    function (session: Session) {
                        return new ScheduledSession({
                            session: session,
                            scheduled_as: session.credit_types[0],
                            scheduled_event_id: session.event_ids[0]
                        })
                    }
                )
            )
        );
    }
}