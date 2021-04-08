import {VolunteerShiftSelectionPage} from '../_contracts';

interface ConstructorParams {
    id: string;
    name: string;
}

export class VolunteerShiftSelectionLocation implements VolunteerShiftSelectionPage.Location {
    id: string;
    name: string;

    /**
     * Create a new instance
     */
    constructor(params: ConstructorParams) {
        this.id = params.id;
        this.name = params.name;
    }
}