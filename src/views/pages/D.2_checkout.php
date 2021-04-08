<?php

/**
 * This demo page is shared between the practice ice checkout and the competition registration checkout.
 * PHP variables based on referring page update non-essential page display elements to demonstrate a real-world
 * user experience
 */

$REGISTRATION_FLAG = false;

if (array_key_exists('REQUEST_URI', $_SERVER)) {

    if (strpos($_SERVER['REQUEST_URI'], 'registration') !== false) {
        $REGISTRATION_FLAG = true;

    }
    if (strpos($_SERVER['REQUEST_URI'], 'series') !== false) {
        $SERIES_FLAG = true;

    }
}
$demo_page_args = (object) [
    'confirmation_url' => $REGISTRATION_FLAG ? "/pages/competition-registration/1/confirmation" :$SERIES_FLAG?'/pages/series-registration/1/confirmation': '/pages/order-confirmation',
];

?>
<div class="page page--checkout page--accent">
	<div class="page__heading">
		<h1 class="page__title">Checkout</h1>
	</div>
	<div class="page__content">
		<!--@integration:
			to specify a confirmation page url, it can be passed to the following component via the confirmation_url attribute
			Within the component, this link defaults to the previous value ("/pages/order-confirmation")
		-->
		<checkout-page confirmation_url="<?=$demo_page_args->confirmation_url?>" inline-template v-cloak>
			<div class="">
				<cart-overview v-cloak></cart-overview>
				<section class="checkout-steps">
					<div ref="step_1" class="checkout-step" :class="{'inactive':!stepActive(1)}">
						<h3 class="checkout-step__heading">
							<span class="checkout-step__step-number">1 of 3</span>
							<span class="checkout-step__step-name">Billing Address</span>
						</h3>
						<checkout-address v-cloak inline-template v-on:step_complete="completeAddress($event)" v-on:reload="setActiveStep(1)">
							<?php include (__DIR__."/partials/checkout-address.php"); ?>
						</checkout-address>
					</div>
					<div ref="step_2" class="checkout-step" :class="{'inactive':!stepActive(2)}">
						<h3 class="checkout-step__heading">
							<span class="checkout-step__step-number">2 of 3</span>
							<span class="checkout-step__step-name">Payment</span>
						</h3>
						<checkout-payment :initial="selected_card" inline-template v-if="payment_initialized" v-on:step_complete="completePayment($event)" v-on:reload="setActiveStep(2)">
							<?php include (__DIR__."/partials/checkout-payment.php"); ?>
						</checkout-payment>
					</div>
					<div ref="step_3" class="checkout-step checkout-step--review" :class="{'inactive':!stepActive(3)}">
						<h3 class="checkout-step__heading">
							<span class="checkout-step__step-number">3 of 3</span>
							<span class="checkout-step__step-name">Review &amp; Submit</span>
						</h3>
						<div class="checkout-step__content checkout-step__content--review" v-if="review_initialized">
							<div class="checkout-review">
								<div class="checkout-cart-summary">
									<cart-summary class="cart-summary--list" :show_remove_item="false"  :show_remove_item="true"></cart-summary>
								</div>
								<p class="checkout-review__instructions">
									Everything look okay? Select COMPLETE PAYMENT to complete your purchase.
								</p>
								<div class="checkout-review__actions">
									<button type="button" v-on:click.prevent="completeOrder()" class="button button--block button--action">Complete Payment</button>
									<p v-if="global_error" class="input-error">{{global_error}}</p>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section class="page-checkout__order-summary"  v-if="active_step<3">
					<h2 class="page-checkout__order-summary__heading page__subtitle">
						Order Summary
					</h2>
					<div class="page-checkout__order-summary__list">
						<cart-summary class="cart-summary--list"></cart-summary>
					</div>
				</section>
			</div>
		</checkout-page>
	</div>
</div>