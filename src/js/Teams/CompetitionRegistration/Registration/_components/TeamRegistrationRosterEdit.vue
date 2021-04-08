<template>
    <div class="team-registration-roster-edit">
        <div class="team-registration-roster-edit__header">
            <h2 class="team-registration-roster-edit__header__title">
                {{title}}
            </h2>
            <h3 v-if="subtitle"
                class="team-registration-roster-edit__header__subtitle">
                {{subtitle}}
            </h3>
        </div>
        <component-loader v-if="show_loader"
                          :container="true"
                          :source="loading_state"></component-loader>
        <div v-else
             class="team-registration-roster-edit__content"
             :style="{'padding-bottom':content_pad+'px'}">
            <ul v-if="roster_rules"
                class="team-registration-roster-edit__rules-list">
                <li v-for="(rule, index) in roster_rules"
                    :key="index">
                    {{rule}}
                </li>
            </ul>
            <div v-if="$slots.information"
                 class="team-registration-roster-edit__information">
                <slot name="information"></slot>
            </div>
            <div class="team-registration-roster-edit__roster-size">
                <team-registration-roster-summary v-bind="summary_binding"></team-registration-roster-summary>
            </div>
            <div class="team-registration-roster-edit__roster">
                <p v-if="!available_roster.length"
                   class="text--alert">
                    There are no {{member_type_descriptor.plural.toLowerCase()}} in the team roster.
                </p>
                <ul v-else
                    class="team-registration-roster-list">
                    <li v-for="member in available_roster"
                        :key="member.id"
                        class="team-registration-roster-list__item"
                        :class="listItemClass(member)">
                        <div class="team-registration-roster-list__entity">
                            <div class="team-registration-roster-list__entity__content">
                                <p class="team-registration-roster-list__entity__description">
                                    <span>{{member.last_name}}, {{member.first_name}} <span class="text--muted">{{member.supporting_information}}</span></span>
                                </p>
                                <p v-if="!member.can_be_added_to_roster && member.cannot_be_added_to_roster_reason"
                                   class="team-registration-roster-list__entity__invalid-message text--alert">
                                    <span>{{member.cannot_be_added_to_roster_reason}}<span v-if="memberInSelectedRoster(member)">, please uncheck to remove</span></span>
                                </p>
                            </div>
                            <div v-if="showMemberControl(member)"
                                 class="team-registration-roster-list__entity__action">
                                <div class="form-group">
                                    <label :for="'select_to_roster_'+member.id"
                                           class="usfsa-checkbox usfsa-checkbox--unlabeled"
                                           :class="{'usfsa-checkbox--invalid':!member.can_be_added_to_roster}">
                                        <input :id="'select_to_roster_'+member.id"
                                               :checked="memberInSelectedRoster(member)"
                                               type="checkbox"
                                               v-on:click.prevent="toggleMember(member)">
                                        <span class="usfsa-checkbox__text">&nbsp;</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="!show_loader"
             ref="footer"
             class="team-registration-roster-edit__footer">
            <div class="team-registration-roster-edit__footer__content">
                <div v-if="per_member_fee"
                     class="team-registration-roster-edit__footer__member-cost total-member-cost">
                    <total-member-cost :per_member_fee="per_member_fee"
                                       :current_roster_size="current_roster_size"
                                       :label="member_type_descriptor.singular"></total-member-cost>
                </div>
                <p v-if="submission_error"
                   class="team-registration-roster-edit__error">
                    {{submission_error}}
                </p>
                <button class="button button--large button--primary button--block"
                        :disabled="confirm_disabled"
                        v-on:click.prevent="confirmRoster">
                    {{submitting ? 'Saving' : confirm_label}}
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {TeamRegistration} from '../_contracts';
    import ValidatesTeamRegistrationRosters from '../_mixins/ValidatesTeamRegistrationRosters';
    import mixins from 'vue-typed-mixins';
    import {ComponentLoaderStatusSource} from '../../../../contracts/AppContracts';
    import TeamRegistrationRosterSummary from './TeamRegistrationRosterSummary.vue';

    const extendedVue = mixins(ValidatesTeamRegistrationRosters);
    // @vue/component
    export default extendedVue.extend({
        components: {
            TeamRegistrationRosterSummary
        },
        props: {
            /**
             * The full roster of available members for the team
             */
            available_roster: {
                type: Array as () => TeamRegistration.RosterEditMember[],
                required: true
            },
            /**
             * Label for submit button
             */
            confirm_label: {
                type: String,
                default: 'Confirm Roster'
            },
            /**
             * Method to confirm roster
             */
            confirm_method: {
                type: Function as TeamRegistration.RosterConfirmMethod,
                required: true
            },
            /**
             * The maximum selections allowed
             */
            maximum_size: {
                type: Number,
                required: false
            },
            /**
             * Descriptor for the member type
             */
            member_type_descriptor: {
                type: Object as () => { singular: string; plural: string; },
                required: true
            },
            /**
             * The minimum size of the roster
             */
            minimum_size: {
                type: Number,
                required: false
            },
            /**
             * The fee per member for the roster
             */
            per_member_fee: {
                type: Number,
                required: false
            },
            /**
             * The rules for creating a team roster
             */
            roster_rules: {
                type: Array as () => string[],
                required: false
            },
            /**
             * The list of member IDs in the selected roster
             */
            selected_roster_ids: {
                type: Array as () => string[],
                required: true
            },
            /**
             * Subtitle to display in header
             */
            subtitle: {
                type: String,
                required: false
            },
            /**
             * Label for summary size count
             */
            summary_label: {
                type: String,
                default: 'Competition Roster'
            },
            /**
             * Title to display in header
             */
            title: {
                type: String,
                default: 'Edit Roster'
            },
            /**
             * The loading status of the data for the component
             */
            loading_state: {
                type: Object as () => ComponentLoaderStatusSource,
                required: false,
                /**
                 * By default, treat the component as loaded
                 */
                default: (): ComponentLoaderStatusSource => {
                    return {
                        load_error: false,
                        loaded: true,
                        loading_timeout: true
                    };
                }
            }
        },
        /**
         * Reactive Data
         */
        data: function () {
            return {
                /**
                 * The amount to pad the content list to prevent overlay issues with sticky footer
                 */
                content_pad: 0,
                /**
                 * Local tracking of member IDs included in the current competition roster.
                 * Local copy to enable cancellation of edits without impacting "official" roster
                 */
                selected_roster_member_ids: this.selected_roster_ids.slice(),
                /**
                 * Server error resulting from most recent submission
                 */
                submission_error: '',
                /**
                 * Whether the component is submitting a change
                 */
                submitting: false
            };
        },
        computed: {
            /**
             * Whether the confirm button should be disabled
             */
            confirm_disabled: function (): boolean {
                return this.invalid || this.incomplete || this.submitting;
            },
            /**
             * The binding for the summary elements
             */
            summary_binding: function (): TeamRegistration.TeamRegistrationRosterSummaryBinding {
                return {
                    available_roster: this.available_roster,
                    maximum_size: this.maximum_size,
                    member_type_descriptor: this.member_type_descriptor,
                    minimum_size: this.minimum_size,
                    per_member_fee: this.per_member_fee,
                    selected_roster_ids: this.selected_roster_member_ids,
                    summary_label: this.summary_label
                };
            },
            /**
             * Whether to show the component loading/load error state
             */
            show_loader: function (): boolean {
                return !this.loading_state.loaded || this.loading_state.load_error;
            },
            /**
             * The full available roster list
             */
            _available_roster: function (): TeamRegistration.RosterEditMember[] {
                return this.available_roster;
            },
            /**
             * The list of selected ids to validate
             */
            _active_roster_ids: function (): string[] {
                return this.selected_roster_member_ids;
            },
            /**
             * The active minimum roster size
             */
            _minimum_roster_size: function (): number | null {
                return this.minimum_size;
            },
            /**
             * The active maximum roster size
             */
            _maximum_roster_size: function (): number | null {
                return this.maximum_size;
            }
        },
        watch: {
            /**
             * Watch submission error for change and update content offset
             */
            submission_error: function () {
                this.$nextTick(() => {
                    this.updateContentOffset();
                });
            },
            /**
             * Watch available members for change and clear submission error message
             */
            selected_roster_member_ids: function () {
                this.submission_error = '';
            },
            /**
             * When loader goes away, adjust content offset
             */
            show_loader: function (val) {
                if (!val) {
                    this.$nextTick(() => {
                        this.updateContentOffset();
                    });
                }
            }
        },
        /**
         * Run processes upon component mount
         */
        mounted() {
            this.$nextTick(() => {
                this.updateContentOffset();
            });
        },
        methods: {
            /**
             * Confirm submission of the updated roster
             */
            confirmRoster: function (): void {
                if (this.confirm_disabled) {
                    return;
                }
                this.submitting = true;
                this.confirm_method(this.selected_roster_member_ids)
                    .then(() => {
                        this.submitting = false;
                        this.$emit('roster-confirmed');
                    })
                    .catch((error_message: string) => {
                        this.submitting = false;
                        this.submission_error = error_message;
                    });
            },
            /**
             * Class to apply to a list item
             */
            listItemClass: function (member: TeamRegistration.RosterEditMember): string | null {
                // If the member is selected but can't be added, invalid
                if (this.memberInSelectedRoster(member) && !member.can_be_added_to_roster) {
                    return 'invalid';
                }

                // If member is not selected, and they either can't be added or the maximum selections have been reached, disabled
                if (!this.memberInSelectedRoster(member) && (!member.can_be_added_to_roster || this.maximum_reached)) {
                    return 'disabled';
                }

                return null;
            },
            /**
             * Determine whether a member is in the currently selected roster or not
             */
            memberInSelectedRoster: function (member: TeamRegistration.RosterEditMember): boolean {
                return this.selected_roster_member_ids.indexOf(member.id) !== -1;
            },
            /**
             * Whether to show the control element for a member item
             */
            showMemberControl: function (member: TeamRegistration.RosterEditMember): boolean {
                if (this.memberInSelectedRoster(member)) {
                    return true;
                }

                return !this.maximum_reached && member.can_be_added_to_roster;
            },
            /**
             * Add/remove a member from the competition roster
             */
            toggleMember: function (member: TeamRegistration.RosterEditMember) {
                const member_index = this.selected_roster_member_ids.indexOf(member.id);
                // If member not in list, add them at the end
                if (member_index === -1) {
                    this.selected_roster_member_ids.push(member.id);

                    return;
                }
                // Remove a member already in the list
                this.selected_roster_member_ids.splice(member_index, 1);
            },
            /**
             * Add padding to content to offset sticky footer
             */
            updateContentOffset: function () {
                if (this.show_loader) {
                    return;
                }
                const footer = this.$refs.footer as HTMLElement;
                const footer_height = footer.offsetHeight;
                this.content_pad = footer_height + 30;
            }
        }
    });
</script>