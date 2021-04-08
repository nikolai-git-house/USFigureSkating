import {StatusMessageTypeKey} from '../../../../../../contracts/AppContracts';
import {CompetitionPortalVolunteer} from '../../../../_contracts';

export namespace MyVolunteerScheduleShiftCard {

    export enum ComplianceFlag {
        compliant = CompetitionPortalVolunteer.ShiftComplianceFlag.compliant,
        non_compliant = CompetitionPortalVolunteer.ShiftComplianceFlag.non_compliant,
        required = CompetitionPortalVolunteer.ShiftComplianceFlag.required
    }

    export interface Shift {
        start_time_formatted: string;
        end_time_formatted: string;
        position_title: string;
        location_name: string;
        is_approved: boolean;
        is_pending: boolean;
        requires_compliance: boolean;
        total_positions: number;
        open_positions: number;
        description: string;
        openings_status: StatusMessageTypeKey;
    }
}