/**
 * Generalized App State Management
 */
import {ActionTree, GetterTree, MutationTree} from "vuex"
import {AppService} from "../../services/AppService";
import {
    AppNoticeStateConfiguration,
    AppNoticeStatePayload,
    BackLinkConfiguration,
    confirmActionConfiguration,
    EMSSupportIssueTypeOption,
    EMSSupportSubmitResult,
    ExportedEMSSupportFormData,
    SupportDocumentCategory
} from "../../contracts/AppContracts";
import Vue from 'vue';

/**
 * The reactive state of competitions
 */
export class State {
    active_page_back_link: BackLinkConfiguration | null = null;
    show_nav_border: boolean = true;
    show_cart_status: boolean = true;
    checkout_active: boolean = false;
    ems_support_issue_type_options: EMSSupportIssueTypeOption[] = [];
    categorized_support_documents: SupportDocumentCategory[] = [];
    confirm_action_overlay: confirmActionConfiguration | null = null;
    notice: AppNoticeStateConfiguration | null = null;
}

/**
 * Accessors for computed competition state properties
 */
const getters = <GetterTree<State, any>>{
    ems_support_issue_type_options: function (state) {
        return state.ems_support_issue_type_options;
    },
    categorized_support_documents: function (state): SupportDocumentCategory[] {
        return state.categorized_support_documents;
    }
};

/**
 * Perform (potentially async) actions with the state
 */
const actions = <ActionTree<State, any>>{
    /**
     * Retrieve the EMS Support Form input options
     */
    fetchEMSSupportFormOptions: function (context) {
        return new Promise(function (resolve, reject) {
            AppService.fetchEMSSupportFormOptions().then(function (form_options: EMSSupportIssueTypeOption[]) {
                context.commit('setEMSSupportFormOptions', form_options);
                resolve();
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Submit the EMS Support Form
     */
    submitEMSSupportForm: function (context, form_data: ExportedEMSSupportFormData): Promise<EMSSupportSubmitResult> {
        return new Promise(function (resolve, reject) {
            AppService.submitEMSSupport(form_data).then(function (response: EMSSupportSubmitResult) {
                resolve(response)
            }).catch(function () {
                reject();
            });
        });
    },
    /**
     * Get Support Documents Data
     */
    fetchSupportDocuments: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            AppService.fetchCategorizedSupportDocuments().then((categorized_support_documents) => {
                context.commit('setCategorizedSupportDocuments', categorized_support_documents);
                resolve();
            }).catch(() => {
                reject();
            })
        });
    },
    /**
     * Launch a confirm action
     */
    confirmAction: function (context, payload: confirmActionConfiguration) {
        context.commit('setConfirmAction', payload);
    },
    /**
     * Cancel the confirmation action
     */
    cancelConfirmAction: function (context) {
        context.commit('setConfirmAction', null);
    },
    /**
     * Confirm the active confirm action
     */
    confirmConfirmAction: function ({commit, state}) {
        return new Promise((resolve) => {
            if (state.confirm_action_overlay && typeof state.confirm_action_overlay.action === 'function') {
                const action = state.confirm_action_overlay.action();
                if (state.confirm_action_overlay.is_promise) {
                    action
                        .then(() => {
                            commit('setConfirmAction', null);
                            resolve();
                        })
                        .catch(() => {
                            commit('setConfirmAction', null);
                            resolve();
                        });

                    return;
                }
            }
            commit('setConfirmAction', null);
            resolve();
        });
    },
    /**
     * Dismiss the current app notice
     */
    dismissNotice: function (context) {
        const state_notice = context.state.notice;
        if (state_notice
            && state_notice.dismiss_override
            && typeof state_notice.dismiss_override === 'function') {
            state_notice.dismiss_override();

            return;
        }
        context.commit('setNotice', null);
    }
};

/**
 * Change reactive data
 */
const mutations = <MutationTree<State>>{
    /**
     * Set the back link for the active page
     */
    setActivePageBackLink: function (state, payload: BackLinkConfiguration | null): void {
        state.active_page_back_link = payload;
    },
    /**
     * Remove the bottom border on the app navbar
     */
    removeNavBorder: function (state) {
        state.show_nav_border = false;
    },
    /**
     * Hide the cart status indicator
     */
    hideCartStatus: function (state) {
        state.show_cart_status = false;
    },
    /**
     * Set that checkout page is active
     * Used in logic to hide app nav menu
     */
    setCheckoutActive: function (state) {
        state.checkout_active = true;
    },
    /**
     * Set the EMS Support form options in state
     */
    setEMSSupportFormOptions: function (state, form_options: EMSSupportIssueTypeOption[]) {
        state.ems_support_issue_type_options = form_options;
    },
    /**
     * Set the categorized Support Documents in state
     */
    setCategorizedSupportDocuments: function (state, categorized_support_documents: SupportDocumentCategory[]) {
        state.categorized_support_documents = categorized_support_documents;
    },
    /**
     * Set the active confirm action overlay configuration
     */
    setConfirmAction: function (state, payload: confirmActionConfiguration | null) {
        state.confirm_action_overlay = payload;
    },
    /**
     * Set the app level notice in state
     */
    setNotice: function (state, payload: AppNoticeStatePayload | null) {
        if (payload === null) {
            state.notice = payload;

            return;
        }

        let notice_content = '';
        if (payload && payload.notice instanceof Vue) {
            const vue_payload: Vue = payload.notice as Vue;
            vue_payload.$mount();
            notice_content = vue_payload.$el.innerHTML;
            vue_payload.$destroy();
        }
        if (payload && typeof payload.notice === 'string') {
            notice_content = payload.notice;
        }

        state.notice = {
            notice: notice_content,
            dismiss_override: payload.dismiss_override,
            is_danger: payload.is_danger || false
        };
    }
};

/**
 * Export the state module
 */
export const AppState = {
    namespaced: true,
    state: new State(),
    getters: getters,
    mutations: mutations,
    actions: actions
};