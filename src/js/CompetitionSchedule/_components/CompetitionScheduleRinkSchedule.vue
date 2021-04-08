<template>
    <div class="rink-schedule">
        <div class="session-list">
            <standard-session
                    v-for="session in filtered_sessions"
                    :key="session.id"
                    :session="session"
                    :prevent_swipe="false">
            </standard-session>
        </div>
        <div v-if="!filtered_sessions.length" class="rink-schedule__no-sessions">
            No sessions match your current filters.
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {RinkSchedule} from '../../models/RinkSchedule/RinkSchedule';
    import {Session} from '../../models/Sessions/Session';
    import {CompetitionScheduleFilterActiveFilters} from '../_contracts/CompetitionScheduleContracts';
    import {CompetitionScheduleRinkScheduleFilterService} from '../CompetitionScheduleRinkScheduleFilterService';

    export default Vue.extend({
        props: {
            /**
             * The active CompetitionScheduleFilterActiveFilters to filter the schedule by
             */
            active_filters: {
                type: Object as () => CompetitionScheduleFilterActiveFilters,
                required: true
            },
            /**
             * The source RinkSchedule
             */
            rink_schedule: {
                type: Object as () => RinkSchedule,
                required: true
            }
        },
        computed: {
            /**
             * The list of filtered Session items
             */
            filtered_sessions: function (): Session[] {
                return CompetitionScheduleRinkScheduleFilterService
                    .filterRinkScheduleSessions(this.rink_schedule, this.active_filters)
                    .all();
            }
        }
    });
</script>