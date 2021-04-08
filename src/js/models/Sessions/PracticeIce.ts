/* eslint-disable */
import {Session} from "./Session";
import {PracticeIceData} from "../../contracts/data/DataContracts";
import {SessionType, SessionTypeKey} from '../../contracts/AppContracts';

export class PracticeIce extends Session {
    protected _type_description: string;
    protected _type_key: SessionTypeKey = 'practice_ice';
    protected _type_code: string;
    private _types: SessionType[];

    constructor(session_data: PracticeIceData) {
        super(session_data);
        this._types = session_data.practice_ice_types;
        this._type_code = this._types.join('/').toUpperCase();
        this._credit_types = this._types;
        this._type_description = this.importTypeDescription()
    }

    private importTypeDescription() {
        if (this._types.length === 1) {
            return PracticeIce.parseTypeDescription(this._types[0]);
        }
        return "Practice Ice (" + this._type_code + ")";
    }


    get types(): string[] {
        return this._types;
    }
}