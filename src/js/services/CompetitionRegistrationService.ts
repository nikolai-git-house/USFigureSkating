import axios from "axios";
import {CompetitionRegistrationAPIAdapter} from "../adaptors/APIAdaptors/CompetitionRegistrationAPIAdapter";
import {FormOptionValue} from "../contracts/AppContracts";
import {PartnerSkateTestAddAppPayload, PartnerSkateTestRemoveAppPayload} from "../contracts/app/SkateTestContracts";
import {SkateTestHistoryAPIAdaptor} from "../adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor";
import {MemberSearchAdaptor} from "../adaptors/MemberSearchAdaptor";
import {SkaterCoachedEventCategory} from "../models/SkaterCoachedEventCategory";
import {UserAPIAdaptor} from "../adaptors/APIAdaptors/UserAPIAdaptor";
import {
    AddPartnerPayload,
    CompetitionRegistrationActiveCompetition,
    CompetitionRegistrationCoachIdentificationScreenParams,
    CompetitionRegistrationEventSelectionScreenParams,
    CompetitionRegistrationOverviewScreenParams,
    CompetitionRegistrationPartnerEventsScreenParams,
    CompetitionRegistrationPartnerIdentificationScreenParams,
    CompetitionRegistrationProfileScreenParams,
    CompetitionRegistrationSkateTestsScreenParams,
    CompetitionRegistrationWaiversScreenParams,
    CompRegAddCoachPayload,
    CompRegRemoveCoachPayload,
    CompRegReplaceCoachPayload,
    EventSelectionEvent,
    EventSelectionResponse,
    PartnerIdentificationCategory,
    PartnerSkateTestAddResult,
    PartnerSkateTestRemoveResult,
    RegistrationListCompetition,
    RemovePartnerPayload,
    RepresentationSelection,
} from "../contracts/app/CompetitionRegistrationContracts";
import {CompetitionRegistrationActiveCompetitionData} from "../contracts/release3/data/CompetitionRegistrationDataContracts";
import {
    AddPartnerAPIPayload,
    AddPartnerAPIResponse,
    CompetitionRegistrationCoachIdentificationScreenParamsData,
    CompetitionRegistrationEventSelectionScreenParamsData,
    CompetitionRegistrationOverviewScreenParamsData,
    CompetitionRegistrationPartnerEventsScreenParamsData,
    CompetitionRegistrationProfileScreenParamsData,
    CompetitionRegistrationSkateTestsScreenParamsData,
    CompetitionRegistrationWaiversScreenParamsData,
    CompRegAddCoachAPIPayload,
    CompRegAddCoachAPIResponse,
    CompRegRemoveCoachAPIPayload,
    CompRegRemoveCoachAPIResponse,
    CompRegReplaceCoachAPIPayload,
    CompRegReplaceCoachAPIResponse,
    EventSelectionAddAPIPayload,
    EventSelectionAddAPIResponse,
    EventSelectionRemoveAPIPayload,
    EventSelectionRemoveAPIResponse,
    FetchRegistrationCompetitionListAPIResponse,
    PartnerEventsSelectionAPIPayload,
    PartnerEventsSelectionAPIResponse,
    PartnerIdentificationScreenParamsData,
    PartnerSkateTestAddAPIPayload,
    PartnerSkateTestAddAPIResponse,
    PartnerSkateTestRemoveAPIPayload,
    PartnerSkateTestRemoveAPIResponse,
    RemovePartnerAPIPayload,
    RemovePartnerAPIResponse,
    RepresentationSelectionAPIPayload,
    RepresentationSelectionAPIResponse
} from "../contracts/release3/api/CompetitionRegistrationAPIContracts";
import {
    GenderedMemberSearchResultAPIResponse,
    MemberSearchAPIParameters,
    MemberSearchResultAPIResponse
} from "../contracts/release3/api/MemberSearchAPIContracts";
import {MemberSearchParameters, MemberSearchResult} from "../contracts/app/MemberSearchContracts";

export class CompetitionRegistrationService {
    /**
     * Fetch the competitions for the index list
     */
    static fetchRegistrationCompetitions(): Promise<RegistrationListCompetition[]> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/competition-registration/competition-list').then(function (response: { data: FetchRegistrationCompetitionListAPIResponse }) {
                if (response.data && response.data.competitions) {
                    resolve(CompetitionRegistrationAPIAdapter.adaptCompetitionList(response.data.competitions));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Fetch screen data for competition overview
     */
    static fetchCompetitionOverviewScreenData(): Promise<CompetitionRegistrationOverviewScreenParams> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/competition-registration/screen/competition-overview').then(function (response: { data: CompetitionRegistrationOverviewScreenParamsData }) {
                if (response.data && response.data.competition && response.data.prices) {
                    resolve({
                        competition: CompetitionRegistrationAPIAdapter.adaptActiveCompetitionInformation(response.data.competition),
                        prices: CompetitionRegistrationAPIAdapter.adaptActiveCompetitionPrices(response.data.prices)
                    });
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Fetch screen data for profile page
     */
    static fetchProfileScreenData(): Promise<CompetitionRegistrationProfileScreenParams> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/competition-registration/screen/profile').then(function (response: { data: CompetitionRegistrationProfileScreenParamsData }) {
                if (response.data && response.data.competition && response.data.user_profile) {
                    resolve({
                        competition: CompetitionRegistrationAPIAdapter.adaptActiveCompetitionInformation(response.data.competition),
                        user_profile: UserAPIAdaptor.adaptUserProfileDataToUserProfile(response.data.user_profile),
                        representation_selection_required: response.data.representation_selection_required,
                        selected_representation: response.data.selected_representation ? CompetitionRegistrationAPIAdapter.adaptSelectedRepresentationDataToRepresentationSelection(response.data.selected_representation) : null
                    });
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Fetch screen data for skate tests page
     */
    static fetchSkateTestsScreenData(): Promise<CompetitionRegistrationSkateTestsScreenParams> {
        return new Promise(function (resolve, reject) {
            axios.get('/api/competition-registration/screen/skate-tests').then(function (response: { data: CompetitionRegistrationSkateTestsScreenParamsData }) {
                if (response.data && response.data.competition && response.data.skate_test_history) {
                    resolve({
                        competition: CompetitionRegistrationAPIAdapter.adaptActiveCompetitionInformation(response.data.competition),
                        skate_test_history: SkateTestHistoryAPIAdaptor.adaptUserSkateTestHistoryDataToUserSkateTestHistory(response.data.skate_test_history)
                    });
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Fetch the data for partner events screen
     */
    static fetchPartnerEventsScreenData(): Promise<CompetitionRegistrationPartnerEventsScreenParams> {
        return new Promise((resolve, reject) => {
            axios.get('/api/competition-registration/screen/partner-events').then(function (response: { data: CompetitionRegistrationPartnerEventsScreenParamsData }) {
                if (response.data && response.data.competition && response.data.selected_events) {
                    resolve({
                        competition: CompetitionRegistrationAPIAdapter.adaptActiveCompetitionInformation(response.data.competition),
                        selected_events: response.data.selected_events ? response.data.selected_events : [],
                    });
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Fetch data for partner identification page
     */
    static fetchPartnerIdentificationScreenData(): Promise<CompetitionRegistrationPartnerIdentificationScreenParams> {
        return new Promise((resolve, reject) => {
            axios.get('/api/competition-registration/screen/partner-identification').then((response: { data: PartnerIdentificationScreenParamsData }) => {
                if (response.data.partner_categories && response.data.state_options && response.data.user_profile && response.data.competition) {
                    resolve({
                        competition: CompetitionRegistrationAPIAdapter.adaptActiveCompetitionInformation(response.data.competition),
                        partner_categories: CompetitionRegistrationAPIAdapter.adaptPartnerIdentificationCategoryDataArrayToPartnerIdentificationCategoryArray(response.data.partner_categories),
                        state_form_options: response.data.state_options,
                        user_profile: UserAPIAdaptor.adaptUserProfileDataToUserProfile(response.data.user_profile)
                    })
                }
                reject();

            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Fetch data for event selection page
     */
    static fetchEventSelectionScreenData(): Promise<CompetitionRegistrationEventSelectionScreenParams> {
        return new Promise((resolve, reject) => {
            axios.get('/api/competition-registration/screen/event-selection').then((response: { data: CompetitionRegistrationEventSelectionScreenParamsData }) => {
                if (response.data.available_events && response.data.partner_skate_test_summary && response.data.competition) {
                    resolve({
                        ...CompetitionRegistrationAPIAdapter.adaptEventSelectionDataToEventSelectionResponse({
                            available_events: response.data.available_events,
                            partner_skate_test_summary: response.data.partner_skate_test_summary,
                        }),
                        competition: CompetitionRegistrationAPIAdapter.adaptActiveCompetitionInformation(response.data.competition),
                        selected_partner_events: response.data.selected_partner_events || []
                    });
                }
                reject();

            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Fetch data for coach identification page
     */
    static fetchCoachIdentificationScreenData(): Promise<CompetitionRegistrationCoachIdentificationScreenParams> {
        return new Promise((resolve, reject) => {
            axios.get('/api/competition-registration/screen/coach-identification').then((response: { data: CompetitionRegistrationCoachIdentificationScreenParamsData }) => {
                if (response.data.event_categories && response.data.state_options) {
                    resolve({
                        competition: CompetitionRegistrationAPIAdapter.adaptActiveCompetitionInformation(response.data.competition),
                        event_categories: CompetitionRegistrationAPIAdapter.adaptSkaterCoachedEventCategoryDataArrayToSkaterCoachedEventCategoryArray(response.data.event_categories),
                        state_form_options: response.data.state_options
                    });
                }
                reject();
            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Fetch data for waivers page
     */
    static fetchWaiversScreenData(): Promise<CompetitionRegistrationWaiversScreenParams> {
        return new Promise((resolve, reject) => {
            axios.get('/api/competition-registration/screen/waivers').then((response: { data: CompetitionRegistrationWaiversScreenParamsData }) => {
                if (response.data.form_options && response.data.form_options.relationships && response.data.user_waivers) {
                    resolve({
                        competition: CompetitionRegistrationAPIAdapter.adaptActiveCompetitionInformation(response.data.competition),
                        relationships: response.data.form_options.relationships,
                        user_waivers: response.data.user_waivers.map((waiver_data) => {
                            return UserAPIAdaptor.adaptUserWaiverDataToUserWaiver(waiver_data);
                        })
                    });
                    return;
                }
                reject();
            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Fetch information about the active competition
     */
    static fetchActiveCompetition() {
        return new Promise<CompetitionRegistrationActiveCompetition>(function (resolve, reject) {
            axios.get('/api/competition-registration/active-competition').then(function (response: { data: CompetitionRegistrationActiveCompetitionData }) {
                if (response.data) {
                    resolve(CompetitionRegistrationAPIAdapter.adaptActiveCompetitionInformation(response.data));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Save the representation selection made by the user
     */
    static postRepresentation(representation: RepresentationSelection) {
        let error_message = "Error saving representation.";
        return new Promise<void>(function (resolve, reject) {
            axios.post('/api/competition-registration/representation', <RepresentationSelectionAPIPayload>{
                representation: CompetitionRegistrationAPIAdapter.adaptRepresentationSelectionToRepresentationSelectionData(representation)
            }).then(function (response: { data: RepresentationSelectionAPIResponse }) {
                if (response.data.success) {
                    resolve();
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }

    /**
     * Save user selection for which partner events they want to do
     */
    static selectPartnerEvents(partner_event_selections: FormOptionValue[]) {
        let error_message = "Error saving selections.";
        return new Promise<void>(function (resolve, reject) {
            axios.post('/api/competition-registration/partner-events', <PartnerEventsSelectionAPIPayload>{
                events: partner_event_selections
            }).then(function (response: { data: PartnerEventsSelectionAPIResponse }) {
                if (response.data.success) {
                    resolve();
                    return;
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }

    /**
     * Add a selected event
     */
    static addEvent(event: EventSelectionEvent): Promise<EventSelectionResponse> {
        let error_message = "Error adding event.";
        return new Promise((resolve, reject) => {
            axios.post('/api/competition-registration/event-selection/add',
                <EventSelectionAddAPIPayload>CompetitionRegistrationAPIAdapter.adaptAddEventToEventSelectionAddAPIPayload(event)
            ).then((response: { data: EventSelectionAddAPIResponse }) => {
                if (response.data && response.data.success) {
                    resolve(CompetitionRegistrationAPIAdapter.adaptEventSelectionDataToEventSelectionResponse(response.data));
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }

    /**
     * Remove a selected event
     */
    static removeEvent(event: EventSelectionEvent): Promise<EventSelectionResponse> {
        let error_message = "Error removing event.";
        return new Promise((resolve, reject) => {
            axios.post('/api/competition-registration/event-selection/remove',
                <EventSelectionRemoveAPIPayload>CompetitionRegistrationAPIAdapter.adaptAddEventToEventSelectionRemoveAPIPayload(event)
            ).then((response: { data: EventSelectionRemoveAPIResponse }) => {
                if (response.data && response.data.success && response.data.available_events && response.data.partner_skate_test_summary) {
                    resolve(CompetitionRegistrationAPIAdapter.adaptEventSelectionDataToEventSelectionResponse(response.data));
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }

    /**
     * Add a partner skate test
     */
    static addPartnerSkateTest(payload: PartnerSkateTestAddAppPayload): Promise<PartnerSkateTestAddResult> {
        let error_message = "Error saving skate test.";
        return new Promise((resolve, reject) => {
            axios.post('/api/competition-registration/partner-skate-test/add',
                <PartnerSkateTestAddAPIPayload>SkateTestHistoryAPIAdaptor.adaptPartnerSkateTestAddAppPayloadToPartnerSkateTestAddAPIPayload(payload)
            ).then((response: { data: PartnerSkateTestAddAPIResponse }) => {
                if (response.data && response.data.success && response.data.skate_test_history && response.data.partner_skate_test_summary) {
                    resolve(CompetitionRegistrationAPIAdapter.adaptPartnerSkateTestAddAPIResponseToPartnerSkateTestAddResult(response.data));
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }

    /**
     * Remove a partner skate test
     */
    static removePartnerSkateTest(remove_data: PartnerSkateTestRemoveAppPayload): Promise<PartnerSkateTestRemoveResult> {
        let error_message = "Error removing skate test.";
        return new Promise((resolve, reject) => {
            axios.post('/api/competition-registration/partner-skate-test/remove',
                <PartnerSkateTestRemoveAPIPayload>SkateTestHistoryAPIAdaptor.adaptPartnerSkateTestRemoveAppPayloadToPartnerSkateTestRemoveAPIPayload(remove_data)
            ).then((response: { data: PartnerSkateTestRemoveAPIResponse }) => {
                if (response.data && response.data.success && response.data.skate_test_history && response.data.partner_skate_test_summary) {
                    resolve(CompetitionRegistrationAPIAdapter.adaptPartnerSkateTestRemoveAPIResponseToPartnerSkateTestRemoveResult(response.data));
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }


    /**
     * Search for a partner
     */
    static partnerSearch(search_params: MemberSearchParameters): Promise<MemberSearchResult[]> {
        return new Promise(function (resolve, reject) {
            axios.post('/api/competition-registration/partner-search',
                <MemberSearchAPIParameters>MemberSearchAdaptor.adaptMemberSearchParametersToMemberSearchAPIParameters(search_params)
            ).then(function (response: { data: GenderedMemberSearchResultAPIResponse }) {
                if (response.data.results) {
                    resolve(MemberSearchAdaptor.adaptGenderedResultArray(response.data.results));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Add a partner to a category
     */
    static addCategoryPartner(payload: AddPartnerPayload): Promise<PartnerIdentificationCategory[]> {
        let error_message = "Error adding partner.";
        return new Promise((resolve, reject) => {
            axios.post('/api/competition-registration/partner-identification/category-partner/add',
                <AddPartnerAPIPayload>CompetitionRegistrationAPIAdapter.adaptAddPartnerPayloadToAddPartnerAPIPayload(payload)
            ).then((response: { data: AddPartnerAPIResponse }) => {
                if (response.data.success && response.data.partner_categories) {
                    resolve(CompetitionRegistrationAPIAdapter.adaptPartnerIdentificationCategoryDataArrayToPartnerIdentificationCategoryArray(response.data.partner_categories))
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }

    /**
     * Remove a partner from a category
     */
    static removeCategoryPartner(payload: RemovePartnerPayload): Promise<PartnerIdentificationCategory[]> {
        let error_message = "Error removing partner.";
        return new Promise((resolve, reject) => {
            axios.post('/api/competition-registration/partner-identification/category-partner/remove',
                <RemovePartnerAPIPayload>CompetitionRegistrationAPIAdapter.adaptRemovePartnerPayloadToRemovePartnerAPIPayload(payload)
            ).then((response: { data: RemovePartnerAPIResponse }) => {
                if (response.data.success && response.data.partner_categories) {
                    resolve(CompetitionRegistrationAPIAdapter.adaptPartnerIdentificationCategoryDataArrayToPartnerIdentificationCategoryArray(response.data.partner_categories))
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }

    /**
     * Search for a coach
     */
    static coachSearch(search_params: MemberSearchParameters): Promise<MemberSearchResult[]> {
        return new Promise(function (resolve, reject) {
            axios.post('/api/competition-registration/coach-search',
                <MemberSearchAPIParameters>MemberSearchAdaptor.adaptMemberSearchParametersToMemberSearchAPIParameters(search_params)
            ).then(function (response: { data: MemberSearchResultAPIResponse }) {
                if (response.data.results) {
                    resolve(MemberSearchAdaptor.adaptResultArray(response.data.results));
                }
                reject();
            }).catch(function () {
                reject();
            });
        });
    }

    /**
     * Add a coach to a category
     */
    static addCategoryCoach(payload: CompRegAddCoachPayload): Promise<SkaterCoachedEventCategory[]> {
        let error_message = "Error adding coach.";
        return new Promise((resolve, reject) => {
            axios.post('/api/competition-registration/coach-identification/category-coach/add',
                <CompRegAddCoachAPIPayload>CompetitionRegistrationAPIAdapter.adaptCompRegAddCoachPayloadToCompRegAddCoachAPIPayload(payload)
            ).then((response: { data: CompRegAddCoachAPIResponse }) => {
                if (response.data.success && response.data.event_categories) {
                    resolve(CompetitionRegistrationAPIAdapter.adaptSkaterCoachedEventCategoryDataArrayToSkaterCoachedEventCategoryArray(response.data.event_categories));
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }

    /**
     * Remove a coach from a category
     */
    static removeCategoryCoach(payload: CompRegRemoveCoachPayload): Promise<SkaterCoachedEventCategory[]> {
        let error_message = "Error removing coach.";
        return new Promise((resolve, reject) => {
            axios.post('/api/competition-registration/coach-identification/category-coach/remove',
                <CompRegRemoveCoachAPIPayload>CompetitionRegistrationAPIAdapter.adaptCompRegRemoveCoachPayloadToCompRegRemoveCoachAPIPayload(payload)
            ).then((response: { data: CompRegRemoveCoachAPIResponse }) => {
                if (response.data.success && response.data.event_categories) {
                    resolve(CompetitionRegistrationAPIAdapter.adaptSkaterCoachedEventCategoryDataArrayToSkaterCoachedEventCategoryArray(response.data.event_categories));
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }

    /**
     * Replace a coach for a category
     */
    static replaceCategoryCoach(payload: CompRegReplaceCoachPayload): Promise<SkaterCoachedEventCategory[]> {
        let error_message = "Error changing coach.";
        return new Promise((resolve, reject) => {
            axios.post('/api/competition-registration/coach-identification/category-coach/change',
                <CompRegReplaceCoachAPIPayload>CompetitionRegistrationAPIAdapter.adaptCompRegReplaceCoachPayloadToCompRegReplaceCoachAPIPayload(payload)
            ).then((response: { data: CompRegReplaceCoachAPIResponse }) => {
                if (response.data.success && response.data.event_categories) {
                    resolve(CompetitionRegistrationAPIAdapter.adaptSkaterCoachedEventCategoryDataArrayToSkaterCoachedEventCategoryArray(response.data.event_categories));
                }
                if (response.data.error) {
                    error_message = response.data.error;
                }
                reject(error_message);
            }).catch(function (error) {
                if (error.response.data && error.response.data.error) {
                    error_message = error.response.data.error;
                }
                reject(error_message);
            });
        });
    }
}