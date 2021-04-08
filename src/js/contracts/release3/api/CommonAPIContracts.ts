/**
 * Represents a generic API response to a data submission
 */
export interface APISubmissionResponse {
    success: boolean;  // Whether the submission was successful
    error: string;     // Error message if the submission is unsuccessful
}