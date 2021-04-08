/* eslint-disable */
import {SessionTypeKey} from '../../contracts/AppContracts';
import {Session} from "../Sessions/Session";

/**
 * Class to manage sets of sessions
 */
export class SessionCollection {
    sessions: Session[];

    constructor(sessions: Session[]) {
        this.sessions = sessions;
    }

    /**
     * Return sessions that belong to a rink
     */
    public static filterRink(rink_id: number, session_collection: SessionCollection): SessionCollection {
        return new SessionCollection(session_collection.sessions.filter(function (session: Session) {
            return session.rink.id == rink_id;
        }));
    }

    /**
     * Order sessions by date
     */
    public static orderDate(session_collection: SessionCollection): SessionCollection {
        return new SessionCollection(session_collection.sessions.sort(function (a, b) {
            if (a.time_start > b.time_start) {
                return 1;
            }
            if (b.time_start > a.time_start) {
                return -1;
            }
            return 0;
        }));
    }

    /**
     * Return sessions that match a date stamp
     */
    public static filterDate(datestamp: (number | null), session_collection: SessionCollection): SessionCollection {
        if (!datestamp) {
            return session_collection;
        }
        let filter_date = new Date();
        filter_date.setTime(datestamp);
        return new SessionCollection(session_collection.sessions.filter(function (session: Session) {
            return session.date.getFullYear() === filter_date.getFullYear() &&
                session.date.getMonth() === filter_date.getMonth() &&
                session.date.getDate() == filter_date.getDate();

        }));
    }

    /**
     * Return sessions of a certain type(s)
     * @param types - array of type_keys.  Session will be returned if it matches any of them
     * @param collection SessionCollection - collection to filter.
     */
    public static filterType(types: SessionTypeKey[], collection: SessionCollection): SessionCollection {
        return new SessionCollection(collection.sessions.filter(function (session: Session) {

            return types.indexOf(session.type_key) !== -1;
        }));
    }

    /**
     * Return sessions that aren't fully booked
     */
    public static filterAvailable(session_collection: SessionCollection) {
        return new SessionCollection(session_collection.sessions.filter(function (session: Session) {
            return session.is_available;
        }));
    }

    /**
     * Instance accessor
     */
    public filterRink(rink_id: number): SessionCollection {
        return SessionCollection.filterRink(rink_id, this);
    }

    /**
     * Instance accessor
     */
    public orderDate(): SessionCollection {

        return SessionCollection.orderDate(this);
    }

    /**
     * Instance accessor
     */
    public filterType(types: SessionTypeKey[]): SessionCollection {
        return SessionCollection.filterType(types, this);
    }

    /**
     * Instance accessor
     */
    public filterAvailable(): SessionCollection {
        return SessionCollection.filterAvailable(this);
    }

    /**
     * Get an array of unique dates
     */
    public unique_dates(): Date[] {
        let results = <Date[]>[];
        let added = <Number[]>[];
        this.sessions.forEach(function (session: Session) {
            let date = new Date(session.date.getFullYear(), session.date.getMonth(), session.date.getDate(), 0, 0, 0);
            if (added.indexOf(date.getTime()) === -1) {
                results.push(date);
                added.push(date.getTime());
            }
        });
        return results;
    }

    /**
     * Instance accessor
     */
    public filterDate(datestamp: (number | null)): SessionCollection {
        return SessionCollection.filterDate(datestamp, this);
    }

    static filterEventIds(event_ids: number[], session_collection: SessionCollection): SessionCollection {
        return new SessionCollection(session_collection.sessions.filter(function (session: Session) {
            for (let i = 0; i < session.event_ids.length; i++) {
                let event_id = session.event_ids[i];
                if (event_ids.indexOf(event_id) !== -1) {
                    return true;
                }
            }
            return false;

        }));
    }

    public filterEventIds(event_ids: number[]): SessionCollection {
        return SessionCollection.filterEventIds(event_ids, this);
    }

    /**
     * Return all sessions in a collection
     */
    public all(): Session[] {
        return this.sessions;
    }

    /**
     * Determine if a session is in the collection
     */
    public contains(session: Session): boolean {
        for (let i = 0; i < this.sessions.length; i++) {
            let internal_session = this.sessions[i];
            if (internal_session.id == session.id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return a collection that only contains sessions in both collections
     */
    static intersect(target: SessionCollection, append: SessionCollection) {
        return new SessionCollection(append.sessions.filter(function (session: Session) {
            return target.contains(session);
        }));
    }

    static exclude(source: SessionCollection, exclude: SessionCollection) {
        return new SessionCollection(source.sessions.filter(function (session: Session) {
            return !exclude.contains(session);
        }));
    }

    public exclude(session_collecton: SessionCollection) {
        return SessionCollection.exclude(this, session_collecton);
    }

    public intersect(append: SessionCollection) {
        return SessionCollection.intersect(this, append);
    }

    /**
     * Return the union of two session collections.
     *
     * Result contains all shared sessions between the two with no duplicates
     */
    static combine(source: SessionCollection, addor: SessionCollection): SessionCollection {
        let source_unique = source.sessions.filter(function (session) {
            return !addor.contains(session);
        });
        return new SessionCollection(source_unique.concat(addor.sessions));
    }

    public combine(append: SessionCollection) {
        return SessionCollection.combine(this, append);
    }

    /**
     * Add a new session to the collection
     */
    public add(session: Session) {
        this.sessions.push(session);
    }

    /**
     * Get the amount of sessions in the collection
     */
    public count(): number {
        return this.sessions.length;
    }

    /**
     * Remove a session
     */
    public remove(session: Session) {
        let index = -1;
        for (let i = 0; i < this.sessions.length; i++) {
            let internal_session = this.sessions[i];
            if (internal_session.id == session.id) {
                index = i;
            }
        }


        if (index === -1) {
            return;
        }
        this.sessions.splice(index, 1);
    }

    public first(): Session | undefined {
        return this.sessions[0];
    }

    public firstDate(): Date | null {
        let sessionCollection = this.orderDate();
        let first = sessionCollection.first();
        if (!first) {
            return null;
        }
        let date = first.date;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
}