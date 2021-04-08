<template>
    <div class="series-application-profile">
        <div class="user-profile-display">
            <div class="user-profile-display__section">
                <h3 class="user-profile-display__section-heading__text user-profile-display__section-heading__text--primary">
                    {{profile.full_name}}
                </h3>
                <div class="user-profile-display__data">
                    <ul class="label-list">
                        <li>
                            <span class="label-list__label">Member:</span>
                            <span class="label-list__value">#{{profile.member_number}}</span>
                        </li>
                        <li>
                            <span class="label-list__label">Date of Birth:</span>
                            <span v-if="profile.birth_date"
                                  class="label-list__value">
                                {{profile.birth_date.formatted}}
                            </span>
                            <span v-else
                                  class="label-list__value">
                                <em>N/A</em>
                            </span>
                        </li>
                        <li v-if="!edit_email_active">
                            <span class="label-list__label">Email:</span>
                            <span v-if="profile.email"
                                  class="label-list__value">
                                {{profile.email}}
                            </span>
                            <span v-else
                                  class="label-list__value">
                                <em>N/A</em>
                            </span>
                            <button class="icon-button icon-button--pseudo icon-button--edit icon-button--md series-application-profile__section-edit"
                                    title="Edit email address"
                                    v-on:click.prevent="openEmailEdit">
                                <span class="sr-only">Edit email address</span>
                            </button>
                        </li>
                        <li v-if="edit_email_active"
                            class="series-application-profile__email-edit">
                            <series-application-profile-email-edit :value="email_edit_initial_value"
                                                                   v-on:close="closeEmailEdit"></series-application-profile-email-edit>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="user-profile-display__section">
                <h3 class="user-profile-display__section-heading__text">
                    <span>Section Eligibility</span>
                    <button class="series-application-profile__info-button icon-button icon-button--lg icon-button--info icon-button--pseudo"
                            v-on:click.prevent="active_info='eligibility'">
                        <span class="sr-only">View more information about section eligibility</span>
                    </button>
                </h3>
                <div class="user-profile-display__data">
                    <ul class="label-list">
                        <li>
                            <span class="label-list__label">Club:</span>
                            <span v-if="profile.home_club"
                                  class="label-list__value">
                                {{profile.home_club.name}}
                            </span>
                            <span v-else
                                  class="label-list__value">
                                <em>N/A</em>
                            </span>
                        </li>
                        <li>
                            <span class="label-list__label">Region:</span>
                            <span class="label-list__value">
                                {{profile.region_name}}
                            </span>
                        </li>
                        <li>
                            <span class="label-list__label">Section:</span>
                            <span class="label-list__value">
                                {{profile.section_name}}
                            </span>
                        </li>
                    </ul>
                </div>
                <popup v-cloak
                       v-if="active_info==='eligibility'"
                       class="popup popup--info popup--md"
                       :math_center="true"
                       v-on:close-popup="active_info=false">
                    <span slot="heading-text">
                        Additional Information
                    </span>
                    <div slot="content">
                        <p>
                            Singles athletes are automatically entered in one of the three sections (Eastern,
                            Midwestern, or Pacific Coast) for the series, based on the location of their home club,
                            or if an individual member, their home address. Athletes will remain in this section for
                            the duration of the series. Pairs and dance teams will receive a national ranking and
                            are not tied to a section.
                        </p>
                    </div>
                </popup>
            </div>
            <div class="user-profile-display__section user-profile-display__section--skate-tests">
                <h3 class="user-profile-display__section-heading__text">
                    <span>Skate Tests</span>
                    <button class="series-application-profile__info-button icon-button icon-button--lg icon-button--info icon-button--pseudo"
                            v-on:click.prevent="active_info='skate_tests'">
                        <span class="sr-only">View more information about section eligibility</span>
                    </button>
                </h3>
                <!--@integration: see integration documentation about `club_autosuggest_configuration` attribute -->
                <skate-tests class="skate-tests--sm"
                             :club_autosuggest_configuration="{ active:true, restrict:false }"></skate-tests>
                <popup v-cloak
                       v-if="active_info==='skate_tests'"
                       class="popup popup--info popup--md"
                       :math_center="true"
                       v-on:close-popup="active_info=false">
                    <span slot="heading-text">
                        Additional Information
                    </span>
                    <div slot="content">
                        <p>A skater's test level determines which events they can enter at the competition.</p>
                        <p>
                            If you need assistance with this requirement, please email
                            <a class="standard-link standard-link--no-underline"
                               href="mailto:ProductSupport@usfigureskating.org">ProductSupport@usfigureskating.org
                            </a>
                        </p>
                    </div>
                </popup>
            </div>
        </div>
        <slot></slot>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import SkateTests from '../../../../components/SkateTests/SkateTests.vue';
    import SeriesApplicationProfileEmailEdit
        from '../../_components/SeriesApplicationProfileEmailEdit.vue';
    import {SeriesApplication} from '../../_contracts';

    type ActiveInfoKey = 'skate_tests' | 'eligibility';
    export default Vue.extend({
        components: {
            SeriesApplicationProfileEmailEdit,
            SkateTests
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Key for active information window
                 */
                active_info: <ActiveInfoKey | boolean>false,
                /**
                 * Whether the edit email form is active
                 */
                edit_email_active: false
            };
        },
        computed: {
            /**
             * Default value when editing email
             */
            email_edit_initial_value: function (): string {
                return this.profile && this.profile.email ? this.profile.email : '';
            },
            /**
             * The profile for the active user
             */
            profile: function (): SeriesApplication.UserApplicationProfile | null {
                return this.$store.getters['series_registration/application/user_profile'];
            }
        },
        methods: {
            /**
             * Cancel the email edit field
             */
            closeEmailEdit: function () {
                this.edit_email_active = false;
            },
            /**
             * Open the email edit field
             */
            openEmailEdit: function () {
                this.edit_email_active = true;
            }
        }
    });
</script>