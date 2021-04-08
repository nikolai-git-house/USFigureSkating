import {SalesWindowKey} from "../contracts/AppContracts";


type SalesWindowParameters = {
    key: SalesWindowKey;
    name: string;
    start_datetime_timestamp: number;
    end_datetime_timestamp: number;
    start_datetime_formatted: string;
    end_datetime_formatted: string;
};

export class SalesWindow {
    private _name: string;
    private _start_datetime: Date;
    private _end_datetime: Date;
    private _start_time_formatted: string;
    private _end_time_formatted: string;
    private _key: SalesWindowKey;

    constructor(parameters: SalesWindowParameters) {
        let {key, name, start_datetime_timestamp, end_datetime_timestamp, start_datetime_formatted, end_datetime_formatted} = parameters;
        this._key = key;
        this._name = name;
        this._start_datetime = new Date(start_datetime_timestamp);
        this._end_datetime = new Date(end_datetime_timestamp);
        this._start_time_formatted = start_datetime_formatted;
        this._end_time_formatted = end_datetime_formatted;
    }

    get key(): SalesWindowKey {
        return this._key;
    }

    get end_time_formatted(): string {
        return this._end_time_formatted;
    }

    get start_time_formatted(): string {
        return this._start_time_formatted;
    }

    get is_passed(): boolean {
        return this._end_datetime < new Date();
    }

    get is_open(): boolean {
        let now = new Date();
        return this._start_datetime <= now && this._end_datetime > now;
    }

    get name(): string {
        return this._name;
    }

    get start_datetime(): Date {
        return this._start_datetime;
    }

    get end_datetime(): Date {
        return this._end_datetime;
    }
}