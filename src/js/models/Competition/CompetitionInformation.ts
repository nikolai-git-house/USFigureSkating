import {CompetitionDocuments} from '../../contracts/app/CompetitionDocumentsContracts';
/* eslint-disable no-continue, jsdoc/require-jsdoc */
import {
    IndexedEventCreditList,
    MusicPPCDeadline,
    MusicPPCInformation,
    SessionLike,
    SessionType
} from '../../contracts/AppContracts';
import {SkatingEventCollection} from '../Collections/SkatingEventCollection';
import {SalesWindow} from '../SalesWindow';
import {SkatingEvent} from '../SkatingEvent';

export type CompetitionInformationParameters = {
    competition_id: number;
    sales_windows: SalesWindow[];
    skating_events: SkatingEvent[];
    practice_ice_instructions: string;
    practice_ice_terminology: string;
    schedulable_session_types: SessionType[];
    pricing_message: string | false;
    music_ppc_deadline_description: string;
    ppc_deadline: MusicPPCDeadline | null;
    music_deadline: MusicPPCDeadline | null;
    /**
     * @deprecated - 2020-06-17
     */
    competition_documents: CompetitionDocuments;

};

export class CompetitionInformation {
    competition_id: number;
    public sales_windows: SalesWindow[] = [];
    public active_sales_window_index: number;
    public schedulable_session_types: SessionType[];
    public pricing_message: string | false = false;
    public music_ppc_deadline_description: string;
    public ppc_deadline: MusicPPCDeadline | null;
    public music_deadline: MusicPPCDeadline | null;
    public practice_ice_terminology: string;
    public practice_ice_instructions: string;
    private _events: SkatingEventCollection;
    /**
     * @deprecated - 2020-06-17
     */
    public competition_documents: CompetitionDocuments;

    constructor(parameters: CompetitionInformationParameters) {
        const {competition_id, sales_windows, skating_events, practice_ice_instructions, practice_ice_terminology, schedulable_session_types, pricing_message = false, music_ppc_deadline_description, ppc_deadline = null, music_deadline = null} = parameters;
        this.competition_id = competition_id;
        this.schedulable_session_types = schedulable_session_types;
        this.sales_windows = sales_windows;
        this.practice_ice_instructions = practice_ice_instructions;
        this.practice_ice_terminology = practice_ice_terminology;
        this.music_ppc_deadline_description = music_ppc_deadline_description;
        this.ppc_deadline = ppc_deadline;
        this.music_deadline = music_deadline;
        this.pricing_message = pricing_message;
        this._events = new SkatingEventCollection(skating_events);
        this.active_sales_window_index = CompetitionInformation._parseActiveSalesWindowIndex(sales_windows);
        /**
         * @deprecated - 2020-06-17
         */
        this.competition_documents = parameters.competition_documents;
    }

    get events(): SkatingEvent[] {
        return this._events.all();
    }

    get event_ids(): number[] {
        return this._events.ids();
    }

    get music_and_ppc_information(): MusicPPCInformation {
        return {
            description: this.music_ppc_deadline_description,
            ppc: this.ppc_deadline,
            music: this.music_deadline
        };
    }

    static blank() {
        return new CompetitionInformation({
            competition_id: -1,
            sales_windows: [],
            skating_events: [],
            practice_ice_instructions: '',
            practice_ice_terminology: '',
            schedulable_session_types: [],
            pricing_message: false,
            music_ppc_deadline_description: '',
            ppc_deadline: null,
            music_deadline: null,
            /**
             * @deprecated - 2020-06-17
             */
            competition_documents: {
                action_documents: [],
                reference_documents: []
            }
        });
    }

    private static _parseActiveSalesWindowIndex(sales_windows: SalesWindow[]): number {
        for (let i = 0; i < sales_windows.length; i++) {
            const sales_window = sales_windows[i];
            if (sales_window.is_passed) {
                continue;
            }
            if (sales_window.is_open) {
                return i;
            }
        }

        return -1;
    }

    getEvent(event_id: number): SkatingEvent | null {
        return this._events.find(event_id);
    }

    getEventTypeLimit(event_id: number, type: SessionType): number {
        const event = this.getEvent(event_id);
        if (!event) {
            return 0;
        }

        return event.getTypeLimit(type);
    }

    getEventTypeCost(event_id: number, type: SessionType): number {
        const event = this.getEvent(event_id);
        if (!event) {
            return 0;
        }

        return event.getTypeCost(type);
    }

    sessionTypeIsSelectable(type: SessionType): boolean {
        return this.schedulable_session_types.indexOf(type) !== -1;
    }

    /**
     * Get an array of the session's types that are skater selectable
     */
    filterSessionSchedulableTypes(session: SessionLike): SessionType[] {
        const valid_session_types = this.schedulable_session_types;

        return session.credit_types.filter(function (session_type: SessionType) {
            return valid_session_types.indexOf(session_type) !== -1;
        });
    }

    getEventsTypeLimits(): IndexedEventCreditList {
        return this._events.getTypeLimits();
    }

}