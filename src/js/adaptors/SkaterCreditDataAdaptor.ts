import {SkaterCompetitionCreditData, SkaterEventCreditData} from "../contracts/data/DataContracts";
import {SkaterEventCredits} from "../models/Credits/SkaterEventCredits";
import {CreditsCollection} from "../models/Credits/CreditsCollection";
import {SkaterCredits} from "../models/Credits/SkaterCredits";

export class SkaterCreditDataAdaptor {
    static adaptEventCredits(raw_data: SkaterEventCreditData): SkaterEventCredits {
        let event_id = raw_data.event_id;
        let total_credits = raw_data.total;
        let scheduled_credits = raw_data.scheduled;
        return new SkaterEventCredits(event_id, new CreditsCollection(total_credits), new CreditsCollection(scheduled_credits));
    }

    static adaptCompetitionCredits(raw_data: SkaterCompetitionCreditData): SkaterCredits {
        let result: SkaterEventCredits[] = [];
        for (let i = 0; i < raw_data.event_credits.length; i++) {
            result.push(SkaterCreditDataAdaptor.adaptEventCredits(raw_data.event_credits[i]));
        }
        return new SkaterCredits(result, raw_data.purchased_package_ids);
    }
}