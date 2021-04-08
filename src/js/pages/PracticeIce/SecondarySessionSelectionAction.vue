<template>
	<div class="session-feedback session-feedback--input" :class="feedback_class">
		<button type="button" class="session-feedback__close" @click.prevent.stop="closeSecondaryAction()" title="Close">&times;</button>
		<div class="session-feedback__content">
			<div class="session-feedback__text">
				{{title}}
			</div>
			<div class="session-feedback-inputs">
				<a class="session-feedback-inputs__input"  v-for="input in input_options" href="#" v-on:click.prevent.stop="input.action"><span>{{input.label}}</span></a>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
	import Vue from "vue";
	import {SecondaryActionState} from "./SecondaryActionState";
	import {SelectedSessionState} from "./SelectedSessionState";
	import {
		SecondaryActionKey,
		SessionType,
		SessionSelectionSecondaryActionInputConfig
	} from "../../contracts/AppContracts";

	const title_map: { [key: string]: string } = {
		select_event: "Add session to which event?",
		confirm_removal: "Remove Session From Schedule?",
		select_type: "Choose Session type:"
	};

	export default Vue.extend({
		props: {
			secondary_action: {
				type: SecondaryActionState,
				required: true
			},
			selected_session: {
				type: SelectedSessionState,
				required: true
			}
		},

		computed: {
			input_options: function (): SessionSelectionSecondaryActionInputConfig[] {
				if (this.action_key !== '') {
					return this.getInputConfig(this.action_key);
				}
				return [];

			},
			title: function () {
				if (this.secondary_action.action_key === "confirm_single_type") {
					return "This session cannot be added as " + this.alternate_type + ", must purchase credit.";
				}
				return title_map[this.secondary_action.action_key];
			},
			feedback_class: function () {
				return "session-feedback--" + this.secondary_action.action_key;
			},
			alternate_type: function () {
				if (this.secondary_action.action_arguments.alternate_types) {
					return this.secondary_action.action_arguments.alternate_types.join('/').toUpperCase();
				}
				return null;
			},
			available_type: function () {
				if (this.secondary_action.action_arguments.available_type) {
					return this.secondary_action.action_arguments.available_type.toUpperCase();
				}
				return null;
			},
			matched_events: function () {
				return this.secondary_action.action_arguments.matched_events;
			},
			matched_types: function () {
				return this.secondary_action.action_arguments.matched_types;
			},
			action_key: function (): SecondaryActionKey | '' {
				return this.secondary_action.action_key;
			}

		},
		methods: {
			getInputConfig: function (key: SecondaryActionKey): SessionSelectionSecondaryActionInputConfig[] {
				if (key === "confirm_single_type") {
					return [
						{
							label: "Add as " + this.available_type,
							action: this.confirmSingleType

						},
						{
							label: "Cancel",
							action: this.closeSecondaryAction
						}

					];
				}
				if (key === "confirm_removal") {
					return [
						{
							label: "Remove",
							action: this.confirmRemoval
						},
						{
							label: "Cancel",
							action: this.closeSecondaryAction
						}
					];
				}
				if (key === "select_event") {
					let result = [];
					for (let i = 0; i < this.matched_events.length; i++) {
						let event = this.matched_events[i];
						let vm = this;
						result.push({
							label: event.name,
							action: function () {
								return vm.selectEvent(event.id);
							}
						})

					}
					return result;
				}
				if (key === "select_type") {
					let result = [];
					for (let i = 0; i < this.matched_types.length; i++) {
						let type = this.matched_types[i];
						let vm = this;
						result.push({
							label: type,
							action: function () {
								return vm.selectType(type);
							}
						});
					}
					return result;
				}
				return [];
			},
			confirmRemoval: function () {
				this.selected_session.action_confirmed = true;
				this.$emit('reselect');
			},
			closeSecondaryAction: function () {
				this.secondary_action.reset();
				this.$emit('secondary_canceled')
			},
			confirmSingleType: function () {
				this.selected_session.selected_session_type = this.secondary_action.action_arguments.available_type;
				this.$emit('reselect');
			},
			selectEvent: function (event_id: number) {
				this.selected_session.selected_event_id = event_id;
				this.$emit('reselect');
			},
			selectType: function (type: SessionType) {
				this.selected_session.selected_session_type = type;
				this.$emit('reselect');
			}
		}
	})

</script>