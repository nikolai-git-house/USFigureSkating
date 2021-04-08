import {CompetitionHeadingData} from '../../data/CompetitionFieldDataContracts';
import {SupportDocumentCategoryData} from '../data/AppDataContracts';

/**
 * Response when retrieving Support Documents list
 */
export interface FetchSupportDocumentsAPIResponse {
    categorized_support_documents: SupportDocumentCategoryData[];   // Object containing support documents grouped by category and subcategory
}

/**
 * Server response when fetching the page heading data for a Competition
 */
export interface FetchCompetitionPageHeadingAPIResponse extends CompetitionHeadingData {}