import {
    EditUserProfileFormData,
    UserProfileData,
    UserWaiverSaveData
} from "../data/CompetitionRegistrationDataContracts";
import {IndividualSkateTestData, UserSkateTestHistoryData} from "../data/SkateTestDataContracts";
import {SkateTestDisciplineKey} from "../../app/SkateTestContracts";
import {APISubmissionResponse} from "./CommonAPIContracts";

/**
 * Response when requesting a Skate Test History for a user
 */
export interface GetUserSkateTestHistoryAPIResponse {
    skate_test_history: UserSkateTestHistoryData; //The skate test history data for the requested user
}

/**
 * Payload when self-reporting a new skate test.
 */
export interface UserAddSkateTestAPIPayload {
    test_data: IndividualSkateTestData;     // The data related to the skate test being self-reported
    discipline_key: SkateTestDisciplineKey; // Key to identify the discipline to which the skate test belongs
}

/**
 * API response when user submits a self-reported skate test
 */
export interface UserAddSkateTestAPIResponse extends APISubmissionResponse {
    skate_test_history: UserSkateTestHistoryData;   // The resulting UserSkateTestHistoryData for the user
}

/**
 * Payload when deleting a self-reported test
 */
export interface UserRemoveSkateTestAPIPayload {
    discipline_key: SkateTestDisciplineKey;     // Key to identify the discipline to which the skate test belongs
    test_id: number;                            // The ID of the test to delete
}

/**
 * API response when user removes a self-reported skate test
 */
export interface UserRemoveSkateTestAPIResponse extends APISubmissionResponse {
    skate_test_history: UserSkateTestHistoryData;   // The resulting UserSkateTestHistoryData for the user
}

/**
 * API response when fetching a user's profile information
 */
export interface GetProfileAPIResponse {
    profile: UserProfileData;
}

/**
 * Payload when a user is attempting to edit their profile
 */
export interface SaveProfileAPIPayload {
    profile_data: EditUserProfileFormData;
}

/**
 * API response when a user is attempts to edit their profile
 */
export interface SaveProfileAPIResponse extends APISubmissionResponse {
    profile: UserProfileData;
}

/**
 * Data submitted when a user completes their waivers
 */
export interface SaveWaiversAPIPayload {
    waivers_data: UserWaiverSaveData[];     //  Array of waivers information for save
}

/**
 * API response when a user submits their waivers. Default submission response
 */
export interface SaveWaiversAPIResponse extends APISubmissionResponse {
}