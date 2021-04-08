import {
    AddPartnerPayload,
    CompetitionPrices,
    CompetitionRegistrationActiveCompetition,
    CompetitionRegistrationCompetitionCore,
    CompRegAddCoachPayload,
    CompRegRemoveCoachPayload,
    CompRegReplaceCoachPayload,
    EventSelectionEvent,
    EventSelectionResponse,
    PartnerIdentificationCategory,
    PartnerSkateTestAddResult,
    PartnerSkateTestRemoveResult,
    PartnerSkateTestSummary,
    RegistrationListCompetition,
    RemovePartnerPayload,
    RepresentationSelection,
} from "../../contracts/app/CompetitionRegistrationContracts";
import {
    CompetitionPricesData,
    CompetitionRegistrationActiveCompetitionData,
    CompetitionRegistrationCompetitionCoreData,
    CompetitionRegistrationListCompetitionData,
    EventSelectionEventData,
    PartnerIdentificationCategoryData,
    PartnerSkateTestSummaryData,
    RepresentationSelectionData
} from "../../contracts/release3/data/CompetitionRegistrationDataContracts";
import {UTCDateFormatNoYear} from "../../helpers/time";
import {SkateTestHistoryAPIAdaptor} from "./SkateTestHistoryAPIAdaptor";
import {SkaterCoachedEventCategory} from "../../models/SkaterCoachedEventCategory";
import {SkaterEventDataAdaptor} from "../SkaterEventDataAdaptor";
import {SkaterCoachedEventCategoryData} from "../../contracts/data/DataContracts";
import {
    AddPartnerAPIPayload,
    CompRegAddCoachAPIPayload,
    CompRegRemoveCoachAPIPayload,
    CompRegReplaceCoachAPIPayload,
    EventSelectionAddAPIPayload,
    EventSelectionAPIResponseData,
    EventSelectionRemoveAPIPayload,
    PartnerSkateTestAddAPIResponse,
    PartnerSkateTestRemoveAPIResponse,
    RemovePartnerAPIPayload
} from "../../contracts/release3/api/CompetitionRegistrationAPIContracts";


export class CompetitionRegistrationAPIAdapter {
    /**
     * Adapt core competition information
     */
    static adaptCompetitionCore(core_data: CompetitionRegistrationCompetitionCoreData): CompetitionRegistrationCompetitionCore {
        return {
            ...core_data,
            start_date: UTCDateFormatNoYear(new Date(core_data.start_date_ts * 1000)),
            end_date: UTCDateFormatNoYear(new Date(core_data.end_date_ts * 1000)),
            start_date_ts: core_data.start_date_ts * 1000,
            end_date_ts: core_data.end_date_ts * 1000,
        }
    }

    /**
     * Adapt data for the competition list
     */
    static adaptCompetitionList(raw_data: CompetitionRegistrationListCompetitionData[]): RegistrationListCompetition[] {
        return raw_data.map((competition_data: CompetitionRegistrationListCompetitionData) => {
            return {
                ...competition_data,
                ...CompetitionRegistrationAPIAdapter.adaptCompetitionCore(competition_data),
            }
        });
    }

    /**
     * Adapt active competition data
     */
    static adaptActiveCompetitionInformation(data: CompetitionRegistrationActiveCompetitionData): CompetitionRegistrationActiveCompetition {
        return {
            ...data,
            competition: CompetitionRegistrationAPIAdapter.adaptCompetitionCore(data.competition),
        }
    }

    static adaptActiveCompetitionPrices(prices: CompetitionPricesData): CompetitionPrices {
        return {
            ...prices
        }
    }


    static adaptEventSelectionEventDataToEventSelectionEvent(data: EventSelectionEventData): EventSelectionEvent {
        return {
            ...data
        }
    }

    static adaptPartnerSkateTestSummaryDataToPartnerSkateTestSummary(data: PartnerSkateTestSummaryData): PartnerSkateTestSummary {
        return {
            ...data
        }
    }

    static adaptEventSelectionDataToEventSelectionResponse(data: EventSelectionAPIResponseData): EventSelectionResponse {
        return {
            available_events: data.available_events.map((item) => {
                return CompetitionRegistrationAPIAdapter.adaptEventSelectionEventDataToEventSelectionEvent(item);
            }),
            partner_skate_test_summary: data.partner_skate_test_summary.map((item) => {
                return CompetitionRegistrationAPIAdapter.adaptPartnerSkateTestSummaryDataToPartnerSkateTestSummary(item);
            }),
        }
    }

    static adaptAddEventToEventSelectionAddAPIPayload(event: EventSelectionEvent): EventSelectionAddAPIPayload {
        return {
            event_id: event.id
        }
    }

    static adaptAddEventToEventSelectionRemoveAPIPayload(event: EventSelectionEvent): EventSelectionRemoveAPIPayload {
        return {
            event_id: event.id
        }
    }

    static adaptPartnerSkateTestRemoveAPIResponseToPartnerSkateTestRemoveResult(data: PartnerSkateTestRemoveAPIResponse): PartnerSkateTestRemoveResult {
        return {
            skate_test_history: SkateTestHistoryAPIAdaptor.adaptUserSkateTestHistoryDataToUserSkateTestHistory(data.skate_test_history),
            partner_skate_test_summary: data.partner_skate_test_summary.map((item) => {
                return CompetitionRegistrationAPIAdapter.adaptPartnerSkateTestSummaryDataToPartnerSkateTestSummary(item);
            }),
        };
    }

    static adaptPartnerSkateTestAddAPIResponseToPartnerSkateTestAddResult(data: PartnerSkateTestAddAPIResponse): PartnerSkateTestAddResult {
        return {
            skate_test_history: SkateTestHistoryAPIAdaptor.adaptUserSkateTestHistoryDataToUserSkateTestHistory(data.skate_test_history),
            partner_skate_test_summary: data.partner_skate_test_summary.map((item) => {
                return CompetitionRegistrationAPIAdapter.adaptPartnerSkateTestSummaryDataToPartnerSkateTestSummary(item);
            }),
        };
    }

    static adaptPartnerIdentificationCategoryDataArrayToPartnerIdentificationCategoryArray(partner_categories: PartnerIdentificationCategoryData[]): PartnerIdentificationCategory[] {
        return partner_categories.map((category_data: PartnerIdentificationCategoryData) => {
            return {
                ...category_data
            } as PartnerIdentificationCategory;
        });
    }

    static adaptAddPartnerPayloadToAddPartnerAPIPayload(payload: AddPartnerPayload): AddPartnerAPIPayload {
        return {
            ...payload
        }
    }

    static adaptRemovePartnerPayloadToRemovePartnerAPIPayload(payload: RemovePartnerPayload): RemovePartnerAPIPayload {
        return {
            ...payload
        }
    }

    static adaptSkaterCoachedEventCategoryDataArrayToSkaterCoachedEventCategoryArray(coach_categories: SkaterCoachedEventCategoryData[]): SkaterCoachedEventCategory[] {
        return coach_categories.map((data: SkaterCoachedEventCategoryData) => {
            return SkaterEventDataAdaptor.adaptCoachedEvent(data);
        });
    }

    static adaptCompRegAddCoachPayloadToCompRegAddCoachAPIPayload(payload: CompRegAddCoachPayload): CompRegAddCoachAPIPayload {
        return {
            ...payload
        }
    }

    static adaptCompRegRemoveCoachPayloadToCompRegRemoveCoachAPIPayload(payload: CompRegRemoveCoachPayload): CompRegRemoveCoachAPIPayload {
        return {
            ...payload
        }
    }

    static adaptCompRegReplaceCoachPayloadToCompRegReplaceCoachAPIPayload(payload: CompRegReplaceCoachPayload): CompRegReplaceCoachAPIPayload {
        return {
            ...payload
        }
    }

    static adaptRepresentationSelectionToRepresentationSelectionData(representation: RepresentationSelection): RepresentationSelectionData {
        return {
            ...representation
        }
    }

    static adaptSelectedRepresentationDataToRepresentationSelection(selected_representation: RepresentationSelectionData): RepresentationSelection {
        return {
            ...selected_representation
        };
    }
}