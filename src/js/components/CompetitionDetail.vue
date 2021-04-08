<!--
    @deprecated 2020-01-22

    This page component is replaced by src/js/pages/ViewCompetition/ViewCompetition.vue
-->
<script lang="ts">
	import Vue from "vue";
	import {Competition} from "../models/Competition/Competition";
	import {UserRole} from "../contracts/AppContracts";

	export default Vue.extend({
		data: function () {
			return {
				schedule_error: false,
				practice_ice_error: false,
				coach_competition_schedule_error: false,
				coach_schedule_error: false
			}
		},
		computed: {
			competition: function (): Competition {
				return this.$store.getters['competitions/active_competition'];
			},
			user_roles: function (): UserRole {
				return this.$store.getters['user/user_roles'];
			},
			is_skater: function (): boolean {
				return this.user_roles.indexOf("skater") !== -1;
			},
			is_coach: function (): boolean {
				return this.user_roles.indexOf("coach") !== -1;
			}
		},
		methods: {
			openSchedule: function () {
				if (!this.competition.schedule_available) {
					this.schedule_error = true;
					let vm = this;
					setTimeout(function () {
						Vue.set(vm, 'schedule_error', false);
					}, 2000);
					return;
				}
				location.assign(this.competition.schedule_link);
			},
			openPracticeIce: function () {
				if (!this.competition.practice_ice_available) {
					this.practice_ice_error = true;
					let vm = this;
					setTimeout(function () {
						Vue.set(vm, 'practice_ice_error', false);
					}, 2000);
					return;
				}
				location.assign(this.competition.practice_ice_link);
			},
			openCoachCompetitionSchedule: function () {
				if (!this.competition.schedule_available) {
					this.coach_competition_schedule_error = true;
					let vm = this;
					setTimeout(function () {
						Vue.set(vm, 'coach_competition_schedule_error', false);
					}, 2000);
					return;
				}
				location.assign(this.competition.coach_competition_schedule_link);
			},
			openCoachSchedule: function () {
				if (!this.competition.schedule_available) {
					this.coach_schedule_error = true;
					let vm = this;
					setTimeout(function () {
						Vue.set(vm, 'coach_schedule_error', false);
					}, 2000);
					return;
				}
				location.assign(this.competition.coach_schedule_link);
			}
		}
	});
</script>