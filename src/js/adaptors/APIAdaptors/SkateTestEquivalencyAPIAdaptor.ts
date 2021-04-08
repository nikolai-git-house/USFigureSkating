import {
    SkateTestEquivalencyData,
    SkateTestFormData,
    SkateTestEquivalencyStateData,
    SkateTestEquivalencySubmissionResponse
} from "../../contracts/app/SkateTestContracts";
import {CreateAccountSkateTestEquivalencyAPIPayload} from "../../contracts/api/CreateAccountAPIContracts";

/**
 * Class to adapt data to and from structures used by API endpoints
 */
export class SkateTestEquivalencyAPIAdaptor {

    /**
     * Adapt the response from the skate test equivalency submission endpoint
     */
    static adaptSkateTestEquivalencySubmissionResponse(data: any): SkateTestEquivalencySubmissionResponse {
        if (data.success) {
            return {
                success: true,
                error: ""
            }
        }
        return {
            success: false,
            error: data.error
        }
    }

    /**
     * Adapt skate test equivalency data to an API Payload
     */
    static adaptSkateTestEquivalencyStateDataToAPIPayload(payload: SkateTestEquivalencyStateData, account_id: string): CreateAccountSkateTestEquivalencyAPIPayload {
        let result: SkateTestEquivalencyData = {};
        for (let i in payload) {
            result[i] = null;
            let payloadElement: SkateTestFormData | null = payload[i];
            if (payloadElement) {
                result[i] = {
                    club: payloadElement.club,
                    club_id: payloadElement.club_id,
                    date: payloadElement.date,
                    test: payloadElement.test.value
                }
            }
        }
        return {
            account_id,
            skate_test_data: result
        };
    }
}