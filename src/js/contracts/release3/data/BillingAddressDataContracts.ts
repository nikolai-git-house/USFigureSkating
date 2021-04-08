import {BillingAddressRawData} from "../../BillingAddressContracts";
import {
    CountryFormOptionData,
    FormOptionDataValue,
    ProvinceFormOptionData,
    StateFormOptionData
} from "./CommonDataContracts";

/**
 * New Raw Data structure for a BillingAddress
 * Base interface (BillingAddressRawData) remains unchanged except where noted here
 */
export interface BillingAddressRawDataV3 extends BillingAddressRawData {
    state?: StateFormOptionData | null;         // [CHANGED] - Previously string, now full StateFormOptionData for the applicable state if available.  Now nullable
    country?: CountryFormOptionData | null;     // [NEW] - full CountryFormOptionData for the applicable country, if available.
    province?: ProvinceFormOptionData | null;   // [NEW] - full ProvinceFormOptionData for the applicable province, if available.
}

/**
 * Data submitted when adding or updating a billing address
 * Though many properties remain unchanged, the full structure is outlined here
 */
export interface BillingAddressSubmitData {
    first_name: string;                     //  The first name for the address
    last_name: string;                      //  The last name for the address
    is_default: boolean;                    //  Whether the address should be saved as the default
    country: FormOptionDataValue;           //  The value of the selected CountryFormOption for the country input.
    street: string;                         //  Street address 1
    street_2: string | null;                //  Street Address 2 if provided
    city: string;                           //  entered city
    state: FormOptionDataValue | null;      //  Value of selected state StateFormOption if present
    province: FormOptionDataValue | null;   //  Value of selected state ProvinceFormOption if present
    zip: string;                            //  entered zip/postal code
}