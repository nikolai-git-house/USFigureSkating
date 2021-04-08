import Vue from "vue";
import Vuex, {ActionTree, GetterTree, MutationTree} from "vuex"
import {AccountTypeKey, ForeignUserTypeKey} from "../../contracts/AppContracts";
import {
    AddressSubmissionResponse,
    EmergencyContactSubmissionResponse,
    FederationInformationSubmissionResponse,
    PasswordSubmissionResponse,
    PersonalInformationSubmissionResponse,
    SavedPersonalInformation
} from "../../contracts/app/CreateAccountContracts";
import {
    SkateTestEquivalencyStateData,
    SkateTestEquivalencySubmissionResponse
} from "../../contracts/app/SkateTestContracts";
import {FormOptionsState} from "../Modules/FormOptionsState";
import {CreateAccountService} from "../../services/CreateAccountService";
import {PersonalInformationData} from "../../models/CreateAccount/PersonalInformationFormState";
import {AddressData} from "../../models/CreateAccount/AddressFormState";
import {EmergencyContactData} from "../../models/Forms/EmergencyContactFormState";
import {PasswordFormData} from "../../models/CreateAccount/PasswordFormState";
import {FederationInfoData} from "../../models/CreateAccount/FederationInfoFormState";
import {SkateTestEquivalencyService} from "../../services/SkateTestEquivalencyService";


Vue.use(Vuex);

export class State {
    account_type: AccountTypeKey | null = null;
    personal_information: SavedPersonalInformation | null = null;
    foreign_account_subtype: ForeignUserTypeKey[] = [];
}

const actions = <ActionTree<State, any>>{
    /**
     * Handle the completion of the personal information form
     * Trigger data submission and react to response
     * If successful, store applicable SavedPersonalInformation for reuse
     */
    completePersonalInformation: function (context, payload: PersonalInformationData): Promise<PersonalInformationSubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let accountType = context.state.account_type as AccountTypeKey;
            CreateAccountService.SubmitPersonalInformation(payload, accountType).then(function (result: PersonalInformationSubmissionResponse) {
                if (result.success) {
                    context.commit('setPersonalInformation', result.data);
                }
                resolve(result);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Handle the completion of the address form
     * Trigger data submission and react to response
     */
    completeAddress: function (context, payload: AddressData): Promise<AddressSubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let account_id = context.getters['account_id'] as string;
            CreateAccountService.SubmitAddressInformation(payload, account_id).then(function (result: AddressSubmissionResponse) {
                if (result.success) {
                    //save data to state
                }
                resolve(result);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Handle the completion of the emergency contact form
     * Trigger data submission and react to response
     */
    completeEmergencyContact: function (context, payload: EmergencyContactData): Promise<EmergencyContactSubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let account_id = context.getters['account_id'] as string;
            CreateAccountService.SubmitEmergencyContactInformation(payload, account_id).then(function (result: EmergencyContactSubmissionResponse) {
                if (result.success) {
                    //save data to state
                }
                resolve(result);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Handle the completion of the password form
     * Trigger data submission and react to response
     */
    completePassword: function (context, payload: PasswordFormData): Promise<PasswordSubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let account_id = context.getters['account_id'] as string;
            CreateAccountService.SubmitPassword(payload, account_id).then(function (result: PasswordSubmissionResponse) {
                if (result.success) {
                    //save data to state
                }
                resolve(result);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Handle the completion of the federation information form
     * Trigger data submission and react to response
     */
    completeFederationInformation: function (context, payload: FederationInfoData): Promise<FederationInformationSubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let account_id = context.getters['account_id'] as string;
            CreateAccountService.SubmitFederationInformation(payload, account_id).then(function (result: FederationInformationSubmissionResponse) {
                if (result.success) {
                    //save data to state
                    context.commit('setForeignAccountTypes', payload.user_type)
                }
                resolve(result);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Handle the completion of a Skate Test Equivalency form
     * Trigger data submission and react to response
     */
    completeSkateTestEquivalency: function (context, payload: SkateTestEquivalencyStateData): Promise<SkateTestEquivalencySubmissionResponse> {
        return new Promise(function (resolve, reject) {
            let account_id = context.getters['account_id'] as string;
            SkateTestEquivalencyService.AddSkateTestEquivalency(payload, account_id).then(function (result: SkateTestEquivalencySubmissionResponse) {
                if (result.success) {
                }
                resolve(result);
            }).catch(function () {
                reject();
            })
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * Get the member number for the active user during account creation
     * Null if personal information has not been successfully submitted
     */
    member_number: function (state): string | null {
        if (state.personal_information && state.personal_information.member_number) {
            return state.personal_information.member_number;
        }
        return null;
    },
    /**
     * Get the account id for the active user during account creation
     * Null if personal information has not been successfully submitted
     */
    account_id: function (state): string | null {
        if (state.personal_information && state.personal_information.account_id) {
            return state.personal_information.account_id;
        }
        return null;
    },
    /**
     * Whether the current user needs to submit federation information
     */
    requires_federation_info: function (state): boolean {
        return state.account_type === "foreign";
    },
    /**
     * Whether the current user needs to submit skate test information
     */
    skate_test_required: function (state, getters): boolean {
        if (!getters['requires_federation_info']) {
            return false;
        }
        if (state.foreign_account_subtype.length === 0) {
            return true;
        }
        return state.foreign_account_subtype.indexOf('skater') !== -1;
    },
    /**
     * The number of required steps for account creation, depending on prior selections
     */
    required_step_count: function (state, getters): number {
        if (!getters['requires_federation_info']) {
            return 4;
        }
        if (!getters['skate_test_required']) {
            return 5;
        }
        return 6;
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Commit account type to state
     */
    setAccountTypeKey: function (state, account_type_key: AccountTypeKey | null) {
        state.account_type = account_type_key;
    },
    /**
     * Commit personal information to state
     */
    setPersonalInformation: function (state, data: SavedPersonalInformation) {
        state.personal_information = data;
    },
    /**
     * Commit foreign account subtypes to state
     */
    setForeignAccountTypes: function (state, account_subtype_key: ForeignUserTypeKey[]) {
        state.foreign_account_subtype = account_subtype_key;
    },
};

export default new Vuex.Store({
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations,
    modules: {
        form_options: FormOptionsState,
    }
});
