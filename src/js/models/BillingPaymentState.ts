import {CreditCardParams} from "./CreditCard";


export type BillingPaymentStateParameters = {
    [key: string]: string | number | undefined;
    expiration_month?: number;
    expiration_year?: number;
    number_formatted?: string;
    type?: string;
    type_formatted?: string;
    card_number?: number;
    cvc?: number;
};

/**
 * Class for managing the in-progress creation/editing of a BillingAddress
 */
export class BillingPaymentState {
    [key: string]: string | number | boolean | null | Function;

    expiration_month: null | number = null;
    expiration_year: null | number = null;
    number_formatted: string | null = null;
    type: string | null = null;
    type_formatted?: any;
    card_number: null | number = null;
    cvc: null | number = null;

    constructor(parameters?: BillingPaymentStateParameters) {
        if (!parameters) {
            return;
        }
        for (let i in parameters) {
            let param = parameters[i] ? parameters[i] : null;
            if (param === undefined) {
                param = null;
            }
            this[i] = param;
        }
    }


    export(): CreditCardParams {
        return {
            number: this.card_number ? this.card_number : -1,
            cvc: this.cvc ? this.cvc : -1,
            expiration_month: this.expiration_month ? this.expiration_month : -1,
            expiration_year: this.expiration_year ? this.expiration_year : -1,
            number_formatted: this.number_formatted ? this.number_formatted : "",
            type: this.type ? this.type : "",
            type_formatted: this.type_formatted ? this.type_formatted : "",
        }
    }


}