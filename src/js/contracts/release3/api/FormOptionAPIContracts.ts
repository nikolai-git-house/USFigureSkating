import {
    CountryFormOptionData,
    FormOptionData,
    ProvinceFormOptionData,
    StateFormOptionData
} from "../data/CommonDataContracts";

/**
 * Response when getting FormOptions for edit profile form
 */
export interface GetEditProfileFormOptionsAPIResponse {
    options: {
        user_prefixes: FormOptionData[];    // Form options for potential prefixes
        user_suffixes: FormOptionData[];    // Form options for potential suffixes
        mobile_carriers: FormOptionData[];  // Form options for potential mobile carriers
    }
}

/**
 * Response when getting form options for Club entry for self-reported Skate Tests
 */
export interface GetClubFormOptionsAPIResponse {
    options: FormOptionData[]; //Club form options
}

/**
 * Response when getting form options for Billing Address form
 */
export interface GetBillingAddressFormOptionsAPIResponse {
    options: {
        states: StateFormOptionData[];       // Form options for state input
        countries: CountryFormOptionData[];  // Form options for country input.  Should be limited to United States and Canada
        provinces: ProvinceFormOptionData[]; // Form options for province input
    }
}