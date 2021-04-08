import {CartCostPropertiesData, CartDataV3} from "../data/CartDataContracts";
import {APISubmissionResponse} from "./CommonAPIContracts";

/**
 * API response containing Cart Cost information
 */
interface CartCostPropertiesAPIResponse {
    cart: CartCostPropertiesData;
}

/**
 * API response containing full Cart information
 */
interface CartAPIResponse {
    cart: CartDataV3;
}

/**
 * API response when getting the full Cart data
 */
export interface FetchCartAPIResponse extends CartDataV3 {
}

/**
 * API response when removing a Session from the Cart
 */
export interface CartRemoveSessionAPIResponse extends CartCostPropertiesAPIResponse, APISubmissionResponse {
}

/**
 * API response when removing  Credit(s) from the Cart
 */
export interface CartRemoveCreditAPIResponse extends CartCostPropertiesAPIResponse, APISubmissionResponse {
}

/**
 * API response when removing a Credit Package from the Cart
 */
export interface CartRemoveCreditPackageAPIResponse extends CartCostPropertiesAPIResponse, APISubmissionResponse {
}

/**
 * API response when adding a Session to the Cart
 */
export interface CartAddSessionAPIResponse extends APISubmissionResponse {
}

/**
 * API response when adding Credit(s to the Cart
 */
export interface CartAddCreditsAPIResponse extends APISubmissionResponse {
}

/**
 * API payload to remove a registration item from the cart
 */
export interface CartRemoveRegistrationItemAPIPayload {
    registration_item_id: number;   // The identifier for the item being removed
    cart_item_type_key:                               // Indicates the subtype of the item from associated CartRegistrationItemData
    'registration_fee'                               // Competition registration fee
    | 'series_registration_fee'                      // Series registration fee
    | 'team_registration_fee';                       // Team registration fee

}

/**
 * API response when removing a Registration Item from the Cart
 */
export interface CartRemoveRegistrationItemAPIResponse extends CartAPIResponse, APISubmissionResponse {
}