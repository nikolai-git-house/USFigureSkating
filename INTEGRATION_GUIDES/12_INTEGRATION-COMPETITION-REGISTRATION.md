# Competition Registration Integration
## Overview
This document aids in the process of integration of isolated frontend development assets with a backend environment for
the Competition Registration release.

## Documentation Notes
API documentation has been divided into separate documents for each component modified by the Competition Registration
updates.  These documents are located in `INTEGRATION_GUIDES/Release3`.

### Data Structure Documentation
In order to mitigate documentation falling out of sync with the latest code, this release utilizes a
"documentation in place" strategy to document data structures.  Primary data structures have been outlined in the files
in the `src/js/contracts/release3/api` directory.  Each of the guides mentioned above outlines a more specific path to
relevant data structures.

Through the top level data structure documents, import trees can be traced to find detailed documentation of dependent
data structures.

For example, tracing the interface `CreateBillingAddressAPIResponse` in `src/js/contracts/release3/api/SkaterServiceAPIContracts.ts`
leads through `BillingAddressRawDataV3` in `src/js/contracts/release3/data/BillingAddressDataContracts.ts` and ultimately to
`BillingAddressRawData` in `src/js/contracts/BillingAddressContracts.ts`.  This final data structure has no documentation notes,
indicating it remains unchanged from previous releases.

```
src/js/contracts/release3/api/SkaterServiceAPIContracts.ts:26

/**
 * The API response when creating a new billing address
 */
export interface CreateBillingAddressAPIResponse extends SubmissionResponse {
    address: BillingAddressRawDataV3;       // The created billing address' data
}


src/js/contracts/release3/data/BillingAddressDataContracts.ts:8

/**
 * New Raw Data structure for a BillingAddress
 * Base interface (BillingAddressRawData) remains unchanged except where noted here
 */
export interface BillingAddressRawDataV3 extends BillingAddressRawData {
    state?: StateFormOptionData | null;         // [CHANGED] - Previously string, now full StateFormOptionData for the applicable state if available.  Now nullable
    country?: CountryFormOptionData | null;     // [NEW] - full CountryFormOptionData for the applicable country, if available.
    province?: ProvinceFormOptionData | null;   // [NEW] - full ProvinceFormOptionData for the applicable province, if available.
}


src/js/contracts/BillingAddressContracts.ts:4

/**
 * Raw Data structure for a BillingAddress
 */
export interface BillingAddressRawData {
    id: number;
    first_name: string;
    last_name: string;
    street: string;
    street_2: string | null;
    city: string;
    zip_code: number;
    is_default: boolean;
}

```

# General
## Inline Integration Notes
As with previous releases, various templates contain `@integration` comments highlighting points relevant to integration.

## Javascript Architecture Change
In this update, the architecture of javascript files has slightly changed: 

* Vendor scripts have been extracted into a separate javascript file `js/vendor.js`.

In order to ensure proper functionality, all instances of app scripts will need to be preceded by the
two following javascript files in the following order:

*  `js/manifest.js`
*  `js/vendor.js`

ex (primary layout, assuming cache busting is not in place):

```
<script src="/js/manifest.js"></script>
<script src="/js/vendor.js"></script>
<script src="/js/main.js"></script>
```

ex2 (pre-login layout, assuming cache busting is not in place and non-create-account variant):

```
<script src="/js/manifest.js"></script>
<script src="/js/vendor.js"></script>
<script src="/js/login.js"></script>
```

## Competition Registration Scripts
Competition Registration scripts have been created in such a way that they can be optionally excluded from pages not relevant to competition
registration.

For pages related to Competition Registration, include the following script before the call to the primary app script:

```
<script src="'/js/competition-registration.js"></script>
<script src="'/js/main.js"></script>
```
For pages not related to Competition Registration, this script call can be removed in order to reduce file transfer sizes.
However, this script can be included on any page without issue.


# Skate Test Discipline Form
The `skate-test-discipline-form` component was added as part of Create Account for use within foreign skater
Skate Test Equivalency.  This update extends that component for use within Competition Registration Skate Test History.

As part of this update, the skate test discipline form can optionally use an autosuggest input for club name entry,
enabled through component properties:

## Configuration
Wherever it appears, the `<skate-test-discipline-form>` component element can accept the following configurations via the
`:club_autosuggest` attribute:

When the attribute is absent, autosuggest is disabled. Club input is a standard text input, and the user can type any value

```
<skate-test-discipline-form  ...>
```

When the attribute is provided with an object containing `active:true`, autosuggest is enabled.  However, the user is able
to provide any value for the input and they are not limited to the available values

```
<skate-test-discipline-form :club_autosuggest="{active:true}" ...>
```

When the attribute is provided with an object containing `active:true` and `restrict:true`, autosuggest is enabled and
the user is only able to select from the available values

```
<skate-test-discipline-form :club_autosuggest="{active:true,restrict:true}" ...>
```

## Current
As part of competition registration, this component exists for "My Skate Tests" screen and "Partner Skate Tests" subscreen of
event selection.  These components have been configured to use unrestricted autosuggests by default.  To change
the configurations, edit the component options located near:

* src/views/pages/competition-registration/K.2_CompetitionRegistration.skater-test-history.php:80
* src/views/pages/competition-registration/K.5_CompetitionRegistration.event-selection.php:122

# API Changes
## Skate Test Equivalency Submission
Corresponding with the addition of autosuggest for skate test club names, Skate Test Equivalency API Payloads during account creation
have been extended to include `club_id` data properties. If autosuggest is active for Account Creation Skate Test Equivalency,
and the user selects a club from the autosuggest list, this property will be populated with the selected club's id.

If the user does not select an option, or if autosuggest is not active, this property will be null.

## Cart Remove Submissions
When submitting a request to remove an item from the cart, the app now expects a response containing the updated cart
cost configs (outlined in `r3.1_4_INTEGRATION_CartAPI.md`) in a `cart` key. In-app logic handling cart item removal has
been retained to prevent breakages. However, the app depends on the API returning new cart properties (total, subtotal,
fees) in order to update these display values.  If these values are not provided, previous functionality will be retained.

For new cart item types (registration fees), there is no app logic handling the updating of pricing and values, and the
app cart is fully rebuilt based on the API response.

## Billing Address API Changes
The billing address form has been retooled to use the address form component from Create Account. As such, the API payload
and response data structures have been changed. These changes are outlined in `INTEGRATION_GUIDES/Release3/r3.1_2_INTEGRATION_SkaterAPI.md`

# API
API endpoints and data structures are outlined in component-specific documents located in the `INTEGRATION_GUIDES/Release3`
directory