/* eslint-disable */
import {SessionTypeKey} from '../../contracts/AppContracts';
import {Session} from "./Session";
import {EventSessionData} from "../../contracts/data/DataContracts";

export class SkatingEventSession extends Session {
    _type_description: string = "";
    _type_key: SessionTypeKey = 'event';
    _is_event = true;
    _icon_color?: string;
    protected event_type: string = "";

    constructor(session_data: EventSessionData) {
        super(session_data);
        this.event_type = session_data.event_type;
        if (session_data.icon_color) {
            this._icon_color = session_data.icon_color
        }
    }

    get icon_class() {
        return "session__icon--" + this.event_type.toLowerCase();
    }

    get icon_style_override() {
        if (!this._icon_color) {
            return;
        }
        return "background-color:" + this._icon_color + ";";
    }

}