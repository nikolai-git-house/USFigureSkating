import {BillingAddressParameters} from "../contracts/BillingAddressContracts";
import {CountryFormOption, ProvinceFormOption, StateFormOption} from "../contracts/AppContracts";

export class BillingAddress {
    [key: string]: any

    id: number;
    first_name: string;
    last_name: string;
    street: string;
    street_2: string | null = null;
    city: string;
    state: StateFormOption | null;
    country: CountryFormOption | null;
    province: ProvinceFormOption | null;
    zip_code: number | string;
    is_default: boolean = false;

    constructor(parameters: BillingAddressParameters) {
        let {id, first_name, last_name, street, street_2, city, state, zip_code, is_default, country, province} = parameters;
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.street = street;
        if (street_2) {
            this.street_2 = street_2;
        }
        this.city = city;
        this.state = state || null;
        this.country = country || null;
        this.province = province || null;
        this.zip_code = zip_code;
        this.is_default = is_default;
    }

    get full_name(): string {
        return this.first_name + " " + this.last_name;
    }

    get city_state_zip(): string {

        return this.city + ", " + (this.state ? this.state.label : (this.province ? this.province.label : "")) + " " + this.zip_code;
    }

    get full_address(): string {
        let address = this.street;
        if (this.street_2) {
            address += ", " + this.street_2;
        }
        address += ", " + this.city_state_zip;
        return address;
    }
}