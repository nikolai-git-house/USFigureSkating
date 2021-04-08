import {RinkData, RinkDataComplete} from "../contracts/data/DataContracts";
import {Facility} from "../models/Facility";
import {Rink} from "../models/Rink";
import {FacililtyDataAdaptor} from "./FacilityDataAdaptor";

export class RinkDataAdaptor {
    static adapt(raw_data: RinkData, facility: Facility): Rink {
        return new Rink(raw_data.name, facility, raw_data.id);
    }

    static adaptFull(raw_data: RinkDataComplete): Rink {
        let facility = FacililtyDataAdaptor.adapt(raw_data.facility);
        return RinkDataAdaptor.adapt(raw_data, facility);
    }

    static adaptFullArray(raw_data: RinkDataComplete[]): Rink[] {
        let result: Rink[] = [];
        for (let i = 0; i < raw_data.length; i++) {
            let rink = RinkDataAdaptor.adaptFull(raw_data[i]);
            result.push(rink);
        }
        return result;
    }

}