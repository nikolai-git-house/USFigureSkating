import {SalesWindowData} from "../contracts/data/DataContracts";
import {SalesWindow} from "../models/SalesWindow";

export class SalesWindowDataAdaptor {
    static adapt(raw_data: SalesWindowData): SalesWindow {
        return new SalesWindow({
            ...raw_data,
            start_datetime_timestamp: raw_data.start_datetime_timestamp * 1000,
            end_datetime_timestamp: raw_data.end_datetime_timestamp * 1000,

        });
    }

    static adaptArray(raw_data: SalesWindowData[]): SalesWindow[] {
        let result: SalesWindow[] = [];
        for (let i = 0; i < raw_data.length; i++) {
            result.push(SalesWindowDataAdaptor.adapt(raw_data[i]));
        }
        return result;
    }
}