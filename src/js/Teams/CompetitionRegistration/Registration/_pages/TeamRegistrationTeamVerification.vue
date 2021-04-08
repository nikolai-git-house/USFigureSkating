<template>
    <page :header="page_header"
          class="team-registration-team-verification">
        <team-registration-header slot="pre-header"></team-registration-header>
        <div slot="header-content">
            <team-registration-progress-bar></team-registration-progress-bar>
            <p class="team-registration__page-lead">
                Please review the team information below as it will be used for various aspects of the competition. If
                the level is not correct, you must update this through your profile in members only.
            </p>
        </div>
        <component-loader v-if="!component_loaded"
                          :container="true"
                          :source="this"
                          error_message="Error loading team verification."></component-loader>
        <div v-else
             class="team-registration-team-verification__content">
            <div class="page__section page__section--accent page__accent-content">
                <div class="grid-container">
                    <div class="card">
                        <div class="card__content">
                            <div v-if="edit_active"
                                 class="edit-team-name-form">
                                <div class="form-group">
                                    <label class="sr-only"
                                           for="team_name">Team Name
                                    </label>
                                    <input id="team_name"
                                           v-model="edit_name"
                                           type="text"
                                           class="form-field"
                                           name="team_name"
                                           v-on:keydown.enter="saveEdit">
                                </div>
                                <div class="edit-team-name-form__actions">
                                    <div class="edit-team-name-form__actions__column">
                                        <button class="button button--block button--info"
                                                v-on:click.prevent="cancelEdit">
                                            Cancel
                                        </button>
                                    </div>
                                    <div class="edit-team-name-form__actions__column">
                                        <button class="button button--block"
                                                :disabled="edit_name===team_information.name"
                                                v-on:click.prevent="saveEdit">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <h3 v-else
                                class="team-registration-team-verification__team-name card__heading">
                                <span>{{team_information.name}}</span>
                                <button class="team-registration-team-verification__team-name__edit-trigger icon-button icon-button--edit icon-button--md"
                                        v-on:click.prevent="openEdit">
                                    <span class="sr-only">Edit team name</span>
                                </button>
                            </h3>
                            <ul class="card__list label-list">
                                <li>
                                    <span class="label-list__label">Level:</span>
                                    {{team_information.level}}
                                </li>
                                <li>
                                    <span class="label-list__label">Member:</span>
                                    #{{team_information.member_number}}
                                </li>
                                <li>
                                    <span class="label-list__label">Membership End Date:</span>
                                    {{team_information.membership_end_date}}
                                    <span v-if="team_information.membership_expired"
                                          class="text--alert"> (Expired)</span>
                                </li>
                                <li>
                                    <span class="label-list__label">Club:</span>
                                    {{team_information.club}}
                                </li>
                                <li v-if="team_information.section">
                                    <span class="label-list__label">Section:</span>
                                    {{team_information.section}}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="team-registration__terms">
                        <label for="terms_confirm"
                               class="usfsa-checkbox">
                            <input id="terms_confirm"
                                   v-model="confirmed"
                                   type="checkbox">
                            <span class="usfsa-checkbox__text">I have verified the team information is accurate.</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="grid-container">
                <team-registration-page-navigation :retreat="retreat"
                                                   :advance="advance"
                                                   :advance_disabled="advance_disabled"
                                                   :hide_retreat="hide_retreat"></team-registration-page-navigation>
            </div>
        </div>
        <saving-confirmation-overlay :is_saving="is_saving"
                                     :save_error="save_error"
                                     :confirmation_message="confirmation_message"
                                     v-on:close="closeConfirmation"></saving-confirmation-overlay>
    </page>
</template>
<script lang="ts">
    import TeamRegistrationSubpageMixin from '../_mixins/TeamRegistrationSubpageMixin';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import mixins from 'vue-typed-mixins';
    import {TeamRegistration, TeamRegistrationService} from '../_contracts';

    const vueClass = mixins(TeamRegistrationSubpageMixin, HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Confirmation message following team name save
                 */
                confirmation_message: '',
                /**
                 * Whether the confirmation checkbox is checked
                 */
                confirmed: false,
                /**
                 * Data dependencies for the component to function
                 */
                dependencies: {
                    team: false
                },
                /**
                 * Whether the edit name form is active
                 */
                edit_active: false,
                /**
                 * Reactive name for the edit team name form
                 */
                edit_name: '',
                /**
                 * Whether the component is saving a team name edit
                 */
                is_saving: false,
                /**
                 * Page title for mixin integration
                 */
                page_title: 'Team Verification',
                /**
                 * Error resulting from a team name save attempt
                 */
                save_error: ''
            };
        },
        computed: {
            /**
             * Whether continue button should be disabled
             */
            advance_disabled: function (): boolean {
                return !this.confirmed;
            },
            /**
             * Information about the active team
             */
            team_information: function (): TeamRegistration.TeamVerificationTeamInformation {
                return this.$store.state.team_registration.active_team_profile;
            }
        },
        methods: {
            /**
             * Cancel edit to the team name
             */
            cancelEdit: function (): void {
                this.edit_active = false;
            },
            /**
             * Close the confirmation overlay
             */
            closeConfirmation: function (): void {
                this.edit_active = !!this.save_error;
                this.is_saving = false;
                this.confirmation_message = '';
                this.save_error = '';
            },
            /**
             * Load data for page
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('team_registration/fetchTeamVerification')
                        .then(() => {
                            this.dependencies.team = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Open the team name edit form
             */
            openEdit: function (): void {
                this.edit_active = true;
                this.edit_name = this.team_information.name;
            },
            /**
             * Save edit to team name
             */
            saveEdit: function (): void {
                this.is_saving = true;
                const payload: TeamRegistrationService.UpdateTeamNameServicePayload = {
                    team_name: this.edit_name,
                    team_id: this.team_information.id
                };
                this.$store.dispatch('team_registration/updateTeamName', payload)
                    .then(() => {
                        this.is_saving = false;
                        this.confirmation_message = `Team "${this.team_information.name}" Successfully Updated.`;
                    })
                    .catch((error_message: string) => {
                        this.is_saving = false;
                        this.save_error = error_message;
                    });
            }
        }
    });
</script>