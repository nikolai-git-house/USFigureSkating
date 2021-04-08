export class MaxValidationRule {
    max: number;

    constructor(max: number) {
        this.max = max;
    }

    toString() {
        return "max:" + this.max;
    }
}

export class MinLengthValidationRule {
    min: number;

    constructor(min: number) {
        this.min = min;
    }

    toString() {
        return "min_length:" + this.min;
    }
}

export class EqualValidationRule {
    field: string;

    constructor(field: string) {
        this.field = field;
    }

    toString() {
        return "equal:" + this.field;
    }
}

export type ValidationRule =
    (
        "required"
        | "zip"
        | "cvc"
        | "credit_card_number"
        | "expiration_date"
        | "integer"
        | "email"
        | MaxValidationRule
        | EqualValidationRule
        | MinLengthValidationRule
        | "date_formatted"
        | "date_not_future"
        | "nullable_email"
        | "confirmed"
        )