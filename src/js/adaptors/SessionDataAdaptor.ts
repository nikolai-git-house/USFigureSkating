import {
    CartSessionData, EventSessionData, PracticeIceData, ScheduledSessionData, SessionData,
    WarmUpData
} from "../contracts/data/DataContracts";
import {Session} from "../models/Sessions/Session";
import {SkatingEventSession} from "../models/Sessions/SkatingEventSession";
import {Resurface} from "../models/Sessions/Resurface";
import {PracticeIce} from "../models/Sessions/PracticeIce";
import {WarmUp} from "../models/Sessions/WarmUp";
import {ScheduledSession} from "../models/Sessions/ScheduledSession";
import {CartSession} from "../models/Sessions/CartSession";

export class SessionDataAdaptor {
    /**
     * Adapt a unix timestamp in seconds relative to a source timezone defined by a UTC offset in minutes to ensure date
     * displayed in browser is the source date rather than the localized version of that date.
     *
     * seconds_to_add = (local_utc_offset - source_utc_offset) * 60
     *
     * ex:
     *  - Source timestamp indicating 8am EDT
     *  - Browser localized to MDT
     *
     * 1. Source is UTC +4 (as defined by Date::getTimezoneOffset() in JavaScript) - param timestamp_seconds
     * 2. Local is UTC +6 - determined in method by Date::getTimezoneOffset()
     * 3. Adjustment to source timestamp to display 8am EDT date as 8am in MDT = +2 hours
     *
     * result: Add 2 hours to timestamp to ensure date shows as 8am rather than 6am
     *
     * Note: timezones east of UTC are negative within JavaScript API.  The math still holds, as subtracting a negative
     * number from the local offset increases the overall amount of time added.
     */
    static adjustLocalTimeRelativeToSourceTimezone(timestamp_seconds: number, source_utc_offset_minutes: number): number {
        let local_utc_offset_minutes = (new Date()).getTimezoneOffset();
        let local_source_offset_difference_minutes = local_utc_offset_minutes - source_utc_offset_minutes;
        let local_adjusted_ts = timestamp_seconds + local_source_offset_difference_minutes * 60;
        return local_adjusted_ts;
    }

    /**
     * Adapt a unix timestamp in seconds to a unix timestamp in milliseconds
     */
    static adaptTimestamp(timestamp_seconds: number): number {
        return timestamp_seconds * 1000;
    }

    static adaptArray(raw_data: SessionData[]): Session[] {
        let results: Session[] = [];
        for (let i = 0; i < raw_data.length; i++) {
            let obj = raw_data[i];
            results.push(SessionDataAdaptor.adapt(obj));
        }
        return results;
    }

    static adapt(raw_data: SessionData): Session {
        raw_data.date = SessionDataAdaptor.adaptTimestamp(
            SessionDataAdaptor.adjustLocalTimeRelativeToSourceTimezone(raw_data.date, raw_data.utc_timezone_offset)
        );
        raw_data.time_end = SessionDataAdaptor.adaptTimestamp(
            SessionDataAdaptor.adjustLocalTimeRelativeToSourceTimezone(raw_data.time_end, raw_data.utc_timezone_offset)
        );
        raw_data.time_start = SessionDataAdaptor.adaptTimestamp(
            SessionDataAdaptor.adjustLocalTimeRelativeToSourceTimezone(raw_data.time_start, raw_data.utc_timezone_offset)
        );

        switch (raw_data.type_key) {
            case 'event': {
                return SessionDataAdaptor.adaptEventSession(raw_data as EventSessionData);
            }
            case 'resurface': {
                return SessionDataAdaptor.adaptResurface(raw_data);
            }
            case 'practice_ice': {
                return SessionDataAdaptor.adaptPracticeIce(raw_data as PracticeIceData);
            }
            case 'warm_up': {
                return SessionDataAdaptor.adaptWarmUp(raw_data);
            }
        }
    }

    static adaptEventSession(raw_data: EventSessionData): SkatingEventSession {
        return new SkatingEventSession(raw_data);
    }

    static adaptResurface(raw_data: SessionData): Resurface {
        return new Resurface(raw_data);
    }

    static adaptPracticeIce(raw_data: PracticeIceData): PracticeIce {
        return new PracticeIce(raw_data);
    }

    static adaptWarmUp(raw_data: WarmUpData): WarmUp {
        return new WarmUp(raw_data);
    }


    static adaptScheduled(raw_data: ScheduledSessionData): ScheduledSession {
        let session = SessionDataAdaptor.adapt(raw_data.session);
        return new ScheduledSession({
            session: session,
            scheduled_as: raw_data.scheduled_as,
            scheduled_event_id: raw_data.scheduled_event_id
        });
    }

    static adaptScheduledArray(raw_data: ScheduledSessionData[]): ScheduledSession[] {
        let result = [];
        for (let i = 0; i < raw_data.length; i++) {
            result.push(SessionDataAdaptor.adaptScheduled(raw_data[i]));
        }
        return result;
    }

    static adaptCartSession(raw_data: CartSessionData): CartSession {
        let session = SessionDataAdaptor.adapt(raw_data.session);
        return new CartSession({
            session: session,
            scheduled_as: raw_data.scheduled_as,
            scheduled_event_id: raw_data.scheduled_event_id,
            cost: raw_data.cost,
            competition_id: raw_data.competition_id,
            competition_name: raw_data.competition_name,
            scheduled_event_name: raw_data.scheduled_event_name,
        });
    }
}