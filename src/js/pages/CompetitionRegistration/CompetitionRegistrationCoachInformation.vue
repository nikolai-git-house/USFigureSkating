<script lang="ts">
    import {MemberSearchState} from "../../store/Modules/MemberSearchState";
    import {
        AssignableMember,
        CompRegAddCoachPayload,
        CompRegRemoveCoachPayload,
        CompRegReplaceCoachPayload
    } from "../../contracts/app/CompetitionRegistrationContracts";
    import {SkaterEventCategoryCoach} from "../../contracts/AppContracts";
    import HasDataDependencies from "../../mixins/HasDataDependencies"
    import HasCompetitionRegistrationCompetitionMixin from "../../mixins/HasCompetitionRegistrationCompetitionMixin"
    import mixins from 'vue-typed-mixins'
    import {SkaterCoachedEventCategory} from "../../models/SkaterCoachedEventCategory";
    import {CompetitionRegistrationService} from "../../services/CompetitionRegistrationService";
    import {MemberSearchConfig, MemberSearchResult} from "../../contracts/app/MemberSearchContracts";
    import {validateResultActive} from "../../components/MemberSearch/MemberSearchValidators";


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
                 * Data for the screen itself
                 */
                screenData: {
                    /**
                     * Whether the user has confirmed their coach selections
                     */
                    confirmed: false
                },
                /**
                 * The current coach in the process of finding a replacement
                 */
                edit_member: <AssignableMember | null>null,
                /**
                 * Whether the additional information popup is active
                 */
                additional_information_popup_active: false,
                /**
                 * Whether data needed for component to function has been loaded
                 */
                dependencies: {
                    competition: false,
                    screen_data: false
                },
            }
        },
        methods: {
            /**
             * Load data needed for component to function
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    let promises: Promise<void>[] = [
                        this.$store.dispatch('competition_registration/fetchCoachIdentificationScreenData').then(() => {
                            this.dependencies.screen_data = true;
                            this.dependencies.competition = true;
                        }).catch(() => {
                            reject();
                        })
                    ];
                    Promise.all(promises).then(() => {
                        resolve();
                    });
                });
            },
            /**
             * Set the ids within member search process to display as already selected
             *
             * Get all the coaches already assigned to the category being modified,
             * including the coach being replaced if replacing a coach
             */
            setCoachSearchBlockedCoachIDs: function (category_id: number) {
                let block_ids: number[] = [];
                for (let i = 0; i < this.coach_identification.length; i++) {
                    let coachIdentificationElement = this.coach_identification[i];
                    if (coachIdentificationElement.id === category_id) {
                        block_ids = coachIdentificationElement.coaches.map((coach_item) => {
                            return coach_item.id;
                        });
                        break;
                    }
                }
                this.$store.commit('member_search/setBlockedPreviousSelection', block_ids);
            },
            /**
             * Open the coach search component
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
             * Start the process for adding a coach to a category
             */
            addCoach: function (category_id: number) {
                this.edit_member = null;
                this.setCoachSearchBlockedCoachIDs(category_id);
                this.active_category_id = category_id;
                this.openSearch();
            },
            /**
             * Start the process for editing a coach within a category
             */
            editCoach: function ({category_id, member}: { category_id: number, member: AssignableMember }) {
                this.active_category_id = category_id;
                this.edit_member = member;
                this.setCoachSearchBlockedCoachIDs(category_id);
                this.openSearch();
            },
            /**
             * Initiate coach removal process and respond to result
             */
            doRemoveCoach: function (category_id: number, member: AssignableMember) {
                this.disable_buttons = true;
                return new Promise((resolve, reject) => {
                    let coach_id = member.id;
                    this.$store.dispatch('competition_registration/removeCategoryCoach', <CompRegRemoveCoachPayload>{
                        coach_id,
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
             * Initiate coach replacement process and respond to result
             */
            doReplaceCoach: function (replacement_id: number, replacee_id: number): Promise<void> {
                return new Promise((resolve, reject) => {
                    let category_id = this.active_category_id;
                    this.$store.dispatch('competition_registration/replaceCategoryCoach', <CompRegReplaceCoachPayload>{
                        category_id,
                        coach_id: replacement_id,
                        replace_coach_id: replacee_id
                    }).then(() => {
                        resolve();
                    }).catch((error_message) => {
                        reject(error_message);
                    });
                });
            },
            /**
             * Initiate coach addition process and respond to result
             */
            doAddCoach: function (coach_id: number): Promise<void> {
                return new Promise((resolve, reject) => {
                    let category_id = this.active_category_id;
                    this.$store.dispatch('competition_registration/addCategoryCoach', <CompRegAddCoachPayload>{
                        coach_id,
                        category_id
                    }).then(() => {
                        resolve();
                    }).catch((error_message) => {
                        reject(error_message);
                    });
                });
            },
            /**
             * Handle the select event on a member from search results
             * Fire proper process based on whether coach is being added as new coach or as a replacement coach
             */
            selectCoach: function (member: MemberSearchResult): Promise<void> {
                let replace_coach_id = this.edit_member ? this.edit_member.id : false;
                if (replace_coach_id) {
                    return this.doReplaceCoach(member.id, replace_coach_id);
                }
                return this.doAddCoach(member.id);
            },
            /**
             * Retreat in the competition registration process
             */
            retreat: function () {
                location.assign(this.competition.registration_links.event_selection);
            },
            /**
             * Advance in the competition registration process
             */
            advance: function () {
                if (this.block_continue) {
                    return;
                }
                location.assign(this.competition.registration_links.waivers);
            },
        },
        /**
         * Register member search state module and configure it when component is created
         */
        created: function () {
            this.$store.registerModule('member_search', MemberSearchState);
            this.$store.commit('member_search/configure',
                <MemberSearchConfig>{
                    search_function: CompetitionRegistrationService.coachSearch,
                    selection_method: this.selectCoach,
                    close_method: this.closeSearch,
                    ineligible_instruction: "Please choose another coach or leave blank.",
                    entity_descriptor: "Coach",
                    result_validators: [
                        validateResultActive
                    ]
                }
            );
        },
        computed: {
            /**
             * Header for the search component
             */
            search_header: function () {
                let value = "Coach Search";
                if (this.$store.state.member_search.results_active) {
                    value += " Results";
                }
                return value;
            },
            /**
             * The currently configured assignment category list and existing coaches
             */
            coach_identification: function (): SkaterCoachedEventCategory[] {
                return this.$store.getters['competition_registration/coach_identification'];
            },
            /**
             * Whether the user has identified at least one coach attending with them
             */
            coach_has_been_identified: function (): boolean {
                for (let i = 0; i < this.coach_identification.length; i++) {
                    let coachIdentificationElement = this.coach_identification[i];
                    if (coachIdentificationElement.coaches.length) {
                        return true;
                    }
                }
                return false;
            },
            /**
             * Whether any of the coaches that's been identified is ineligible
             */
            ineligible_coach_selected: function (): boolean {
                for (let i = 0; i < this.coach_identification.length; i++) {
                    let coachIdentificationElement = this.coach_identification[i];
                    for (let j = 0; j < coachIdentificationElement.coaches.length; j++) {
                        let coach: SkaterEventCategoryCoach = coachIdentificationElement.coaches[j];
                        if (coach.ineligible) {
                            return true;
                        }
                    }
                }
                return false;
            },
            /**
             * The active step in the competition registration process.  Depends on whether the competition supports partner events
             */
            active_step_number: function () {
                if (this.active_competition && !this.competition.has_partner_events) {
                    return 4;
                }
                return 6;
            },
            /**
             * Whether user should be prevented from continuing in the competition registration process
             * If an ineligible coach has been selected, or if the user hasn't approved the page terms
             */
            block_continue: function () {
                return this.ineligible_coach_selected || !this.screenData.confirmed;
            },
        },
        watch: {
            /**
             * When the set of assigned coaches change, re-require terms agreement
             */
            coach_identification: {
                handler: function () {
                    this.screenData.confirmed = false;
                },
                deep: true
            }
        }
    });
</script>