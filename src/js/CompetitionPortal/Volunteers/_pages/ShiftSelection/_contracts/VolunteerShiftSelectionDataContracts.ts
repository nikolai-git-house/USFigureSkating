import {StatusMessageTypeKeyData} from '../../../../../contracts/data/DataContracts';
import {CompetitionPortalVolunteerData} from '../../../_contracts';

export namespace VolunteerShiftSelectionData {
    /**
     * Represents a location in the shift selection schedule
     */
    export interface Location {
        id: string;         // Unique Identifier for the location
        name: string;       // Name of the location
    }

    /**
     * Represents information about a user-selected shift
     */
    export interface SelectedShiftStatus {
        shift_id: string;                       // The ID of the shift
        status: SelectedShiftStatusKey;         // The status of the shift selection relative to the user (approved, denied, pending)
    }

    /**
     * Represents a shift in shift selection schedule
     */
    export interface Shift extends CompetitionPortalVolunteerData.VolunteerShift {
        date_ts: number;                        // Unix timestamp (in seconds) representing the date of the shift at 12:00AM UTC.  Used for filtering and determining initial state of filter set
        date_formatted: string;                 // String representation of the shift date.  Used for filtering
        location_id: string;                    // ID for the shift's location.  Used to display shift within proper location in UI
        start_datetime_ts: number;              // Unix timestamp representing the start of the shift UTC.  Used to order shifts and for conflict detection.
        end_datetime_ts: number;                // Unix timestamp representing the end of the shift UTC.  Used for conflict detection.
    }

    /**
     * Represents information about a volunteer shift following its selection or removal
     */
    interface ShiftSelectionChangeResponseData {
        open_positions: number;                     // The open positions for the shift following the action
        openings_status: StatusMessageTypeKeyData;  // Controls the UI text color of the openings in the UI
    }

    /**
     * Represents information about a volunteer shift following its selection
     */
    export interface ShiftSelectionChangeSelectedResponseData extends ShiftSelectionChangeResponseData {
        selection_result: 'pending' | 'approved';    // Whether the selection resulted in the shift being in approved or pending status
    }

    /**
     * Represents information about a volunteer shift following its removal
     */
    export interface ShiftSelectionChangeRemovedResponseData extends ShiftSelectionChangeResponseData {
    }

    /**
     * Options for a selected shift's status
     */
    export type SelectedShiftStatusKey =
        | 'approved'                // Shift has been selected and approved
        | 'pending'                 // Shift has been selected and is pending approval
        | 'denied'                  // Shift has been selected and denied
}