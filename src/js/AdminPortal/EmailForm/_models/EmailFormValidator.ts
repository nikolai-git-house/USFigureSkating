import {SKIP_VALIDATION} from '../../../config/AppConfig';
import {formatBytes} from '../../../helpers/FileSizeHelpers';
import {FormValidator, FormValidatorResult} from '../../../models/FormValidator';
import {ValidationRule} from '../../../models/ValidationRules';
import {AttachmentValidationRules} from '../_contracts/EmailFormContracts';

export type AttachmentsValidationResult = { [key: string]: string[]; } | null;

export type EmailFormValidatorResult = { result: FormValidatorResult; attachments: AttachmentsValidationResult; };

export class EmailFormValidator extends FormValidator {
    protected attachment_rules: AttachmentValidationRules = {};
    protected rules: { [key: string]: ValidationRule[]; } = {
        message: ['required'],
        subject: ['required']
    };

    /**
     * Override base validate method to add conditional rules
     */
    validate(): FormValidatorResult {
        if (SKIP_VALIDATION) {
            return {
                errors: {},
                messages: {}
            };
        }
        const result = super.validate();

        if (!this.validateTargets()) {
            this.ensureValidationResultFieldPresence('target_values', result);
            result.errors.target_values.push('required');
            result.messages.target_values.push('At least one recipient is required.');
        }

        if (!this.validateCollectiveAttachments()) {
            const max_size = this.attachment_rules.max_total_size ? formatBytes(this.attachment_rules.max_total_size) : null;
            const message = `Maximum total attachments size ${max_size ? `of ${max_size}` : ''} exceeded.`;
            this.ensureValidationResultFieldPresence('attachments', result);
            result.errors.attachments.push('size');
            result.messages.attachments.push(message);
        }

        return result;
    }

    /**
     * Validate form itself and attachments
     */
    validateAll(attachment_rules: AttachmentValidationRules): EmailFormValidatorResult {
        this.attachment_rules = attachment_rules;

        return {
            result: this.validate(),
            attachments: this.validateAttachments()
        };
    }

    /**
     * Validate individual attachments against rules
     */
    public validateAttachments(): AttachmentsValidationResult {
        const result: AttachmentsValidationResult = {};
        for (let i = 0; i < this.form_data.attachments.length; i++) {
            const errors = this.attachmentValidationErrors(this.form_data.attachments[i]);
            if (errors) {
                result[i.toString()] = errors;
            }
        }

        return Object.keys(result).length !== 0 ? result : null;
    }

    /**
     * Get validation errors for a single attachment
     */
    private attachmentValidationErrors(attachment: File): string[] | null {
        const max_size = this.attachment_rules.max_individual_size || false;
        const valid_types = this.attachment_rules.valid_types || false;
        const errors = [];

        /**
         * Validate Size
         */
        if (max_size && attachment.size > max_size) {
            errors.push(`${formatBytes(attachment.size)} exceeds limit of ${formatBytes(max_size)} per file.`);
        }

        /**
         * Validate Type
         */
        if (valid_types && valid_types.indexOf(attachment.type) === -1) {
            errors.push(this.validationTypeMessage(attachment.type, valid_types));
        }

        return errors.length ? errors : null;
    }

    /**
     * Validate rules against full set of attachments
     */
    private validateCollectiveAttachments() {
        const limit = this.attachment_rules.max_total_size;
        if (typeof limit !== 'number') {
            return true;
        }
        let total_bytes = 0;
        for (let i = 0; i < this.form_data.attachments.length; i++) {
            const attachment: File = this.form_data.attachments[i];
            total_bytes += attachment.size;
        }

        return total_bytes <= limit;
    }

    /**
     * Validate that a BCC and a CC have been selected
     */
    private validateTargets() {
        return this.form_data.bcc.values.length || this.form_data.cc.values.length;
    }

    /**
     * Get error message for invalid attachment type.
     */
    private validationTypeMessage(attachment_type: string, valid_types: string[]) {
        const type_descriptor = valid_types.length > 1 ? 'types are' : 'type is';
        const and_type = valid_types.length > 1 ? valid_types.pop() : null;

        let supported_segment = `'${valid_types.join('\', \'')}'`;
        if (and_type) {
            supported_segment += ` and '${and_type}'`;
        }

        return `File type '${attachment_type}' unsupported. Supported ${type_descriptor} ${supported_segment}.`;
    }
}