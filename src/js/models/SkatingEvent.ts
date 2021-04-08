import {CreditState, SessionType} from "../contracts/AppContracts";
import {CreditPackage} from "./Credits/CreditPackage";

export interface CreditRuleContract {
    key: SessionType;
    cost: number;
    limit: number;
}

export class CreditRule implements CreditRuleContract {
    key: SessionType;
    cost: number;
    limit: number;
    name: string;

    constructor(key: SessionType, cost?: number, limit?: number) {
        this.key = key;
        this.cost = cost ? cost : 0;
        this.limit = limit ? limit : 0;
        this.name = key.toUpperCase();
    }
}

export class CreditRules {
    [key: string]: CreditRule;
    opi: CreditRule;
    upi: CreditRule;
    wu: CreditRule;

    constructor(opi: CreditRule, upi: CreditRule, wu: CreditRule) {
        this.opi = opi;
        this.upi = upi;
        this.wu = wu;
    }

}


export class SkatingEvent {
    id: number;
    name: string;
    competition_id: number;
    /**
     * All credit rules
     */
    credit_rules?: CreditRules;
    /**
     * Credit rules that have a limit above 0
     */
    private _available_credit_types: CreditRule[] = [];

    credit_packages: CreditPackage[] = [];

    constructor(id: number, name: string, competition_id: number, credit_rules?: CreditRules, credit_packages?: CreditPackage[]) {
        this.id = id;
        this.name = name;
        this.competition_id = competition_id;
        this.credit_rules = credit_rules;
        if (credit_rules) {
            for (let i in credit_rules) {
                let credit_rule = credit_rules[i];
                if (credit_rule.limit > 0) {
                    this._available_credit_types.push(credit_rule);
                }
            }
        }
        if (credit_packages) {
            this.credit_packages = credit_packages;
        }
    }

    get available_credit_types(): CreditRule[] {
        return this._available_credit_types;
    }

    getTypeLimit(type: SessionType): number {
        if (!this.credit_rules) {
            return 0;
        }
        return this.credit_rules[type].limit;
    }

    getTypeCost(type: SessionType): number {
        if (!this.credit_rules) {
            return 0;
        }
        return this.credit_rules[type].cost;
    }

    getCreditRules(limit_types?: SessionType[]): CreditRule[] {
        if (!limit_types) {
            limit_types = ['opi', 'upi', 'wu'];
        }
        let result = [];
        if (this.credit_rules) {
            for (let type_key in this.credit_rules) {
                if (limit_types.indexOf(type_key as SessionType) !== -1) {
                    result.push(this.credit_rules[type_key]);
                }

            }
        }
        return result;

    }

    /**
     * Get the event-configured session type limits
     */
    getCreditLimits(): CreditState {
        let result: CreditState = {
            opi: 0,
            upi: 0,
            wu: 0
        };
        for (let credit_type in result) {
            result[credit_type] = this.getTypeLimit(credit_type as SessionType);
        }
        return result;

    }
}