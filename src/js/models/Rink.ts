import {Facility} from "./Facility";

export class Rink {
    private _facility: Facility;
    private _name: string;
    private _full_name: string;
    private _id: number;

    constructor(name: string, facility: Facility, id: number) {
        this._name = name;
        this._facility = facility;
        this._id = id;
        this._full_name = name + " - " + facility.name;
    }

    get facility(): Facility {
        return this._facility;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get full_name(): string {
        return this._full_name;
    }

}