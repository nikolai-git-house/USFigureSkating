import {VolunteerShiftSelectionShift} from '../_models';
import {FilterTakeover} from '../../../../../components/FilterTakeover/_contracts';
import {FormOption} from '../../../../../contracts/AppContracts';
import {CompetitionPortalVolunteerService} from '../../../_contracts';

export namespace VolunteerShiftSelection {

    /**
     * All selected filters and free text filter
     */
    export type CompiledFilters = {
        free: string | null;
        dates: number[] | null;
        statuses: FilterOptionStatusValue[] | null;
        compliance_requirements: boolean[] | null;
    }

    /**
     * Represents a window wherein new shifts can't be selected
     */
    export interface ConflictWindow {
        start_ts: number;
        end_ts: number;
        shift_id: string;
    }

    /**
     * A compliance filter option
     */
    export interface FilterOptionCompliance extends FormOption {
        value: boolean;
    }

    /**
     * A date filter option
     */
    interface FilterOptionDate extends FormOption {
        value: number;
    }

    /**
     * A status filter option
     */
    export interface FilterOptionStatus extends FormOption {
        value: FilterOptionStatusValue;
    }

    /**
     * The value property of a status filter option
     */
    export type FilterOptionStatusValue = ShiftStatus;

    /**
     * Shift arrays indexed by location ID
     */
    export type LocationIndexedShifts = { [key: string]: VolunteerShiftSelectionShift[]; };

    /**
     * Configuration object for filter component
     */
    export type ShiftSelectionAvailableFilters = {
        [key: string]: FilterTakeover.AvailableFilterConfiguration;

        dates: FilterTakeover.AvailableFilterConfiguration;
        statuses: FilterTakeover.AvailableFilterConfiguration;
        compliance_requirements: FilterTakeover.AvailableFilterConfiguration;
    }

    /**
     * Object to track selected filter set
     */
    export type ShiftSelectionSelectedFilters = {
        [key: string]: FormOption[];

        dates: FilterOptionDate[];
        statuses: FilterOptionStatus[];
        compliance_requirements: FilterOptionCompliance[];
    }

    /**
     * Shift ID-indexed key indicating the statuses of selected shifts.
     */
    export interface SelectedShiftKey {
        [key: string]: ShiftStatusSelected;
    }

    /**
     * All potential options for status on a shift
     */
    export enum ShiftStatus {
        new = 'new',
        approved = 'approved',
        pending = 'pending',
        conflict = 'conflict',
        denied = 'denied',
        no_availability = 'no_availability',
    }

    /**
     * Options for status on a shift model
     */
    export type ShiftStatusModel =
        ShiftStatus.new
        | ShiftStatus.approved
        | ShiftStatus.pending
        | ShiftStatus.denied
        | ShiftStatus.no_availability;

    /**
     * Options for a selected shift's status
     */
    export type ShiftStatusSelected =
        ShiftStatus.approved
        | ShiftStatus.pending
        | ShiftStatus.denied;

    /**
     * Options for a shift's status following its selection
     */
    export type ShiftStatusPostSelection =
        ShiftStatus.approved
        | ShiftStatus.pending

    /**
     * Selected shift information after selection staged prior to updating UI
     */
    export type PendingShiftSelection = {
        selection_result: CompetitionPortalVolunteerService.SelectVolunteerShiftServiceResponse;
        shift: VolunteerShiftSelectionShift;
    };

    export type PendingShiftRemoval = {
        response: CompetitionPortalVolunteerService.RemoveVolunteerShiftServiceResponse;
        shift: VolunteerShiftSelectionShift;
    }

    /**
     * A shift compatible with the filterer
     */
    export interface FilterableShift {
        date_ts: number;
        id: string;
        position_title: string;
        requires_compliance: boolean;
        status: ShiftStatusModel;
    }
}