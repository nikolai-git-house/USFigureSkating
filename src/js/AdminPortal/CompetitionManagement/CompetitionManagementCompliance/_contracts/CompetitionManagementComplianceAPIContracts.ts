import {
    FetchEmailConfigurationAPIResponse,
    SubmitEmailAPIPayload
} from '../../../EmailForm/_contracts/EmailFormAPIContracts';
import {
    CompetitionManagementComplianceEntityData,
    CompetitionManagementComplianceEntityPositionKeyData
} from './CompetitionManagementComplianceDataContracts';

/**
 * Server response when fetching competition management compliance entities
 */
export interface CompetitionManagementFetchCompetitionComplianceEntitiesAPIResponse extends Array<CompetitionManagementComplianceEntityData> {}

/**
 * Server response when fetching compliance email recipient options
 *
 * Note: BCC Options are set by the frontend.  If BCC key is included in response, it will be ignored
 */
export interface FetchComplianceEmailConfigurationAPIResponse extends FetchEmailConfigurationAPIResponse {
    bcc: undefined;
}

/**
 * Represents an intended recipient configuration for a Compliance Email BCC.  Array of strings
 *
 * Recipient keys fall into two categories - Compliance and Position.  These keys should be used in subtractive logic
 * rather than additive.  For example:
 *
 * SubmitComplianceEmailComplianceConfigurationData = "compliant"
 * SubmitComplianceEmailPositionConfigurationData = "qualifying_coaches"
 *
 * Should result in an email sent to only qualifying coaches that are compliant (as opposed to all qualifying coaches and all compliant entities)
 */
interface SubmitComplianceEmailRecipientConfigurationData extends Array<string> {
    0: SubmitComplianceEmailComplianceConfigurationData; // The first key will identify compliance and will be one of three values

    [index: number]: SubmitComplianceEmailPositionConfigurationData; // The second and further keys will identify position and will be "all_positions," or a list of identified positions
}

/**
 * Server payload when submitting a Compliance Email
 *
 * Data will be posted with a Content-Type: multipart/form-data;
 */
export interface SubmitComplianceEmailAPIPayload extends SubmitEmailAPIPayload {
    bcc: SubmitComplianceEmailRecipientConfigurationData;
}

/**
 * A compliance email recipient configuration for the target entity compliance status
 */
type SubmitComplianceEmailComplianceConfigurationData = 'all_compliance' | 'compliant' | 'non_compliant';

/**
 * A compliance email recipient configuration for the target entity position(s)
 */
type SubmitComplianceEmailPositionConfigurationData =
    'all_positions'
    | CompetitionManagementComplianceEntityPositionKeyData