import {
    PartnerSkateTestAddAppPayload,
    PartnerSkateTestRemoveAppPayload,
    SkateTestFormData,
    SkateTestRemoveAppPayload,
    UserSkateTestHistory
} from "../../contracts/app/SkateTestContracts";
import {
    PartnerSkateTestAddAPIPayload,
    PartnerSkateTestRemoveAPIPayload
} from "../../contracts/release3/api/CompetitionRegistrationAPIContracts";
import {IndividualSkateTestData, UserSkateTestHistoryData} from "../../contracts/release3/data/SkateTestDataContracts";
import {UserRemoveSkateTestAPIPayload} from "../../contracts/release3/api/UserAPIContracts";

export class SkateTestHistoryAPIAdaptor {

    static adaptUserSkateTestHistoryDataToUserSkateTestHistory(data: UserSkateTestHistoryData): UserSkateTestHistory {

        return {
            ...data
        }
    }

    static adaptSkateTestFormDataToIndividualSkateTestData(test_data: SkateTestFormData): IndividualSkateTestData {
        return {
            ...test_data,
            test: test_data.test.value
        }
    }

    static adaptSkateTestRemoveAppPayloadToSkateTestRemoveAPIPayload(remove_data: SkateTestRemoveAppPayload): UserRemoveSkateTestAPIPayload {
        return {
            discipline_key: remove_data.discipline.key,
            test_id: remove_data.test.id
        }
    }

    static adaptPartnerSkateTestRemoveAppPayloadToPartnerSkateTestRemoveAPIPayload(remove_data: PartnerSkateTestRemoveAppPayload): PartnerSkateTestRemoveAPIPayload {
        return {
            discipline_key: remove_data.discipline.key,
            test: remove_data.test,
            partner_id: remove_data.partner_id
        }
    }

    static adaptPartnerSkateTestAddAppPayloadToPartnerSkateTestAddAPIPayload(payload: PartnerSkateTestAddAppPayload): PartnerSkateTestAddAPIPayload {
        return {
            ...payload,
            test_data: SkateTestHistoryAPIAdaptor.adaptSkateTestFormDataToIndividualSkateTestData(payload.test_data),
        }
    }
}