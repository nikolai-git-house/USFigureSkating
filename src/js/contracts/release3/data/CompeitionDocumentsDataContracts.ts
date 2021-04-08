
/**
 * Represents information related to competition documents for a competition
 */
export type CompetitionDocumentsData = {
    action_documents: ActionCompetitionDocumentData[];           // List of action documents for the competition
    reference_documents: ReferenceCompetitionDocumentData[];     // List of reference documents for the competition
}

/**
 * Represents an Action Competition Document
 */
export interface ActionCompetitionDocumentData extends CompetitionDocumentData {
    deadline_formatted?: string;     // The formatted deadline for completion of the document. If not provided, information will not display
    is_complete: boolean;            // Whether the document has been marked as completed by the active user
}

/**
 * Represents a Reference Competition Document
 */
export interface ReferenceCompetitionDocumentData extends CompetitionDocumentData {}

/**
 * Represents core data for a Competition Document
 */
export interface CompetitionDocumentData {
    id: number;       // Unique identifier for the document
    name: string;     // Name of the document
    url: string;      // URL for the document
}