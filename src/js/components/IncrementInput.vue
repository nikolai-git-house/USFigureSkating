<script lang="ts">
	import Vue from "vue";

	export default Vue.extend({
		props: {
			attrs: {},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: undefined
			},
			initial: {
				type: Number
			},
			input_lock: {
				type: Boolean,
				default: false
			},
			reduce_on_max_change: {
				type: Boolean,
				default: false
			}
		},
		data: function () {
			return {
				value: 0,
				initial_max: 0
			}
		},
		mounted: function (): void {
			if (this.initial) {
				this.value = this.initial;
			}

			if (this.min > this.value) {
				this.value = this.min;
			}
			this.initial_max = this.max;
		},
		methods: {
			increment: function (): void {
				if (this.value === null) {
					this.value = 1;
					return;
				}
				if (this.max && this.value >= this.max) {
					return;
				}
				this.value++

			},
			decrement: function (): void {
				if (this.value === null || this.value === this.min) {
					this.value = this.min;
					return;
				}
				this.value--;
			}
		},
		computed: {
			increment_disabled: function () {
				return this.max && this.value >= this.max;
			},
			decrement_disabled: function () {
				return this.value <= this.min;
			},

		},
		watch: {
			value: function () {
				if (this.value < this.min) {
					this.value = this.min;
				}
				if (this.value > this.initial_max) {
					this.value = this.initial_max;
				}
				this.$emit('increment_value_changed', this.value);
				this.$emit('input', this.value);
			},
			max: function (new_max) {
				if (this.reduce_on_max_change) {
					if (this.value > new_max) {
						this.value = new_max;
					}
				}
			}
		}
	});
</script>



