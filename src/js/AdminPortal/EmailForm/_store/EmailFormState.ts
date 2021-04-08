import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {SubmitCheckInEmailPayload} from '../../CheckIn/_contracts/CheckInContracts';
import {
    AttachmentValidationRules,
    EmailFormServiceInterface,
    EmailFormStateConfiguration,
    EmailRecipientOptionCategory
} from '../_contracts/EmailFormContracts';
import {EmailFormFormState} from '../_models/EmailFormFormState';

export class State {
    attachment_rules: AttachmentValidationRules = {};
    bcc_lead: string = 'Please select email recipients';
    cc_lead: string = '';

    email_recipients_loaded: boolean = false;
    form_data: EmailFormFormState = new EmailFormFormState();
    form_title: string = 'Email Participants';
    is_each_bcc_required: boolean = false;
    recipient_options_bcc: EmailRecipientOptionCategory[] = [];
    recipient_options_cc: EmailRecipientOptionCategory[] = [];
    service_class: EmailFormServiceInterface | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Get the recipient options for the email form
     */
    fetchEmailConfiguration: function (context) {
        return new Promise((resolve, reject) => {
            if (context.state.email_recipients_loaded) {
                resolve();

                return;
            }
            if (!context.state.service_class) {
                throw 'Email service class not defined';
            }
            context.state.service_class.fetchEmailConfiguration()
                .then((response: EmailFormStateConfiguration) => {
                    context.commit('configure', response);
                    context.commit('setEmailRecipientsLoaded', true);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Submit a check-in email
     */
    submitEmail: function (context, data: SubmitCheckInEmailPayload): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!context.state.service_class) {
                throw 'Email service class not defined';
            }
            context.state.service_class.submitEmail(data)
                .then(() => {
                    resolve();
                })
                .catch((message: string) => {
                    reject(message);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * The BCC Options for the email form
     */
    options_bcc: function (state): EmailRecipientOptionCategory[] {
        return state.recipient_options_bcc;
    },
    /**
     * The CC Options for the email form
     */
    options_cc: function (state): EmailRecipientOptionCategory[] {
        return state.recipient_options_cc;
    },
    /**
     * Whether a recipient for each BCC category is required
     */
    is_each_bcc_required: function (state): boolean {
        return state.is_each_bcc_required;
    }

};

const mutations = <MutationTree<State>>{
    /**
     * Reset form state
     */
    resetState: function (state) {
        state.bcc_lead = 'Please select email recipients';
        state.cc_lead = 'Please select Competition Contacts and Key Officials to CC';
        state.recipient_options_bcc = [];
        state.recipient_options_cc = [];
        state.email_recipients_loaded = false;
        state.form_data = new EmailFormFormState();
        state.form_title = 'Email Participants';
        state.is_each_bcc_required = false;
        state.service_class = null;
    },
    /**
     * Configure the email
     * 1. BCC recipients
     * 2. CC recipients
     * 3. Attachment validation rules
     */
    configure: function (state, options: EmailFormStateConfiguration) {
        if (typeof options.attachment_rules !== 'undefined') {
            state.attachment_rules = options.attachment_rules;
        }
        if (typeof options.bcc !== 'undefined' && options.bcc !== false) {
            state.recipient_options_bcc = options.bcc;
        }
        if (typeof options.cc !== 'undefined') {
            state.recipient_options_cc = options.cc;
        }
    },
    /**
     * Set whether the email recipients have loaded
     */
    setEmailRecipientsLoaded: function (state, are_loaded: boolean) {
        state.email_recipients_loaded = are_loaded;
    },
    /**
     * Set form data in state
     */
    setFormData: function (state, form_data: EmailFormFormState) {
        state.form_data = form_data;
    },
    /**
     * Set service class used to interact with API
     */
    setServiceClass: function (state, service_class: EmailFormServiceInterface) {
        state.service_class = service_class;
    },
    /**
     * Set BCC requirement configuration in state
     */
    setIsEachBccRequired: function (state, is_required: boolean) {
        state.is_each_bcc_required = is_required;
    }
};

export const EmailFormState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};