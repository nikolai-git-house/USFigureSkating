<template>
    <div class="series-application-profile">
        <div class="user-profile-display">
            <div class="user-profile-display__section">
                <h3 class="user-profile-display__section-heading__text user-profile-display__section-heading__text--primary">
                    {{profile.name}}
                </h3>
                <div class="user-profile-display__data">
                    <ul class="label-list">
                        <li>
                            <span class="label-list__label">Member:</span>
                            <span class="label-list__value">#{{profile.member_number}}</span>
                        </li>
                        <li>
                            <span class="label-list__label">Level:</span>
                            <span class="label-list__value">{{profile.level}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="user-profile-display__section">
                <h3 class="user-profile-display__section-heading__text">
                    <span>Section Eligibility</span>
                </h3>
                <div class="user-profile-display__data">
                    <ul class="label-list">
                        <li v-if="profile.home_club">
                            <span class="label-list__label">Club:</span>
                            <span class="label-list__value">
                                {{profile.home_club.name}}
                            </span>
                        </li>
                        <li v-if="profile.region_name">
                            <span class="label-list__label">Region:</span>
                            <span class="label-list__value">
                                {{profile.region_name}}
                            </span>
                        </li>
                        <li v-if="profile.section_name">
                            <span class="label-list__label">Section:</span>
                            <span class="label-list__value">
                                {{profile.section_name}}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesApplication} from '../../_contracts';

    export default Vue.extend({
        computed: {
            /**
             * The profile for the active user
             */
            profile: function (): SeriesApplication.TeamApplicationProfile | null {
                return this.$store.state.series_registration.application.team_profile;
            }
        }
    });
</script>