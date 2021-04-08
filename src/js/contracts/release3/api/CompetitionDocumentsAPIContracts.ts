/**
 * Server payload when changing the completion status of a User's Action Competition Document
 *
 * @deprecated 2020-06-24
 */
export type ChangeCompetitionDocumentCompletionAPIPayload = {
    competition_id: number;    // The ID of the related competition
    document_id: number;       // The ID of the document for which the status is changing
    is_complete: boolean;      // Whether the document is being marked complete (true) or incomplete (false)
}