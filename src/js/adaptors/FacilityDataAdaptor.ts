import {FacilityData} from "../contracts/data/DataContracts";
import {Facility} from "../models/Facility";

export class FacililtyDataAdaptor {
    static adapt(raw_data: FacilityData): Facility {
        return new Facility(raw_data.name, raw_data.id);
    }

    static adaptArray(raw_data: FacilityData[]): Facility[] {
        let result: Facility[] = [];
        for (let i = 0; i < raw_data.length; i++) {
            let facility = FacililtyDataAdaptor.adapt(raw_data[i]);
            result.push(facility);
        }
        return result;
    }
}