export interface CompetitionDocuments {
    action_documents: ActionCompetitionDocument[];
    reference_documents: CompetitionDocument[];
}

export interface CompetitionDocument {
    id: number;
    name: string;
    url: string;
}

export interface ActionCompetitionDocument extends CompetitionDocument {
    deadline_formatted?: string;
    is_complete: boolean;
}

export interface ActionDocumentToggleFunction extends FunctionConstructor {
    (document: ActionCompetitionDocument): Promise<void>;
}