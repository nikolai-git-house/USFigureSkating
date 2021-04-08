import {MemberNumber} from '../../../../contracts/AppContracts';
import {ComplianceRequirementsSummaryItemDescribed} from '../../../_contracts/AdminPortalContracts';
import {CheckInSubEntity, CheckInSubEntitySkaterParameters} from '../_contracts/CheckInSubEntityContracts';

export class CheckInSubEntitySkater implements CheckInSubEntity {
    age: number;
    can_be_added_to_roster: boolean;
    cannot_be_added_to_roster_reason: string;
    compliance_summary: ComplianceRequirementsSummaryItemDescribed[];
    first_name: string;
    full_name: string;
    id: number;
    last_name: string;
    member_number: MemberNumber;
    requirements_summary: ComplianceRequirementsSummaryItemDescribed[];

    /**
     * Create a new CheckInSubEntitySkater instance
     */
    constructor(parameters: CheckInSubEntitySkaterParameters) {
        const {age, can_be_added_to_roster, cannot_be_added_to_roster_reason, compliance_summary, first_name, full_name, id, last_name, member_number, requirements_summary} = parameters;
        this.age = age;
        this.can_be_added_to_roster = can_be_added_to_roster;
        this.cannot_be_added_to_roster_reason = cannot_be_added_to_roster_reason;
        this.compliance_summary = compliance_summary;
        this.first_name = first_name;
        this.full_name = full_name;
        this.id = id;
        this.last_name = last_name;
        this.member_number = member_number;
        this.requirements_summary = requirements_summary;
    }

    /**
     * Whether compliance is complete
     */
    get compliance_complete(): boolean {
        for (let i = 0; i < this.compliance_summary.length; i++) {
            const compliance_item = this.compliance_summary[i];
            if (!compliance_item.complete) {
                return false;
            }

        }

        return true;
    }

    /**
     * Whether the skater is checkin-complete
     */
    get is_checkin_complete(): boolean {
        return this.requirements_and_compliance_complete;
    }

    /**
     * Whether compliance and requirements are complete
     */
    get requirements_and_compliance_complete(): boolean {
        return this.requirements_complete && this.compliance_complete;
    }

    /**
     * Whether requirements are complete
     */
    get requirements_complete(): boolean {
        for (let i = 0; i < this.requirements_summary.length; i++) {
            const requirements_item = this.requirements_summary[i];
            if (!requirements_item.complete) {
                return false;
            }

        }

        return true;
    }

}