import {MemberNumber, SkaterEventCategoryCoach} from '../../../../contracts/AppContracts';
import {ComplianceRequirementsSummaryItem} from '../../../_contracts/AdminPortalContracts';
import {CheckInSubEntity, CheckInSubEntitySkaterCoachParameters} from '../_contracts/CheckInSubEntityContracts';

export class CheckInSubEntitySkaterCoach implements CheckInSubEntity, SkaterEventCategoryCoach {
    compliance_summary: ComplianceRequirementsSummaryItem[];
    first_name: string;
    id: number;
    ineligible: boolean;
    last_name: string;
    member_number: MemberNumber = '';

    /**
     * Create a new CheckInSubEntitySkaterCoach instance
     */
    constructor(parameters: CheckInSubEntitySkaterCoachParameters) {
        const {first_name, id, last_name, compliance_summary, ineligible} = parameters;
        this.first_name = first_name;
        this.id = id;
        this.last_name = last_name;
        this.compliance_summary = compliance_summary;
        this.ineligible = ineligible;
    }

    /**
     * Whether compliance is complete
     */
    get compliance_complete(): boolean {
        for (const i in this.compliance_summary) {
            if (Object.prototype.hasOwnProperty.call(this.compliance_summary, i)) {
                const complianceElement = this.compliance_summary[i];
                if (!complianceElement.complete) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Whether the coach is checkin-complete
     */
    get is_checkin_complete(): boolean {
        return this.compliance_complete;
    }

}