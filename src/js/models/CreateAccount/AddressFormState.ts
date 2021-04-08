import {CountryFormOption, ProvinceFormOption, StateFormOption} from '../../contracts/AppContracts';
import {FormState} from '../FormState';

/**
 * Exported AddressFormState data.
 * Flatten FormOptions
 */
export interface AddressData {
    country: string;        // The value from the country FormOption selected by the user
    street: string;         // The street address entered by the user
    street_2: string;       // The second line street address entered by the user.  Might be empty string.
    city: string;           // The city entered by the user
    state: string;          // The value from the StateFormOption selected by the user. Might be empty string.
    province: string;       // The value from the ProvinceFormOption selected by the user. Might be empty string.
    zip: string;            // The zip/postal code entered by the user
}

/**
 * Class to track state of Address Form data
 */
export class AddressFormState extends FormState {

    country: CountryFormOption | null = null;
    street: string | null = null;
    street_2: string | null = null;
    city: string | null = null;
    state: StateFormOption | null = null;
    province: ProvinceFormOption | null = null;
    zip: string | null = null;

    /**
     * Whether the selected country is USA.  Default to true
     */
    get is_usa(): boolean {
        return !this.country || this.country.is_usa;
    }

    /**
     * Whether the selected country is Canada. Only true when a country is selected and it's Canada
     */
    get is_canada(): boolean {
        return this.country !== null && this.country.is_canada;
    }

    /**
     * Export the form data state.
     * Flatten FormOptions to their value attributes
     */
    export(): AddressData {
        return {
            country: this.country ? this.country.value : '',
            street: this.street ? this.street : '',
            street_2: this.street_2 ? this.street_2 : '',
            city: this.city ? this.city : '',
            state: this.is_usa && this.state ? this.state.value : '',
            province: this.is_canada && this.province ? this.province.value : '',
            zip: this.zip ? this.zip : ''
        };
    }
}