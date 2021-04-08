import * as CardValidator from "card-validator";
import {DATE_INPUT_GAP_SEPARATOR} from "../config/AppConfig";

/**
 * VALIDATION HELPERS
 */
export function validateRequired(field: any, invalidateZero: boolean) {
    if (field === undefined || field === null) {
        return false;
    }
    if (field === "0" && invalidateZero) {
        return false;
    }
    return !!String(field).trim().length;
}

export function validateMaxLength(field: any, length: number) {
    if (field === undefined || field === null) {
        return false;
    }
    return !!(String(field).trim().length <= length);
}

export function validateMinLength(field: any, length: number) {
    if (field === undefined || field === null) {
        return false;
    }
    return !!(String(field).trim().length >= length);
}

/**
 * Rudimentary email validation
 * Match [anything] @ [anything] . [anything]
 */
export function validateEmail(field: any) {
    if (field === undefined || field === null) {
        return false;
    }
    return !!String(field).match(/.+@.+\..+/i);
}

/**
 * Validate an email's format if it exists.
 * falsy field values pass validation
 */
export function validateNullableEmail(field: any) {
    if (field === undefined || field === null || field === "") {
        return true;
    }
    return validateEmail(field);
}

/**
 * Check that the value, if present, matches one of USA postal code formats (where X is numeric):
 *
 * XXXXX
 * XXXXX-XXXX
 */
export function validateUSAZipCode(field: any) {
    // empty fields pass validation
    if (field === undefined || field === null) {
        return true;
    }
    let regex = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
    return regex.test(field);
}

/**
 * Check that the value, if present, matches CAN postal code formats (where X is alpha-numeric):
 *
 * XXXXXX
 * XXX XXX
 */
export function validateCanadaPostalCode(field: any) {
    // empty fields pass validation
    if (field === undefined || field === null) {
        return true;
    }
    let regex = new RegExp(/(^[A-Za-z0-9]{6}$)|(^[A-Za-z0-9]{3}\s[A-Za-z0-9]{3}$)/);
    return regex.test(field);
}

/**
 * Validate a date is formatted in MM/DD/YYYY format
 */
export function validateDateFormatted(field: any): boolean {
    if (field === undefined || field === null || field === '') {
        return true;
    }
    const regex_string = "[0-9]{2}\\" + DATE_INPUT_GAP_SEPARATOR + "[0-9]{2}\\" + DATE_INPUT_GAP_SEPARATOR + "[0-9]{4}";
    const regex = new RegExp(regex_string);
    if (!regex.test(field)) {
        return false;
    }
    const split = field.split(DATE_INPUT_GAP_SEPARATOR);
    const month = parseInt(split[0]);
    const day = parseInt(split[1]);

    const month_max_config: { [key: number]: number } = {
        1: 31,
        2: 29,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    };
    if (month < 1 || month > 12) {
        return false;
    }
    if (day < 1) {
        return false;
    }
    if (month_max_config[month] < day) {
        return false;
    }
    return true;

}

/**
 * Validate a date is not in the future.  If date is not in the proper format, it will pass here
 */
export function validateDateNotFuture(field: any): boolean {
    if (field === undefined || field === null || !validateDateFormatted(field)) {
        return true;
    }
    let split = field.split(DATE_INPUT_GAP_SEPARATOR);
    const month = parseInt(split[0]);
    const day = parseInt(split[1]);
    const year = parseInt(split[2]);

    const current_year = new Date().getFullYear();
    const current_month = new Date().getMonth() + 1;
    const current_day = new Date().getDate();

    if (year > current_year) {
        return false;
    }

    if (year == current_year && month > current_month) {
        return false;
    }

    return !(year == current_year && month == current_month && day > current_day);
}


/**
 * Validate a zip code
 * Check against a regexp for formatting, then min and max lengths
 * regexp: check for 1+ numerics, followed by optional spaces, dashes and numerics
 */
export function validateZipCode(field: any) {
    if (field === undefined || field === null) {
        return false;
    }
    let zip_regexp = /^[0-9]+(?:[-\s]*)?(?:[0-9]*)?$/;
    if (zip_regexp.test(field) !== true) {
        return false;
    }
    return validateMinLength(field, 5) && validateMaxLength(field, 10);
}

/**
 * Verify the value is numeric and 3-4 characters long
 */
export function validateCVC(field: any) {
    if (field === undefined || field === null) {
        return false;
    }
    let cvc_regexp = /^[0-9]{3,4}?$/;
    if (cvc_regexp.test(field) === true) {
        return true;
    }
    return false;
}


export function validateCreditCardNumber(field: any) {
    if (field === undefined || field === null) {
        return false;
    }
    let validation_result = CardValidator.number(field);
    return validation_result.isValid;

}

export function validateExpiration(expiration_month: number, expiration_year: number) {
    let current_year = new Date().getFullYear();
    if (expiration_year > current_year) {
        return true;
    }
    let current_month = new Date().getMonth() + 1;
    return current_month <= expiration_month;
}

/**
 * Validate a field value is a number.  Null field values pass
 *
 * Fail if input can't be parsed into an integer
 *
 * Fail if input contains characters other than number characters
 */
export function validateInteger(field_value: any) {
    if (field_value === undefined || field_value === null || field_value === "") {
        return true;
    }
    if (isNaN(parseInt(field_value))) {
        return false;
    }
    let regex = new RegExp('^[0-9]+$');
    return regex.test(field_value);
}

/**
 * Validate that input number is less than a max.
 *
 * If the value is undefined or not capable of being parsed into an integer
 * pass validation
 */
export function validateMax(field_value: any, max: number) {
    if (field_value === undefined || field_value === null) {
        return true;
    }
    let int = parseInt(field_value);
    if (isNaN(int)) {
        return true;
    }
    return int <= max;
}

/**
 * Ensure two fields are equal.  If corresponding value is absent, valid
 */
export function validateEqual(field_value: any, corresponding_value: any) {
    if (corresponding_value === null || typeof corresponding_value === "undefined") {
        return true;
    }
    return field_value === corresponding_value;
}

/**
 * Verify a field has been confirmed
 */
export function validateConfirmed(field: any) {
    if (field === undefined || field === null) {
        return false;
    }
    return field !== false;
}