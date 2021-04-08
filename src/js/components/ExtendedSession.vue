<template>
	<div class="session session--extended">
		<div class="session__content">
			<div class="session__header">
				<p class="session__time">
					{{session.pretty_time_start}}<span class="session__time__meridian"> {{session.time_start_meridian}}</span> &mdash; {{session.pretty_time_end}}<span class="session__time__meridian"> {{session.time_end_meridian}}</span>
				</p>
				<div class="session__code">
					<span class="session__icon" v-if="session.is_event" :class="session.icon_class" :style="session.icon_style_override">
						&nbsp;
					</span>
					<span class="session__icon session__icon--resurface" v-else-if="session.is_resurface">
						&nbsp;
					</span>
					<span v-else-if="type_code">
						{{type_code}}
					</span>
				</div>
			</div>
			<p class="session__name">
				{{session.name}}
			</p>
			<div class="session__toggle-row">
				<p class="session__subtext session__toggle-row__item">{{session.full_location}}</p>
				<button type="button" class="session__toggle" @click.prevent="toggleExpand" :class="{'session__toggle--expanded':expanded}">
					&nbsp;
				</button>
			</div>
		</div>
		<div class="session--extended__content" v-if="expanded">
			<p class="session--extended__rink">{{session.facility_name}}</p>
			<slot>
				<div class="session--extended__secondary">
					<div class="session--extended__skater-count">
						Skaters: {{skater_count}}
					</div>
					<div class="session--extended__type-description">
						{{type_description}}
					</div>
				</div>
			</slot>
		</div>
	</div>
</template>
<script lang="ts">
	import Vue from "vue";
	import {ScheduledSession} from "../models/Sessions/ScheduledSession";

	export interface ExtendedSessionComponent extends Vue {
		toggleExpand: Function;
	}

	export default Vue.extend({
		props: {
			session: {
				type: Object,
				required: true
			},
			scheduled_session: {
				type: ScheduledSession,
				required: false
			}
		},
		data: function () {
			return {
				expanded: false,
			}
		},
		methods: {
			toggleExpand: function () {
				this.expanded = !this.expanded;
			}
		},
		computed: {
			type_description: function () {
				if (this.scheduled_session) {
					return this.scheduled_session.type_description;
				}
				return this.session.type_description;
			},
			skater_count: function () {
				let session = this.session;
				if (session.type_key === "event") {
					return session.slots_registered;
				}
				return session.slots_registered + "/" + session.slots_available;
			},
			type_code: function () {
				if (this.session.type_key === "warm_up") {
					return this.session.type_code;
				}
				if (this.session.type_key === "practice_ice") {
					if (this.session.types && this.session.types.length === 1 || !this.scheduled_session) {
						return this.session.type_code;
					}
					return this.scheduled_session.scheduled_as.toUpperCase();
				}
				return "";
			}
		}
	})
</script>