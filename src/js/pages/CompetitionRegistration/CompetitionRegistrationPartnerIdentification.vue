<script lang="ts">
    import {MemberSearchState} from "../../store/Modules/MemberSearchState";
    import {
        AddPartnerPayload,
        AssignableMember,
        MemberAssignmentCategory,
        PartnerIdentificationCategory,
        RemovePartnerPayload} from "../../contracts/app/CompetitionRegistrationContracts";
    import {CompetitionRegistrationService} from "../../services/CompetitionRegistrationService";
    import {GenderKey} from "../../contracts/AppContracts";
    import HasDataDependencies from "../../mixins/HasDataDependencies"
    import HasCompetitionRegistrationCompetitionMixin from "../../mixins/HasCompetitionRegistrationCompetitionMixin"
    import mixins from 'vue-typed-mixins'
    import {
        MemberSearchConfig,
        MemberSearchResult,
        PartnerMemberSearchResult,
        PartnerMemberSearchResultValidationFunction
    } from "../../contracts/app/MemberSearchContracts";
    import {validateResultActive} from "../../components/MemberSearch/MemberSearchValidators";
    import {UserProfile} from '../../contracts/app/UserContracts';

    export default mixins(HasCompetitionRegistrationCompetitionMixin, HasDataDependencies).extend({
        data: function () {
            return {
                /**
                 * Whether search component is active
                 */
                search_active: false,
                /**
                 * The category for which a partner is being modified
                 */
                active_category_id: <number | null>null,
                /**
                 * Whether to disable buttons within the assignment screen
                 */
                disable_buttons: false,
                /**
                 * Whether data needed for component to function has been loaded
                 */
                dependencies: {
                    screen_data: false,
                    competition: false
                }
            }
        },
        methods: {
            /**
             * Load data needed for component to function
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    let promises: Promise<void>[] = [
                        this.$store.dispatch('competition_registration/fetchPartnerIdentificationScreenData').then(() => {
                            this.dependencies.competition = true;
                            this.dependencies.screen_data = true;
                            resolve();

                        }).catch(() => {
                            reject();
                        }),
                    ];
                    Promise.all(promises).then(() => {
                        resolve();
                    });
                });
            },
            /**
             * Begin the process for adding a partner to a category
             */
            addPartner: function (category_id: number) {
                this.active_category_id = category_id;
                this.$store.commit('member_search/setBlockedPreviousSelection', []);
                this.openSearch();
            },
            /**
             * Begin the process for editing a partner for a category
             */
            editPartner: function ({category_id, member}: { category_id: number, member: AssignableMember }) {
                this.active_category_id = category_id;
                this.$store.commit('member_search/setBlockedPreviousSelection', [member.id]);
                this.openSearch();
            },
            /**
             * Remove a partner from a category
             */
            removePartner: function (category_id: number, member: AssignableMember) {
                this.disable_buttons = true;
                return new Promise((resolve, reject) => {
                    let member_id = member.id;
                    this.$store.dispatch('competition_registration/removeCategoryPartner', <RemovePartnerPayload>{
                        member_id,
                        category_id
                    }).then(() => {
                        this.disable_buttons = false;
                        resolve();
                    }).catch((error_message) => {
                        this.disable_buttons = false;
                        reject(error_message);
                    });
                });
            },
            /**
             * Open the search component
             */
            openSearch: function (): void {
                this.search_active = true;
            },
            /**
             * Whether the search component is active.  Used for site overlay logic
             */
            searchActive: function (): boolean {
                return this.search_active;
            },
            /**
             * Close the search component.  Used by site overlay
             */
            closeSearch: function (): void {
                this.search_active = false;
            },
            /**
             * Handle the select event on a member from search results
             * Param generic type (MemberSearchResult vs PartnerMemberSearchResult)for Member Search functionality compatibility
             */
            selectMember: function (member: MemberSearchResult): Promise<void> {
                return new Promise((resolve, reject) => {
                    let category_id = this.active_category_id;
                    let member_id = member.id;
                    this.$store.dispatch('competition_registration/addCategoryPartner', <AddPartnerPayload>{
                        member_id,
                        category_id
                    }).then(() => {
                        resolve();
                    }).catch((error_message) => {
                        reject(error_message);
                    });
                });
            },
            /**
             * Validate that a search result has the opposite gender of the active user
             */
            validateSearchResultGender: function (member_result: PartnerMemberSearchResult): string | false {
                if (this.active_user_gender && member_result.gender === this.active_user_gender) {
                    return "Must be opposite gender";
                }
                return false;
            },
            /**
             * Retreat in the competition registration process
             */
            retreat: function () {
                location.assign(this.competition.registration_links.partner_events);
            },
            /**
             * Advance in the competition registration process
             */
            advance: function () {
                if (this.block_continue) {
                    return;
                }
                location.assign(this.competition.registration_links.event_selection);
            },
        },
        /**
         * Register member search state module and configure it when component is created
         */
        created: function () {
            this.$store.registerModule('member_search', MemberSearchState);
            this.$store.commit('member_search/configure', <MemberSearchConfig>{
                search_function: CompetitionRegistrationService.partnerSearch,
                selection_method: this.selectMember,
                close_method: this.closeSearch,
                ineligible_instruction: "Please select another partner.",
                entity_descriptor: "Partner",
                result_validators: [
                    this.validateSearchResultGender as PartnerMemberSearchResultValidationFunction,
                    validateResultActive
                ]
            });
        },
        computed: {
            /**
             * Header for the search component
             */
            search_header: function () {
                let value = "Partner Search";
                if (this.$store.state.member_search.results_active) {
                    value += " Results";
                }
                return value;
            },
            /**
             * The list of categories to which partners can be assigned, along with their currently assigned partner
             */
            identification_categories: function (): PartnerIdentificationCategory[] {
                return this.$store.getters['competition_registration/partner_identification'];
            },
            /**
             * identification_categories mapped to structure consumable by member assignment component
             */
            event_categories: function (): MemberAssignmentCategory[] {
                return this.identification_categories.map(function (category: PartnerIdentificationCategory): MemberAssignmentCategory {
                    return {
                        id: category.id,
                        name: category.name,
                        member_limit: 1,
                        members: category.partner ? [category.partner] : [],
                    }
                });
            },
            /**
             * The active user's gender
             */
            active_user_gender: function (): GenderKey | null {
                let active_user_profile: UserProfile | null = this.$store.getters['user/profile'];
                if (active_user_profile) {
                    return active_user_profile.gender;
                }
                return null;
            },
            /**
             * Whether user should be prevented from continuing in the competition registration process
             * If a category doesn't have a partner assigned, or if the partner is ineligible
             */
            block_continue: function (): boolean {
                for (let i = 0; i < this.identification_categories.length; i++) {
                    let identificationCategory: PartnerIdentificationCategory = this.identification_categories[i];
                    if (!identificationCategory.partner) {
                        return true
                    }
                    if (identificationCategory.partner.ineligible) {
                        return true;
                    }
                }
                return false;
            }
        }
    });
</script>