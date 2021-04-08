import {Session} from "../Sessions/Session";
import {ScheduleDay} from "./ScheduleDay";
import {ScheduledSession} from "../Sessions/ScheduledSession";
import {ScheduledSessionCollection} from "../Collections/ScheduledSessionCollection";

type TimestampIndexedScheduleDays = { [key: number]: ScheduleDay };

export class SessionSchedule {

    private days: ScheduleDay[] = [];

    constructor(sessions: ScheduledSessionCollection) {

        this._importSessions(sessions);
        this._orderDays();

    }

    /**
     * Add a session to the schedule within its appropriate ScheduleDay
     */
    public add(scheduled_session: ScheduledSession) {
        let day_index = this._scheduleDayIndex(scheduled_session.session);
        if (day_index !== -1) {
            this.days[day_index].add(scheduled_session);
            return;
        }
        this._addScheduleDay(scheduled_session);
    }

    removeDay(day_index: number) {
        this.days.splice(day_index, 1);
    }

    /**
     * Remove a session from the schedule
     * 1. Make sure session is in schedule
     * 2. Remove the session from the day
     * 3. If resulting day is empty, remove it from the days
     * @refactor: change to scheduled_session
     */
    remove(session: Session) {
        let day_index = this._scheduleDayIndex(session);
        if (day_index === -1) {
            return;
        }
        let scheduleDay = this.days[day_index];
        scheduleDay.remove(session);
        if (scheduleDay.isEmpty()) {
            this.removeDay(day_index);
        }
    }

    private _importSessions(session_collection: ScheduledSessionCollection) {
        let timestampIndexedDays: TimestampIndexedScheduleDays = {};

        /**
         * Loop over all scheduled sessions.  Create object with timestamp index containing schedule day for
         * sessions with that date. Add sessions to appropriate days
         */
        session_collection.all().forEach(function (scheduled_session: ScheduledSession) {
            let timestamp = scheduled_session.session.date.getTime();
            if (!timestampIndexedDays.hasOwnProperty(String(timestamp))) {
                timestampIndexedDays[timestamp] = new ScheduleDay(new Date(timestamp));
            }
            timestampIndexedDays[timestamp].add(scheduled_session);
        });

        /**
         * Loop over all days, sort the sessions in each and add it to the days array
         */
        for (let i in timestampIndexedDays) {
            let obj = timestampIndexedDays[i];
            obj.sortSessions();
            this.days.push(obj);
        }
    }

    /**
     * Sort the schedule days in date order
     */
    private _orderDays() {
        this.days.sort(function (a, b): number {
            if (a.date > b.date) {
                return 1;
            }
            if (b.date > a.date) {
                return -1;
            }
            return 0;
        })
    }

    /**
     * Get the corresponding index for the appropriate ScheduleDay for a Session within the Schedule
     * Returns index if it exists, -1 if one doesn't
     * @note: depends on sessions date being a timestamp for 0:00:00:00 on the date
     */
    private _scheduleDayIndex(session: Session): number {
        for (let i = 0; i < this.days.length; i++) {
            let day = this.days[i];
            if (day.date.getTime() == session.date.getTime()) {
                return i;
            }
        }
        return -1
    }

    /**
     * Add a new ScheduleDay to the schedule for a session
     */
    private _addScheduleDay(scheduled_session: ScheduledSession) {
        this.days.push(new ScheduleDay(scheduled_session.session.date, [scheduled_session]));
        this._orderDays();
    }
}