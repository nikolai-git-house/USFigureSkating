import {AbstractAPIService} from './AbstractAPIService';
import {MemberSearchParameters, MemberSearchResult} from '../contracts/app/MemberSearchContracts';
import axios from 'axios';
import {
    MemberSearchAPIParameters,
    MemberSearchResultAPIResponse
} from '../contracts/release3/api/MemberSearchAPIContracts';
import {MemberSearchAdaptor} from '../adaptors/MemberSearchAdaptor';

export class MemberSearchService extends AbstractAPIService {
    /**
     * Generic member search and response transformation
     */
    static memberSearch<I extends MemberSearchResult = MemberSearchResult, R extends MemberSearchResultAPIResponse = MemberSearchResultAPIResponse>(search_params: MemberSearchParameters, url_override?: string): Promise<I[]> {
        const url = url_override || '/api/member-search';

        return new Promise(function (resolve, reject) {
            axios.post(url,
                <MemberSearchAPIParameters>MemberSearchAdaptor.adaptMemberSearchParametersToMemberSearchAPIParameters(search_params))
                .then(function (response: { data: R; }) {
                    if (response.data.results) {
                        resolve(MemberSearchAdaptor.adaptResultArray(response.data.results) as I[]);
                    }
                    reject();
                })
                .catch(function () {
                    reject();
                });
        });
    }
}