import {ScheduledSession} from "./ScheduledSession";
import {CartSessionArguments} from "../../contracts/AppContracts";
import {CartItemContract} from "../../contracts/CartItemContract";
import {CartItemTypeKey} from "../../contracts/CartItemContract";


export class CartSession extends ScheduledSession implements CartItemContract {
    cart_item_type_key: CartItemTypeKey = "session";
    cost: number;
    scheduled_event_name: string;
    competition_id: number;
    competition_name: string;

    constructor(parameters: CartSessionArguments) {
        super(parameters);
        this.competition_id = parameters.competition_id;
        this.cost = parameters.cost;
        this.scheduled_event_name = parameters.scheduled_event_name;
        this.competition_name = parameters.competition_name;
    }

    get event_id(): number {
        return this.scheduled_event_id;
    }

    get event_name(): string {
        return this.scheduled_event_name;
    }

    get cart_description(): string {
        return this.scheduled_as.toUpperCase();
    }
}