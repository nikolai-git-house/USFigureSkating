import {PPC} from "../../models/PPC/PPC";

export interface PPCElementType {
    name: string;
    id: number;
}

export interface PPCElementMove {
    id: number;
    category_id: number;
    type_id: number;
    name: string;
    code: string | null;
    is_combo: boolean;
    is_transition: boolean;
    move_count: number;
    exclude_from_combos: boolean;
}

export interface PPCFormOptions {
    types: PPCElementType[];
    moves: PPCElementMove[];
}

export interface ExportedPPCElement {
    moves: PPCElementMove[];
    type: PPCElementType;
    element: PPCElementMove;
    transition_description?: string;
}

export interface ExportedPPC {
    elements: ExportedPPCElement[];
}

export type PPCSaveAPIPayload = {
    ppc: ExportedPPC;
    event_id: number;
    event_segment_id: number;
    competition_id: number;
    competition_skated_event_id: number;
}

export type PPCSavePayload = {
    ppc: PPC;
    competition_id: number;
    event_id: number;
    segment_id: number;
    competition_skated_event_id: number;
}

export type PPCSaveResponse = {
    success: boolean;
    is_complete: boolean;
    last_modified: number | null;
}

export type PPCFetchArgs = {
    competition_id: number;
    event_id: number;
    event_segment_id: number;
    competition_skated_event_id: number;
}

export type PPCOptionFetchParams = {
    event_id: number;
    event_segment_id: number;
    competition_id: number;
    competition_skated_event_id: number;
}