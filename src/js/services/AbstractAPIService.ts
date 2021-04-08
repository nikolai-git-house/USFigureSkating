import axios from 'axios';
import {MemberSearchAdaptor} from '../adaptors/MemberSearchAdaptor';
import {MemberSearchParameters, MemberSearchResult} from '../contracts/app/MemberSearchContracts';
import {SubmissionResponse} from '../contracts/AppContracts';
import {APISubmissionResponse} from '../contracts/release3/api/CommonAPIContracts';
import {
    MemberSearchAPIParameters,
    MemberSearchResultAPIResponse
} from '../contracts/release3/api/MemberSearchAPIContracts';

export type SubmissionResponseTransformationFunction<R, O> = (response_data: R) => O
export type SubmissionResponseValidationFunction<R> = (response_data: R) => boolean;

export interface FetchAndTransformResponseParameters<R, O> {
    transformResponse: SubmissionResponseTransformationFunction<R, O>;
    url: string;
    validateResponse?: SubmissionResponseValidationFunction<R>;
}

type MemberSearchPayloadTransformationFunction<A extends MemberSearchParameters, P extends MemberSearchAPIParameters> = ((data: A) => P);

export interface MemberSearchSubmitParameters<A extends MemberSearchParameters, P extends MemberSearchAPIParameters> {
    error_message?: string;
    payload: MemberSearchParameters;
    transformPayload?: MemberSearchPayloadTransformationFunction<A, P>;
    transformResponse?: SubmissionResponseTransformationFunction<MemberSearchResultAPIResponse, MemberSearchResult[]>;
    url: string;
    validateResponse?: SubmissionResponseValidationFunction<MemberSearchResultAPIResponse>;
}

export interface SubmitForAPISubmissionResponseParameters {
    error_message: string;
    method?: 'post' | 'delete' | 'put' | 'patch';

    payload: any;
    url: string;
}

export interface SubmitWithTransformedResponseParameters<R, O> {
    error_message: string;
    method?: 'post' | 'delete' | 'put' | 'patch';
    payload: any;
    transformResponse: SubmissionResponseTransformationFunction<R, O>;
    url: string;
    validateResponse?: SubmissionResponseValidationFunction<R>;
}

export abstract class AbstractAPIService {

    /**
     * Fetch information from the API and transform the response
     */
    protected static fetchAndTransformResponse<R, O>(parameters: FetchAndTransformResponseParameters<R, O>): Promise<O> {
        const {url, validateResponse, transformResponse} = parameters;

        return new Promise((resolve, reject) => {
            axios.get(url)
                .then((response: { data: R; }) => {
                    if (typeof validateResponse === 'undefined' || validateResponse(response.data)) {
                        resolve(transformResponse(response.data));

                        return;
                    }
                    reject();
                })
                .catch(() => {
                    reject();
                });
        });

    }

    /**
     * Submit an API request and handle the expected APISubmissionResponse response
     */
    protected static submitForAPISubmissionResponse(parameters: SubmitForAPISubmissionResponseParameters): Promise<void> {
        const {url, payload} = parameters;
        let error_message = parameters.error_message;
        const method = parameters.method || 'post';

        return new Promise((resolve, reject) => {
            axios.request({
                data: payload,
                url,
                method
            })
                .then((response: { data: APISubmissionResponse; }) => {
                    if (response.data && response.data.success) {
                        resolve();

                        return;
                    }
                    if (response.data.error) {
                        error_message = response.data.error;
                    }
                    reject(error_message);
                })
                .catch(() => {
                    reject(error_message);
                });
        });
    }

    /**
     * Submit a member search
     */
    protected static submitMemberSearch<A extends MemberSearchParameters, P extends MemberSearchAPIParameters>(parameters: MemberSearchSubmitParameters<A, P>): Promise<MemberSearchResult[]> {
        const error_message = parameters.error_message || 'Search error. Please try again';
        const {payload, url} = parameters;

        const transform = parameters.transformPayload || ((data: A): P => {
            return MemberSearchAdaptor.adaptMemberSearchParametersToMemberSearchAPIParameters(data) as P;
        });

        const api_payload: MemberSearchAPIParameters = transform(payload as A);

        const validateResponse = parameters.validateResponse || ((response_data: MemberSearchResultAPIResponse) => {
            return !!response_data && !!response_data.results;
        });

        const transformResponse = parameters.transformResponse || ((response_data: MemberSearchResultAPIResponse): MemberSearchResult[] => {
            return MemberSearchAdaptor.adaptResultArray(response_data.results);
        });

        return new Promise((resolve, reject) => {
            axios.post(url, api_payload)
                .then((response: { data: MemberSearchResultAPIResponse; }) => {
                    if (validateResponse(response.data)) {
                        resolve(transformResponse(response.data));

                        return;
                    }
                    reject(error_message);
                })
                .catch(() => {
                    reject(error_message);
                });
        });
    }

    /**
     * Submit an API request with an expected response payload. Validate then transform the response payload
     *
     * R represents the API response
     * O represents the transformed outcome
     */
    protected static submitWithTransformedResponse<R extends SubmissionResponse, O>(parameters: SubmitWithTransformedResponseParameters<R, O>): Promise<O> {
        const {url, payload, transformResponse} = parameters;
        const method = parameters.method || 'post';
        const validateResponse = parameters.validateResponse || ((response_data: R) => {
            return !!response_data && !!response_data.success;
        });
        let {error_message} = parameters;

        return new Promise((resolve, reject) => {
            axios.request({
                data: payload,
                url,
                method
            })
                .then((response: { data: R; }) => {
                    if (validateResponse(response.data)) {
                        resolve(transformResponse(response.data));

                        return;
                    }
                    if (response.data.error) {
                        error_message = response.data.error;
                    }
                    reject(error_message);
                })
                .catch(() => {
                    reject(error_message);
                });
        });
    }

    /**
     * Get a value from a cookie using the cookie name
     */
    public static getValueFromCookie(cookie_name: string, cookie_descriptor: string = '', suppress_warnings?: boolean) {
        let cookie_value = '';
        if (cookie_name) {
            const pattern = `(?:(?:^|.*;\\s*)${cookie_name}\\s*\\=\\s*([^;]*).*$)|^.*$`;
            const cookieValue = document.cookie.replace(new RegExp(pattern), '$1');
            cookie_value = cookieValue.trim();
            if (cookie_value !== '') {
                return cookie_value;
            }
        }
        if (!suppress_warnings) {
            console.warn(`Unable to retrieve ${cookie_descriptor} cookie value`);
        }
        throw `Unable to retrieve ${cookie_descriptor} cookie value`;
    }
}