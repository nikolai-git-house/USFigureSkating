import {ScheduledSession} from "../../models/Sessions/ScheduledSession";
import {CheckoutData} from "../../contracts/AppContracts";
import {CartCreditPackage} from "../../models/Cart/CartCreditPackage";
import {CartSession} from "../../models/Sessions/CartSession";
import {CartCredit} from "../../models/Cart/CartCredit";
import {CartRegistrationItem} from "../../contracts/CartItemContract";
import {CartRemoveRegistrationItemAPIPayload} from "../../contracts/release3/api/CartAPIContracts";

/**
 * Adapt App Data for Consumption by API
 */
export class CartAPIAdaptor {
    static adaptRemoveSession(cart_session: CartSession) {
        return {
            session_id: cart_session.session.id
        }
    }

    static adaptAddSession(scheduled_session: ScheduledSession, cost: number) {
        return {
            scheduled_as: scheduled_session.scheduled_as,
            scheduled_event_id: scheduled_session.scheduled_event_id,
            session_id: scheduled_session.session.id,
            cost
        }
    }

    static adaptAddCredits(credits: CartCredit[]) {
        return credits;
    }

    static adaptRemoveCredit(credit: CartCredit) {
        return {
            ...credit
        }
    }

    static adaptCompleteOrder(checkout_data: CheckoutData) {
        return {
            ...checkout_data
        }
    }

    /**
     * Adapt App cart package data to data processable by backend when adding new packages
     */
    static adaptAddPackages(packages: CartCreditPackage[]) {
        return packages;
    }

    static adaptRemoveCreditPackage(credit_package: CartCreditPackage) {
        return {
            ...credit_package
        }
    }

    static adaptRemoveRegistrationItem(item: CartRegistrationItem): CartRemoveRegistrationItemAPIPayload {
        // By this point, the type key is either 'registration_fee' or 'series_registration_fee'
        const cart_item_type_key = item.cart_item_type_key as 'registration_fee' | 'series_registration_fee';

        return {
            registration_item_id: item.id,
            cart_item_type_key
        }
    }
}