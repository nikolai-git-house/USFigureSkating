import Vue from 'vue';
import {EmailFormFormState} from '../_models/EmailFormFormState';

/**
 * Interface for Email Form component for use externally
 */
export interface EmailFormComponentInterface extends Vue {
    closeSubpages: () => boolean;
    form_data: EmailFormFormState;
}

/**
 * Interface for a service that interacts with the Email Form
 */
export interface EmailFormServiceInterface {
    fetchEmailConfiguration(): Promise<EmailFormStateConfiguration>;

    submitEmail(data: SubmitEmailPayload): Promise<void>;
}

/**
 * Validation rules for email attachments
 */
export type AttachmentValidationRules = {
    valid_types?: string[];
    max_individual_size?: number;
    max_total_size?: number;
}

/**
 * Payload when configuring email state
 *
 * If a key is present, and not false, the value will be updated in state. Otherwise, state will be preserved.
 */
export interface EmailFormStateConfiguration {
    attachment_rules?: AttachmentValidationRules;
    bcc?: EmailRecipientOptionCategory[] | false;
    cc?: EmailRecipientOptionCategory[];
}

/**
 * An email configuration retrieved from the server.
 *
 * Core structure when fetching and transforming an email configuration from the API
 *
 * BCC and CC keys are always present and will contain at the very least an empty array
 */
export interface APIEmailConfiguration {
    attachment_rules?: AttachmentValidationRules;
    bcc: EmailRecipientOptionCategory[];
    cc: EmailRecipientOptionCategory[];
}

/**
 * A form option for an email recipient.
 */
export interface EmailRecipientOption {
    label: string;
    role?: string; // Displays before label if present.  "<role>: Label"
    value: EmailRecipientOptionValue;
}

/**
 * Category of recipient options.  Is an option in its own right, as the category as a whole can be selected
 */
export interface EmailRecipientOptionCategory extends EmailRecipientOption {
    options: EmailRecipientOption[];
}

/**
 * Value for an option.
 */
export type EmailRecipientOptionValue = string | number;

/**
 * Represents data exported from and Email Form
 */
export interface ExportedEmailForm {
    attachments: File[];
    bcc: EmailRecipientOptionValue[];
    cc: EmailRecipientOptionValue[];
    message: string;
    subject: string;
}

/**
 * App payload when submitting an email
 */
export interface SubmitEmailPayload extends FormData {
    attachments?: File[];
    bcc: EmailRecipientOptionValue[];
    cc: EmailRecipientOptionValue[];
    message: string;
}