import {EventCreditConfig, EventCreditList, IndexedEventCreditList} from "../contracts/AppContracts";

export class CreditsAdaptor {
    /**
     * Transform a EventCreditConfig array into an IndexedEventCreditList
     */
    static adaptEventCreditConfigArrayIndexedEventCreditList(config_array: EventCreditConfig[]): IndexedEventCreditList {
        let result: IndexedEventCreditList = {};
        for (let i = 0; i < config_array.length; i++) {
            let event_credit_config: EventCreditConfig = config_array[i];
            let event_id = event_credit_config.event.id;
            if (!result.hasOwnProperty(String(event_id))) {
                result[event_id] = {
                    event_id: event_id,
                    opi: 0,
                    upi: 0,
                    wu: 0
                };
            }
            for (let j = 0; j < event_credit_config.purchasable_credits.length; j++) {
                let obj = event_credit_config.purchasable_credits[j];
                result[event_id][obj.key] = obj.limit;
            }
        }
        return result;

    }

    /**
     * Take an IndexedEventCreditList, then reduce its credit counts by those of another
     */
    static reduceIndexedEventCreditList(base: IndexedEventCreditList, reducor: IndexedEventCreditList) {
        let result: IndexedEventCreditList = {};
        for (let i in base) {
            let event_credit_list = base[i];
            let reduced_event_credit_list: EventCreditList = {
                ...event_credit_list
            };
            if (reducor.hasOwnProperty(String(event_credit_list.event_id))) {
                let package_report_event: EventCreditList = reducor[event_credit_list.event_id];
                reduced_event_credit_list.opi -= package_report_event.opi;
                reduced_event_credit_list.upi -= package_report_event.upi;
                reduced_event_credit_list.wu -= package_report_event.wu;
            }
            result[i] = reduced_event_credit_list;
        }
        return result;

    }


}