<script lang="ts">
    import mixins from "vue-typed-mixins";
    import FormMixin from "../mixins/FormMixin";
    import {ProfileSectionKey} from "../contracts/app/CompetitionRegistrationContracts";
    import {EditProfileFormState} from "../models/Forms/EditProfileFormState";
    import {EditProfileFormValidator} from "../models/Forms/EditProfileFormValidator";
    import {GenderKey} from "../contracts/AppContracts";
    import {AccordionComponentInterface} from "../components/Accordion.vue";
    import HasDataDependencies from "../mixins/HasDataDependencies";
    import {UserProfile} from '../contracts/app/UserContracts';

    interface ProfileSectionKeyInterface extends StringConstructor {
        (): ProfileSectionKey;
    }

    export default mixins(FormMixin, HasDataDependencies).extend({
        props: {
            /**
             * The section to display as open when the component loads
             */
            init_section: {
                type: String as ProfileSectionKeyInterface,
                default: ""
            }
        },
        data: function () {
            return {
                /**
                 * The validator to use against the form data
                 */
                validator_class: EditProfileFormValidator,
                /**
                 * State form data class
                 */
                form_data: new EditProfileFormState(),
                /**
                 * Whether a submission attempt has been made
                 */
                dependencies: <{ [key: string]: boolean; }> {
                    form_options: false
                },
                /**
                 * Whether the component is saving
                 */
                saving: false,
                /**
                 * Save error on the component
                 */
                save_error: <string | null>null
            };
        },
        /**
         * Import saved profile into form on creation
         */
        created: function () {
            this.form_data.import(this.saved_profile);
        },
        methods: {
            /**
             * Load data needed for the component
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('form_options/fetchEditProfileOptions').then(() => {
                        this.dependencies.form_options = true;
                        resolve();
                    }).catch(() => {
                        reject();
                    });
                });
            },
            /**
             * Gender display formatting
             */
            displayGender: function (gender_key: GenderKey) {
                return gender_key.toLowerCase().replace(/^[a-z]/, function (letter: string) {
                    return letter.toUpperCase();
                });
            },
            /**
             * Open all the expandable sections of the form
             */
            openAllAccordions: function () {
                for (let i in this.$children) {
                    let $child = this.$children[i] as AccordionComponentInterface;
                    if ("open" in $child && typeof $child.open === "function") {
                        $child.open();
                    }
                }
            },
            /**
             * Save the active form
             */
            save: function () {
                this.submit_attempt = true;
                this.save_error = null;
                // If invalid, open all accordions and scroll to the first error field
                if (!this.valid) {
                    this.openAllAccordions();
                    this.$nextTick(() => {
                        let first_error_field = this.$el.querySelector('.form-field.has-error');
                        let error_parent = first_error_field ? first_error_field.parentNode : false;
                        if (error_parent) {
                            (error_parent as HTMLElement).scrollIntoView();
                        }
                    });
                    return;
                }
                this.saving = true;
                this.$store.dispatch('user/saveProfile', this.form_data).then(() => {
                    this.$emit('saved');
                    this.saving = false;
                }).catch((save_error: string) => {
                    this.saving = false;
                    this.save_error = save_error;
                });
            }
        },
        computed: {
            /**
             * The current user's saved profile
             */
            saved_profile: function (): UserProfile {
                return this.$store.getters['user/profile'];
            },
            /**
             * Name to display for the user
             */
            display_name: function (): string {
                return this.saved_profile.full_name;
            },
            /**
             * Member number to display for the user
             */
            display_member_number: function (): string {
                return this.saved_profile.member_number;
            },
            /**
             * Form options for the form inputs
             */
            form_options: function () {
                return this.$store.getters['form_options/edit_profile_options'];
            }
        }
    });
</script>