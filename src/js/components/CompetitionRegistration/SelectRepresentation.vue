<script lang="ts">
    import Vue from "vue";
    import {FormOption, FormOptionValue} from "../../contracts/AppContracts";
    import {
        RepresentationSelection,
        RepresentationType} from "../../contracts/app/CompetitionRegistrationContracts";
    import {UserClubInformation, UserProfile} from '../../contracts/app/UserContracts';


    export default Vue.extend({
        data: function () {
            return {
                /**
                 * The active representation type
                 */
                representation_type: <RepresentationType>"home_club",
                /**
                 * The active LTS Program
                 */
                lts_program: <FormOptionValue | null>null,
                /**
                 * Whether the component is in the process of saving
                 */
                saving: false,
                /**
                 * Saving error message to display
                 */
                save_error: <string | null> null,
                /**
                 * Whether initial component load has completed
                 */
                component_loaded: false
            }
        },
        /**
         * Set initial values on component load.
         * If representation has been saved, honor it.
         * If the user doesn't have a home club, default to lts_program
         */
        created: function () {
            let existing_representation: RepresentationSelection | null = this.$store.getters['competition_registration/selected_representation'];
            if (!existing_representation) {
                if (!this.user_club) {
                    this.representation_type = "lts_program";
                }
                return
            }
            this.representation_type = existing_representation.representation_type;
            if (existing_representation.lts_program) {
                //ensure the previously selected organization is still an available value
                for (let i = 0; i < this.lts_programs.length; i++) {
                    let argument = this.lts_programs[i];
                    if (argument.value === existing_representation.lts_program) {
                        this.lts_program = argument.value;
                    }
                }
            }
            //Wait for next tick to prevent reset of initial values
            Vue.nextTick(() => {
                this.component_loaded = true;
            });
        },
        methods: {
            /**
             * Save the selection
             */
            saveRepresentation: function () {
                if (!this.representation_type) {
                    return;
                }
                this.saving = true;
                this.save_error = null;
                let representation_selection: RepresentationSelection = {
                    representation_type: this.representation_type,
                    lts_program: this.lts_program
                };

                this.$store.dispatch('competition_registration/selectRepresentation', representation_selection).then(() => {
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
             * Active user's profile.  Fetched in parent components. Used for option population
             */
            user_profile: function (): UserProfile | null {
                return this.$store.getters['user/profile']
            },
            /**
             * The active user's club, if it exists
             */
            user_club: function (): UserClubInformation | null {
                if (!this.user_profile) {
                    return null;
                }
                return this.user_profile.home_club;
            },
            /**
             * The active user's lts programs, if they exist
             */
            lts_programs: function (): FormOption[] {
                if (!this.user_profile) {
                    return [];
                }
                if (this.user_profile.lts_programs) {
                    return this.user_profile.lts_programs.programs
                }
                return [];
            },
            /**
             * Whether to show the secondary set of inputs on the form
             */
            show_sub_organization: function () {
                return this.representation_type === "lts_program";
            },
            /**
             * Whether the save button should be disabled
             */
            save_disabled: function () {
                if (this.saving) {
                    return true;
                }
                if (this.representation_type === null) {
                    return true;
                }
                if (this.show_sub_organization && this.lts_program === null) {
                    return true;
                }
                return false;
            },
            /**
             * Text to display in the button
             */
            button_text: function () {
                return this.saving ? "Saving" : "Save";
            }
        },
        watch: {
            /**
             * Watch representation type change and clear secondary form values
             */
            representation_type: function () {
                if (!this.component_loaded) {
                    return;
                }
                this.lts_program = null;
            }
        }
    });
</script>