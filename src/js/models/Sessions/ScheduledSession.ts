import {Session} from "./Session";
import {ScheduleSessionArguments, SessionType} from "../../contracts/AppContracts";

export class ScheduledSession {
    public session: Session;
    public scheduled_as: SessionType;
    public scheduled_event_id: number;


    constructor(parameters: ScheduleSessionArguments) {
        let {session, scheduled_as, scheduled_event_id} = parameters;
        this.session = session;
        this.scheduled_as = scheduled_as;
        this.scheduled_event_id = scheduled_event_id;
    }

    get type_description() {
        if (['upi', 'opi'].indexOf(this.scheduled_as) !== -1) {
            return Session.parseTypeDescription(this.scheduled_as);
        }
        return this.session.type_description;
    }
}

