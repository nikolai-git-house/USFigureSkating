import {EmailRecipientOption, EmailRecipientOptionValue} from '../_contracts/EmailFormContracts';

export interface CategoryIndexedEmailRecipientOptions extends Array<EmailRecipientOption[]> {}

/**
 * Used to track selected email recipients in email form.  Indexes selections by category.
 * Transforms selected data into various other structures
 */
export class CategoryIndexedRecipients {
    /**
     * Make a new CategoryIndexedRecipients instance
     */
    constructor(recipients: CategoryIndexedEmailRecipientOptions = []) {
        this._recipients = recipients.slice();
    }

    /**
     * The selected recipients for the form
     */
    private _recipients: CategoryIndexedEmailRecipientOptions = [];
    /**
     * Getter
     */
    get recipients(): CategoryIndexedEmailRecipientOptions {
        return this._recipients;
    }

    /**
     * Setter
     */
    set recipients(value: CategoryIndexedEmailRecipientOptions) {
        this._recipients = value;
    }

    /**
     * Get the flattened and reduced list of recipients from all categories
     */
    get flattened(): EmailRecipientOption[] {
        return this._recipients.reduce((carry, sub_array) => {
            if (sub_array && sub_array.length) {
                return carry.concat(sub_array);
            }

            return carry;
        }, []);
    }

    /**
     * Get whether there is a selection for each available category
     */
    get is_each_selected(): boolean {
        for (let i = 0; i < this.recipients.length; i++) {
            const recipient = this.recipients[i];
            if (recipient.length === 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Create a display label the stored options
     */
    get label() {
        return this.flattened.reduce((carry, item) => {
            if (carry) {
                carry += '; ';
            }
            carry += item.label;

            return carry;
        }, '');
    }

    /**
     * Get the length of recipient categories
     */
    get length(): number {
        return this._recipients.length;
    }

    /**
     * Get the values for present recipients
     */
    get values(): EmailRecipientOptionValue[] {
        return this.flattened.map((item) => {
            return item.value;
        });
    }

    /**
     * Make a copy
     */
    public clone() {
        return new CategoryIndexedRecipients(this.recipients);
    }
}