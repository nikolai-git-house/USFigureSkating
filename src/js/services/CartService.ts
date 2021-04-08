import {ScheduledSession} from "../models/Sessions/ScheduledSession";
import {Cart} from "../models/Cart/Cart";
import {CartDataAdaptor} from "../adaptors/CartDataAdaptor";
import axios from "axios";
import {CheckoutData, CreditExportPayload, OrderAttemptResponse} from "../contracts/AppContracts";
import {CartAPIAdaptor} from "../adaptors/APIAdaptors/CartAPIAdaptor";
import {CartSession} from "../models/Sessions/CartSession";
import {CartCredit} from "../models/Cart/CartCredit";
import {CartCreditPackage} from "../models/Cart/CartCreditPackage";
import {CartCostProperties} from "../contracts/CartItemContract";
import {CartRegistrationItem} from "../contracts/CartItemContract";
import {
    CartAddCreditsAPIResponse,
    CartAddSessionAPIResponse,
    CartRemoveCreditAPIResponse,
    CartRemoveCreditPackageAPIResponse,
    CartRemoveRegistrationItemAPIResponse,
    CartRemoveSessionAPIResponse,
    FetchCartAPIResponse
} from "../contracts/release3/api/CartAPIContracts";
import {CompetitionPortalAppService} from '../CompetitionPortal/_services';

export class CartService {

    /**
     * Remove a session from the cart
     */
    static removeSession(session: CartSession): Promise<CartCostProperties> {
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/skater-cart/remove-session',
                CartAPIAdaptor.adaptRemoveSession(session)
            ).then(function (response: { data: CartRemoveSessionAPIResponse }) {
                if (response.data.success == true && response.data.cart) {
                    resolve(CartDataAdaptor.adaptCostProperties(response.data.cart));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Retrieve and adapt the skater's cart data
     */
    static fetchCart(): Promise<Cart> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/skater-cart').then(function (response: { data: FetchCartAPIResponse }) {
                if (response.data) {
                    resolve(CartDataAdaptor.adapt(response.data));
                }
                reject();

            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Add a session to the skater's cart
     */
    static addSession(scheduled_session: ScheduledSession, cost: number) {
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/skater-cart/add-session',
                CartAPIAdaptor.adaptAddSession(scheduled_session, cost)
            ).then(function (response: { data: CartAddSessionAPIResponse }) {
                if (response.data.success) {
                    resolve();
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }
    /**
     * [2020-07-14] - Add credits to team cart
     */
    static addTeamCredits(credit_payload: CreditExportPayload) {

        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        return new Promise(function (resolve, reject) {
            axios.post(
                `/api/cart/teams/${team_id}/credits`,
                {
                    credits: CartAPIAdaptor.adaptAddCredits(credit_payload.credits),
                    packages: CartAPIAdaptor.adaptAddPackages(credit_payload.packages)
                }
            ).then(function (response: { data: CartAddCreditsAPIResponse }) {
                if (response.data.success) {
                    resolve();
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Add a set of credits to the cart
     */
    static addCredits(credit_payload: CreditExportPayload) {
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/skater-cart/add-credits',
                {
                    credits: CartAPIAdaptor.adaptAddCredits(credit_payload.credits),
                    packages: CartAPIAdaptor.adaptAddPackages(credit_payload.packages)
                }
            ).then(function (response: { data: CartAddCreditsAPIResponse }) {
                if (response.data.success) {
                    resolve();
                }
                reject();
            }).catch(function () {
                reject();
            });
        });

    }

    /**
     * Remove a credit from the cart
     */
    static removeCredit(credit: CartCredit): Promise<CartCostProperties> {
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/skater-cart/remove-credits',
                CartAPIAdaptor.adaptRemoveCredit(credit)
            ).then(function (response: { data: CartRemoveCreditAPIResponse }) {
                if (response.data.success == true && response.data.cart) {
                    resolve(CartDataAdaptor.adaptCostProperties(response.data.cart));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Post data to server to complete checkout process
     *
     * checkout_data - Object containing BillingAddress, CreditCard and Cart objects
     */
    static completeOrder(checkout_data: CheckoutData): Promise<OrderAttemptResponse> {
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/complete-order',
                CartAPIAdaptor.adaptCompleteOrder(checkout_data)
            ).then(function (response) {
                if (response.data.success === true) {
                    resolve({
                        success: true,
                        message: "Order Complete",
                        invoice_id: response.data.invoice_id
                    });
                    return;
                }
                resolve({
                    success: false,
                    message: response.data.message
                })

            }).catch(function () {
                reject();
            })
        });
    }

    /**
     * Remove a credit package from the cart.
     */
    static removeCreditPackage(credit_package: CartCreditPackage): Promise<CartCostProperties> {
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/skater-cart/remove-credit-package',
                CartAPIAdaptor.adaptRemoveCreditPackage(credit_package)
            ).then(function (response: { data: CartRemoveCreditPackageAPIResponse }) {
                if (response.data.success == true && response.data.cart) {
                    resolve(CartDataAdaptor.adaptCostProperties(response.data.cart));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    static removeRegistrationItem(item: CartRegistrationItem): Promise<Cart> {
        return new Promise(function (resolve, reject) {
            axios.post(
                '/api/skater-cart/remove-registration',
                CartAPIAdaptor.adaptRemoveRegistrationItem(item)
            ).then(function (response: { data: CartRemoveRegistrationItemAPIResponse }) {
                if (response.data.success && response.data.cart) {
                    resolve(CartDataAdaptor.adapt(response.data.cart));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }
}
