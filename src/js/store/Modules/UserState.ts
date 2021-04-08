import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {UserService} from '../../services/UserService';
import {User} from '../../models/User';
import {UserWaiver} from '../../contracts/app/CompetitionRegistrationContracts';
import {EditProfileFormState} from '../../models/Forms/EditProfileFormState';
import {EmergencyContact, UpdateEmergencyContactArgs} from '../../contracts/AppContracts';
import {UpdateUserProfileArgs, UserLTSInformation, UserProfile} from '../../contracts/app/UserContracts';


export class State {
    user: User = User.blank();
    user_info_endpoint_request_completed: boolean = false;
    profile: UserProfile | null = null;
    waivers: UserWaiver[] = [];
    emergency_contact: EmergencyContact | null = null;
}

const actions = <ActionTree<State, any>>{
    fetchUserInfo: function (context): Promise<User> {
        let active_competition_id = context.rootState.competitions.active_competition_id;
        context.commit('setUserInfoEndpointCompleted', false);
        if (active_competition_id === -1) {
            active_competition_id = false;
        }
        return new Promise(function (resolve, reject) {
            UserService.getUserInfo(active_competition_id).then(function (user: User) {
                context.commit('setUser', user);
                context.commit('setUserInfoEndpointCompleted', true);
                resolve();
            }).catch(function () {
                context.commit('setUserInfoEndpointCompleted', true);
                reject();
            })
        });
    },
    fetchUserProfile: function (context) {
        return new Promise((resolve, reject) => {
            UserService.getProfile().then((user_profile: UserProfile) => {
                context.commit('setUserProfile', user_profile);
                resolve();
                return;
            }).catch(() => {
                reject();
            })
        });
    },
    saveProfile: function (context, profile_data: EditProfileFormState) {
        return new Promise((resolve, reject) => {
            UserService.saveProfile(profile_data).then((updated_profile: UserProfile) => {
                context.commit('setUserProfile', updated_profile);
                resolve();
            }).catch((error_message: string) => {
                reject(error_message)
            });
        });
    },
    saveWaivers: function (context, waiver_data: UserWaiver[]) {
        return new Promise((resolve, reject) => {
            UserService.saveWaivers(waiver_data).then(() => {
                resolve();
            }).catch((error_message: string) => {
                reject(error_message)
            });

        });
    },
    /**
     * Update user profile in state
     */
    updateProfile: function (context, update_args: UpdateUserProfileArgs): void {
        let current_profile = {...context.getters.profile};
        for (let property in update_args) {
            if (!Object.prototype.hasOwnProperty.call(update_args, property)) {
                continue;
            }
            let property_value = update_args[property];
            if (!Object.prototype.hasOwnProperty.call(current_profile, property)) {
                console.warn('Update property not present in profile:', property);
                continue;
            }
            current_profile[property] = property_value;
        }
        context.commit('setUserProfile', current_profile);
    },
    /**
     * Update emergency contact in state
     */
    updateEmergencyContact: function (context, update_args: UpdateEmergencyContactArgs): void {
        let current_contact = {...context.getters.emergency_contact};
        for (let property in update_args) {
            if (!Object.prototype.hasOwnProperty.call(update_args, property)) {
                continue;
            }
            let property_value = update_args[property];
            if (!Object.prototype.hasOwnProperty.call(current_contact, property)) {
                console.warn('Update property not present in emergency contact:', property);
                continue;
            }
            current_contact[property] = property_value;
        }
        context.commit('setUserEmergencyContact', current_contact);

    }
};

const getters = <GetterTree<State, any>>{
    user: function (state) {
        return state.user;
    },
    user_roles: function (state) {
        return state.user.roles;
    },
    upload_file_capability: function (state) {
        return state.user.upload_file_capability;
    },
    profile: function (state): UserProfile | null {
        return state.profile;
    },
    emergency_contact: function (state): EmergencyContact | null {
        return state.emergency_contact;
    },
    /**
     * Active non-null LTS information for the active user
     */
    lts_information: function (state, getters): UserLTSInformation {
        let active_profile = getters['profile'];
        if (active_profile) {
            return active_profile.lts_programs;
        }
        return {
            summary: {
                description: "",
                validity_date_formatted: "",
            },
            programs: []
        }
    },
    waivers: function (state): UserWaiver[] {
        return state.waivers;
    }
};

const mutations = <MutationTree<State>>{
    setUserInfoEndpointCompleted: function (state, payload: boolean) {
        state.user_info_endpoint_request_completed = payload;
    },
    setUser: function (state, user: User) {
        state.user = user;
    },
    setUserProfile: function (state, user_profile: UserProfile) {
        state.profile = user_profile;
    },
    setUserWaivers: function (state, user_waivers: UserWaiver[]) {
        state.waivers = user_waivers;
    },
    setUserEmergencyContact: function (state, emergency_contact: EmergencyContact) {
        state.emergency_contact = emergency_contact;
    }
};


export const UserState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};