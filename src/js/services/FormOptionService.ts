import {
    BillingAddressFormOptions,
    CreateAccountFormOptions,
    EditProfileFormOptions,
    FormOption
} from "../contracts/AppContracts";
import axios from "axios";
import {
    GetEditProfileFormOptionsAPIResponse
} from "../contracts/release3/api/FormOptionAPIContracts";
import {
    GetBillingAddressFormOptionsAPIResponse,
    GetClubFormOptionsAPIResponse
} from "../contracts/release3/api/FormOptionAPIContracts";


/**
 * Service class for interacting with API in relation to FormOptions
 */
export class FormOptionService {
    /**
     * Get all form options and configurations needed for Create Account
     * @note: adapter layer is not currently in place and will need to be added if necessary
     */
    static GetCreateAccountOptions(): Promise<CreateAccountFormOptions> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/form-options/component/create-account').then(function (response) {
                if (response.data.options) {
                    resolve(response.data.options);
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            })
        });
    }

    static GetEditProfileOptions(): Promise<EditProfileFormOptions> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/form-options/component/edit-profile').then(function (response: { data: GetEditProfileFormOptionsAPIResponse }) {
                if (response.data.options) {
                    resolve({
                        user_prefixes: response.data.options.user_prefixes,
                        user_suffixes: response.data.options.user_suffixes,
                        mobile_carriers: response.data.options.mobile_carriers,
                    });
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            })
        });
    }

    static getClubOptions(): Promise<FormOption[]> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/form-options/clubs').then(function (response: { data: GetClubFormOptionsAPIResponse }) {
                if (response.data.options) {
                    resolve(response.data.options);
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            })
        });
    }

    static getBillingAddressOptions(): Promise<BillingAddressFormOptions> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/form-options/component/billing-address').then(function (response: { data: GetBillingAddressFormOptionsAPIResponse }) {
                if (response.data.options) {
                    resolve(response.data.options);
                    return;
                }
                reject();
            }).catch(function () {
                reject();
            })
        });
    }
}