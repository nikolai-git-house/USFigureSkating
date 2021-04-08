import {StatusMessageTypeKey} from '../../../contracts/AppContracts';

export namespace CompetitionPortalVolunteer {
    /**
     * Base shift model constructor params
     */
    export interface ShiftParams {
        id: string;
        description: string;
        end_time_formatted: string;
        start_time_formatted: string;
        requires_compliance: boolean;
        location_name: string;
        open_positions: number;
        openings_status: StatusMessageTypeKey;
        position_title: string;
        total_positions: number;
    }

    /**
     * Links for My Volunteer Schedule
     */
    export interface MyVolunteerScheduleLinks {
        download_schedule: string;
        user_compliance: string;
        product_support: string;
    }

    /**
     * Links for Shift Selection
     */
    export interface ShiftSelectionLinks {
        download_schedule: string;
        user_compliance: string;
    }

    /**
     * Compliance flag to assign to a shift
     */
    export enum ShiftComplianceFlag {
        required = 'compliance-required',
        compliant = 'compliant',
        non_compliant = 'not-compliant'
    }
}