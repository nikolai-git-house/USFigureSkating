<?php

/**
 * This demo page is shared between the practice ice cart and the competition registration cart.
 * PHP variables based on referring page update non-essential page display elements to demonstrate a real-world
 * user experience
 */

$REGISTRATION_FLAG      = false;
$SERIES_FLAG            = false;
$TEAM_REGISTRATION_FLAG = false;

if (array_key_exists('REQUEST_URI', $_SERVER)) {

    if (strpos($_SERVER['REQUEST_URI'], 'registration') !== false) {
        $REGISTRATION_FLAG = true;

    }
    if (strpos($_SERVER['REQUEST_URI'], 'series') !== false) {
        $SERIES_FLAG = true;

    }
    if (strpos($_SERVER['REQUEST_URI'], 'registration-teams') !== false) {
        $REGISTRATION_FLAG      = false;
        $TEAM_REGISTRATION_FLAG = true;

    }
}
$demo_page_args = (object) [
    'back_text'    => $REGISTRATION_FLAG
        ? 'Back to Competition Registration'
        : $SERIES_FLAG
            ? 'Back to Skater Series Application'
            : $TEAM_REGISTRATION_FLAG
                ? 'Back to Team Registration'
                : "Continue Shopping",
    'back_url'     => $REGISTRATION_FLAG
        ? '/pages/competition-registration'
        : $SERIES_FLAG
            ? '/pages/series-registration'
            : $TEAM_REGISTRATION_FLAG
                ? '/pages/competition-registration-teams'
                : "/pages/my-competitions",
    'checkout_url' => $REGISTRATION_FLAG
        ? "/pages/competition-registration/1/checkout"
        : $SERIES_FLAG
            ? "/pages/series-registration/1/checkout"
            : $TEAM_REGISTRATION_FLAG
                ? '/pages/competition-registration-teams/1/checkout'
                : '/pages/checkout',
];

?>
<div class="page page-cart page--accent">
	<div class="page__heading">
		<h1 class="page__title">My Cart</h1>
	</div>
	<div class="page__content">
		<!--@integration:
			to specify a checkout page link, it can be passed to the following component via the checkout_url attribute
			Within the component, this link defaults to the previous value (/pages/checkout)
		-->
		<cart-review checkout_url="<?=$demo_page_args->checkout_url?>" inline-template v-cloak>
			<div>
				<cart-overview></cart-overview>
				<cart-summary v-if="items_in_cart" :show_remove_item="true"></cart-summary>
				<div v-else>
					<p>You have no items in your cart.</p>
				</div>
				<div class="page-cart__cta">
					<a class="button button--action button--block" v-on:click.prevent="proceedToCheckout()" href="/pages/checkout">Checkout</a>
					<p v-if="cart_error" class="input-error">You have no items in your cart.</p>
					<a class="standard-link standard-link--no-visited" href="<?=$demo_page_args->back_url?>"><?=$demo_page_args->back_text?></a>
				</div>
			</div>
		</cart-review>
	</div>
</div>