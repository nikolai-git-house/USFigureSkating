import {
    GenderedMemberSearchResult,
    MemberSearchParameters,
    MemberSearchResult
} from "../contracts/app/MemberSearchContracts";
import {
    GenderedMemberSearchResultData,
    MemberSearchResultData,
    PartnerMemberSearchResultData
} from "../contracts/release3/data/MemberSearchDataContracts";
import {MemberSearchAPIParameters} from "../contracts/release3/api/MemberSearchAPIContracts";

export class MemberSearchAdaptor {
    static adaptResult(raw_data: MemberSearchResultData): MemberSearchResult {
        return {
            ...raw_data
        }
    }

    static adaptResultArray(raw_data: MemberSearchResultData[]): MemberSearchResult[] {
        return raw_data.map(function (item: MemberSearchResultData) {
            return MemberSearchAdaptor.adaptResult(item);
        })
    }

    static adaptGenderedResultArray(raw_data: GenderedMemberSearchResultData[]): GenderedMemberSearchResult[] {
        return raw_data.map(function (item: PartnerMemberSearchResultData) {
            return {
                ...item,
                ...MemberSearchAdaptor.adaptResult(item),
            };
        })
    }

    static adaptMemberSearchParametersToMemberSearchAPIParameters(search_params: MemberSearchParameters): MemberSearchAPIParameters {
        return {
            ...search_params
        }
    }
}