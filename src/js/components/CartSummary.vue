<template>
	<div class="cart-summary">
		<div class="cart-summary__items">
			<cart-item v-for="(item,index) in items" :show_remove="show_remove_item" v-on:remove_cart_item="removeItem(item)" :item="item" :key="index">
			</cart-item>
		</div>
		<div class="cart-summary__footer">
			<div class="cart-summary__footer__item cart-summary__footer__item--small" v-for="fee in cart.additional_fees">
				<span class="cart-summary__footer__label">{{fee.name}}:</span><span class="cart-summary__footer__value cart-summary__total-cost">${{fee.amount}}</span>
			</div>
			<div class="cart-summary__footer__item cart-summary__footer__item--small" v-if="cart.subtotal!==null">
				<span class="cart-summary__footer__label">Subtotal:</span><span class="cart-summary__footer__value cart-summary__total-cost">${{cart.subtotal}}</span>
			</div>
			<div class="cart-summary__footer__item">
				<span class="cart-summary__footer__label">Total:</span><span class="cart-summary__footer__value cart-summary__total-cost">${{total_cost}}</span>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
	import Vue from "vue";
	import {CartItemContract} from "../contracts/CartItemContract";

	export default Vue.extend({
		props: {
			show_remove_item: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			cart: function () {
				return this.$store.state.cart.cart;
			},
			item_count: function () {
				return this.cart.item_count
			},
			total_cost: function () {
				return this.cart.total_cost;
			},
			items: function () {
				return this.cart.items;
			}
		},
		methods: {
			removeItem: function (item: CartItemContract) {
				this.$store.dispatch('cart/removeItem', item).then(function (result) {
					result();
				}).catch(function () {
					alert("Error removing item from cart");
				});
			}
		}
	});
</script>