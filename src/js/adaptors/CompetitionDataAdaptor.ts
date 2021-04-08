import {CompetitionData} from "../contracts/data/DataContracts";
import {Competition} from "../models/Competition/Competition";

export class CompetitionDataAdaptor {
    static adapt(raw_data: CompetitionData): Competition {

        raw_data.end_date = raw_data.end_date * 1000; //account for difference in javascript timestamp length
        raw_data.start_date = raw_data.start_date * 1000;//account for difference in javascript timestamp length
        return new Competition(raw_data);
    }

    static adaptArray(raw_data: CompetitionData[]): Competition[] {
        let results: Competition[] = [];
        for (let i = 0; i < raw_data.length; i++) {
            results.push(CompetitionDataAdaptor.adapt(raw_data[i]));
        }
        return results;
    }
}