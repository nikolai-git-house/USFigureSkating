import axios from "axios";
import {User} from "../models/User";
import {UserAdaptor} from "../adaptors/UserDataAdaptor";
import {EditProfileFormState} from "../models/Forms/EditProfileFormState";
import {UserWaiver} from "../contracts/app/CompetitionRegistrationContracts";
import {UserAPIAdaptor} from "../adaptors/APIAdaptors/UserAPIAdaptor";
import {
    SkateTestDisciplineKey,
    SkateTestRemoveAppPayload,
    SkateTestFormData,
    UserSkateTestHistory
} from "../contracts/app/SkateTestContracts";
import {SkateTestHistoryAPIAdaptor} from "../adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor";
import {
    GetProfileAPIResponse,
    GetUserSkateTestHistoryAPIResponse, SaveProfileAPIPayload,
    SaveProfileAPIResponse, SaveWaiversAPIPayload,
    SaveWaiversAPIResponse, UserAddSkateTestAPIPayload,
    UserAddSkateTestAPIResponse,
    UserRemoveSkateTestAPIResponse
} from "../contracts/release3/api/UserAPIContracts";
import {UserProfile} from '../contracts/app/UserContracts';


export class UserService {
    /**
     * Get general information about the logged in user
     */
    static getUserInfo(competition_id: number | null): Promise<User> {
        return new Promise(function (resolve, reject) {
            axios.post('/api/user/info', {
                competition_id
            }).then(function (response) {
                if (response.data.user) {
                    resolve(UserAdaptor.adaptUser(response.data.user));
                }
                reject();
            }).catch(function () {
                reject();
            });

        });
    }

    static saveProfile(profile_data: EditProfileFormState): Promise<UserProfile> {
        let error_message = "Error saving profile.";
        return new Promise((resolve, reject) => {
            axios.post(
                '/api/user/profile',
                <SaveProfileAPIPayload>{
                    profile_data: UserAPIAdaptor.adaptEditProfileFormStateToUserProfileData(profile_data)
                }
            ).then((response: { data: SaveProfileAPIResponse }) => {
                if (response.data.success && response.data.profile) {
                    resolve(UserAPIAdaptor.adaptUserProfileDataToUserProfile(response.data.profile));
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

    static getProfile(): Promise<UserProfile> {
        return new Promise((resolve, reject) => {
            axios.get('/api/user/profile').then((response: { data: GetProfileAPIResponse }) => {
                if (response.data.profile) {
                    resolve(UserAPIAdaptor.adaptUserProfileDataToUserProfile(response.data.profile));
                    return;
                }
                reject();
            }).catch(() => {
                reject();
            })
        });
    }

    static saveWaivers(waiver_data: UserWaiver[]) {
        let error_message = "Error saving waiver information.";
        return new Promise((resolve, reject) => {
            axios.post('/api/user/waivers',
                <SaveWaiversAPIPayload>{
                    waivers_data: waiver_data.map((user_waiver: UserWaiver) => {
                        return UserAPIAdaptor.adaptUserWaiversToUserWaiverSaveData(user_waiver)
                    })
                }
            ).then((response: { data: SaveWaiversAPIResponse }) => {
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

    static getSkateTestHistory(partner_id?: number): Promise<UserSkateTestHistory> {
        return new Promise((resolve, reject) => {
            let post_data = partner_id ? {partner_id} : null;
            axios.post('/api/user/skate-test-history', post_data).then((response: { data: GetUserSkateTestHistoryAPIResponse }) => {
                if (response.data.skate_test_history) {
                    let userSkateTestHistory = SkateTestHistoryAPIAdaptor.adaptUserSkateTestHistoryDataToUserSkateTestHistory(response.data.skate_test_history);
                    resolve(userSkateTestHistory);
                    return;
                }
                reject();
            }).catch(() => {
                reject();
            });
        });
    }

    static addSkateTest(test_data: SkateTestFormData, discipline_key: SkateTestDisciplineKey): Promise<UserSkateTestHistory> {
        let error_message = "Error saving skate test.";
        return new Promise((resolve, reject) => {
            axios.post('/api/user/skate-test-history/add', <UserAddSkateTestAPIPayload>{
                test_data: SkateTestHistoryAPIAdaptor.adaptSkateTestFormDataToIndividualSkateTestData(test_data),
                discipline_key
            }).then((response: { data: UserAddSkateTestAPIResponse }) => {
                if (response.data.success && response.data.skate_test_history) {
                    let userSkateTestHistory = SkateTestHistoryAPIAdaptor.adaptUserSkateTestHistoryDataToUserSkateTestHistory(response.data.skate_test_history);
                    resolve(userSkateTestHistory);
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

    static removeSkateTest(remove_data: SkateTestRemoveAppPayload): Promise<UserSkateTestHistory> {
        let error_message = "Error removing skate test.";
        return new Promise((resolve, reject) => {
            axios.post('/api/user/skate-test-history/remove',
                SkateTestHistoryAPIAdaptor.adaptSkateTestRemoveAppPayloadToSkateTestRemoveAPIPayload(remove_data)
            ).then((response: { data: UserRemoveSkateTestAPIResponse }) => {
                if (response.data.success && response.data.skate_test_history) {
                    let userSkateTestHistory = SkateTestHistoryAPIAdaptor.adaptUserSkateTestHistoryDataToUserSkateTestHistory(response.data.skate_test_history);
                    resolve(userSkateTestHistory);
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
}