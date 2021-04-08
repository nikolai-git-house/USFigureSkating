/**
 * The parsed value from an extended date input.  Reports complete values for m/d/y keys
 * year, if present, will always be a 4-digit year
 */
export type DateInputParsedValue = {
    day: number | false;
    month: number | false;
    year: number | false;
};
/**
 * The complete emitted value from an extended date input.  Includes parsed value, cleaned value and formatted value
 */
export type DateInputCompleteValue = {
    value: DateInputParsedValue;
    formatted: string;
    clean: string;
};
/**
 * Result when running a date processor
 */
export type DateInputInputProcessorResult = {
    value: DateInputParsedValue;
    formatted: string;
    clean: string;
};