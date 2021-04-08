import {SessionCollection} from "../Collections/SessionCollection";
import {Session} from "../Sessions/Session";
import {SkatingEvent} from "../SkatingEvent";
import {SkatingEventCollection} from "../Collections/SkatingEventCollection";
import {SessionSchedule} from "./SessionSchedule";
import {ScheduledSession} from "../Sessions/ScheduledSession";
import {ScheduledSessionCollection} from "../Collections/ScheduledSessionCollection";
import {SessionLike, SessionType} from "../../contracts/AppContracts";
import {CreditStateData} from "../../contracts/data/DataContracts";

/**
 * @refactor: remove unused members and methods
 */
export class SkaterSchedule {
    //@refactor: refactor to see if we need sessions on top of scheduled_sessions
    sessions: SessionCollection;
    private _schedule: SessionSchedule;
    private _registered_events: SkatingEventCollection;
    private scheduled_sessions: ScheduledSessionCollection;

    constructor(scheduled_sessions: ScheduledSession[], events: SkatingEvent[]) {
        this.scheduled_sessions = new ScheduledSessionCollection(scheduled_sessions);
        this.sessions = new SessionCollection(this.scheduled_sessions.sessions());
        this._schedule = new SessionSchedule(this.scheduled_sessions);
        this._registered_events = new SkatingEventCollection(events);
    }

    get schedule(): SessionSchedule {
        return this._schedule;
    }

    get registered_events(): SkatingEvent[] {
        return this._registered_events.all();
    }

    get event_ids(): number[] {
        return this._registered_events.ids();
    }

    get session_ids() {
        return this.scheduled_sessions.ids();
    }

    public findEvent(event_id: number) {
        return this._registered_events.find(event_id);
    }

    public getScheduledSessionsForEvent(event_id: number): ScheduledSessionCollection {
        return this.scheduled_sessions.eventId(event_id);
    }

    contains(session: Session) {
        return this.sessions.contains(session);
    }

    add(scheduled_session: ScheduledSession) {
        this.scheduled_sessions.add(scheduled_session);
        this.sessions.add(scheduled_session.session);
        this._schedule.add(scheduled_session);
    }

    findScheduledSession(session_id: number): ScheduledSession | null {
        return this.scheduled_sessions.find(session_id);
    }

    remove(scheduled_session: ScheduledSession) {
        this.scheduled_sessions.remove(scheduled_session.session.id);
        this.sessions.remove(scheduled_session.session);
        this._schedule.remove(scheduled_session.session)
    }

    //@refactor: remove if unused
    public getfirstDate(): (Date | null) {
        let ordered = this.sessions.orderDate();
        if (ordered.count()) {
            let date = ordered.sessions[0].date;
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        return null;
    }

    getfirstRinkDate(rink_id: number) {
        let filtered = this.sessions.filterRink(rink_id).orderDate();
        if (filtered.count()) {
            let date = filtered.sessions[0].date;
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        return null;
    }

    getEventScheduledTypeAmount(event_id: number, session_type: SessionType): number {
        return this.scheduled_sessions.eventId(event_id).creditsUsed()[session_type];
    }

    getEventScheduledTypeCounts(event_id: number): CreditStateData {
        return this.scheduled_sessions.eventId(event_id).creditsUsed();
    }

    /**
     * Return an array of event ids contained within the session that the skater is registered for
     */
    filterAvailableSessionEventIds(session: SessionLike): number[] {
        let schedulable_event_ids = this.event_ids;
        return session.event_ids.filter(function (event_id: number) {
            return schedulable_event_ids.indexOf(event_id) !== -1;
        })
    }

}