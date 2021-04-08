/* eslint-disable */
import {Rink} from "../Rink";

import {meridian, prettyTime} from "../../helpers/time";
import {SessionData} from "../../contracts/data/DataContracts";
import {RinkDataAdaptor} from "../../adaptors/RinkDataAdaptor";
import {SessionLike, SessionType, SessionTypeKey} from '../../contracts/AppContracts';

export abstract class Session implements SessionLike {
    get location(): string {
        return this._location;
    }

    private _id: number;
    protected name: string;
    protected slots_registered: number = 0;
    protected slots_available: number = 0;
    private _event_ids: number[];
    protected _is_event: boolean = false;
    protected abstract _type_key: SessionTypeKey;
    protected abstract _type_description: string;
    protected _time_start: Date;
    protected _is_resurface: boolean = false;
    protected _pretty_time_end: string;
    protected _pretty_time_start: string;
    protected _credit_types: SessionType[] = [];
    protected _type_code?: string;
    private _facility_name: string;
    private _date: Date;
    private _time_end: Date;
    private _time_start_meridian: string;
    private _time_end_meridian: string;
    private _rink: Rink;
    private _location: string = "";


    private _cost: number = 0;


    constructor(session_data: SessionData, rink?: Rink) {
        this.name = session_data.name;
        this._id = session_data.id;
        this._date = new Date(session_data.date);
        this._time_start = new Date(session_data.time_start);
        this._time_end = new Date(session_data.time_end);
        this.slots_registered = session_data.slots_registered;
        this.slots_available = session_data.slots_available;
        this._pretty_time_start = prettyTime(this._time_start);
        this._time_start_meridian = meridian(this._time_start);
        this._time_end_meridian = meridian(this._time_end);
        this._pretty_time_end = prettyTime(this._time_end);
        this._rink = this._importRink(session_data, rink);
        this._facility_name = this._rink.facility.name;
        this._event_ids = session_data.event_ids;
        if (session_data.location) {
            this._location = session_data.location;
        }
    }

    get type_description(): string {
        return this._type_description;
    }

    get event_ids(): number[] {
        return this._event_ids;
    }

    get facility_name(): string {
        return this._facility_name;
    }

    get is_event(): boolean {
        return this._is_event;
    }

    get id(): number {
        return this._id;
    }

    get type_code(): string {
        return this._type_code ? this._type_code : '';
    }

    get is_full(): boolean {
        return this.slots_registered >= this.slots_available;
    }

    get is_available(): boolean {
        return !this.is_full;
    }


    get type_key(): SessionTypeKey {
        return this._type_key;
    }

    get date(): Date {
        return this._date;
    }

    get time_start(): Date {
        return this._time_start;
    }

    get time_end(): Date {
        return this._time_end;
    }

    get time_start_meridian(): string {
        return this._time_start_meridian;
    }

    get time_end_meridian(): string {
        return this._time_end_meridian;
    }

    get is_resurface(): boolean {
        return this._is_resurface;
    }

    get pretty_time_end(): string {
        return this._pretty_time_end;
    }

    get pretty_time_start(): string {
        return this._pretty_time_start;
    }

    get credit_types(): SessionType[] {
        return this._credit_types;
    }

    get rink(): Rink {
        return this._rink;
    }

    get cost(): number {
        return this._cost;
    }

    get full_location(): string {
        let result = this.rink.name;
        if (this._location !== "") {
            result += " - " + this._location;
        }
        return result;
    }

    /**
     * @refactor: investigate and refactor/remove
     * Data should be adapted on the adaptor layer, not within the model layer
     */
    private _importRink(session_data: SessionData, rink: Rink | undefined) {
        if (rink) {
            return rink;
        }
        return RinkDataAdaptor.adaptFull(session_data.rink);
    }

    static parseTypeDescription(type: SessionType) {
        if (type === "upi") {
            return "Unofficial Practice Ice (UPI)";
        }
        if (type === "opi") {
            return "Official Practice Ice (OPI)";
        }
        if (type === "wu") {
            return "Warm Up (WU)";
        }
        return "";
    }
}