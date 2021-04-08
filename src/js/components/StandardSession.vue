<!-- eslint-disable -->
<template>
	<div class="session" @click="handleClick">
		<div class="session__content" :class="{'noswipe': prevent_swipe}">
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
					<span v-else-if="session.type_code">
						{{session.type_code}}
					</span>
				</div>
			</div>
			<p class="session__name">
				{{session.name}}
			</p>
			<div class="session__toggle-row" v-if="!session.is_resurface">
				<p class="session__subtext session__toggle-row__item">Skaters: {{skater_count}}</p>
				<button v-if="expandable" type="button" class="session__toggle" @click.prevent="toggleExpand" :class="{'session__toggle--expanded':expanded}">
					&nbsp;
				</button>
			</div>
			<slot name="toggle-content" v-if="expanded"></slot>
			<slot name="additional-content"></slot>
		</div>
		<slot></slot>
	</div>
</template>
<script lang="ts">
    /* eslint-disable */
	import Vue from "vue";

	export interface StandardSessionComponent extends Vue {
		toggleExpand: Function;
	}

	export default Vue.extend({
		props: {
			session: {
				type: Object,
				required: true
			},
			expandable: {
				required: false,
				default: false
			},
			/**
			 * Whether to prevent carousel swiping on session content area
			 */
			prevent_swipe: {
				type: Boolean,
				default: true
			}
		},
		data: function () {
			return {
				expanded: false,
			}
		},
		methods: {
			handleClick: function () {
				this.$emit('session-click', this.session);
			},
			toggleExpand: function () {
				this.expanded = !this.expanded;
			}
		},
		computed: {
			skater_count: function () {
				let session = this.session;
				if (session.type_key === "event") {
					return session.slots_registered;
				}
				return session.slots_registered + "/" + session.slots_available;
			}
		}
	});
</script>