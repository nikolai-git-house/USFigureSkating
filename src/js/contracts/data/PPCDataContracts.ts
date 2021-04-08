export interface PPCMoveData {
    id: number;
    category_id: number;
    type_id: number;
    description: string;
    code: string | null;
    is_combo: boolean;
    is_transition: boolean;
    number_of_combos: number;
    exclude_from_combos: boolean;
}

export interface PPCTypeData {
    id: number;
    description: string;
}

export interface PPCIndexedTypesData {
    [key: number]: string;
}

export interface PPCIndexedMoveData {
    [key: number]: PPCMoveData;
}

export interface PPCOptionsData {
    type: PPCIndexedTypesData;
    elements: PPCIndexedMoveData;
}

export interface PPCElementData {
    type: PPCTypeData;
    moves: PPCMoveData[];
    element: PPCMoveData;
    transition_description?: string;
}

export interface PPCData {
    event_id: string;
    event_segment_id: string;
    competition_id: string;
    elements: PPCElementData[];
    competition_skated_event_id: string;
}