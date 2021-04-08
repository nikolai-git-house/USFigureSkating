<script lang="ts">
    import Vue from "vue";
    import PersonalInfoForm from "./PersonalInfoForm.vue";
    import AddressForm from "./AddressForm.vue";
    import EmergencyContactForm from "./EmergencyContactForm.vue";
    import ForeignInfoForm from "./ForeignInfoForm.vue";
    import PasswordForm from "./PasswordForm.vue";
    import AccountTypeSelect from "./AccountTypeSelect.vue";
    import SkateTestEquivalency from "../../components/SkateTestEquivalency/SkateTestEquivalency.vue"
    import {AccountTypeKey} from "../../contracts/AppContracts";
    import {PersonalInformationData} from "../../models/CreateAccount/PersonalInformationFormState";
    import {AddressData} from "../../models/CreateAccount/AddressFormState";
    import {FederationInfoData} from "../../models/CreateAccount/FederationInfoFormState";
    import {PasswordFormData} from "../../models/CreateAccount/PasswordFormState";
    import {EmergencyContactData} from "../../models/Forms/EmergencyContactFormState";
    import {
        AddressSubmissionResponse,
        EmergencyContactSubmissionResponse,
        FederationInformationSubmissionResponse,
        PasswordSubmissionResponse,
        PersonalInformationSubmissionResponse
    } from "../../contracts/app/CreateAccountContracts";
    import {
        SkateTestEquivalencyStateData,
        SkateTestEquivalencySubmissionResponse
    } from "../../contracts/app/SkateTestContracts";

    type CreateAccountScreenKey =
        'landing'
        | 'personal_info'
        | 'address'
        | 'emergency_contact'
        | 'federation'
        | 'skate_test'
        | 'password'
        | 'all';

    /**
     * Component to manage entire create account process
     */
    export default Vue.extend({
        props: {
            /**
             * Whether data for blank emergency contact forms should be posted to the server
             */
            post_blank_emergency_contact: {
                type: Boolean,
                default: true
            }
        },
        /**
         * Handle data loading and loading state-related variables upon component creation
         */
        created: function () {
            this.initLoadingTimeout();
            this.loadData();
        },
        data: function () {
            return {
                /**
                 * Used for dev.  All screens display
                 */
                debug_mode: false,
                /**
                 * The number (not index) of the active step
                 */
                active_step_number: 1,
                /**
                 * The key of the active screen
                 */
                active_screen_key: <CreateAccountScreenKey>"landing",
                /**
                 * Any server errors returned by a submission for the current screen
                 */
                screen_server_error: "",
                /**
                 * Specific to personal information, if the submission results in a duplicate account flag
                 */
                duplicate_account_attempt: <boolean>false,
                /**
                 * Whether the component is in the process of submitting to the server
                 */
                submitting: <boolean> false,
                /**
                 * Dependencies for component loading
                 */
                dependencies: <{ [key: string]: boolean; }> {
                    form_options: false
                },
                /**
                 * Whether there was an error loading component dependencies
                 */
                load_error: false,
                /**
                 * Timeout after which to display a loading message if data is not yet loaded
                 */
                loading_timeout: false,
            }
        },
        methods: {
            /**
             * Start the loading timeout.  Log value after expiration
             */
            initLoadingTimeout: function () {
                setTimeout(() => {
                    this.loading_timeout = true;
                }, 200);
            },
            /**
             * Load dependencies
             */
            loadData: function () {
                this.$store.dispatch('form_options/fetchCreateAccountOptions').then(() => {
                    this.dependencies.form_options = true;
                }).catch(() => {
                    this.dependencies.form_options = true;
                    this.load_error = true;
                });
            },
            /**
             * Whether to show a particular screen
             */
            showScreen: function (screen_key: CreateAccountScreenKey): boolean {
                if (this.debug_mode) {
                    return true;
                }
                if (this.active_screen_key === "all") {
                    return true;
                }
                return screen_key === this.active_screen_key;
            },
            /**
             * Clear the currently logged server error
             */
            clearServerError: function () {
                this.screen_server_error = "";
                this.duplicate_account_attempt = false;
            },
            /**
             * Handle the selection of an account type
             */
            selectAccountType: function (account_type: AccountTypeKey) {
                this.$store.commit('setAccountTypeKey', account_type);
                this.active_screen_key = "personal_info";
            },
            /**
             * Handle completion event on personal info form.
             * Submit data to server and respond to response
             */
            completePersonalInfo: function (exported_form_data: PersonalInformationData) {
                this.clearServerError();
                if (this.submitting) {
                    return;
                }
                this.submitting = true;
                this.$store.dispatch('completePersonalInformation', exported_form_data).then((response: PersonalInformationSubmissionResponse) => {
                    this.submitting = false;
                    if (response.success) {
                        this.active_screen_key = "address";
                        this.active_step_number++;
                        return;
                    }
                    this.screen_server_error = response.error;
                    if (response.is_duplicate_account) {
                        this.duplicate_account_attempt = true;
                    }
                }).catch(() => {
                    this.submitting = false;
                    this.screen_server_error = "There was an error submitting your information";
                });
            },
            /**
             * Handle cancel event on personal info form
             */
            cancelPersonalInfo: function () {
                if (this.submitting) {
                    return;
                }
                this.clearServerError();
                this.$store.commit('setAccountTypeKey', null);
                this.active_screen_key = "landing";
            },
            /**
             * Handle completion event on address form.
             * Submit data to server and respond to response
             */
            completeAddress: function (exported_form_data: AddressData) {
                if (this.submitting) {
                    return;
                }
                this.submitting = true;
                this.clearServerError();
                this.$store.dispatch('completeAddress', exported_form_data).then((response: AddressSubmissionResponse) => {
                    this.submitting = false;
                    if (response.success) {
                        this.active_screen_key = "emergency_contact";
                        this.active_step_number++;
                        return;
                    }
                    this.screen_server_error = response.error;
                }).catch(() => {
                    this.submitting = false;
                    this.screen_server_error = "There was an error submitting your information";
                });
            },
            /**
             * Whether the emergency contact form is blank
             */
            isEmergencyContactFormBlank: function (exported_form_data: EmergencyContactData): boolean {
                return exported_form_data.name === "" &&
                    exported_form_data.phone === "" &&
                    exported_form_data.relationship === "";
            },
            /**
             * Actions following completion of emergency contact form:
             *  - Increment active step number
             *  - Advance to next screen in the process (location depends on whether the active registration is
             *    domestic or foreign).
             */
            afterCompleteEmergencyContact: function () {
                this.active_step_number++;
                if (this.requires_federation_info) {
                    this.active_screen_key = "federation";
                    return;
                }
                this.active_screen_key = "password";
            },
            /**
             * Handle completion event on emergency contact form.
             * Submit data to server and respond to response
             */
            completeEmergencyContact: function (exported_form_data: EmergencyContactData) {
                if (this.submitting) {
                    return;
                }
                if (this.post_blank_emergency_contact !== true && this.isEmergencyContactFormBlank(exported_form_data)) {
                    this.afterCompleteEmergencyContact();
                    return;
                }
                this.submitting = true;
                this.clearServerError();
                this.$store.dispatch('completeEmergencyContact', exported_form_data).then((response: EmergencyContactSubmissionResponse) => {
                    this.submitting = false;
                    if (response.success) {
                        this.afterCompleteEmergencyContact();
                        return;
                    }
                    this.screen_server_error = response.error;
                }).catch(() => {
                    this.submitting = false;
                    this.screen_server_error = "There was an error submitting your information";
                });
            },
            /**
             * Handle completion event on federation information form.
             * Submit data to server and respond to response
             */
            completeFederationInfo: function (exported_form_data: FederationInfoData) {
                if (this.submitting) {
                    return;
                }
                this.submitting = true;
                this.clearServerError();
                this.$store.dispatch('completeFederationInformation', exported_form_data).then((response: FederationInformationSubmissionResponse) => {
                    this.submitting = false;
                    if (response.success) {
                        this.active_step_number++;
                        if (this.skate_test_required) {
                            this.active_screen_key = "skate_test";
                            return;
                        }
                        this.active_screen_key = "password";
                        return;
                    }
                    this.screen_server_error = response.error;
                }).catch(() => {
                    this.submitting = false;
                    this.screen_server_error = "There was an error submitting your information";
                });
            },
            /**
             * Handle completion event on skate test equivalency form.
             * Submit data to server and respond to response
             */
            completeSkateTestEquivalency: function (equivalency_data: SkateTestEquivalencyStateData) {
                if (this.submitting) {
                    return;
                }
                this.submitting = true;
                this.clearServerError();
                this.$store.dispatch('completeSkateTestEquivalency', equivalency_data).then((response: SkateTestEquivalencySubmissionResponse) => {
                    this.submitting = false;
                    if (response.success) {
                        this.active_step_number++;
                        this.active_screen_key = "password";
                        return;
                    }
                    this.screen_server_error = response.error;
                }).catch(() => {
                    this.submitting = false;
                    this.screen_server_error = "There was an error submitting your information";
                });
            },
            /**
             * Handle completion event on password form.
             * Submit data to server and respond to response
             *  - redirect to page contained in response
             */
            completePassword: function (exported_form_data: PasswordFormData) {
                if (this.submitting) {
                    return;
                }
                this.submitting = true;
                this.clearServerError();
                this.$store.dispatch('completePassword', exported_form_data).then((response: PasswordSubmissionResponse) => {
                    this.submitting = false;
                    if (response.success) {
                        window.location.assign(response.redirect_url);
                        return;
                    }
                    this.screen_server_error = response.error;
                }).catch(() => {
                    this.submitting = false;
                    this.screen_server_error = "There was an error submitting your information";
                });
            }
        },
        computed: {
            /**
             * Whether the component data is fully loaded.
             */
            loaded: function () {
                for (let i in this.dependencies) {
                    if (this.dependencies.hasOwnProperty(i)) {
                        let obj = this.dependencies[i];
                        if (obj !== true) {
                            return false;
                        }
                    }
                }
                return true;
            },
            /**
             * Whether federation information needs to be filled out
             */
            requires_federation_info: function (): boolean {
                return this.$store.getters['requires_federation_info'];
            },
            /**
             * Whether skate test equivalency is required
             */
            skate_test_required: function () {
                return this.$store.getters['skate_test_required'];
            },
            /**
             * Total amount of required steps
             */
            required_step_count: function (): number {
                return this.$store.getters['required_step_count'];
            },
            /**
             * Whether to show the steps indicator
             */
            show_steps_indicator: function (): boolean {
                return this.account_type !== null;
            },
            /**
             * The selected account type
             */
            account_type: function (): AccountTypeKey | null {
                return this.$store.state.account_type;
            },
            /**
             * The created member number for the active user
             * Null prior to completion of personal info form
             */
            member_number: function (): string | null {
                return this.$store.getters['member_number'];
            }
        },
        /**
         * Register sub-components
         */
        components: {
            PersonalInfoForm,
            AddressForm,
            EmergencyContactForm,
            ForeignInfoForm,
            PasswordForm,
            AccountTypeSelect,
            SkateTestEquivalency
        }
    });
</script>