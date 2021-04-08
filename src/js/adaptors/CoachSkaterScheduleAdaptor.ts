import {CoachSkatersSchedule, SkaterSessionMap} from "../models/Schedule/CoachSkatersSchedule";
import {SessionData} from "../contracts/data/DataContracts";
import {SessionCollection} from "../models/Collections/SessionCollection";
import {SessionDataAdaptor} from "./SessionDataAdaptor";

export class CoachSkaterScheduleAdaptor {
    static adapt(sessions_data: SessionData[], skater_session_map: SkaterSessionMap): CoachSkatersSchedule {
        return new CoachSkatersSchedule(
            new SessionCollection(
                SessionDataAdaptor.adaptArray(sessions_data)
            ),
            skater_session_map
        );
    }
}