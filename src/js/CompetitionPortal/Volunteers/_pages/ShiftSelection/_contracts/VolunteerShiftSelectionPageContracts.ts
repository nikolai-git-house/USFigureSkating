import {ShiftSelectionShiftCard} from '../_components/ShiftSelectionShiftCard/_contracts';

export namespace VolunteerShiftSelectionPage {
    /**
     * A location compatible with the shift selection page
     */
    export interface Location {
        name: string;
        id: string;
    }

    /**
     * A shift compatible with the shift selection page
     */
    export interface Shift extends ShiftSelectionShiftCard.Shift {
        id: string;
    }
}