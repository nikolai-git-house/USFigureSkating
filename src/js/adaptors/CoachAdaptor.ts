import {CoachResult} from "../contracts/AppContracts";
import {CoachResultData} from "../contracts/data/DataContracts";

export class CoachAdaptor {
    static adaptCoachResult(raw_data: CoachResultData): CoachResult {
        return {
            club_name: raw_data.club_name,
            first_name: raw_data.first_name,
            id: raw_data.id,
            ineligible: raw_data.ineligible,
            last_name: raw_data.last_name,
            member_number: parseInt(raw_data.member_number),
            state_abbreviation: raw_data.state_abbreviation,
        }
    }

    static adaptCoachResultArray(raw_data: CoachResultData[]): CoachResult[] {
        return raw_data.map(function (item: CoachResultData) {
            return CoachAdaptor.adaptCoachResult(item);
        })
    }
}