import {CreditState, EventCreditList, IndexedEventCreditList} from "../../contracts/AppContracts";
import {CartCredit} from "./CartCredit";

export class CartCreditCollection {
    cart_credits: CartCredit[] = [];


    constructor(init_credits?: CartCredit[]) {
        this.cart_credits = init_credits ? init_credits : [];
    }

    credit_count(): number {
        let total = 0;
        for (let i = 0; i < this.cart_credits.length; i++) {
            total += this.cart_credits[i].amount;
        }
        return total;
    }

    count() {
        return this.cart_credits.length;
    }

    add(credit: CartCredit) {
        this.cart_credits.push(credit);
    }

    remove(credit: CartCredit) {
        for (let i = 0; i < this.cart_credits.length; i++) {
            let cart_credit = this.cart_credits[i];
            let unit_cost = cart_credit.cost / cart_credit.amount;
            if (cart_credit.event_id == credit.event_id && cart_credit.credit_type == credit.credit_type && cart_credit.amount > 0) {
                cart_credit.amount--;
                cart_credit.cost -= unit_cost;
                return;
            }
        }
    }

    public eventId(event_id: number): CartCreditCollection {
        return new CartCreditCollection(this.cart_credits.filter(function (cart_credit: CartCredit) {
            return cart_credit.event_id === event_id;
        }));
    }

    public getReport(): IndexedEventCreditList {

        let credits: { [key: number]: EventCreditList } = {};

        return this.cart_credits.reduce(function (accumulator, credit: CartCredit) {
            if (!accumulator.hasOwnProperty(String(credit.event_id))) {
                accumulator[credit.event_id] = {
                    event_id: credit.event_id,
                    opi: 0,
                    upi: 0,
                    wu: 0
                };
            }
            accumulator[credit.event_id][credit.credit_type] += credit.amount;
            return accumulator
        }, credits)
    }

    getEventReport(event_id: number): CreditState {
        let result: CreditState = {
            opi: 0,
            upi: 0,
            wu: 0
        };
        let event_credits = this.eventId(event_id);
        if (event_credits.count() === 0) {
            return result;
        }
        let temp = {...event_credits.getReport()[event_id]};
        delete temp['event_id'];
        return temp;
    }

    public export(): CartCredit[] {
        return this.cart_credits.reduce(function (accumulator: CartCredit[], cart_credit) {
            let credit_single_cost = cart_credit.cost / cart_credit.amount;
            for (let i = 0; i < cart_credit.amount; i++) {
                accumulator.push({
                    ...cart_credit,
                    cost: credit_single_cost,
                    amount: 1
                })
            }
            return accumulator;
        }, [])
    }


}