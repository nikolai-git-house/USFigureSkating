import {BillingPaymentState, BillingPaymentStateParameters} from "./BillingPaymentState";
import {CREDIT_CARD_GAP_SEPARATOR} from "../config/AppConfig";

export type CreditCardParams = {
    number: number;
    cvc: number;
    expiration_month: number;
    expiration_year: number;
    type: string;
    type_formatted: string;
    number_formatted: string;
};


export class CreditCard {
    number: number;
    cvc: number;
    expiration_month: number;
    expiration_year: number;
    type: string;
    type_formatted: string;
    number_formatted: string;


    constructor(parameters: CreditCardParams) {
        let {type, type_formatted, number_formatted, number, cvc, expiration_month, expiration_year} = parameters;
        this.number = number;
        this.cvc = cvc;
        this.expiration_month = expiration_month;
        this.expiration_year = expiration_year;
        this.type = type;
        this.type_formatted = type_formatted;
        this.number_formatted = number_formatted;
    }

    get expiration_formatted(): string {
        let year = String(this.expiration_year).slice(2);
        let month = String(this.expiration_month);
        if (this.expiration_month < 10) {
            month = "0" + month;
        }
        return month + "/" + year;
    }

    get masked() {
        let split = this.number_formatted.split(CREDIT_CARD_GAP_SEPARATOR);
        return split.reduce(function (result, element, index) {
            if (index < split.length - 1) {
                result += element.replace(/./g, "X") + CREDIT_CARD_GAP_SEPARATOR;
                return result;
            }
            result += element;
            return result;
        }, "");
    }

    get last_group() {
        let split = this.number_formatted.split(CREDIT_CARD_GAP_SEPARATOR);
        return split[split.length - 1];
    }

    static createFromBillingState(payent_state: BillingPaymentState): CreditCard {
        return new CreditCard(payent_state.export())
    }

    extract_state(): BillingPaymentStateParameters {
        return {
            expiration_month: this.expiration_month,
            expiration_year: this.expiration_year,
            number_formatted: this.number_formatted,
            type: this.type,
            type_formatted: this.type_formatted,
            card_number: this.number,
            cvc: this.cvc,
        }
    }
}