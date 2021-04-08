import {Session} from "../Sessions/Session";
import {ScheduledSessionCollection} from "../Collections/ScheduledSessionCollection";
import {ScheduledSession} from "../Sessions/ScheduledSession";

/**
 * Class that represents a single day in a Schedule of Sessions
 */
export class ScheduleDay {
    public scheduled_sessions: ScheduledSessionCollection;
    private _date: Date;
    private _pretty_date: string;

    constructor(date: Date, scheduled_sessions?: ScheduledSession[]) {
        this._date = date;
        this._pretty_date = ScheduleDay._parsePrettyDate(this._date);
        if (!scheduled_sessions) {
            scheduled_sessions = [];
        }
        this.scheduled_sessions = new ScheduledSessionCollection(scheduled_sessions);
        this.sortSessions();

    }

    get date(): Date {
        return this._date;
    }

    get pretty_date(): string {
        return this._pretty_date;
    }

    get sessions(): ScheduledSession[] {
        return this.scheduled_sessions.all();
    }

    /**
     * Return the date in "Mon 3/27" format
     */
    private static _parsePrettyDate(date: Date): string {
        let days_of_week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
        return days_of_week[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate();
    }

    /**
     * Add a session to the day
     */
    public add(scheduled_session: ScheduledSession) {
        this.scheduled_sessions.add(scheduled_session);
        this.sortSessions();
    }

    /**
     * @refactor: change to scheduled_session
     */
    public remove(session: Session) {
        this.scheduled_sessions.remove(session.id);
    }

    /**
     * Sort sessions in start time order
     */
    public sortSessions() {
        this.scheduled_sessions.reorderSessionTimeStart();

    }

    isEmpty() {
        return this.scheduled_sessions.count() === 0;
    }
}