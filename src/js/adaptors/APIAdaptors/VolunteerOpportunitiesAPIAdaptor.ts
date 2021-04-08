import {
    ExportedVolunteerRequestSearchForm,
    FetchVolunteerOpportunitiesResponse,
    FetchVolunteerRequestDataResponse,
    SubmitVolunteerRequestSubmissionResponse,
    VolunteerOpportunityEvent,
    VolunteerOpportunitySearchResponse,
    VolunteerRequestCategorizedOpportunities,
    VolunteerRequestGeneralInformationFormData
} from '../../contracts/app/VolunteerOpportunitiesContracts';
import {
    FetchVolunteerOpportunitiesAPIResponse,
    FetchVolunteerRequestDataAPIResponse,
    SubmitVolunteerRequestAPIPayload,
    SubmitVolunteerRequestAPISubmissionResponse,
    VolunteerOpportunitySearchAPIPayload,
    VolunteerOpportunitySearchAPIResponse,
    VolunteerRequestUpdateUserProfileAPIPayload
} from '../../contracts/release3/api/VolunteerOpportunitiesAPIContracts';
import {UserAPIAdaptor} from './UserAPIAdaptor';
import {VolunteerOpportunityData} from '../../contracts/release3/data/VolunteerOpportunitiesDataContracts';
import {VolunteerRequestFormData} from '../../models/Forms/VolunteerRequestFormState';
import {UserWaiver} from '../../contracts/app/CompetitionRegistrationContracts';

export class VolunteerOpportunitiesAPIAdaptor {

    /**
     * Transform categorized set of opportunities from API to App structures
     */
    static adaptCategorizedVolunteerOpportunitiesDataToVolunteerRequestCategorizedOpportunities(data: VolunteerRequestCategorizedOpportunities): VolunteerRequestCategorizedOpportunities {
        return {
            upcoming: {
                local: data.upcoming.local.map((data) => {
                    return VolunteerOpportunitiesAPIAdaptor.adaptOpportunityEvent(data);
                }),
                usfs: data.upcoming.usfs.map((data) => {
                    return VolunteerOpportunitiesAPIAdaptor.adaptOpportunityEvent(data);
                })
            },
            requested: data.requested.map((data) => {
                return VolunteerOpportunitiesAPIAdaptor.adaptOpportunityEvent(data);
            })
        };
    }

    /**
     * Transform search form data to structure usable by API
     */
    static adaptExportedVolunteerRequestSearchFormToVolunteerOpportunitySearchAPIPayload(payload: ExportedVolunteerRequestSearchForm): VolunteerOpportunitySearchAPIPayload {
        return {
            state: payload.state ? payload.state.value : null,
            club: payload.club ? payload.club.value : null,
            competition_name: payload.event_name || null,
            start_date: payload.start_date || null,
            end_date: payload.end_date || null
        };
    }

    /**
     * Transform response when fetching opportunities list
     */
    static adaptFetchVolunteerOpportunitiesResponse(response: FetchVolunteerOpportunitiesAPIResponse): FetchVolunteerOpportunitiesResponse {
        return {
            opportunities: VolunteerOpportunitiesAPIAdaptor.adaptCategorizedVolunteerOpportunitiesDataToVolunteerRequestCategorizedOpportunities(response.opportunities),
            search_form_options: {
                states: [...response.search_form_options.states],
                clubs: [...response.search_form_options.clubs]
            }
        };
    }

    /**
     * Transform response when fetching data for an individual opportunity
     */
    static adaptFetchVolunteerRequestDataResponse(response: FetchVolunteerRequestDataAPIResponse): FetchVolunteerRequestDataResponse {
        const {
            links,
            user_profile_form_options,
            user_profile,
            user_emergency_contact,
            opportunity_request_form_options
        } = response;

        return {
            links,
            user_profile_form_options,
            user_profile: UserAPIAdaptor.adaptUserProfileDataToUserProfile(user_profile),
            user_emergency_contact: {
                name: user_emergency_contact.name || null,
                relationship: user_emergency_contact.relationship || null,
                phone: user_emergency_contact.phone || null
            },
            opportunity_request_form_options,
            waivers: VolunteerOpportunitiesAPIAdaptor.adaptFetchVolunteerRequestDataResponseWaivers(response)
        };
    }

    static adaptFetchVolunteerRequestDataResponseWaivers(response: FetchVolunteerRequestDataAPIResponse) {
        const waivers_information = response.waivers;

        return {
            form_options: {
                relationships: waivers_information ? waivers_information.form_options.relationships.slice() : []
            },
            user_waivers: waivers_information ? waivers_information.user_waivers.map((waiver_data) => {
                return UserAPIAdaptor.adaptUserWaiverDataToUserWaiver(waiver_data);
            }) : [],
            lead: waivers_information ? waivers_information && waivers_information.introduction : 'Please confirm your agreement of the terms and conditions below.'
        };
    }

    /**
     * Transform an individual opportunity item
     */
    static adaptOpportunityEvent(event_data: VolunteerOpportunityData): VolunteerOpportunityEvent {
        return {...event_data};
    }

    /**
     * Transform response when submitting an opportunity request
     */
    static adaptSubmitVolunteerRequestResponse(response: SubmitVolunteerRequestAPISubmissionResponse): SubmitVolunteerRequestSubmissionResponse {
        const {opportunities, redirect_url} = response;

        return {
            opportunities: opportunities ? VolunteerOpportunitiesAPIAdaptor.adaptCategorizedVolunteerOpportunitiesDataToVolunteerRequestCategorizedOpportunities(opportunities) : null,
            redirect_url
        };
    }

    /**
     * Transform response when searching for an opportunity
     */
    static adaptVolunteerOpportunitySearchResponse(response: VolunteerOpportunitySearchAPIResponse): VolunteerOpportunitySearchResponse {
        return {
            opportunities: response.opportunities.map((opportunity_data) => {
                return VolunteerOpportunitiesAPIAdaptor.adaptOpportunityEvent(opportunity_data);
            })
        };
    }

    /**
     * Transform experience form data to structure usable by API
     */
    static adaptVolunteerRequestExperienceFormDataToSubmitVolunteerRequestAPIPayload(app_payload: VolunteerRequestFormData): SubmitVolunteerRequestAPIPayload {
        return {
            experience: app_payload.experience.map((item) => {
                return {
                    ...item,
                    description: item.description || null
                };
            }),
            volunteer_skillset: app_payload.skillset,
            confirmations: {
                terms_and_conditions: app_payload.terms_agree,
                criminal_history_consent: app_payload.records_consent
            },
            waivers: app_payload.waivers.map((user_waiver: UserWaiver) => {
                return UserAPIAdaptor.adaptUserWaiversToUserWaiverSaveData(user_waiver);
            })
        };
    }

    /**
     * Update data from General Information form to structure usable by API.
     */
    static adaptVolunteerRequestGeneralInformationFormDataToVolunteerRequestUpdateUserProfileAPIPayload(app_payload: VolunteerRequestGeneralInformationFormData): VolunteerRequestUpdateUserProfileAPIPayload {
        return {
            profile: {
                address: {
                    country: app_payload.country,
                    street: app_payload.street,
                    street_2: app_payload.street_2,
                    city: app_payload.city,
                    state: app_payload.state,
                    province: app_payload.province,
                    zip: app_payload.zip
                },
                cell_phone: app_payload.cell_phone,
                email: app_payload.email
            },
            emergency_contact: {...app_payload.emergency_contact}
        };
    }
}