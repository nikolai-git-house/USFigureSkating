import {CreditRule, CreditRules, SkatingEvent} from "../models/SkatingEvent";
import {CreditConfigData, CreditPackageData, SkatingEventData} from "../contracts/data/DataContracts";
import {CreditPackage} from "../models/Credits/CreditPackage";

export class DefaultCreditRules {
    opi: CreditRule = new CreditRule("opi", 0, 0);
    upi: CreditRule = new CreditRule("upi", 0, 0);
    wu: CreditRule = new CreditRule("wu", 0, 0);
}

export class SkatingEventCreditConfigDataAdaptor {
    static adapt(raw_data: CreditConfigData[]) {
        let default_rules = new DefaultCreditRules();
        for (let i = 0; i < raw_data.length; i++) {
            let config = raw_data[i];
            default_rules[config.key] = new CreditRule(config.key, config.cost, config.limit);
        }
        return new CreditRules(default_rules.opi, default_rules.upi, default_rules.wu);
    }
}


export class SkatingEventDataAdaptor {

    static adaptCreditPackageData(raw_data: CreditPackageData): CreditPackage {
        return new CreditPackage({
            cost: raw_data.cost,
            limit: raw_data.limit,
            id: raw_data.id,
            event_id: raw_data.event_id,
            credits: raw_data.credits
        })
    }

    static adaptCreditPackageDataArray(raw_data: CreditPackageData[]): CreditPackage[] {
        if (raw_data && raw_data.length) {

            return raw_data.map(function (raw_datum: CreditPackageData) {
                return SkatingEventDataAdaptor.adaptCreditPackageData(raw_datum);
            });
        }
        return [];
    }

    static adapt(raw_data: SkatingEventData): SkatingEvent {
        return new SkatingEvent(
            raw_data.id,
            raw_data.name,
            raw_data.competition_id,
            SkatingEventCreditConfigDataAdaptor.adapt(raw_data.credit_config),
            SkatingEventDataAdaptor.adaptCreditPackageDataArray(raw_data.credit_packages)
        );
    }

    static adaptArray(raw_data: SkatingEventData[]): SkatingEvent[] {
        let result: SkatingEvent[] = [];
        for (let i = 0; i < raw_data.length; i++) {
            result.push(SkatingEventDataAdaptor.adapt(raw_data[i]));
        }
        return result;
    }
}