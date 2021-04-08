import {MemberNumber} from '../../../../contracts/AppContracts';
import {ComplianceRequirementsSummaryItem} from '../../../_contracts/AdminPortalContracts';
import {CheckInSubEntity, CheckInSubEntityTeamCoachParameters} from '../_contracts/CheckInSubEntityContracts';

export class CheckInSubEntityTeamCoach implements CheckInSubEntity {
    can_be_added_to_roster: boolean;
    cannot_be_added_to_roster_reason: string;
    compliance_summary: ComplianceRequirementsSummaryItem[];
    email_address: string;
    first_name: string;
    full_name: string;
    id: number;
    last_name: string;
    member_number: MemberNumber;
    phone_number: string;

    /**
     * Create a new CheckInSubEntityTeamCoach instance
     */
    constructor(parameters: CheckInSubEntityTeamCoachParameters) {
        const {first_name, full_name, id, last_name, member_number, compliance_summary, can_be_added_to_roster, cannot_be_added_to_roster_reason, email_address, phone_number} = parameters;
        this.first_name = first_name;
        this.full_name = full_name;
        this.id = id;
        this.last_name = last_name;
        this.member_number = member_number;
        this.compliance_summary = compliance_summary;
        this.can_be_added_to_roster = can_be_added_to_roster;
        this.cannot_be_added_to_roster_reason = cannot_be_added_to_roster_reason;
        this.email_address = email_address;
        this.phone_number = phone_number;
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