import {MemberSearchResult, MemberSearchResultValidationFunction} from '../../contracts/app/MemberSearchContracts';

/**
 * Validate that a member search result has active status
 */
export const validateResultActive: MemberSearchResultValidationFunction = function (member_result: MemberSearchResult): string | false {
    return member_result.active ? false : 'Ineligible to Participate';
};