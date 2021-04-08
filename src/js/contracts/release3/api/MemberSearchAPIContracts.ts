import {GenderedMemberSearchResultData, MemberSearchResultData} from "../data/MemberSearchDataContracts";
import {FormOptionDataValue} from "../data/CommonDataContracts";

/**
 * Represents a payload submitted when searching for a member through one of the member search permutations
 */
export interface MemberSearchAPIParameters {
    member_number: string | null;       //  The member number to search against
    first_name: string | null;          //  The first name to search against
    last_name: string | null;           //  The last name to search against
    state: FormOptionDataValue | null;  //  The value of the state option selected
}

/**
 * API response when performing a member search that requires gender information
 */
export interface GenderedMemberSearchResultAPIResponse {
    results: GenderedMemberSearchResultData[];
}

/**
 * API response when performing a standard member search
 */
export interface MemberSearchResultAPIResponse {
    results: MemberSearchResultData[];
}