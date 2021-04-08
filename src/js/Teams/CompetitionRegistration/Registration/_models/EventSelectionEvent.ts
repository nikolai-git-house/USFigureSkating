import {TeamRegistration} from '../_contracts';

interface ConstructorParams {
    id: number;
    is_registered_for: boolean;
    is_selected: boolean;
    name: string;
    judging_system: string;
    music_required: boolean;
    ppc_required: boolean;
}

export class EventSelectionEvent implements TeamRegistration.TeamRegistrationEventCardEvent, TeamRegistration.EventSelectionPageEvent {
    id: number;
    is_registered_for: boolean;
    is_selected: boolean;
    name: string;
    judging_system: string;
    music_required: boolean;
    ppc_required: boolean;
    // Extend interface for component; property unused in context
    category: string = 'Synchro';

    constructor(params: ConstructorParams) {
        this.id = params.id;
        this.is_registered_for = params.is_registered_for;
        this.is_selected = params.is_selected;
        this.name = params.name;
        this.judging_system = params.judging_system;
        this.music_required = params.music_required;
        this.ppc_required = params.ppc_required;
    }

    get additional_data(): string[] {
        return [
            `Music: ${this.music_required ? 'Required' : 'Not Required'}`,
            `PPC: ${this.ppc_required ? 'Required' : 'Not Required'}`
        ];
    }
}