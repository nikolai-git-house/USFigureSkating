import {BillingAddress} from "../../models/BillingAddress";
import {CountryFormOption, ProvinceFormOption, StateFormOption} from "../../contracts/AppContracts";
import {BillingAddressStateImportData} from "../../models/BillingAddressFormState";
import {UserProfile} from "../../contracts/app/UserContracts";


export class BillingAddressToBillingAddressStateImportDataAdapter implements BillingAddressStateImportData {
    private _form_options: { states: StateFormOption[]; provinces: ProvinceFormOption[]; countries: CountryFormOption[] };
    private _billing_address: BillingAddress;

    constructor(billing_address: BillingAddress, form_options: { states: StateFormOption[], provinces: ProvinceFormOption[], countries: CountryFormOption[] }) {
        this._billing_address = billing_address;
        this._form_options = form_options;
    }

    get first_name() {
        return this._billing_address.first_name;
    }

    get last_name() {
        return this._billing_address.last_name;
    }

    get street() {
        return this._billing_address.street;
    }

    get street_2() {
        return this._billing_address.street_2;
    }

    get city() {
        return this._billing_address.city;
    }

    get zip() {
        return String(this._billing_address.zip_code);
    }

    get country() {
        if (this._billing_address.country) {
            for (let i = 0; i < this._form_options.countries.length; i++) {
                let country_option = this._form_options.countries[i];
                if (country_option.value === this._billing_address.country.value) {
                    return {...country_option};
                }
            }
        }
        return null;
    }


    get state() {
        if (this._billing_address.state) {
            for (let i = 0; i < this._form_options.states.length; i++) {
                let state_option = this._form_options.states[i];
                if (state_option.value === this._billing_address.state.value) {
                    return {...state_option};
                }
            }
        }
        return null;
    }

    get province() {
        if (this._billing_address.province) {
            for (let i = 0; i < this._form_options.provinces.length; i++) {
                let province_option = this._form_options.provinces[i];
                if (province_option.value === this._billing_address.province.value) {
                    return {...province_option};
                }
            }
        }
        return null;
    }

    get is_default() {
        return this._billing_address.is_default;
    }


}

export class UserProfileToBillingAddressStateImportDataAdapter implements BillingAddressStateImportData {
    private _form_options: { states: StateFormOption[]; provinces: ProvinceFormOption[]; countries: CountryFormOption[] };
    private _user_profile: UserProfile;

    constructor(user_profile: UserProfile, form_options: { states: StateFormOption[], provinces: ProvinceFormOption[], countries: CountryFormOption[] }) {
        this._user_profile = user_profile;
        this._form_options = form_options;
    }

    get first_name() {
        return this._user_profile.first_name;
    }

    get last_name() {
        return this._user_profile.last_name;
    }

    get street() {
        return this._user_profile.address.street;
    }

    get street_2() {
        return this._user_profile.address.street_2;
    }

    get city() {
        return this._user_profile.address.city;
    }

    get zip() {
        return String(this._user_profile.address.zip_code);
    }

    get country() {
        if (this._user_profile.address.country) {
            for (let i = 0; i < this._form_options.countries.length; i++) {
                let country_option = this._form_options.countries[i];
                if (country_option.value === this._user_profile.address.country.value) {
                    return {...country_option};
                }
            }
        }
        return null;
    }


    get state() {
        if (this._user_profile.address.state) {
            for (let i = 0; i < this._form_options.states.length; i++) {
                let state_option = this._form_options.states[i];
                if (state_option.value === this._user_profile.address.state.value) {
                    return {...state_option};
                }
            }
        }
        return null;
    }

    get province() {
        if (this._user_profile.address.province) {
            for (let i = 0; i < this._form_options.provinces.length; i++) {
                let province_option = this._form_options.provinces[i];
                if (province_option.value === this._user_profile.address.province.value) {
                    return {...province_option};
                }
            }
        }
        return null;
    }

    get is_default() {
        return true;
    }
}