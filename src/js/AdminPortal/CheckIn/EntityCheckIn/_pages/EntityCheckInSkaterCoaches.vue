<template>
    <div class="entity-check-in-skater-coaches">
        <div class="entity-check-in-subpage__content-container  entity-check-in-subpage__content-container--pad-lg">
            <div v-if="!component_loaded" class="entity-check-in-subpage__notice">
                <p v-if="load_error" class="text--alert">
                    Error loading coaches.
                </p>
                <p v-else-if="!loaded && loading_timeout">
                    Loading...
                </p>
            </div>
            <div v-else class="entity-check-in-skater-coaches__content">
                <member-category-assignment :disable_buttons="disable_buttons"
                                            :remove_fn="remove_function"
                                            :event_categories="coach_identification"
                                            member_label="Coach Attending"
                                            no_item_notice="No coach selections available."
                                            add_button_text="Add Coach"
                                            v-on:add="addCoach"
                                            v-on:edit="editCoach">
                    <div slot="member" slot-scope="slotProps">
                        <div class="member-selection-member__description member-selection-member__description--with-compliance">
                            <accordion class="accordion--unpadded accordion--blank accordion--up-down">
                                <span slot="trigger_text" class="accordion-trigger-raw member-selection-member__description--with-compliance__summary">
                                    <span class="member-selection-member__description--with-compliance__summary__status">
                                        <i class="member-selection-member__description--with-compliance__status-icon inline-icon" :class="'icon-status-primary-'+(slotProps.member.compliance_complete ? 'success' : 'error')"></i>
                                    </span>
                                    <span class="member-selection-member__description--with-compliance__summary__entity-name">
                                        <span v-if="slotProps.member_label" class="member-name__position">
                                            {{slotProps.ordinal}} {{slotProps.member_label}}:
                                        </span>
                                        <span class="member-name__name">
                                            {{slotProps.member.first_name}} {{slotProps.member.last_name}}
                                        </span>
                                        <span v-if="slotProps.member.ineligible" class="member-name__status text--alert">(Ineligible)</span>
                                    </span>
                                </span>
                                <entity-compliance-requirements-summary
                                    slot="expand_content"
                                    class="member-selection-member__description--with-compliance__data entity-compliance-requirements-summary--small entity-compliance-requirements-summary--small-icons entity-compliance-requirements-summary--standard-text"
                                    :compliance_items="slotProps.member.compliance_summary"
                                    :override_permitted="false"></entity-compliance-requirements-summary>
                            </accordion>
                        </div>
                    </div>
                </member-category-assignment>
            </div>
        </div>
        <site-takeover v-if="searchActive()" v-on:close="closeSearch()">
            <div class="competition-registration-takeover">
                <div class="competition-registration-takeover__header">
                    <h2 class="competition-registration-takeover__title">
                        Coach Search
                    </h2>
                </div>
                <div class="competition-registration-takeover__content  competition-registration-takeover__content--blank">
                    <member-search></member-search>
                </div>
            </div>
        </site-takeover>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {AssignableMember, MemberRemoveFunction} from '../../../../contracts/app/CompetitionRegistrationContracts';
    import {
        MemberSearchConfig,
        MemberSearchParameters,
        MemberSearchResult,
        MemberSearchSearchFunction
    } from '../../../../contracts/app/MemberSearchContracts';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import {MemberSearchState} from '../../../../store/Modules/MemberSearchState';
    import {CheckInSkaterCoachedEventCategory} from '../../_models/CheckInSkaterCoachedEventCategory';
    import {
        CheckInAddSkaterCoachActionPayload,
        CheckInRemoveCoachActionPayload,
        CheckInReplaceSkaterCoachActionPayload
    } from '../_contracts/EntityCheckInContracts';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The category for which a partner is being modified
                 */
                active_category_id: <number | null>null,
                /**
                 * Data dependencies
                 */
                dependencies: {
                    coaches: false
                },
                /**
                 * Whether to disable buttons within the assignment screen
                 */
                disable_buttons: false,
                /**
                 * The current coach in the process of finding a replacement
                 */
                edit_member: <AssignableMember | null>null,
                /**
                 * Whether search component is active
                 */
                search_active: false,
                /**
                 * Whether there's an error loading the search form
                 */
                search_form_load_error: false
            };
        },
        computed: {
            /**
             * The current event-coach assignment in state
             */
            coach_identification: function (): CheckInSkaterCoachedEventCategory[] {
                return this.$store.getters['checkin/skater_coaches/coach_assignment'];
            },
            /**
             * The function passed to assignment child component to perform the removal of a member
             */
            remove_function: function (): MemberRemoveFunction {
                return this.doRemoveCoach as MemberRemoveFunction;
            },
            /**
             * Function to supply to Member Search to run search
             */
            search_function: function (): MemberSearchSearchFunction {
                return (search_params: MemberSearchParameters) => {
                    return this.$store.dispatch('checkin/skater_coaches/search', search_params);
                };
            }
        },
        /**
         * Run methods on component creation
         */
        created: function () {
            this.registerMemberSearchModule();
            this.configureMemberSearch();
        },
        methods: {
            /**
             * Begin the process for adding a coach
             */
            addCoach: function (category_id: number) {
                this.edit_member = null;
                this.setCoachSearchBlockedCoachIDs(category_id);
                this.active_category_id = category_id;
                this.openSearch();
            },
            /**
             * Close the search component.  Used by site overlay
             */
            closeSearch: function (): void {
                this.search_active = false;
            },
            /**
             * Configure member search
             */
            configureMemberSearch: function (): void {
                const member_search_config: MemberSearchConfig = {
                    close_method: this.closeSearch,
                    entity_descriptor: 'Coach',
                    ineligible_instruction: 'Please choose another coach or leave blank.',
                    result_validators: [],
                    search_function: this.search_function,
                    selection_method: this.selectCoach
                };
                this.$store.commit('member_search/configure', member_search_config);
            },
            /**
             * Initiate coach addition process and respond to result
             */
            doAddCoach: function (coach: MemberSearchResult): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('checkin/skater_coaches/addCategoryCoach', <CheckInAddSkaterCoachActionPayload>{
                        category_id: this.active_category_id,
                        coach
                    })
                        .then(() => {
                            resolve();
                        })
                        .catch((error_message) => {
                            reject(error_message);
                        });
                });
            },
            /**
             * Initiate coach removal process and respond to result
             */
            doRemoveCoach: function (category_id: number, member: AssignableMember): Promise<void> {
                this.disable_buttons = true;

                return new Promise((resolve, reject) => {
                    const coach_id = member.id;
                    this.$store.dispatch('checkin/skater_coaches/removeCategoryCoach', <CheckInRemoveCoachActionPayload>{
                        coach_id,
                        category_id
                    })
                        .then(() => {
                            this.disable_buttons = false;
                            resolve();
                        })
                        .catch((error_message) => {
                            this.disable_buttons = false;
                            reject(error_message);
                        });
                });
            },
            /**
             * Initiate coach replacement process and respond to result
             */
            doReplaceCoach: function (replacement: MemberSearchResult, replacee_id: number): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('checkin/skater_coaches/replaceCategoryCoach', <CheckInReplaceSkaterCoachActionPayload>{
                        category_id: this.active_category_id,
                        coach: replacement,
                        previous_coach_id: replacee_id
                    })
                        .then(() => {
                            resolve();
                        })
                        .catch((error_message) => {
                            reject(error_message);
                        });
                });
            },
            /**
             * Begin the process for editing a coach
             */
            editCoach: function ({category_id, member}: { category_id: number; member: AssignableMember; }) {
                this.active_category_id = category_id;
                this.edit_member = member;
                this.setCoachSearchBlockedCoachIDs(category_id);
                this.openSearch();
            },
            /**
             * Load component data
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('checkin/skater_coaches/fetchInformation')
                        .then(() => {
                            this.dependencies.coaches = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Open the coach search component
             */
            openSearch: function (): void {
                this.search_form_load_error = false;
                this.$store.dispatch('checkin/skater_coaches/fetchSearchFormOptions')
                    .then(() => {
                        this.search_active = true;
                    })
                    .catch(() => {
                        this.search_form_load_error = true;
                        this.search_active = true;
                    });
            },
            /**
             * If member search state module isn't registered, register it
             */
            registerMemberSearchModule: function (): void {
                if (typeof this.$store.state.member_search === 'undefined') {
                    this.$store.registerModule('member_search', MemberSearchState);
                }
                this.$store.commit('member_search/setFormLoadErrorCheckFunction', () => {
                    return this.search_form_load_error;
                });
            },
            /**
             * Whether the search component is active.  Used for site overlay logic
             */
            searchActive: function (): boolean {
                return this.search_active;
            },
            /**
             * Handle the select event on a coach from search results
             * Fire proper process based on whether coach is being added as new coach or as a replacement coach
             */
            selectCoach: function (member: MemberSearchResult): Promise<void> {
                const replace_coach_id = this.edit_member ? this.edit_member.id : false;
                if (replace_coach_id) {
                    return this.doReplaceCoach(member, replace_coach_id);
                }

                return this.doAddCoach(member);
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
                    const coachIdentificationElement = this.coach_identification[i];
                    if (coachIdentificationElement.id === category_id) {
                        block_ids = coachIdentificationElement.coaches.map((coach_item) => {
                            return coach_item.id;
                        });
                        break;
                    }
                }
                this.$store.commit('member_search/setBlockedPreviousSelection', block_ids);
            }
        }
    });
</script>