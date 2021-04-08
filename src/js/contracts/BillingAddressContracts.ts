import {CountryFormOption, ProvinceFormOption, StateFormOption} from "./AppContracts";
import {BillingAddress} from "../models/BillingAddress";
import {BillingAddressFormData} from "../models/BillingAddressFormState";

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

/**
 * Parameters used to create a BillingAddress
 */
export type BillingAddressParameters = {
    id: number;
    first_name: string;
    last_name: string;
    street: string;
    street_2: string | null;
    city: string;
    state?: StateFormOption | null;
    country?: CountryFormOption | null;
    province?: ProvinceFormOption | null;
    zip_code: number | string;
    is_default: boolean;
};

/**
 * Payload used by services to create BillingAddresses
 */
export interface BillingAddressCreatePayload {
    data: BillingAddressFormData;
}

/**
 * Payload used by services to edit BillingAddresses
 */
export interface BillingAddressEditPayload extends BillingAddressCreatePayload {
    source: BillingAddress;
}