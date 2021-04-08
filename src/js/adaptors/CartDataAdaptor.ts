import {CartCreditData, CartCreditPackageData} from "../contracts/data/DataContracts";
import {Cart} from "../models/Cart/Cart";
import {SessionDataAdaptor} from "./SessionDataAdaptor";
import {CartSession} from "../models/Sessions/CartSession";
import {CartCreditPackage} from "../models/Cart/CartCreditPackage";
import {CartCredit} from "../models/Cart/CartCredit";
import {CartCostProperties, CartFee, CartRegistrationItem} from "../contracts/CartItemContract";
import {
    CartCostPropertiesData,
    CartDataV3,
    CartFeeData,
    CartRegistrationItemData
} from "../contracts/release3/data/CartDataContracts";

export class CartDataAdaptor {
    static adapt(raw_data: CartDataV3): Cart {
        let sessions: CartSession[] = [];
        let credits: CartCredit[] = [];
        let credit_packages: CartCreditPackage[] = [];
        //calculated total cost has been replaced by API-reported total cost
        let total_cost = 0;
        for (let i = 0; i < raw_data.sessions.length; i++) {
            let obj = raw_data.sessions[i];
            let temp = SessionDataAdaptor.adaptCartSession(obj);
            total_cost += temp.cost;
            sessions.push(temp);
        }
        for (let i = 0; i < raw_data.credits.length; i++) {
            let cart_credit = CartCreditDataAdaptor.adapt(raw_data.credits[i]);
            total_cost += cart_credit.cost;
            credits.push(cart_credit);
        }
        for (let i = 0; i < raw_data.packages.length; i++) {
            let credit_package_data = raw_data.packages[i];
            let cart_package = CartCreditPackageDataAdaptor.adapt(credit_package_data);
            total_cost += cart_package.cost;
            credit_packages.push(cart_package);
        }
        let cart = new Cart(sessions, total_cost, credits, credit_packages);
        cart.setCostProperties(CartDataAdaptor.adaptCostProperties(raw_data));
        cart.registration_items = CartDataAdaptor.adaptRegistrationItems(raw_data);
        return cart
    }

    static adaptCostProperties(raw_data: CartCostPropertiesData): CartCostProperties {
        return {
            subtotal: (raw_data.subtotal !== null && raw_data.subtotal !== undefined) ? raw_data.subtotal : false,
            additional_fees: (raw_data.additional_fees && "map" in raw_data.additional_fees) ? raw_data.additional_fees.map((fee_data: CartFeeData) => {
                return CartFeeDataAdaptor.adapt(fee_data);
            }) : false,
            total: (raw_data.total !== null && raw_data.total !== undefined) ? raw_data.total : false,
        }
    }

    private static adaptRegistrationItems(raw_data: CartDataV3): CartRegistrationItem[] {
        if (!raw_data.registration_items) {
            return [];
        }
        return raw_data.registration_items.map((data: CartRegistrationItemData): CartRegistrationItem => {
            return {
                ...data,
                is_registration_item: true,
                description_lines: data.description_lines ? data.description_lines : [],
            }
        })
    }
}

export class CartFeeDataAdaptor {
    static adapt(raw_data: CartFeeData): CartFee {
        return {
            ...raw_data
        };
    }
}

export class CartCreditDataAdaptor {
    static adapt(raw_data: CartCreditData): CartCredit {
        return new CartCredit(raw_data);
    }
}

export class CartCreditPackageDataAdaptor {
    static adapt(raw_data: CartCreditPackageData): CartCreditPackage {
        return new CartCreditPackage(raw_data);
    }
}