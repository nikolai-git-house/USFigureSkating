import {GenderKey} from "../../contracts/AppContracts";
import {FormState} from "../FormState";

/**
 * Exported PersonalInformationFormState data.
 */
export interface PersonalInformationData {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: GenderKey | "";
    phone: string;
    email: string;
    captcha_value: string;
}

/**
 * Class to track state of Personal Information Form data
 */
export class PersonalInformationFormState extends FormState {
    first_name: null | string = null;
    last_name: null | string = null;
    date_of_birth: null | string = null;
    gender: null | GenderKey = null;
    phone: null | string = null;
    email: null | string = null;
    captcha_value: string = "";

    /**
     * Export the form data state.
     */
    export(): PersonalInformationData {
        return {
            first_name: this.first_name ? this.first_name : '',
            last_name: this.last_name ? this.last_name : '',
            date_of_birth: this.date_of_birth ? this.date_of_birth : '',
            gender: this.gender ? this.gender : '',
            phone: this.phone ? this.phone : '',
            email: this.email ? this.email : '',
            captcha_value: this.captcha_value
        }
    }
}