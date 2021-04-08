<template>
    <div class="team-registration-roster-summary">
        <div class="team-registration-roster-summary__row">
            <h4 class="team-registration-roster-summary__label">
                {{summary_label}}:
            </h4>
            <div class="team-registration-roster-summary__count">
                <span class="count-badge"
                      :class="{
                          'count-badge--invalid': invalid,
                          'count-badge--incomplete': incomplete && !invalid
                      }">
                    <span class="count-badge__content">
                        {{current_roster_size}}
                    </span>
                </span>
            </div>
            <p v-if="roster_summary_message"
               class="team-registration-roster-summary__message"
               :class="{
                   'text--alert': invalid || incomplete
               }">
                {{roster_summary_message}}
            </p>
        </div>
        <p v-if="per_member_fee"
           class="team-registration-roster-summary__secondary">
            Per {{member_type_descriptor.singular}} Fee:
            <span class="team-registration-roster-summary__fee">${{per_member_fee}}</span>
        </p>
    </div>
</template>
<script lang="ts">
    import {TeamRegistration} from '../_contracts';
    import ValidatesTeamRegistrationRosters from '../_mixins/ValidatesTeamRegistrationRosters';
    import mixins from 'vue-typed-mixins';

    const extendedVue = mixins(ValidatesTeamRegistrationRosters);
    export default extendedVue.extend({
        props: {
            /**
             * The full roster of available members for the team
             */
            available_roster: {
                type: Array as () => TeamRegistration.RosterEditMember[],
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
             * The list of member IDs in the selected roster
             */
            selected_roster_ids: {
                type: Array as () => string[],
                required: true
            },
            /**
             * Whether to show messaging that isn't related to validation errors
             */
            show_secondary_messaging: {
                type: Boolean,
                default: true
            },
            /**
             * Label for summary size count
             */
            summary_label: {
                type: String,
                default: 'Competition Roster'
            }
        },
        computed: {
            /**
             * Message to display in roster summary
             */
            roster_summary_message: function (): string | null {
                if (this.invalid) {
                    return `Remove ${this.invalid_reason} ${this.member_type_descriptor.singular.toLowerCase()}`;
                }
                if (this.incomplete) {
                    return `Roster minimum is ${this.minimum_size}`;
                }
                if (this.show_secondary_messaging) {
                    if (this.maximum_size && this.current_roster_size < this.maximum_size) {
                        return `You can select up to ${this.maximum_size}`;
                    }
                    if (this.maximum_reached) {
                        return 'You have reached the max allowed';
                    }
                }

                return null;
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
                return this.selected_roster_ids;
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
        }
    });
</script>