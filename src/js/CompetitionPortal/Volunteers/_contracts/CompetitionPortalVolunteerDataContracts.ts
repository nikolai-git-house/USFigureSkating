import {StatusMessageTypeKeyData} from '../../../contracts/data/DataContracts';

export namespace CompetitionPortalVolunteerData {
    /**
     * Represents core information about a volunteer shift
     */
    export interface VolunteerShift {
        description: string;                            // The long-form description of the shift
        end_time_formatted: string;                     // The formatted end time for the shift ("9:00 AM")
        id: string;                                     // Unique identifier for the shift. Used to construct API endpoint URLs
        location_name: string;                          // Name of the location for the shift
        open_positions: number;                         // The number of open positions for the shift
        openings_status: StatusMessageTypeKeyData;      // Controls the color of text in which open_positions is displayed
        position_title: string;                         // The title of the shift position
        requires_compliance: boolean;                   // Whether the shift requires compliance
        start_time_formatted: string;                   // The formatted start time for the shift ("8:00 AM")
        total_positions: number;                        // The total number of positions the shift can accept
    }
}