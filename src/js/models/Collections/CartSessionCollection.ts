import {ScheduledSessionCollection} from "./ScheduledSessionCollection";
import {CartSession} from "../Sessions/CartSession";
import {SessionCollection} from "./SessionCollection";

export class CartSessionCollection extends ScheduledSessionCollection {

    protected scheduled_sessions: CartSession[];

    constructor(scheduled_sessions: CartSession[]) {
        super(scheduled_sessions);
        this.scheduled_sessions = scheduled_sessions;
    }

    find(session_id: number): CartSession | null {
        return super.find(session_id) as CartSession | null;
    }

    getTotalCost(): number {
        return this.scheduled_sessions.reduce(function (result, scheduled_session: CartSession): number {
            return result + scheduled_session.cost;
        }, 0);

    }

    all(): CartSession[] {
        return this.scheduled_sessions;
    }

    get session_collection(): SessionCollection {
        let result = new SessionCollection([]);
        for (let i = 0; i < this.scheduled_sessions.length; i++) {
            let scheduled_session = this.scheduled_sessions[i];
            result.add(scheduled_session.session);
        }
        return result;
    }

}