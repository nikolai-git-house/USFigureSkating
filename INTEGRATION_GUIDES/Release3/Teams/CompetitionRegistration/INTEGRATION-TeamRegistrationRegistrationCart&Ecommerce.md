# Team Registration Integration - Cart & E-Commerce Pathways
This document summarizes integration notes surrounding the cart and e-commerce pathways for Team Registration

## Notes
Team Registration Cart & E-Commerce mirrors the strategies and established for Cart and E-Commerce extensions performed in Series Registration `INTEGRATION_GUIDES/Release3/SeriesRegistration/Cart&Ecommerce.md`
Cart data structures and endpoints have been modified in a similar way, and E-Commerce remains similarly unchanged. 

## API Endpoints

### Fetch Cart (extended)

**Purpose:** Get the items in the active user's cart.

**Source:** Cart Review, Checkout Review and Checkout Confirmation

**URL:** `GET:/api/skater-cart` (unchanged)

**Request Payload:** `none` (unchanged)

**Response:** `FetchCartAPIResponse` (unchanged, properties extended)

**Notes:**
1. The `CartRegistrationItemData` structure within the `registration_items` key of the response has been extended to include a new enum option to indicate team registration items

### Remove Cart Team Registration Item (extended)

**Purpose:** Remove a Competition Registration item (existing), a Series Registration item (existing), or a Team Registration item (new) from cart

**Source:**  Cart review "remove item" button click.

**URL:** `/api/skater-cart/remove-registration` (unchanged)

**Request Payload:** `CartRemoveRegistrationItemAPIPayload` (extended)

**Response:** `CartRemoveRegistrationItemAPIResponse` (unchanged)

**Notes:**
1. The request payload for this endpoint has been extended to facilitate differentiation between competition registration, series registration and team registration items 


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
        | 'series_registration_fee';                     // [Existing] Series registration fee
        | 'team_registration_fee';                       // [New] Team registration fee
}
/**
 * API payload to remove a registration item from the cart
 */
export interface CartRemoveRegistrationItemAPIPayload {
    registration_item_id: number;                     // [Existing] The identifier for the item being removed
    cart_item_type_key:                               // [Extended] Indicates the subtype of the item. From associated CartRegistrationItemData
    'registration_fee'                                      // Competition registration fee
    | 'series_registration_fee';                            // Series registration fee
    | 'team_registration_fee';                              // Team registration fee
}
```