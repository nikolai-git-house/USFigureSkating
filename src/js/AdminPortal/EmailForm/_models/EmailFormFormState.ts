import {EmailRecipientOptionValue, ExportedEmailForm} from '../_contracts/EmailFormContracts';
import {CategoryIndexedRecipients} from './CategoryIndexedRecipients';

/**
 * Tracks form state on email form
 */
export class EmailFormFormState {

    attachments: File[] = [];
    bcc: CategoryIndexedRecipients;
    cc: CategoryIndexedRecipients;
    message: string = '';
    subject: string = '';

    /**
     * Create a new EmailFormFormState instance
     */
    constructor() {
        this.bcc = new CategoryIndexedRecipients();
        this.cc = new CategoryIndexedRecipients();
    }

    /**
     * Get the value list of bcc recipients
     */
    get bcc_values(): EmailRecipientOptionValue[] {
        return this.bcc.values;
    }

    /**
     * Get the value list of cc recipients
     */
    get cc_values(): EmailRecipientOptionValue[] {
        return this.cc.values;
    }

    /**
     * Get the combined CC and BCC value lists
     */
    get target_values(): EmailRecipientOptionValue[] {
        return this.bcc_values.concat(this.cc_values);
    }

    /**
     * Export the form
     */
    export(): ExportedEmailForm {
        return {
            attachments: this.attachments,
            cc: this.cc_values,
            bcc: this.bcc_values,
            message: this.message,
            subject: this.subject
        };
    }
}