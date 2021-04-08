import {
    SkateTestEquivalencyStateData,
    SkateTestEquivalencySubmissionResponse
} from "../contracts/app/SkateTestContracts";
import axios from "axios";
import {SkateTestEquivalencyAPIAdaptor} from "../adaptors/APIAdaptors/SkateTestEquivalencyAPIAdaptor";

/**
 * Service class for interacting with API in relation to SkateTestEquivalency
 */
export class SkateTestEquivalencyService {
    /**
     * Adapt and submit data for a new Skate Test Equivalency
     */
    static AddSkateTestEquivalency(payload: SkateTestEquivalencyStateData, account_id: string): Promise<SkateTestEquivalencySubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let adapted_payload = SkateTestEquivalencyAPIAdaptor.adaptSkateTestEquivalencyStateDataToAPIPayload(payload, account_id);
            axios.post('/api/skate-test-equivalency/save', adapted_payload).then(function (response) {
                resolve(SkateTestEquivalencyAPIAdaptor.adaptSkateTestEquivalencySubmissionResponse(response.data));
            }).catch(function () {
                reject();
            })
        });
    }
}