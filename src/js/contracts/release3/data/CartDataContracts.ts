import {CartData} from "../../data/DataContracts";

/**
 * Represents a fee applied to the items in the cart
 */
export interface CartFeeData {
    name: string;           // The name of the fee
    amount: number;         // The amount of the fee
}

/**
 * Represents additional cost properties relative to the cart
 */
export interface CartCostPropertiesData {
    total?: number;                  // [OPTIONAL] The total cost of the items in the cart.
    subtotal?: number;               // [OPTIONAL] The subtotal cost of the items in the cart
    additional_fees?: CartFeeData[]; // [OPTIONAL] Array of additional fees applied to the items in the cart
}

/**
 * Represents a registration item (Event Registration fee, Admin Fee, etc) in the cart
 */
export interface CartRegistrationItemData {
    name: string;                                     // The name of the item
    cost: number;                                     // The cost of the item
    description_lines?: string[];                     // [OPTIONAL] Array of item descriptors.
    cart_item_type_key:                               // Indicates the subtype of the item
        'registration_fee'                               // Competition registration fee
        | 'fee'                                          // admin/ADMN fee
        | 'series_registration_fee'                      // Series registration fee
        | 'team_registration_fee';                       // Team registration fee
    id: number;                                       // Unique identifier for the item relative to the cart
    unremovable: boolean;                             // Whether the item cannot be removed from the cart by the user
}

/**
 * Represents full Cart data structures as updated in Release 3
 */
export interface CartDataV3 extends CartData, CartCostPropertiesData {
    total?: number;                                   // [NEW, OPTIONAL] The total cost of the items in the cart.
    subtotal?: number;                                // [NEW, OPTIONAL] The subtotal cost of the items in the cart
    additional_fees?: CartFeeData[];                  // [NEW, OPTIONAL] Additional fees applied to the items in the cart
    registration_items?: CartRegistrationItemData[];  // [NEW, OPTIONAL] Registration items in the cart
}