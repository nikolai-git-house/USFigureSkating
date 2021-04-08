import {CreditList} from "../../contracts/AppContracts";
import {CartItemContract, CartItemTypeKey} from "../../contracts/CartItemContract";


export interface CartCreditPackageParameters {
    [key: string]: number | string | CartItemTypeKey | undefined | CreditList;

    cost: number,
    competition_id: number,
    competition_name: string,
    event_id: number,
    event_name: string,
    id: number;
    name: string;
    credits: CreditList;
}


export class CartCreditPackage implements CartItemContract {
    [key: string]: number | string | CartItemTypeKey | undefined | CreditList;

    cost: number;
    competition_id: number;
    competition_name: string;
    event_id: number;
    event_name: string;
    cart_item_type_key: CartItemTypeKey = "credit_package";
    id: number;
    name: string;
    credits: CreditList;

    constructor(parameters: CartCreditPackageParameters) {
        this.cost = parameters.cost;
        this.competition_id = parameters.competition_id;
        this.event_id = parameters.event_id;
        this.event_name = parameters.event_name;
        this.competition_name = parameters.competition_name;
        this.id = parameters.id;
        this.name = parameters.name;
        this.credits = parameters.credits;
    }

    get cart_description(): string {
        return "Credit Package: " + this.name;
    }
}