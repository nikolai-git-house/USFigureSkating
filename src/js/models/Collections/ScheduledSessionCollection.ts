import {ScheduledSession} from "../Sessions/ScheduledSession";
import {Session} from "../Sessions/Session";
import {CreditState, IndexedEventCreditList} from "../../contracts/AppContracts";

export class ScheduledSessionCollection {
    protected scheduled_sessions: ScheduledSession[];

    constructor(scheduled_sessions: ScheduledSession[]) {
        this.scheduled_sessions = scheduled_sessions;
    }

    all() {
        return this.scheduled_sessions;
    }

    count() {
        return this.scheduled_sessions.length;
    }


    public ids() {
        return this.scheduled_sessions.map(function (session) {
            return session.session.id;
        });
    }

    public add(scheduled_session: ScheduledSession) {
        this.scheduled_sessions.push(scheduled_session);
    }

    public eventId(event_id: number): ScheduledSessionCollection {
        return new ScheduledSessionCollection(this.scheduled_sessions.filter(function (scheduled_session: ScheduledSession) {
            return scheduled_session.scheduled_event_id === event_id;
        }));
    }

    public sessions(): Session[] {
        return this.scheduled_sessions.map(function (scheduled_session) {
            return scheduled_session.session;
        })
    }

    creditsUsed(): CreditState {
        let result = {
            opi: 0,
            upi: 0,
            wu: 0
        };
        this.scheduled_sessions.forEach(function (session) {
            result[session.scheduled_as]++;
        });
        return result;
    }

    getEventScheduledTypeAmounts(event_id: number) {
        this.eventId(event_id).creditsUsed();
    }

    containsSession(session: Session): boolean {
        for (let i = 0; i < this.scheduled_sessions.length; i++) {
            let scheduled_session = this.scheduled_sessions[i];
            if (scheduled_session.session.id === session.id) {
                return true;
            }
        }
        return false;
    }

    find(session_id: number): ScheduledSession | null {
        for (let i = 0; i < this.scheduled_sessions.length; i++) {
            let obj = this.scheduled_sessions[i];
            if (obj.session.id === session_id) {
                return obj;
            }
        }
        return null;
    }

    remove(session_id: number): boolean {
        let session_index = -1;
        for (let i = 0; i < this.scheduled_sessions.length; i++) {
            let obj = this.scheduled_sessions[i];
            if (obj.session.id === session_id) {
                session_index = i;
            }
        }
        if (session_index !== -1) {
            this.scheduled_sessions.splice(session_index, 1);
            return true;
        }
        return false;
    }

    reorderSessionTimeStart() {
        this.scheduled_sessions.sort(function (a: ScheduledSession, b: ScheduledSession) {
            if (a.session.time_start > b.session.time_start) {
                return 1;
            }
            if (b.session.time_start > a.session.time_start) {
                return -1;
            }
            return 0;
        })
    }

    creditReport(): IndexedEventCreditList {
        let result: IndexedEventCreditList = {};
        for (let i = 0; i < this.scheduled_sessions.length; i++) {
            let session = this.scheduled_sessions[i];
            if (!result.hasOwnProperty(String(session.scheduled_event_id))) {
                result[session.scheduled_event_id] = {
                    event_id: session.scheduled_event_id,
                    opi: 0,
                    upi: 0,
                    wu: 0
                }
            }
            result[session.scheduled_event_id][session.scheduled_as]++;
        }
        return result;
    }
}

