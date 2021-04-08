import {ValidationRule} from "./ValidationRules";
import {BillingAddressFormState} from "./BillingAddressFormState";
import {AddressFormValidator} from "./CreateAccount/AddressFormValidator";


/**
 * Validator to be used with AddressForms
 */
export class BillingAddressFormValidator extends AddressFormValidator {

    protected rules: { [key: string]: ValidationRule[] } = {
        country: ["required"],
        street: ["required"],
        city: ["required"],
        first_name: ["required"],
        last_name: ["required"],
    };

    constructor(form_data: BillingAddressFormState) {
        super(form_data);
    }
}
