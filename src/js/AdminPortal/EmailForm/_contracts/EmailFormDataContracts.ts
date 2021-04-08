/**
 * Represents an option for an email recipient
 */
export interface EmailRecipientOptionData {
    label: string;                            // The primary label for the option (recipient name)
    role?: string;                            // Optional role for the option. Displays in selection list.
    value: EmailRecipientOptionValueData;     // Value to identify the option.  Used in submission of selections
}

/**
 * Represents a category of recipients for an email.
 *
 * Note extension of EmailRecipientOptionData.  This both contains sub-items of this type, and is an item of this type.
 */
export interface EmailRecipientOptionCategoryData extends EmailRecipientOptionData {
    options: EmailRecipientOptionData[];     // The sub-options of the category
}

/**
 * Represents a value associated with an EmailRecipientOptionData element.
 *
 * Should be a unique value to identify the option.  Used in data submission.
 */
export type EmailRecipientOptionValueData = string | number;

/**
 * Represents attachment rules for an email form.
 *
 * All keys are optional.  If a key is empty, that category of validation rules will not be enforced
 */
export type AttachmentValidationRulesData = {
    valid_types?: string[];           // List of valid MIME types for files
    max_individual_size?: number;     // Maximum individual attachment size (base-10 bytes)
    max_total_size?: number;          // Maximum collective attachment size (base-10 bytes)
}