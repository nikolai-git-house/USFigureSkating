import {CompetitionContactData} from "../contracts/data/DataContracts";
import {CompetitionContact} from "../contracts/AppContracts";

export class CompetitionContactDataAdaptor {
    static adapt(raw_data: CompetitionContactData): CompetitionContact {
        return {
            name: raw_data.name,
            role: raw_data.role,
            email: raw_data.email
        };
    }

    static adaptArray(raw_data: CompetitionContactData[]): CompetitionContact[] {
        let results: CompetitionContact[] = [];
        for (let i = 0; i < raw_data.length; i++) {
            results.push(CompetitionContactDataAdaptor.adapt(raw_data[i]));
        }
        return results;
    }
}