import {MONTH_LENGTHS} from '../../constants/DateConstants';
import {StringHelpers} from '../../helpers/StringHelpers';
import {DateInputInputProcessorResult, DateInputParsedValue} from './DateInputExtendedContracts';

/**
 * Process date input value to force validity
 */
export class DateInputInputProcessor {
    /**
     * Create a new DateInputInputProcessor instance
     */
    constructor(input: string, year_length: number = 2) {
        this.input = input;
        this.year_length = year_length;
        this.limit = 4 + year_length;
        this.is_last_key_slash = input[input.length - 1] === '/';
        this._output = input;
        this.sanitizeInput();
        this.processSlash();
        this.processMonth();
        this.processDate();
        this._formatted = this.parseFormat();
        this._value = this.parseValue();
    }

    /**
     * The raw input value
     */
    private input: string;
    /**
     * Whether the last key in the input is a slash "/"
     */
    private is_last_key_slash: boolean;
    /**
     * The limit for the length of numerical input
     */
    private limit: number;
    /**
     * The length of the year value for to process (2- or 4-digit)
     */
    private year_length: number;
    /**
     * The formatted value of the input ("x/x/x")
     */
    private _formatted: string;

    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get formatted(): string {
        return this._formatted;
    }

    /**
     * The output value following running processing on the input value
     */
    private _output: string;

    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get output(): string {
        return this._output;
    }

    /**
     * The parsed value from the input.
     * Contains numerical values for month, day, and/or year depending on segment completion
     */
    private _value: DateInputParsedValue;

    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get value(): DateInputParsedValue {
        return this._value;
    }

    /**
     * Facade to get a processor result
     */
    static processInput(input: string, year_length: number = 2): DateInputInputProcessorResult {
        const processor = new DateInputInputProcessor(input, year_length);

        return processor.getResult();
    }

    /**
     * Get the full processor result
     */
    public getResult(): DateInputInputProcessorResult {
        return {
            value: this._value,
            formatted: this._formatted,
            clean: this._output
        };
    }

    /**
     * Determine if an entered date is valid based on the amount of days in a month
     */
    private dateIsValid(month: number, day: number): boolean {
        const max = MONTH_LENGTHS[String(month)];

        return day <= max;
    }

    /**
     * Format the output
     *
     * 1. Apply slashes after each segment.
     * 2. If last key entered is a slash, and active index allows a slash, add it
     */
    private parseFormat(): string {
        const source = this._output;
        let formatted = source.slice(0, 2);
        if (source.length >= 3 || (this.is_last_key_slash && source.length >= 2)) {
            formatted += '/';
        }
        formatted += source.slice(2, 4);
        if (source.length >= 5 || (this.is_last_key_slash && source.length >= 4)) {
            formatted += '/';
        }
        formatted += source.slice(4);

        return formatted;
    }

    /**
     * Parse the input value
     */
    private parseValue(): DateInputParsedValue {
        let day,
            month,
            year;

        if (this.output.length >= 1) {
            month = parseInt(this.output.slice(0, 2));
        }
        if (this.output.length >= 3) {
            day = parseInt(this.output.slice(2, 4));
        }
        if (this.output.length == 8 || (this.year_length === 2 && this.output.length == 6)) {
            let year_string = this.output.slice(4);
            if (this.year_length === 2 && year_string.length === 2) {
                year_string = '20' + year_string;
            }
            year = parseInt(year_string);
        }

        return {
            day: day ? day : false,
            month: month ? month : false,
            year: year ? year : false
        };
    }

    /**
     * Complete the date segment for input.
     * If date is complete, but entered value is an invalid date (ie: 03/32),
     * prepend "0" and push last digit to year segment to create valid date (03/03/2)
     */
    private processDate(): void {
        if (this._output.length < 4) {
            return;
        }
        const month = parseInt(this._output.slice(0, 2));
        const day = parseInt(this._output.slice(2, 4));
        if (!!month && !!day && !this.dateIsValid(month, day)) {
            this._output = StringHelpers.splice(this._output, 2, '0');
        }
    }

    /**
     * Complete the month segment for input.
     * If month is complete, but entered value is greater than 12,
     * prepend "0" to create valid month and push the last digit to date segment (14 => 01/4)
     */
    private processMonth(): void {
        if (this._output.length < 2) {
            return;
        }
        const month = parseInt(this._output.slice(0, 2));
        if (month > 12) {
            this._output = '0' + this._output;
        }
    }

    /**
     * Complete active segment upon slash character entry at appropriate points
     *
     * Do nothing if:
     *  1. Last character in input is not a slash.
     *  2. Slash is entered anywhere other than a place where it would complete a month or date
     *  3. The last current output character is a "0".
     *
     * Otherwise, append a "0" character to complete the segment.
     *
     * ex: user entry: "1" + "/"
     *     output: "01"
     */
    private processSlash(): void {
        if (!this.is_last_key_slash) {
            return;
        }

        if (this._output.length !== 1 && this._output.length !== 3) {
            return;
        }
        if (this._output[this._output.length - 1] === '0') {
            return;
        }
        this._output = StringHelpers.splice(this._output, this._output.length - 1, '0');
    }

    /**
     * Limit input to proper length, and strip invalid (non-numeric) characters
     */
    private sanitizeInput(): void {
        this._output = this._output.replace(/[^0-9]/g, '')
            .slice(0, this.limit);
    }
}