/**
 * Represents an individual support document. Consists of a name and a link to the document
 */
interface SupportDocumentData {
    name: string;                                       // The name of the document
    link: string;                                       // URL for the document
}

/**
 * Represents a subcategory of support documents.  Contains list of individual support documents,
 * and belongs to a parent category.
 */
interface SupportDocumentSubcategoryData {
    name: string | null;                                // The name of the subcategory. If null, no name will display
    documents: SupportDocumentData[];                   // Array of documents belonging to the category
}

/**
 * Represents a top level categorization of support documents (ie: "EMS-Skaters and Coaches")
 */
export interface SupportDocumentCategoryData {
    name: string;                                      // The name of the category
    subcategories: SupportDocumentSubcategoryData[];   // Array of subcategories belonging to the category
}

/**
 * Configuration for a page's "Back" link
 */
export interface BackLinkConfigurationData {
    url: string;            // Link target for the back link
    label?: string;         // Label for the back link. If not provided, will default to "Back"
}