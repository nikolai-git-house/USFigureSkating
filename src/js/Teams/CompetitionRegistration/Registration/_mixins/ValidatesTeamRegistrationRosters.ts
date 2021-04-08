import Vue from 'vue';
import {TeamRegistration} from '../_contracts';
import {TeamRegistrationRosterService} from '../_services/TeamRegistrationRosterService';

export default Vue.extend({
    computed: {
        /**
         * The size of the selected roster
         */
        current_roster_size: function (): number {
            return this._active_roster_ids.length;
        },
        /**
         * Whether the selected roster is incomplete
         */
        incomplete: function (): boolean {
            return !!this._minimum_roster_size && this.current_roster_size < this._minimum_roster_size;
        },
        /**
         * Whether the selected roster is invalid
         */
        invalid: function (): boolean {
            return !!this.invalid_reason;
        },
        /**
         * Reason selected roster is invalid
         */
        invalid_reason: function (): 'ineligible' | 'invalid' | null {
            for (let i = 0; i < this.selected_roster.length; i++) {
                const selectedRosterElement: TeamRegistration.RosterEditMember = this.selected_roster[i];
                if (!selectedRosterElement.can_be_added_to_roster) {
                    const reason = selectedRosterElement.cannot_be_added_to_roster_reason;
                    if (reason && reason.toLowerCase()
                        .indexOf('ineligible') !== -1) {
                        return 'ineligible';
                    }

                    return 'invalid';
                }
            }

            return null;
        },
        /**
         * Whether the maximum roster size has been reached
         */
        maximum_reached: function (): boolean {
            return !!this._maximum_roster_size && this.current_roster_size >= this._maximum_roster_size;
        },
        /**
         * The roster corresponding with the current selections
         */
        selected_roster: function (): TeamRegistration.RosterEditMember[] {
            return TeamRegistrationRosterService.rosterFromIds(this._available_roster, this._active_roster_ids);
        },
        /**
         * The full available roster list
         */
        _available_roster: function (): TeamRegistration.RosterEditMember[] {
            return [];
        },
        /**
         * The list of selected ids to validate
         */
        _active_roster_ids: function (): string[] {
            return [];
        },
        /**
         * The active minimum roster size
         */
        _minimum_roster_size: function (): number | null {
            return null;
        },
        /**
         * The active maximum roster size
         */
        _maximum_roster_size: function (): number | null {
            return null;
        }
    }
});