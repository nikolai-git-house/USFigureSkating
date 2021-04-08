/* ===========================================================================================================
*                                              Data Contracts
* ===========================================================================================================*/
import {
    AttachmentValidationRulesData,
    EmailRecipientOptionCategoryData,
    EmailRecipientOptionValueData
} from './EmailFormDataContracts';

/**
 * An abstract server response when fetching email component configuration options
 */
export interface FetchEmailConfigurationAPIResponse {
    attachment_rules?: AttachmentValidationRulesData;     // Validation rules for email attachments
    bcc?: EmailRecipientOptionCategoryData[];             // The BCC options list
    cc?: EmailRecipientOptionCategoryData[];              // The CC options list.  Key absence or empty array will hide CC form input
}

/**
 * Server payload when submitting an email
 *
 * Data will be posted with a Content-Type: multipart/form-data;
 */
export interface SubmitEmailAPIPayload extends FormData {
    attachments?: File[];                      // Array of file attachments (HTML file input data).
    bcc: EmailRecipientOptionValueData[];     // List of option values for the selected BCC recipients
    cc: EmailRecipientOptionValueData[];      // List of option values for the selected CC recipients
    message: string;                          // Message added by the user
    subject: string;                          // The subject of the email
}