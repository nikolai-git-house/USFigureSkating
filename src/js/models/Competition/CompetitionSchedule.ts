/* eslint-disable */
import {
    CompetitionScheduleLegend,
    CompetitionScheduleLinks
} from '../../CompetitionSchedule/_contracts/CompetitionScheduleContracts';
import {Rink} from "../Rink";
import {Session} from "../Sessions/Session";
import {Facility} from "../Facility";
import {RinkSchedule} from "../RinkSchedule/RinkSchedule";
import {SessionCollection} from "../Collections/SessionCollection";

export class CompetitionSchedule {

    rinks: Rink[];
    sessions: SessionCollection;
    facilities: Facility[];
    rink_schedules: RinkSchedule[] = [];
    private _unique_dates: Date[];
    private _legend: CompetitionScheduleLegend | null = null;
    private _links: CompetitionScheduleLinks = {};

    constructor(facilities: Facility[], rinks: Rink[], sessions: Session[]) {
        this.rinks = rinks;
        this.sessions = new SessionCollection(sessions);
        this._unique_dates = this.sessions.unique_dates();
        this.facilities = facilities;
        this._buildRinkSchedules(rinks, sessions);
    }

    get legend(): CompetitionScheduleLegend | null {
        return this._legend;
    }

    set legend(value: CompetitionScheduleLegend | null) {
        this._legend = value;
    }

    get links(): CompetitionScheduleLinks {
        return this._links;
    }

    set links(value: CompetitionScheduleLinks) {
        this._links = value;
    }

    /**
     * Get the download schedule link, if it's available
     */
    get download_schedule_link(): string | null {
        if (this.links && typeof this.links.download_schedule==='string') {
            return this.links.download_schedule;
        }
        return null;
    }

    get admin_edit_schedule_link(): string | null {
        if (this.links && typeof this.links.admin_edit === 'string') {
            return this.links.admin_edit;
        }
        return null;
    }

    get unique_dates(): Date[] {
        return this._unique_dates;
    }

    private _buildRinkSchedules(rinks: Rink[], sessions: Session[]) {
        for (let i = 0; i < rinks.length; i++) {
            let rink = rinks[i];
            let rink_sessions = sessions.filter(function (session: Session) {
                return session.rink.id === rink.id;
            });
            this.rink_schedules.push(new RinkSchedule(rink, rink_sessions));
        }
    }
}