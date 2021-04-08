import {CreditList, NullableCreditList} from "../../contracts/AppContracts";
import {NullableCreditListCreditListAdaptor} from "../../adaptors/NullableCreditListCreditListAdaptor";

type CreditPackageParams = {
    cost: number
    limit: number
    id: number
    event_id: number
    credits: NullableCreditList
};

export class CreditPackage {
    cost: number;
    name: string;
    //@refactor: remove limit prop
    limit: number = 1;
    id: number;
    event_id: number;
    credits: CreditList;


    constructor(parameters: CreditPackageParams) {
        let {cost, limit, id, event_id} = parameters;
        this.cost = cost;
        // this.limit = limit;
        this.id = id;
        this.event_id = event_id;
        this.credits = NullableCreditListCreditListAdaptor.adapt(parameters.credits);
        this.name = this._parseName(this.credits);
    }

    private _parseName(credits: CreditList) {
        let components = [];
        for (let i in credits) {
            let credit = credits[i];
            if (credit > 0) {
                components.push(i.toUpperCase() + ":" + credit);
            }
        }
        return components.join('/');
    }

    get summary(): string {
        let result = "(";
        let components = [];
        for (let i in this.credits) {
            let credit = this.credits[i];
            if (credit > 0) {
                components.push(i.toUpperCase() + ":" + credit);
            }
        }
        result += components.join(', ');
        result += ")";
        result += ": $" + this.cost;
        return result
    }

}
