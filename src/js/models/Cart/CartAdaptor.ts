import {CreditPackage} from "../Credits/CreditPackage";
import {SkatingEvent} from "../SkatingEvent";
import {CartCreditPackage} from "./CartCreditPackage";
import {CartSessionPayloadComplete} from "../../contracts/AppContracts";
import {CartSession} from "../Sessions/CartSession";
import {Competition} from "../Competition/Competition";

type CreditPackageCreatePayload = {
    credit_package: CreditPackage,
    event: SkatingEvent,
    competition: Competition
};

export class CartAdaptor {
    static adaptCreditPackage(parameters: CreditPackageCreatePayload) {
        let {credit_package, event, competition} = parameters;
        return new CartCreditPackage({
            id: credit_package.id,
            cost: credit_package.cost,
            event_id: event.id,
            event_name: event.name,
            competition_name: competition.name,
            competition_id: competition.id,
            name: credit_package.name,
            credits: credit_package.credits
        });
    }

    static adaptCartSessionPayloadCartSession(payload: CartSessionPayloadComplete): CartSession {
        return new CartSession({
            ...payload.session,
            cost: payload.cost,
            competition_id: payload.competition_id,
            scheduled_event_name: payload.event_name,
            competition_name: payload.competition_name

        });
    }

}