<template>
    <div class="select-team-list">
        <div v-for="team in teams"
             :key="team.id"
             class="card select-team-card"
             :class="{
                 'select-team-card--no-level':!team.level
             }">
            <div class="select-team-card__content">
                <div class="select-team-card__data">
                    <h3 class="select-team-card__title">
                        {{team.name}}
                    </h3>
                    <h4 v-if="team.level"
                        class="select-team-card__level">
                        {{team.level}}
                    </h4>
                    <ul class="select-team-card__data-list label-list">
                        <li>
                            <span class="label-list__label">
                                Member:
                            </span>
                            <span>
                                #{{team.member_number}}
                            </span>
                        </li>
                        <li>
                            <span class="label-list__label">
                                Membership End Date:
                            </span>
                            <span>
                                {{team.membership_status.validity_date_formatted}}
                                <span v-if="!team.membership_status.active"
                                      class="text--error">Expired</span>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="select-team-card__cta">
                    <slot v-if="team.is_selectable"
                          :team="team"
                          name="button">
                        <button class="button button--block button--info button--block"
                                v-on:click.prevent.stop="selectTeam(team)">
                            <slot :team="team"
                                  name="button-text">
                                Select
                            </slot>
                        </button>
                    </slot>
                    <span v-else
                          class="member-result-notice member-result-notice--alert">
                        <span class="member-result-notice__icon">&nbsp;</span>
                        <a v-if="team.not_selectable_reason && team.not_selectable_link"
                           class="member-result-notice__text"
                           :href="team.not_selectable_link"
                           target="_blank"
                           rel="noreferrer noopener">{{team.not_selectable_reason}}</a>
                        <span v-else-if="team.not_selectable_reason"
                              class="member-result-notice__text">{{team.not_selectable_reason}}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {Teams} from '../_contracts';
    import SelectTeamListComponentTeam = Teams.SelectTeamListComponentTeam;

    export default Vue.extend({
        props: {
            /**
             * The teams to display in the list
             */
            teams: {
                type: Array as () => SelectTeamListComponentTeam[],
                required: true
            }
        },
        methods: {
            /**
             * Handle the select event on a team
             */
            selectTeam: function (team: SelectTeamListComponentTeam) {
                this.$emit('select', team);
            }
        }
    });
</script>