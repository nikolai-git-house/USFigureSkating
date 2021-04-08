<script lang="ts">
    import HasCompetitionRegistrationCompetitionMixin from "../../mixins/HasCompetitionRegistrationCompetitionMixin"
    import mixins from 'vue-typed-mixins'
    import HasDataDependencies from "../../mixins/HasDataDependencies";
    import SelectRepresentation from "./../../components/CompetitionRegistration/SelectRepresentation.vue";
    import {
        DataDisplayConfig,
        LabeledData,
        ProfileSectionKey,
        RepresentationSelection,
        RepresentationType} from "../../contracts/app/CompetitionRegistrationContracts";
    import {GenderKey} from "../../contracts/AppContracts";
    import EditProfile from "./../../components/EditProfile.vue";
    import {DataDisplayService} from "../../services/DataDisplayService";
    import {UserLTSInformation, UserProfile} from '../../contracts/app/UserContracts';


    export default mixins(HasDataDependencies, HasCompetitionRegistrationCompetitionMixin).extend({
        data: function () {
            return {
                /**
                 * Whether profile edit takeover is active
                 */
                edit_active: false,
                /**
                 * Whether select representation takeover is active
                 */
                representation_active: false,
                /**
                 * Whether data needed for component to function has been loaded
                 */
                dependencies: {
                    competition: false,
                    profile: false
                },
                /**
                 * Data for the screen itself
                 */
                screenData: {
                    /**
                     * Whether the user has confirmed their information is accurate
                     */
                    confirmed: false,
                },
                /**
                 * The section of the profile that triggered the beginning of the edit process
                 */
                edit_section: <ProfileSectionKey | null>null,
                /**
                 * Whether default representation selection request is pending
                 */
                default_representation_submitting: <boolean>false,
                /**
                 * Error message resulting from default representation selection
                 */
                default_representation_error: <string | null>null
            }
        },
        methods: {
            /**
             * Load data needed for component to function
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    let promises: Promise<void>[] = [
                        this.$store.dispatch('competition_registration/fetchProfileScreenData').then(() => {
                            this.dependencies.profile = true;
                            this.dependencies.competition = true;
                        }).catch(() => {
                            reject();
                        })
                    ];
                    Promise.all(promises).then(() => {
                        resolve();
                    })
                });
            },
            /**
             * Format gender display
             */
            displayGender: function (gender_key: GenderKey): string {
                return DataDisplayService.capitalize(gender_key);
            },
            /**
             * From a field config, get the display value from user profile
             */
            summaryField: function (field_config: DataDisplayConfig): string | null {
                if (!this.active_profile) {
                    return null;
                }
                if (field_config.key === "gender") {
                    return this.displayGender(this.active_profile.gender);
                }
                return DataDisplayService.displayFieldFromObject(field_config.key, this.active_profile);
            },
            /**
             * Create a summary list from a source config
             */
            createSummaryList: function (source_config: DataDisplayConfig[]): LabeledData[] {
                return source_config.reduce((carry: LabeledData[], item: DataDisplayConfig) => {
                    let display_value = this.summaryField(item);
                    if (display_value) {
                        carry.push({
                            label: item.label,
                            value: display_value
                        })
                    }
                    return carry;
                }, [])
            },
            /**
             * Overlay logic function to determine whether to show the edit profile takeover
             */
            editActive: function (): boolean {
                return this.edit_active;
            },
            /**
             * Close the profile edit takeover
             * Assume data change and unset the confirmation
             */
            closeEdit: function (): void {
                this.edit_active = false;
                this.screenData.confirmed = false;
            },
            /**
             * Open the profile edit takeover
             */
            openEdit: function (section_key: ProfileSectionKey): void {
                this.edit_active = true;
                this.edit_section = section_key;
            },
            /**
             *  When a user does not need to select their representation, report default selection
             *  1) If a user has LTS program(s), select the first one.
             *  2) Otherwise, use "home_club"
             */
            selectDefaultRepresentation: function (): Promise<void> {
                this.default_representation_error = null;
                this.default_representation_submitting = true;

                return new Promise((resolve, reject) => {
                    let lts_program = null;
                    let representation_type: RepresentationType = "home_club";
                    if (this.lts_programs && this.lts_programs.programs.length) {
                        lts_program = this.lts_programs.programs[0].value;
                        representation_type = "lts_program";
                    }

                    let representation_selection: RepresentationSelection = {
                        representation_type,
                        lts_program
                    };

                    this.$store.dispatch('competition_registration/selectRepresentation', representation_selection).then(() => {
                        this.default_representation_submitting = false;
                        resolve();
                    }).catch((save_error: string) => {
                        this.default_representation_submitting = false;
                        reject(save_error);
                    });
                });
            },
            /**
             * Open the representation selection takeover
             */
            openRepresentation: function ($event: Event): void {
                if (this.editActive()) {
                    return;
                }
                if (this.screenData.confirmed) {
                    return;
                }
                if (this.default_representation_submitting) {
                    return;
                }
                if (!this.representation_selection_required) {
                    this.selectDefaultRepresentation().then(() => {
                        this.screenData.confirmed = true;
                    }).catch((save_error: string) => {
                        this.default_representation_error = save_error;
                    });
                    return;
                }
                $event.preventDefault();
                this.representation_active = true;
            },
            /**
             * Overlay logic function to determine whether to show the representation selection takeover
             */
            representationActive: function (): boolean {
                return this.representation_active;
            },
            /**
             * Handle the close without save event from representation takeover
             */
            closeRepresentation: function (): void {
                this.representation_active = false;
                this.$nextTick(() => {
                    this.scrollToActions();
                })
            },
            /**
             * Handle the save event from representation takeover
             */
            saveRepresentation: function (): void {
                this.screenData.confirmed = true;
                this.closeRepresentation();
            },
            /**
             * Scroll to the page actions block
             */
            scrollToActions: function () {
                (this.$refs['actions']as HTMLElement).scrollIntoView()
            },
            /**
             * Advance in the competition registration process
             */
            advance: function () {
                if (this.block_continue) {
                    return;
                }
                location.assign(this.competition.registration_links.skate_test);
            },
            /**
             * Retreat in the competition registration process
             */
            retreat: function () {
                location.assign(this.competition.registration_links.overview);
            }
        },
        computed: {
            /**
             * Whether a representation selection needs to be completed in general (independent of whether it's been done already)
             */
            representation_selection_required: function (): boolean {
                return this.$store.getters['competition_registration/representation_selection_required'];
            },
            /**
             * The profile for the active user
             */
            active_profile: function (): UserProfile | null {
                return this.$store.getters['user/profile'];
            },
            /**
             * The LTS programs for the active user
             */
            lts_programs: function (): UserLTSInformation | null {
                return this.$store.getters['user/lts_information'];
            },
            /**
             * Data to populate the profile summary block
             */
            profile_summary: function () {
                return {
                    name: this.active_profile ? this.active_profile.full_name : "",
                    member_number: this.active_profile ? this.active_profile.member_number : "",
                    home_club: this.active_profile ? this.active_profile.home_club : null,
                    region_name: this.active_profile ? this.active_profile.region_name : "",
                    section_name: this.active_profile ? this.active_profile.section_name : "",
                }
            },
            /**
             * Whether user should be prevented from continuing
             */
            block_continue: function () {
                return !this.screenData.confirmed;
            },
            /**
             * The label:value pairs for the main information data display
             */
            main_summary_data: function () {
                return this.createSummaryList(<DataDisplayConfig[]>[
                        {
                            label: "Prefix",
                            key: "prefix.label"
                        },
                        {
                            label: "First Name",
                            key: "first_name"
                        },
                        {
                            label: "Last Name",
                            key: "last_name"
                        },
                        {
                            label: "Gender",
                            key: "gender"
                        },
                        {
                            label: "Birth Date",
                            key: "birth_date.formatted"
                        },
                    ]
                );
            },
            /**
             * The label:value pairs for the contact data display
             */
            contact_summary_data: function (): LabeledData[] {
                return this.createSummaryList(<DataDisplayConfig[]>[
                    {
                        label: "Primary Email",
                        key: 'primary_email.value'
                    },
                    {
                        label: "Primary Phone",
                        key: 'primary_phone.value'
                    }
                ]);
            },
        },
        components: {
            SelectRepresentation,
            EditProfile
        }
    });
</script>