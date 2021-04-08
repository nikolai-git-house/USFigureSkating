<script lang="ts">
	import Vue from "vue";
	import {mapState} from 'vuex'
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
		methods: {
			isActive: function (competition: Competition): boolean {
				return this.$store.getters['competitions/isActiveCompetition'](competition.id);
			},
			openSchedule: function (competition: Competition) {
				if (!competition.schedule_available) {
					this.schedule_error = true;
					let vm = this;
					setTimeout(function () {
						Vue.set(vm, 'schedule_error', false);
					}, 2000);
					return;
				}
				location.assign(competition.schedule_link);
			},
			openPracticeIce: function (competition: Competition) {
				if (!competition.practice_ice_available) {
					this.practice_ice_error = true;
					let vm = this;
					setTimeout(function () {
						Vue.set(vm, 'practice_ice_error', false);
					}, 2000);
					return;
				}
				location.assign(competition.practice_ice_link);
			},
			openCoachCompetitionSchedule: function (competition: Competition) {
				if (!competition.schedule_available) {
					this.coach_competition_schedule_error = true;
					let vm = this;
					setTimeout(function () {
						Vue.set(vm, 'coach_competition_schedule_error', false);
					}, 2000);
					return;
				}
				location.assign(competition.coach_competition_schedule_link);
			},
			openCoachSchedule: function (competition: Competition) {
				if (!competition.schedule_available) {
					this.coach_schedule_error = true;
					let vm = this;
					setTimeout(function () {
						Vue.set(vm, 'coach_schedule_error', false);
					}, 2000);
					return;
				}
				location.assign(competition.coach_schedule_link);
			}
		},
		computed: {
			...mapState('competitions', {
				competitions: 'competition_list',
				loaded: 'competitions_loaded'
			}),
			user_roles: function (): UserRole {
				return this.$store.getters['user/user_roles'];
			},
			is_skater: function (): boolean {
				return this.user_roles.indexOf("skater") !== -1;
			},
			is_coach: function (): boolean {
				return this.user_roles.indexOf("coach") !== -1;
			}
		}
	});
</script>