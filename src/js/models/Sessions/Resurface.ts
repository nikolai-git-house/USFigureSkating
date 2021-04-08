/* eslint-disable */
import {SessionTypeKey} from '../../contracts/AppContracts';
import {Session} from "./Session";
import {SessionData} from "../../contracts/data/DataContracts";

export class Resurface extends Session {
    _type_description: string = "Resurface";
    name = "Ice Resurface";
    _type_key: SessionTypeKey = 'resurface';
    _is_resurface = true;

    constructor(session_data: SessionData) {
        super(session_data);
    }
}