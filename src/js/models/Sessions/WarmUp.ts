/* eslint-disable */
import {Session} from "./Session";
import {WarmUpData} from "../../contracts/data/DataContracts";
import {SessionType, SessionTypeKey} from '../../contracts/AppContracts';

export class WarmUp extends Session {
    _type_description: string = "Warm Up (WU)";
    _type_key: SessionTypeKey = 'warm_up';
    protected _type_code: string = "WU";
    protected _credit_types: SessionType[] = ['wu'];

    constructor(session_data: WarmUpData) {
        super(session_data);
    }


}