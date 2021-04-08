import {
    ExportedVolunteerRequestSearchForm,
    FetchVolunteerOpportunitiesResponse,
    FetchVolunteerRequestDataResponse,
    SubmitVolunteerRequestSubmissionResponse,
    VolunteerOpportunitySearchResponse,
    VolunteerRequestGeneralInformationFormData
} from '../contracts/app/VolunteerOpportunitiesContracts';
import {
    FetchVolunteerOpportunitiesAPIResponse,
    FetchVolunteerRequestDataAPIResponse,
    SubmitVolunteerRequestAPIPayload,
    SubmitVolunteerRequestAPISubmissionResponse,
    VolunteerOpportunitySearchAPIPayload,
    VolunteerOpportunitySearchAPIResponse,
    VolunteerRequestUpdateUserProfileAPIPayload,
    VolunteerRequestUpdateUserProfileAPIResponse
} from '../contracts/release3/api/VolunteerOpportunitiesAPIContracts';
import {VolunteerOpportunitiesAPIAdaptor} from '../adaptors/APIAdaptors/VolunteerOpportunitiesAPIAdaptor';
import axios from 'axios';
import {VolunteerRequestFormData} from '../models/Forms/VolunteerRequestFormState';

export class VolunteerOpportunitiesService {
    /**
     * Retrieve core data to display Volunteer Opportunities page
     */
    public static fetchVolunteerOpportunities(): Promise<FetchVolunteerOpportunitiesResponse> {
        return new Promise((resolve, reject) => {
            axios.get('/api/volunteer/competitions')
                .then((response) => {
                    if (response.data &&
                        response.data.opportunities &&
                        response.data.opportunities.upcoming &&
                        response.data.opportunities.upcoming.local &&
                        response.data.opportunities.upcoming.usfs &&
                        response.data.opportunities.requested &&
                        response.data.search_form_options) {
                        resolve(
                            VolunteerOpportunitiesAPIAdaptor
                                .adaptFetchVolunteerOpportunitiesResponse(
                                    <FetchVolunteerOpportunitiesAPIResponse>response.data
                                )
                        );

                        return;
                    }
                    console.error('Invalid core opportunities page data');
                    reject();
                })
                .catch(() => {
                    reject();
                });
        });
    }

    /**
     * Retrieve information enabling a user to pursue an volunteer request opportunity
     */
    public static fetchVolunteerRequestData(competition_id: number): Promise<FetchVolunteerRequestDataResponse> {
        return new Promise((resolve, reject) => {
            axios.get(`/api/volunteer-request/${competition_id}/profile`)
                .then((response: { data: FetchVolunteerRequestDataAPIResponse; }) => {
                    if (!response.data.user_profile_form_options ||
                        !response.data.user_profile ||
                        !response.data.user_emergency_contact ||
                        !response.data.opportunity_request_form_options) {
                        reject();
                    }
                    resolve(
                        VolunteerOpportunitiesAPIAdaptor
                            .adaptFetchVolunteerRequestDataResponse(
                                response.data
                            )
                    );
                })
                .catch(() => {
                    reject();
                });
        });
    }

    /**
     * Submit a completed volunteer request
     */
    public static submitVolunteerRequest(competition_id: number, app_payload: VolunteerRequestFormData): Promise<SubmitVolunteerRequestSubmissionResponse> {
        let error_message: string = 'Error submitting request.';

        const request_payload: SubmitVolunteerRequestAPIPayload = VolunteerOpportunitiesAPIAdaptor.adaptVolunteerRequestExperienceFormDataToSubmitVolunteerRequestAPIPayload(app_payload);

        return new Promise((resolve, reject) => {
            axios.post(`/api/volunteer-request/${competition_id}`, request_payload)
                .then((response: { data: SubmitVolunteerRequestAPISubmissionResponse; }) => {
                    // Validate request was successful
                    if (!response.data || !response.data.success) {
                        if (response.data.error) {
                            error_message = response.data.error;
                        }
                        reject(error_message);

                        return;
                    }

                    resolve(
                        VolunteerOpportunitiesAPIAdaptor.adaptSubmitVolunteerRequestResponse(response.data)
                    );
                })
                .catch(() => {
                    reject(error_message);
                });
        });
    }

    /**
     * Update a user's profile information related to a volunteer opportunity
     */
    public static updateVolunteerRequestUserProfile(competition_id: number, app_payload: VolunteerRequestGeneralInformationFormData): Promise<void> {
        const request_payload: VolunteerRequestUpdateUserProfileAPIPayload = VolunteerOpportunitiesAPIAdaptor.adaptVolunteerRequestGeneralInformationFormDataToVolunteerRequestUpdateUserProfileAPIPayload(app_payload);
        let error_message: string = 'Error saving information';

        return new Promise((resolve, reject) => {
            axios.post(`/api/volunteer-request/${competition_id}/profile`, request_payload)
                .then((response: { data: VolunteerRequestUpdateUserProfileAPIResponse; }) => {
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
     * Search for volunteer opportunities
     */
    public static volunteerOpportunitySearch(payload: ExportedVolunteerRequestSearchForm): Promise<VolunteerOpportunitySearchResponse> {
        const transformed_payload = <VolunteerOpportunitySearchAPIPayload>VolunteerOpportunitiesAPIAdaptor.adaptExportedVolunteerRequestSearchFormToVolunteerOpportunitySearchAPIPayload(payload);
        const search_error = 'Error searching.';

        return new Promise((resolve, reject) => {
            axios.post('/api/volunteer/competitions/search', transformed_payload)
                .then((response: { data: VolunteerOpportunitySearchAPIResponse; }) => {
                    if (!response.data.opportunities) {
                        reject(search_error);

                        return;
                    }
                    resolve(
                        VolunteerOpportunitiesAPIAdaptor
                            .adaptVolunteerOpportunitySearchResponse(
                                response.data
                            )
                    );
                })
                .catch(() => {
                    reject(search_error);
                });
        });
    }
}