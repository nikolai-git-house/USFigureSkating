import {DateFormat} from "../../helpers/time";
import {CompetitionInformation} from "./CompetitionInformation";
import {CompetitionSchedule} from "./CompetitionSchedule";
import {CompetitionData} from "../../contracts/data/DataContracts";
import {CompetitionHeadingSource} from "../../contracts/AppContracts";


export class Competition implements CompetitionHeadingSource {
    public id: number;
    public name: string;
    private start_date: Date;
    private end_date: Date;
    public icon: string;
    public start_date_pretty: string;
    public end_date_pretty: string;
    private _detail_link: string;
    private _schedule_link: string;
    private _information_link: string;
    private _practice_ice_link: string;
    private _schedule_available: boolean;
    private _practice_ice_available: boolean;
    private _active_sales_window: string;
    private _contacts_link: string;
    private _my_skaters_link: string;
    private _my_coaches_link: string;
    private _music_and_ppc_link: string;
    private _coach_competition_schedule_link: string;
    private _coach_schedule_link: string;
    private competition_information: CompetitionInformation | {} = {};
    private schedule: CompetitionSchedule | {} = {};
    private _directions?: { location_name: string; link: string }[];
    private _announcement_url?: string;
    private _website_url?: string;

    constructor(data: CompetitionData) {
        this.name = data.name;
        this.start_date = new Date(data.start_date);
        this.end_date = new Date(data.end_date);
        this.id = data.id;
        this.icon = data.icon;
        this._schedule_available = data.schedule_available;
        this._practice_ice_available = data.practice_ice_available;
        this._active_sales_window = data.active_sales_window;
        this._directions = data.directions;
        this._announcement_url = data.announcement_url;
        this._website_url = data.website_url;
        this.start_date_pretty = DateFormat(this.start_date);
        this.end_date_pretty = DateFormat(this.end_date);
        this._detail_link = this._parseDetailLink();
        this._schedule_link = this._parseScheduleLink();
        this._information_link = this._parseInfoLink();
        this._practice_ice_link = this._parsePracticeIceLink();
        this._contacts_link = this._parseContactsLink();
        this._my_skaters_link = this._parseMySkatersLink();
        this._my_coaches_link = this._parseMyCoachesLink();
        this._music_and_ppc_link = this._parseMusicAndPPCLink();
        this._coach_competition_schedule_link = this._parseCoachCompetitionScheduleLink();
        this._coach_schedule_link = this._parseCoachScheduleLink();
    }

    get coach_schedule_link(): string {
        return this._coach_schedule_link;
    }

    get coach_competition_schedule_link(): string {
        return this._coach_competition_schedule_link;
    }

    get music_and_ppc_link(): string {
        return this._music_and_ppc_link;
    }

    get active_sales_window(): string {
        return this._active_sales_window;
    }

    get detail_link(): string {
        return this._detail_link;
    }

    get schedule_link(): string {
        return this._schedule_link;
    }

    get information_link(): string {
        return this._information_link;
    }

    get practice_ice_link(): string {
        return this._practice_ice_link;
    }

    get contacts_link(): string {
        return this._contacts_link;
    }

    get my_skaters_link(): string {
        return this._my_skaters_link;
    }

    get my_coaches_link(): string {
        return this._my_coaches_link;
    }

    get practice_ice_available(): boolean {
        return this._practice_ice_available;
    }

    get schedule_available(): boolean {
        return this._schedule_available;
    }

    get directions(): { location_name: string; link: string }[] {
        return this._directions || [];
    }

    get announcement_url(): string | null {
        return this._announcement_url || null;
    }

    get website_url(): string | null {
        return this._website_url || null;
    }

    public setInformation(information: CompetitionInformation) {
        this.competition_information = information;
    }

    public setSchedule(schedule: CompetitionSchedule) {
        this.schedule = schedule;
    }

    private _parsePracticeIceLink() {
        if (this.active_sales_window === "pre_purchase") {
            return "/pages/practice-ice-pre-purchase?id=" + this.id;
        }
        return "/pages/practice-ice-schedule?id=" + this.id;
    }

    private _parseInfoLink() {
        return "/pages/competition-information?id=" + this.id;
    }

    private _parseDetailLink(): string {
        return "/CompetitionProfile/Index?id=" + this.id;
    }

    private _parseScheduleLink(): string {
        return "/pages/my-schedule?id=" + this.id;
    }

    private _parseContactsLink() {
        return "/pages/competition-contacts?id=" + this.id;
    }

    private _parseMySkatersLink(): string {
        return "/pages/my-skaters?id=" + this.id;
    }

    private _parseMyCoachesLink() {
        return "/pages/my-coaches?id=" + this.id;
    }

    private _parseMusicAndPPCLink() {
        return "/pages/music-and-ppc?id=" + this.id;
    }

    private _parseCoachCompetitionScheduleLink() {
        return "/pages/coach-competition-schedule?id=" + this.id;
    }

    private _parseCoachScheduleLink() {
        return "/pages/coach-schedule?id=" + this.id;
    }
}