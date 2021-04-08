/**
 * State Management for Cart
 */
import {ActionTree, GetterTree, MutationTree} from "vuex"
import {Cart} from "../../models/Cart/Cart";
import {CartService} from "../../services/CartService";
import {CartSessionPayload, CartSessionPayloadComplete, CreditExportPayload} from "../../contracts/AppContracts";
import {CartCreditPackage} from "../../models/Cart/CartCreditPackage";
import {CartSession} from "../../models/Sessions/CartSession";
import {CreditPackage} from "../../models/Credits/CreditPackage";
import {CartAdaptor} from "../../models/Cart/CartAdaptor";
import {CartCredit} from "../../models/Cart/CartCredit";
import {CartItemContract, CartRegistrationItem} from "../../contracts/CartItemContract";
import {CartCostProperties} from "../../contracts/CartItemContract";

/**
 * The reactive state of competitions
 */
export class State {
    cart: Cart = new Cart([], 0);
    cart_loaded: boolean = false
}

/**
 * Accessors for computed competition state properties
 */
const getters = <GetterTree<State, any>>{
    contains_package: function (state): Function {
        return function (credit_package: CreditPackage): boolean {
            return state.cart.containsPackage(credit_package);
        }

    }
};

/**
 * Perform (potentially async) actions with the state
 */
const actions = <ActionTree<State, any>>{
    /**
     * Add a session to the cart
     */
    addSession: function (context, payload: CartSessionPayload): Promise<Function> {
        return new Promise(function (resolve, reject) {
            let competition = context.rootGetters['competitions/active_competition'];
            CartService.addSession(payload.session, payload.cost).then(function () {
                function addSessionToAppCart() {
                    context.commit('addSessionToCart', {
                        ...payload,
                        competition_name: 'name' in competition ? competition.name : "",
                    });
                }

                resolve(addSessionToAppCart);
            }).catch(function () {
                reject();
            });
        });
    },
    removeItem: function (context, item: CartItemContract | CartRegistrationItem) {
        return new Promise(function (resolve, reject) {
            if (item.cart_item_type_key === 'fee') {
                reject();
                return;
            }
            if (['registration_fee', 'series_registration_fee', 'team_registration_fee'].indexOf(item.cart_item_type_key) !== -1) {
                context.dispatch('removeRegistrationFee', item).then(function (result) {
                    resolve(result);
                }).catch(function () {
                    reject();
                });
                return;
            }
            if (item.cart_item_type_key === 'session') {
                context.dispatch('removeSession', item).then(function (result) {
                    resolve(result);
                }).catch(function () {
                    reject();
                });
                return;
            }
            if (item.cart_item_type_key === 'credit') {
                context.dispatch('removeCredit', item).then(function (result) {
                    resolve(result);
                }).catch(function () {
                    reject();
                });
                return;
            }
            if (item.cart_item_type_key === 'credit_package') {
                context.dispatch('removeCreditPackage', item).then(function (result) {
                    resolve(result);
                }).catch(function () {
                    reject();
                });
                return;
            }

            reject();
        });
    },
    /**
     * Remove a session from the cart
     */
    removeRegistrationFee: function (context, item: CartRegistrationItem): Promise<Function> {
        return new Promise(function (resolve, reject) {
            CartService.removeRegistrationItem(item).then(function (cart: Cart) {
                function replaceCart() {
                    context.commit('loadCart', cart);
                    context.commit('skater/setSkaterCart', cart, {root: true});
                }

                resolve(replaceCart);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Remove a session from the cart
     */
    removeSession: function (context, session: CartSession): Promise<Function> {
        return new Promise(function (resolve, reject) {
            CartService.removeSession(session).then(function (cost_properties: CartCostProperties) {
                function removeSessionFromAppCart() {
                    context.commit('removeSessionFromCart', session.session.id);
                    context.commit('setCartCostProperties', cost_properties);
                }

                resolve(removeSessionFromAppCart);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Retrieve the saved cart and all associated data within it
     */
    fetchCart: function (context) {
        context.state.cart_loaded = false;
        return new Promise(function (resolve, reject) {
            CartService.fetchCart().then(function (cart: Cart) {
                context.commit('loadCart', cart);
                context.commit('skater/setSkaterCart', cart, {root: true});
                resolve();
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * [2020-07-14] - Add credits to team cart
     */
    addTeamCredits: function (context, params: CreditExportPayload): Promise<void> {
        return new Promise(function (resolve, reject) {
            CartService.addTeamCredits(params).then(function () {
                context.commit('addCreditsToCart', params.credits);
                context.commit('addCreditPackagesToCart', params.packages);
                resolve();
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Add credits to the cart
     */
    addCredits: function (context, params: CreditExportPayload): Promise<void> {
        return new Promise(function (resolve, reject) {
            CartService.addCredits(params).then(function () {
                context.commit('addCreditsToCart', params.credits);
                context.commit('addCreditPackagesToCart', params.packages);
                resolve();
            }).catch(function () {
                reject();
            });
        });
    },


    /**
     * Remove a credit from the cart
     */
    removeCredit: function (context, credit: CartCredit): Promise<Function> {

        return new Promise(function (resolve, reject) {
            CartService.removeCredit(credit).then(function (cost_properties: CartCostProperties) {
                function resolution() {
                    context.commit('removeCreditFromCart', credit);
                    context.commit('setCartCostProperties', cost_properties);
                }

                resolve(resolution);
            }).catch(function () {
                reject();
            });
        });
    },

    removeCreditPackage: function (context, credit_package: CartCreditPackage): Promise<Function> {
        return new Promise(function (resolve, reject) {
            CartService.removeCreditPackage(credit_package).then(function (cost_properties: CartCostProperties) {
                function resolution() {
                    context.commit('removeCreditPackageFromCart', credit_package);
                    context.commit('setCartCostProperties', cost_properties);
                }

                resolve(resolution);
            }).catch(function () {
                reject();
            })
        });
    }

};

/**
 * Change reactive data
 */
const mutations = <MutationTree<State>>{
    addSessionToCart: function (state, payload: CartSessionPayloadComplete) {
        state.cart.addSession(CartAdaptor.adaptCartSessionPayloadCartSession(payload));
    },
    loadCart: function (state, cart: Cart) {
        state.cart = cart;
        state.cart_loaded = true;
    },
    removeSessionFromCart: function (state, session_id: number) {
        state.cart.removeSession(session_id);
    },
    addCreditsToCart: function (state, credits: CartCredit[]) {
        state.cart.addCredits(credits);
    },
    addCreditPackagesToCart: function (state, packages: CartCreditPackage[]) {
        state.cart.addPackages(packages);
    },
    removeCreditFromCart: function (state, credit) {
        state.cart.removeCredit(credit);
    },
    removeCreditPackageFromCart: function (state, credit_package: CartCreditPackage) {
        state.cart.removeCreditPackage(credit_package);
    },
    setCartCostProperties: function (state, cost_properties: CartCostProperties) {
        state.cart.setCostProperties(cost_properties);
    }
};

/**
 * Export the state module
 */
export const CartState = {
    namespaced: true,
    state: new State(),
    getters: getters,
    mutations: mutations,
    actions: actions
};