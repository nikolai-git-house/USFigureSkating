/**
 * Represents a generic member search result item
 */
export interface MemberSearchResultData {
    club_name: string;               // The name of the club the member is affiliated with.
    first_name: string;              // The first name of the member
    id: number;                      // Unique ID for the member
    ineligible: boolean;             // Whether the member is ineligible to participate in sanctioned events
    active: boolean;                 // Whether the member's status is active. When false, result cannot be selected in search results.
    last_name: string;               // The last name of the member
    member_number: number;           // The member number of the member
    state_abbreviation: string;      // The abbreviated state name of the member's location
    city: string;                    // The member's city location
}

/**
 * Represents a more specific MemberSearchResultData item that also includes a gender
 */
export interface GenderedMemberSearchResultData extends MemberSearchResultData {
    gender: "male" | "female";       // The gender of the member
}

/**
 * Represents a search result when using the partner search during competition registration
 * Currently no data differences from GenderedMemberSearchResultData
 */
export interface PartnerMemberSearchResultData extends GenderedMemberSearchResultData {
}