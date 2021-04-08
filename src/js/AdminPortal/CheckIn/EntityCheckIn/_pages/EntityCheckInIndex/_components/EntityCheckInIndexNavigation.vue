<template>
    <div class="entity-check-in-index-navigation">
        <div class="panel-link-group">
            <a v-if="show_entity_compliance"
               href="#"
               class="panel-link panel-link--status"
               v-on:click.prevent="openSubpage('compliance')">
                <div class="panel-link__content">
                    <div class="panel-link__status">
                        <i class="inline-icon" :class="'icon-status-primary-' + (is_entity_compliance_complete ? 'success' : 'error')"></i>
                    </div>
                    <div class="panel-link__text">
                        Compliance
                    </div>
                </div>
            </a>
            <a v-if="show_entity_skaters"
               href="#"
               class="panel-link panel-link--status"
               v-on:click.prevent="openSubpage('skaters')">
                <div class="panel-link__content">
                    <div class="panel-link__status">
                        <div class="count-badge">
                            <div class="count-badge__content">
                                {{count_coached_skaters}}
                            </div>
                        </div>
                    </div>
                    <div class="panel-link__text">
                        Skaters
                    </div>
                </div>
            </a>
            <a v-if="show_entity_events"
               href="#"
               class="panel-link panel-link--status"
               v-on:click.prevent="openSubpage('events')">
                <div class="panel-link__content">
                    <div class="panel-link__status">
                        <i class="inline-icon" :class="'icon-status-primary-' + (is_entity_events_complete ? 'success' : 'error')"></i>
                    </div>
                    <div class="panel-link__text">
                        Events
                    </div>
                </div>
            </a>
            <a v-if="show_entity_roster"
               href="#"
               class="panel-link panel-link--status"
               v-on:click.prevent="openSubpage('roster')">
                <div class="panel-link__content">
                    <div class="panel-link__status">
                        <div class="count-badge">
                            <div class="count-badge__content">
                                {{count_roster}}
                            </div>
                        </div>
                    </div>
                    <div class="panel-link__text">
                        Roster
                    </div>
                </div>
            </a>
            <a v-if="show_entity_team_coaches"
               href="#"
               class="panel-link panel-link--status"
               v-on:click.prevent="openSubpage('team_coaches')">
                <div class="panel-link__content">
                    <div class="panel-link__status">
                        <div class="count-badge">
                            <div class="count-badge__content">
                                {{count_coaches}}
                            </div>
                        </div>
                    </div>
                    <div class="panel-link__text">
                        Coaches
                    </div>
                </div>
            </a>
            <a v-if="show_entity_skater_coaches"
               href="#"
               class="panel-link panel-link--status"
               v-on:click.prevent="openSubpage('skater_coaches')">
                <div class="panel-link__content">
                    <div class="panel-link__status">
                        <div class="count-badge">
                            <div class="count-badge__content">
                                {{count_coaches}}
                            </div>
                        </div>
                    </div>
                    <div class="panel-link__text">
                        Coaches
                    </div>
                </div>
            </a>
            <a v-if="show_entity_personnel"
               href="#"
               class="panel-link panel-link--status"
               v-on:click.prevent="openSubpage('team_service_personnel')">
                <div class="panel-link__content">
                    <div class="panel-link__status">
                        <div class="count-badge">
                            <div class="count-badge__content">
                                {{count_team_service_personnel}}
                            </div>
                        </div>
                    </div>
                    <div class="panel-link__text">
                        Team Service Personnel
                    </div>
                </div>
            </a>
            <a href="#"
               class="panel-link panel-link--status"
               v-on:click.prevent="openSubpage('comments')">
                <div class="panel-link__content">
                    <div class="panel-link__status">
                        <div class="count-badge">
                            <div class="count-badge__content">
                                {{count_comments}}
                            </div>
                        </div>
                    </div>
                    <div class="panel-link__text">
                        Comments
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {AbstractCheckInEntity} from '../../../../_models/CheckInEntities/AbstractCheckInEntity';
    import {EntityCheckInPageKey} from '../../../_contracts/EntityCheckInContracts';

    export default Vue.extend({
        props: {
            debug_mode: {
                type: Boolean,
                default: false
            },
            entity: {
                type: Object as () => AbstractCheckInEntity,
                required: true
            }
        },
        computed: {
            /**
             * Count of coached skaters
             */
            count_coached_skaters: function (): number {
                return this.entity.skater_count;
            },
            /**
             * Count of coaches for entity
             */
            count_coaches: function (): number {
                return this.entity.coach_count;
            },
            /**
             * Count of comments
             */
            count_comments: function (): number {
                return this.entity.comment_count;
            },
            /**
             * Count of roster members
             */
            count_roster: function (): number {
                return this.entity.roster_count;
            },
            /**
             * Count for team service personnel
             */
            count_team_service_personnel: function (): number {
                return this.entity.team_service_personnel_count;
            },
            /**
             * Whether the active entity is compliance complete
             */
            is_entity_compliance_complete: function (): boolean {
                return this.entity.is_compliant;
            },
            /**
             * Whether the events for the active entity are checkin-complete
             */
            is_entity_events_complete: function (): boolean {
                return this.entity.events_complete;
            },

            /**
             * Whether to show the "Compliance" link section
             */
            show_entity_compliance: function (): boolean {
                if (this.debug_mode) {
                    return true;
                }
                const valid_roles = [
                    'team_personnel',
                    'coach',
                    'official',
                    'competition_contact',
                    'volunteer',
                    'team_coach'
                ];

                return valid_roles.indexOf(this.entity.entity_type_key) !== -1;
            },
            /**
             * Whether to show the "Events" link section
             */
            show_entity_events: function (): boolean {
                if (this.debug_mode) {
                    return true;
                }
                const valid_roles = [
                    'team',
                    'skater'
                ];

                return valid_roles.indexOf(this.entity.entity_type_key) !== -1;
            },
            /**
             * Whether to show the "Team Service Personnel" link section
             */
            show_entity_personnel: function (): boolean {
                if (this.debug_mode) {
                    return true;
                }
                const valid_roles = ['team'];

                return valid_roles.indexOf(this.entity.entity_type_key) !== -1;
            },
            /**
             * Whether to show the "Roster" link section
             */
            show_entity_roster: function (): boolean {
                if (this.debug_mode) {
                    return true;
                }
                const valid_roles = ['team'];

                return valid_roles.indexOf(this.entity.entity_type_key) !== -1;
            },
            /**
             * Whether to show the "Skaters" link section
             */
            show_entity_skaters: function (): boolean {
                if (this.debug_mode) {
                    return true;
                }
                const valid_roles = ['coach'];

                return valid_roles.indexOf(this.entity.entity_type_key) !== -1;
            },
            /**
             * Whether to show the "Coaches" link section for skaters
             */
            show_entity_skater_coaches: function (): boolean {
                if (this.debug_mode) {
                    return true;
                }
                const valid_roles = ['skater'];

                return valid_roles.indexOf(this.entity.entity_type_key) !== -1;
            },
            /**
             * Whether to show the "Coaches" link section for teams
             */
            show_entity_team_coaches: function (): boolean {
                if (this.debug_mode) {
                    return true;
                }
                const valid_roles = ['team'];

                return valid_roles.indexOf(this.entity.entity_type_key) !== -1;
            }
        },
        methods: {
            /**
             * Handle subpage element click
             */
            openSubpage: function (page_key: EntityCheckInPageKey) {
                this.$emit('page-selected', page_key);
            }
        }
    });
</script>