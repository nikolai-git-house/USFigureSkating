<template>
	<div class="cart-item" :class="'cart-item--'+item.cart_item_type_key">
		<div class="cart-item__info" v-if="item.is_registration_item">
			<div class="cart-item__heading">
				<div class="cart-item__name">
					{{item.name}}
				</div>
				<div class="cart-item__cost">
					${{item.cost}}
				</div>
			</div>
			<div class="cart-item__description" v-if="item.description_lines.length">
				<p v-for="description in item.description_lines">{{description}}</p>
			</div>
		</div>
		<div v-else class="cart-item__info">
			<div class="cart-item__heading">
				<div class="cart-item__competition-name">
					{{item.competition_name}}
				</div>
				<div class="cart-item__cost">
					${{item.cost}}
				</div>
			</div>
			<div class="cart-item__event-name">
				{{item.event_name}}
			</div>
			<div class="cart-item__details">
				<div class="cart-item__type-description">
					{{item.cart_description}}
				</div>
				<ul class="cart-item__session-description" v-if="is_session">
					<li>
						<span class="cart-item__time">{{session_time}}</span>
					</li>
					<li>
						<span>{{item.session.rink.name}}</span>
					</li>
				</ul>
			</div>
		</div>
		<button v-if="show_remove_controls" type="button" class="cart-item__remove" v-on:click.prevent="remove()">
			<span class="cart-item__remove__text">REMOVE</span>
		</button>
	</div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {DateFormat} from "../helpers/time";

    export default Vue.extend({
		props: {
			item: {
				type: Object,
				required: true
			},
			show_remove: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			remove: function () {
				this.$emit('remove_cart_item', this.item)
			}
		},
		computed: {
			is_session: function () {
				return this.item.cart_item_type_key === "session";
			},
			session_time: function () {
				return DateFormat(this.item.session.date) + " " + this.item.session.pretty_time_start + " " + this.item.session.time_start_meridian
			},
            show_remove_controls: function () {
                if (!this.show_remove) {
                    return false;
                }
                return !this.item.unremovable
            }
		}
	});

</script>