import {Session} from "../Sessions/Session";
import {SessionCollection} from "../Collections/SessionCollection";
import {Rink} from "../Rink";


/**
 * Class for managing rink schedules
 *
 * Child of competition schedule
 */
export class RinkSchedule {
    public session_collection: SessionCollection;
    private _rink: Rink;

    constructor(rink: Rink, sessions: Session[]) {
        this._rink = rink;
        this.session_collection = new SessionCollection(sessions);

    }

    get rink(): Rink {
        return this._rink;
    }

    public getDates(): Date[] {
        return this.session_collection.unique_dates();
    }
}