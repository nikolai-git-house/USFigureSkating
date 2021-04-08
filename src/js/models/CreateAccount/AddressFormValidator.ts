import {FormValidator, FormValidatorResult} from "../FormValidator";
import {ValidationRule} from "../ValidationRules";
import {AddressFormState} from "./AddressFormState";
import {validateCanadaPostalCode, validateUSAZipCode} from "../ValidationFunctions";


/**
 * Validator to be used with AddressForms
 */
export class AddressFormValidator extends FormValidator {

    protected rules: { [key: string]: ValidationRule[] } = {
        country: ["required"],
        street: ["required"],
        city: ["required"]
    };

    constructor(form_data: AddressFormState) {
        super(form_data);
    }

    /**
     * Override base validate method to add conditional rules
     */
    validate(): FormValidatorResult {
        let result = super.validate();

        if (!this.validateState()) {
            this.ensureValidationResultFieldPresence('state', result);
            result.errors.state.push('required');
            result.messages.state.push('This field is required');
        }

        if (!this.validateProvince()) {
            this.ensureValidationResultFieldPresence('province', result);
            result.errors.province.push('required');
            result.messages.province.push('This field is required');
        }

        if (!this.validateZipRequired()) {
            this.ensureValidationResultFieldPresence('zip', result);
            result.errors.zip.push('required');
            result.messages.zip.push('This field is required');
        }

        if (!this.validateZipFormat()) {
            this.ensureValidationResultFieldPresence('zip', result);
            result.errors.zip.push('format');
            let code_name = this.form_data.is_canada ? "postal" : "zip";
            result.messages.zip.push('Enter a valid ' + code_name + ' code');
        }

        return result;
    }


    /**
     * Test validity of state field
     * If country is USA, required.  Else valid
     */
    private validateState() {
        if (this.form_data.is_usa) {
            return this.validateRule('required', this.form_data.state);
        }
        return true;
    }

    /**
     * Test validity of province field
     * If country is Canada, required.  Else valid
     */
    private validateProvince() {
        if (this.form_data.is_canada) {
            return this.validateRule('required', this.form_data.province);
        }
        return true;
    }

    /**
     * test validity of the zip/postal code format.
     * If country is USA, validate according to US formatting rules
     * If country is Canada, validate according to Canada formatting rules
     * Otherwise, format is treated as valid
     */
    private validateZipFormat() {
        if (this.form_data.is_usa) {
            return validateUSAZipCode(this.form_data.zip);
        }
        if (this.form_data.is_canada) {
            return validateCanadaPostalCode(this.form_data.zip);
        }
        return true;
    }

    /**
     * Test validity of zip code field presence.
     * If US or Canada, field is required.
     * Otherwise, field is optional
     */
    private validateZipRequired() {
        if (this.form_data.is_usa || this.form_data.is_canada) {
            return this.validateRule('required', this.form_data.zip);
        }
        return true;
    }
}
