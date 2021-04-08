import {FormValidator} from "./FormValidator";
import {ValidationRule} from "./ValidationRules";
import {BillingPaymentState} from "./BillingPaymentState";
import {validateExpiration} from "./ValidationFunctions";

export class BillingPaymentFormValidator extends FormValidator {

    protected rules: { [key: string]: ValidationRule[] } = {
        card_number: ['credit_card_number'],
        cvc: ['cvc'],
        expiration_month: ['required', 'expiration_date'],
        expiration_year: ['required', 'expiration_date'],
    };
    protected messages: { [key: string]: string } = {
        required: "This field is required",
        cvc: "Invalid CVC",
        credit_card_number: "Enter a valid credit card number"
    };

    constructor(form_data: BillingPaymentState) {
        super(form_data);
    }

    validateRule(rule: string, value: any) {
        if (rule === "expiration_date") {
            let {expiration_month, expiration_year} = this.form_data;
            return validateExpiration(expiration_month, expiration_year);
        }
        return super.validateRule(rule, value);
    }

    protected addMessage(messages: { [p: string]: string[] }, field: string, field_rule: string): void {
        if (field_rule === 'expiration_date') {
            // add message to non-field key
            messages['expiration_date'] = ["Enter a valid expiration date"];
            return;
        }
        if (field === 'expiration_month') {
            messages['expiration_month'] = ["Select month"];
        }
        if (field === 'expiration_year') {
            messages['expiration_year'] = ["Select year"];
        }


        super.addMessage(messages, field, field_rule);
    }
}
