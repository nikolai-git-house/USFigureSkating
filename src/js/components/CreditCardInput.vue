<template>
	<input v-on:input="valueChanged($event.target.value)" :value="formatted" v-number-input :class="[input_class,cardClass()]" type="tel" id="card_number" class="form-field form-field--card card-input">
</template>
<script lang="ts">
	import Vue from "vue";
	import * as CardValidator from "card-validator";
	import {CREDIT_CARD_GAP_SEPARATOR} from "../config/AppConfig";

	export default Vue.extend({
		props: {
			initial: {
				type: Number
			},
			input_class: {
				type: String,
			}
		},
		created: function () {
			this.number = this.initial ? String(this.initial) : "";
		},
		data: function () {
			return {
				number: "",
			}
		},
		methods: {
			valueChanged: function (value: string) {
				this.number = value.replace(/[^0-9]/g, "");
			},
			export: function () {
				this.$emit('change', {
					number: this.number,
					formatted: this.formatted,
					type: this.card_type,
					type_formatted: this.card_type_pretty
				});
			},

			reset: function () {
				this.number = "";
			},
			cardClass: function () {
				if (this.card_type) {
					return "card-input--" + this.card_type;
				}
			}
		},
		updated: function () {
			this.export();
		},
		computed: {
			credit_card_config: function () {
				return CardValidator.number(this.number);
			},
			gap_config: function () {
				return this.credit_card_config.card ? this.credit_card_config.card.gaps : [];
			},
			card_type: function () {
				if (this.credit_card_config.card && this.credit_card_config.card.type) {
					return this.credit_card_config.card.type;
				}
			},
			card_type_pretty: function () {
				if (this.credit_card_config.card && this.credit_card_config.card.niceType) {
					return this.credit_card_config.card.niceType;
				}
			},
			formatted: function () {
				let source = this.number;
				let gap_config = [0].concat(this.gap_config);
				if (!source) {
					return source;
				}
				let split = [];
				for (let i = 0; i < gap_config.length; i++) {
					let start_index = gap_config[i];
					if (start_index > source.length) {
						break;
					}
					let end_index = gap_config[i + 1];
					split.push(source.slice(start_index, end_index));
				}
				return split.join(CREDIT_CARD_GAP_SEPARATOR);
			}
		}
	});
</script>