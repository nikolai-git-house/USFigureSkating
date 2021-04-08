import {FormState} from "../FormState";
import {FederationFormOption, ForeignUserTypeKey} from "../../contracts/AppContracts";

/**
 * Exported FederationInfoFormState data.
 */
export interface FederationInfoData {
    federation: string;
    user_type: ForeignUserTypeKey[]
}

/**
 * Class to track state of Federation information Form data
 */
export class FederationInfoFormState extends FormState {

    user_type: ForeignUserTypeKey[] = [];
    federation: FederationFormOption | null = null;

    /**
     * Export the form data state.
     */
    export(): FederationInfoData {
        return {
            federation: this.federation ? this.federation.value : "",
            user_type: this.user_type
        }
    }
}