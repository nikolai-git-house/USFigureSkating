import {SkaterCoachedEventCategoryData, SkaterEventCoachData, SkaterEventData} from "../contracts/data/DataContracts";
import {SkatingEvent} from "../models/SkatingEvent";
import {SkaterEventCategoryCoach} from "../contracts/AppContracts";
import {SkaterCoachedEventCategory} from "../models/SkaterCoachedEventCategory";

export class SkaterEventDataAdaptor {
    static adapt(raw_data: SkaterEventData): SkatingEvent {
        return new SkatingEvent(raw_data.id, raw_data.name, raw_data.competition_id);
    }

    static adaptArray(raw_data: SkaterEventData[]): SkatingEvent[] {
        let result: SkatingEvent[] = [];
        for (let i = 0; i < raw_data.length; i++) {
            result.push(SkaterEventDataAdaptor.adapt(raw_data[i]));
        }
        return result;
    }

    static adaptCoachedEvent(raw_data: SkaterCoachedEventCategoryData): SkaterCoachedEventCategory {
        return new SkaterCoachedEventCategory({
            id: raw_data.id,
            name: raw_data.name,
            coach_limit: raw_data.coach_limit,
            coaches: SkaterEventDataAdaptor.adaptEventCoachArray(raw_data.coaches)
        });
    }

    static adaptEventCoach(raw_data: SkaterEventCoachData): SkaterEventCategoryCoach {
        return {
            id: raw_data.id,
            first_name: raw_data.first_name,
            last_name: raw_data.last_name,
            ineligible: raw_data.ineligible,
        }
    }

    static adaptEventCoachArray(raw_data: SkaterEventCoachData[]): SkaterEventCategoryCoach[] {
        let result: SkaterEventCategoryCoach[] = [];
        for (let i = 0; i < raw_data.length; i++) {
            let obj = raw_data[i];
            result.push(SkaterEventDataAdaptor.adaptEventCoach(obj));
        }
        return result;
    }

    static adaptCoachedEventArray(raw_data: SkaterCoachedEventCategoryData[]): SkaterCoachedEventCategory[] {
        let result: SkaterCoachedEventCategory[] = [];
        for (let i = 0; i < raw_data.length; i++) {
            let obj = raw_data[i];
            result.push(SkaterEventDataAdaptor.adaptCoachedEvent(obj));
        }
        return result;
    }

}
