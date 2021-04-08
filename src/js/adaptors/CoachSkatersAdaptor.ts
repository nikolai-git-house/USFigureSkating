import {CoachSkaterData, CoachSkaterEventData} from "../contracts/data/DataContracts";
import {CoachSkater, CoachSkaterEvent} from "../contracts/AppContracts";

export class CoachSkatersAdaptor {
    /**
     * Adapt coach skater data into coach skater
     */
    static adapt(raw_data: CoachSkaterData): CoachSkater {
        return {
            id: raw_data.id,
            first_name: raw_data.first_name,
            last_name: raw_data.last_name,
            federation_letter_status: raw_data.federation_letter_status ? raw_data.federation_letter_status : false,
            events: CoachSkatersAdaptor.adaptEventArray(raw_data.events),
        }
    }

    /**
     * Adapt coach skater event data into coach skater event
     */
    static adaptEvent(raw_data: CoachSkaterEventData): CoachSkaterEvent {
        return {
            name: raw_data.name,
            coaching_role: raw_data.coaching_role,
            music_complete: raw_data.music_complete,
            ppc_complete: raw_data.ppc_complete,
            ppc_required: raw_data.ppc_required,
            music_required: raw_data.music_required,
        }
    }

    /**
     * Adapt array of coach skater data into array of coach skaters
     */
    static adaptArray(raw_data: CoachSkaterData[]): CoachSkater[] {
        let result = [];
        for (let i = 0; i < raw_data.length; i++) {
            result.push(CoachSkatersAdaptor.adapt(raw_data[i]));
        }
        return result;
    }

    /**
     * Adapt array of coach skater event data into array of coach skaters
     */
    static adaptEventArray(raw_data: CoachSkaterEventData[]): CoachSkaterEvent[] {
        let result = [];
        for (let i = 0; i < raw_data.length; i++) {
            result.push(CoachSkatersAdaptor.adaptEvent(raw_data[i]));
        }
        return result;
    }


}