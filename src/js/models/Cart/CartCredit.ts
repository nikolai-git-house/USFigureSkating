import {CartCreditInterface, SessionType} from "../../contracts/AppContracts";
import {CartItemContract} from "../../contracts/CartItemContract";
import {CartItemTypeKey} from "../../contracts/CartItemContract";

type CartCreditParams = {
    competition_id: number
    event_name: string
    competition_name: string
    event_id: number
    credit_type: SessionType
    amount: number
    cost: number
};

export class CartCredit implements CartCreditInterface, CartItemContract {
    cart_description: string;
    competition_id: number;
    cart_item_type_key: CartItemTypeKey = "credit";
    event_name: string;
    competition_name: string;
    event_id: number;
    credit_type: SessionType;
    amount: number;
    cost: number;


    constructor(parameters: CartCreditParams) {
        let {competition_id, event_name, competition_name, event_id, credit_type, amount, cost} = parameters;
        this.competition_id = competition_id;
        this.event_name = event_name;
        this.competition_name = competition_name;
        this.event_id = event_id;
        this.credit_type = credit_type;
        this.amount = amount;
        this.cost = cost;
        this.cart_description = this.credit_type.toUpperCase() + " Credit"
    }

}