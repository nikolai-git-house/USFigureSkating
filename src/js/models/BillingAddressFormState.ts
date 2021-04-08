import {AddressData, AddressFormState} from "./CreateAccount/AddressFormState";

import {CountryFormOption, ProvinceFormOption, StateFormOption} from "../contracts/AppContracts";

/**
 * True interface to import data into the state
 */
export interface BillingAddressStateImportData {
    first_name: string | null;
    last_name: string | null;
    country: CountryFormOption | null;
    street: string | null;
    street_2: string | null;
    city: string | null;
    state: StateFormOption | null;
    province: ProvinceFormOption | null;
    zip: string | null;
    is_default: boolean
}

/**
 * Exported data from the form
 */
export interface BillingAddressFormData extends AddressData {
    first_name: string;
    last_name: string;
    is_default: boolean;
}

/**
 * Class to track state of Address Form data
 */
export class BillingAddressFormState extends AddressFormState {
    first_name: string | null = null;
    last_name: string | null = null;
    is_default: boolean = false;

    /**
     * Export the form data state.
     * Flatten FormOptions to their value attributes
     */
    export(): BillingAddressFormData {
        let base = super.export();

        return {
            ...base,
            first_name: this.first_name ? this.first_name : '',
            last_name: this.last_name ? this.last_name : '',
            is_default: this.is_default
        }
    }

    /**
     * Import data into the form
     */
    import(import_data: BillingAddressStateImportData): void {
        this.first_name = import_data.first_name;
        this.last_name = import_data.last_name;
        this.country = import_data.country;
        this.street = import_data.street;
        this.street_2 = import_data.street_2;
        this.city = import_data.city;
        this.state = import_data.state;
        this.province = import_data.province;
        this.zip = String(import_data.zip);
        this.is_default = import_data.is_default;
    }
}