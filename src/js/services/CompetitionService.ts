import axios from 'axios';
import {VolunteerOpportunitiesAPIAdaptor} from '../adaptors/APIAdaptors/VolunteerOpportunitiesAPIAdaptor';
import {CompetitionContactDataAdaptor} from '../adaptors/CompetitionContactDataAdaptor';
import {CompetitionDataAdaptor} from '../adaptors/CompetitionDataAdaptor';
import {CompetitionInformationDataAdaptor} from '../adaptors/CompetitionInformationDataAdaptor';
import {CompetitionScheduleDataAdaptor} from '../adaptors/CompetitionScheduleDataAdaptor';
import {FetchCompetitionScheduleAPIResponse} from '../CompetitionSchedule/_contracts/CompetitionScheduleAPIContracts';
import {FetchCompetitionScheduleServiceResponse} from '../CompetitionSchedule/_contracts/CompetitionScheduleContracts';
import {URL_CONFIG} from '../config/AppConfig';
import {ActionCompetitionDocument} from '../contracts/app/CompetitionDocumentsContracts';
import {SubmitCompetitionVolunteerRequestServiceResponse} from '../contracts/app/VolunteerOpportunitiesContracts';
import {
    CompetitionHeadingSource,
    FetchCompetitionContactsServiceResponse
} from '../contracts/AppContracts';
import {FetchCompetitionContactsAPIResponse} from '../contracts/data/DataContracts';
import {
    FetchCompetitionPageHeadingAPIResponse
} from '../contracts/release3/api/AppAPIContracts';
import {ChangeCompetitionDocumentCompletionAPIPayload} from '../contracts/release3/api/CompetitionDocumentsAPIContracts';
import {
    SubmitCompetitionVolunteerRequestAPIResponse,
    SubmitVolunteerRequestAPIPayload
} from '../contracts/release3/api/VolunteerOpportunitiesAPIContracts';
import {FetchSearchCompetitionListAPIResponse} from '../pages/SearchCompetitions/SearchCompetitionsAPIContracts';
import {SearchCompetitionsCompetition} from '../pages/SearchCompetitions/SearchCompetitionsContracts';
import {SearchCompetitionsTransformer} from '../pages/SearchCompetitions/SearchCompetitionsTransformer';
import {FetchViewCompetitionAPIResponse} from '../pages/ViewCompetition/ViewCompetitionAPIContracts';
import {ViewCompetitionCompetition} from '../pages/ViewCompetition/ViewCompetitionCompetition';
import {ViewCompetitionTransformer} from '../pages/ViewCompetition/ViewCompetitionTransformer';
import {AbstractAPIService} from './AbstractAPIService';
import {VolunteerRequestFormData} from '../models/Forms/VolunteerRequestFormState';
import {DataNavigationLinkTransformer} from '../CompetitionPortal/_transformers/DataNavigationLinkTransformer';

/**
 * COMPETITION SERVICE
 *
 * Service class for managing data related to Competitions
 */
export class CompetitionService extends AbstractAPIService {
    /**
     * Fetch the competition heading data for a competition
     */
    static fetchCompetitionPageHeading(competition_id: number) {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition_id}/page-heading`,
            /**
             * Validate that the response is present and is an object
             */
            validateResponse: function (response_data: FetchCompetitionPageHeadingAPIResponse): boolean {
                return !!response_data && typeof response_data === 'object';
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchCompetitionPageHeadingAPIResponse): CompetitionHeadingSource {
                return {
                    ...response_data,
                    directions: response_data.directions || [],
                    announcement_url: response_data.announcement_url || null,
                    website_url: response_data.website_url || null,
                    id: competition_id
                };
            }
        });

    }

    /**
     * Fetch and construct competition list
     */
    public static getCompetitionList() {
        return new Promise(function (resolve, reject) {
            axios.get(URL_CONFIG.getCompetitionList)
                .then(function (response) {
                    if (response.data) {
                        resolve(CompetitionDataAdaptor.adaptArray(response.data));
                    }
                    reject();
                })
                .catch(function () {
                    reject();
                });
        });
    }

    /**
     * Fetch and construct competition list
     */
    public static getCompetitionListSearch(): Promise<SearchCompetitionsCompetition[]> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: '/api/search-competitions',
            /**
             * Validate that the response is an array
             */
            validateResponse: function (response_data: FetchSearchCompetitionListAPIResponse): boolean {
                return !!response_data && typeof response_data.competitions === 'object';
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchSearchCompetitionListAPIResponse): SearchCompetitionsCompetition[] {
                return SearchCompetitionsTransformer.transformFetchSearchCompetitionList(response_data);
            }
        });
    }

    /**
     * Get the competition information for a competition
     *
     * @deprecated 2020-07-29
     */
    static getCompetitionInformation(competition_id: number) {
        return new Promise(function (resolve, reject) {
            axios.get('/api/competitions/' + competition_id + '/information')
                .then(function (response) {
                    if (response.data) {
                        resolve(CompetitionInformationDataAdaptor.adapt(response.data));
                    }
                    reject();
                })
                .catch(function () {
                    reject();
                });
        });
    }

    /**
     * Get the schedule for a competition
     *
     * @deprecated 2020-07-29
     */
    static getCompetitionSchedule(competition_id: any): Promise<FetchCompetitionScheduleServiceResponse> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition_id}/schedule`,
            /**
             * Validate that the response contains the proper structures
             */
            validateResponse: function (response_data: FetchCompetitionScheduleAPIResponse): boolean {
                if (!response_data || typeof response_data !== 'object') {
                    return false;
                }
                // Verify schedule data is provided if unavailable flag is not set
                if (!response_data.schedule_unavailable) {
                    const required_keys = [
                        'facilities',
                        'rinks',
                        'sessions'
                    ];
                    for (let i = 0; i < required_keys.length; i++) {
                        const requiredKey = required_keys[i];
                        if (!(requiredKey in response_data)) {
                            console.warn(`Required key "${requiredKey}" missing from available competition schedule data.`);

                            return false;
                        }
                    }
                }

                return true;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchCompetitionScheduleAPIResponse): FetchCompetitionScheduleServiceResponse {
                if (response_data.schedule_unavailable) {
                    return {
                        schedule_available: false
                    };
                }

                return {
                    schedule_available: true,
                    schedule: CompetitionScheduleDataAdaptor.adapt(response_data)
                };
            }
        });
    }

    /**
     * Get the list of contacts for a competition
     *
     * @deprecated 2020-07-01; see:CompetitionPortalApiService.fetchCompetitionContacts
     */
    static getCompetitionContacts(competition_id: number): Promise<FetchCompetitionContactsServiceResponse> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/competitions/${competition_id}/contacts`,
            /**
             * Validate that the response contains the proper structures
             */
            validateResponse: function (response_data: FetchCompetitionContactsAPIResponse): boolean {
                return !!response_data && typeof response_data.contacts === 'object';
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchCompetitionContactsAPIResponse): FetchCompetitionContactsServiceResponse {
                return {
                    contacts: CompetitionContactDataAdaptor.adaptArray(response_data.contacts)
                };
            }
        });
    }

    /**
     * Fetch the ViewCompetitionCompetition for a competition ID
     *
     * @deprecated 2020-06-24
     */
    static fetchViewCompetitionCompetition(competition_id: number): Promise<ViewCompetitionCompetition> {
        return AbstractAPIService.fetchAndTransformResponse({
            url: `/api/view-competition/${competition_id}`,
            /**
             * Validate that the response is present and is an object
             */
            validateResponse: function (response_data: FetchViewCompetitionAPIResponse): boolean {
                return !!response_data && typeof response_data === 'object';
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response_data: FetchViewCompetitionAPIResponse): ViewCompetitionCompetition {
                return ViewCompetitionTransformer.transformFetchViewCompetitionCompetition(response_data);
            }
        });
    }

    /**
     * Submit a volunteer request for a competition (from view competition page)
     */
    static submitCompetitionVolunteerRequest(competition_id: number, form_data: VolunteerRequestFormData): Promise<SubmitCompetitionVolunteerRequestServiceResponse> {

        return AbstractAPIService.submitWithTransformedResponse({
            error_message: 'Error submitting request.',
            url: `/api/competitions/${competition_id}/volunteer-request`,
            payload: <SubmitVolunteerRequestAPIPayload>VolunteerOpportunitiesAPIAdaptor.adaptVolunteerRequestExperienceFormDataToSubmitVolunteerRequestAPIPayload(form_data),
            /**
             * Validate the server response
             */
            validateResponse: function (response_data: SubmitCompetitionVolunteerRequestAPIResponse) {
                return !!response_data
                    && !!response_data.success
                    && typeof response_data.confirmation_message !== 'undefined'
                    && typeof response_data.volunteer_cta_configuration === 'object';
            },
            /**
             * Transform the server response
             */
            transformResponse: function (response_data: SubmitCompetitionVolunteerRequestAPIResponse): SubmitCompetitionVolunteerRequestServiceResponse {

                const response: SubmitCompetitionVolunteerRequestServiceResponse = {
                    volunteer_cta_configuration: response_data.volunteer_cta_configuration,
                    confirmation_message: response_data.confirmation_message
                };
                if (response_data.competition_user_navigation) {
                    response.user_navigation = response_data.competition_user_navigation.map((data) => {
                        return DataNavigationLinkTransformer.transformDataNavigationLink(data);
                    });
                }

                return response;
            }
        });
    }

    /**
     * Update the completion status on a competition document
     */
    static updateCompetitionDocumentCompletionStatus(document: ActionCompetitionDocument, competition_id: number): Promise<void> {
        const payload: ChangeCompetitionDocumentCompletionAPIPayload = {
            competition_id,
            document_id: document.id,
            is_complete: !document.is_complete
        };

        return AbstractAPIService.submitForAPISubmissionResponse({
            error_message: 'Error updating document status',
            method: 'put',
            payload,
            url: `/api/competitions/${competition_id}/documents/${document.id}`
        });

    }
}

export default CompetitionService;