# Series Registration API - Cart & E-Commerce Pathways

This document outlines API additions related to the “Series Registration” release cart and e-commerce components.

## Notes
Cart functionality was initially written in release 1 and it was extended in release 3.1.  This release extends the updates made in 3.1 in order to facilitate series registration functionality.

E-commerce pathways and functionality is not changed as part of this release. 

## API Endpoints

### Fetch Cart (extended)

**Purpose:** Get the items in the active user's cart.

**Source:** Cart Review, Checkout Review and Checkout Confirmation

**URL:** `GET:/api/skater-cart` (unchanged)

**Request Payload:** `none` (unchanged)

**Response:** `FetchCartAPIResponse` (unchanged, properties extended)

**Notes:**
1. The `CartRegistrationItemData` structure within the `registration_items` key of the response has been extended to include a new enum option to indicate series registration items

### Remove Cart Registration Item

**Purpose:** Remove a Competition Registration item (existing) or Series Registration item (new) from cart

**Source:**  Cart review "remove item" button click.

**URL:** `/api/skater-cart/remove-registration` (unchanged)

**Request Payload:** `CartRemoveRegistrationItemAPIPayload` (extended)

**Response:** `CartRemoveRegistrationItemAPIResponse` (unchanged)

**Notes:**
1. The request payload for this endpoint has been extended to facilitate differentiation between competition registration and series registration items 


## Modified Data Structures

The following section outlines data structures related to the cart that have changed as part of this release:

``` typescript
/**
 * Represents a registration item (Event Registration fee, Admin Fee, etc) in the cart
 */
export interface CartRegistrationItemData {
    // Unchanged keys omitted
    cart_item_type_key:                               // [Existing, extended] Indicates the subtype of the item
        'registration_fee'                               // [Existing] Competition registration fee
        | 'fee'                                          // [Existing] admin/ADMN fee
        | 'series_registration_fee';                     // [New] Series registration fee
}
/**
 * API payload to remove a registration item from the cart
 */
export interface CartRemoveRegistrationItemAPIPayload {
    registration_item_id: number;                     // [Existing] The identifier for the item being removed
    cart_item_type_key:                               // [New] Indicates the subtype of the item. From associated CartRegistrationItemData
    'registration_fee'                                      // Competition registration fee
    | 'series_registration_fee';                            // Series registration fee
}
```