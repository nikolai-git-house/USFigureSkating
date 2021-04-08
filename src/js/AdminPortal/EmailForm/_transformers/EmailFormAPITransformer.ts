/* eslint-disable jsdoc/require-jsdoc */
import {FetchEmailConfigurationAPIResponse} from '../_contracts/EmailFormAPIContracts';
import {APIEmailConfiguration, EmailRecipientOptionCategory} from '../_contracts/EmailFormContracts';
import {EmailRecipientOptionCategoryData} from '../_contracts/EmailFormDataContracts';

export class EmailFormAPITransformer {
    /**
     * Transform a recipient key to ensure value is a lit of option categories or false
     */
    static transformEmailRecipientKey(recipient_key?: EmailRecipientOptionCategoryData[]): EmailRecipientOptionCategoryData[] {
        return recipient_key ? recipient_key.map((category_data: EmailRecipientOptionCategoryData) => {
            return EmailFormAPITransformer.transformEmailRecipientOptionCategory(category_data);
        }) : [];
    }

    static transformEmailRecipientOptionCategory(data: EmailRecipientOptionCategoryData): EmailRecipientOptionCategory {
        return {
            ...data
        };
    }

    /**
     * Transform a base email configuration.
     */
    static transformFetchEmailConfiguration(data: FetchEmailConfigurationAPIResponse): APIEmailConfiguration {
        return {
            attachment_rules: data.attachment_rules || {},
            cc: EmailFormAPITransformer.transformEmailRecipientKey(data.cc),
            bcc: EmailFormAPITransformer.transformEmailRecipientKey(data.bcc) || []
        };
    }
}