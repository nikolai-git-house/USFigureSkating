import {StatusMessageTypeKey} from '../../../../../../contracts/AppContracts';
import {CompetitionPortalVolunteer} from '../../../../_contracts';

export namespace ShiftSelectionShiftCard {
    /**
     * All options for a shift's status
     */
    export enum ShiftStatus {
        new = 'new',
        approved = 'approved',
        pending = 'pending',
        conflict = 'conflict',
        denied = 'denied',
        no_availability = 'no_availability'
    }

    /**
     * Options that are available directly on a compatible shift model
     */
    type ShiftModelStatus =
        ShiftStatus.new |
        ShiftStatus.approved |
        ShiftStatus.pending |
        ShiftStatus.denied |
        ShiftStatus.no_availability;

    export enum ComplianceFlag {
        required = CompetitionPortalVolunteer.ShiftComplianceFlag.required,
        compliant = CompetitionPortalVolunteer.ShiftComplianceFlag.compliant,
        non_compliant = CompetitionPortalVolunteer.ShiftComplianceFlag.non_compliant
    }

    export interface Shift {
        start_time_formatted: string;
        end_time_formatted: string;
        date_formatted: string;
        position_title: string;
        requires_compliance: boolean;
        location_name: string;
        openings_status: StatusMessageTypeKey;
        open_positions: number;
        total_positions: number;
        description: string;
        status: ShiftModelStatus;
    }
}