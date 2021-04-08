import {IndexedEventCreditList, SessionType, StagingCartAddPayload} from "../../contracts/AppContracts";
import {CreditPackage} from "../Credits/CreditPackage";
import {CartCreditPackage} from "./CartCreditPackage";
import {CartCredit} from "./CartCredit";

type StagingCartEventCredits = {

    [key: number]: {// the event id
        [key: string]: { // the credit type
            cost: number,
            amount: number,
            competition_name: string,
            event_name: string,
            event_id: number,
            competition_id: number
        }
    }
};

export class StagingCartCredits {
    credits: StagingCartEventCredits = {};
    total_cost: number = 0;
    packages: CartCreditPackage[] = [];

    get credit_cost(): number {
        let start = 0;
        for (let i in this.credits) {
            let event_credits = this.credits[i];
            for (let i in event_credits) {
                let event_credit = event_credits[i];
                start += event_credit.cost;
            }
        }
        return start;
    }

    get package_cost(): number {
        let start: number = 0;
        return this.packages.reduce(function (accumulator: number, credit_package: CartCreditPackage) {
            accumulator += credit_package.cost;
            return accumulator;
        }, start)
    }

    add(parameters: StagingCartAddPayload): void {
        let {event_id, credit_config, amount} = parameters;
        if (!this.credits.hasOwnProperty(String(event_id))) {
            this.credits[event_id] = {};
        }
        if (!this.credits[event_id].hasOwnProperty(credit_config.key)) {
            this.credits[event_id][credit_config.key] = {
                cost: 0,
                amount: 0,
                competition_name: parameters.competition_name,
                event_name: parameters.event_name,
                event_id: parameters.event_id,
                competition_id: parameters.competition_id
            }
        }
        this.credits[event_id][credit_config.key].amount = amount;
        this.credits[event_id][credit_config.key].cost = credit_config.cost * this.credits[event_id][credit_config.key].amount;
        this.updateCost();
    }

    addPackage(cart_credit_package: CartCreditPackage): void {
        this.packages.push(cart_credit_package);
        this.total_cost += cart_credit_package.cost;
    }

    removePackage(parameters: CreditPackage): void {
        for (let i = 0; i < this.packages.length; i++) {
            let credit_package = this.packages[i];
            if (credit_package.id === parameters.id) {
                this.packages.splice(i, 1);
                this.total_cost -= credit_package.cost;
                return;
            }
        }
    }

    updateCost(): void {
        this.total_cost = this.credit_cost + this.package_cost;
    }

    export(): CartCredit[] {
        let result = [];
        for (let j in this.credits) {
            let event_credits = this.credits[j];
            for (let credit_key in event_credits) {
                let event_credit = event_credits[credit_key];
                if (event_credit.amount && event_credit.cost) {
                    result.push(new CartCredit({
                        event_id: parseInt(j),
                        credit_type: credit_key as SessionType,
                        amount: event_credit.amount,
                        cost: event_credit.cost,
                        competition_id: event_credit.competition_id,
                        event_name: event_credit.event_name,
                        competition_name: event_credit.competition_name,
                    }));
                }
            }
        }
        return result;
    }

    exportPackages(): CartCreditPackage[] {
        return this.packages;
    }

    clear(): void {
        for (let j in this.credits) {
            let event_credits = this.credits[j];
            for (let i in event_credits) {
                let event_credit = event_credits[i];
                event_credit.amount = 0;
                event_credit.cost = 0;
            }
        }
        this.packages.splice(0);
        this.total_cost = 0;
    }

    /**
     * Get an IndexedEventCreditList outlining all the credits in the staging cart for packages
     */
    packageReport(): IndexedEventCreditList | null {
        if (this.packages.length <= 0) {
            return null;
        }
        let source: IndexedEventCreditList = {};
        return this.packages.reduce(function (accumulator, credit_package: CartCreditPackage) {
            if (!accumulator.hasOwnProperty(String(credit_package.event_id))) {
                accumulator[credit_package.event_id] = {
                    event_id: credit_package.event_id,
                    opi: 0,
                    upi: 0,
                    wu: 0
                };
            }
            accumulator[credit_package.event_id].opi += credit_package.credits.opi;
            accumulator[credit_package.event_id].upi += credit_package.credits.upi;
            accumulator[credit_package.event_id].wu += credit_package.credits.wu;
            return accumulator;
        }, source)
    }
}