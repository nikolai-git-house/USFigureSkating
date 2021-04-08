<footer v-cloak class="page-practice-ice__footer practice-ice-footer" :class="footer_class" v-if="footer_ready">
    <div class="practice-ice-footer__content">
        <div class="practice-ice-footer__row">
            <div class="practice-ice-footer__column practice-ice-footer__credits-notice practice-ice-footer__column--credits">
				<p class="practice-ice-footer__credits-list" v-if="show_credits_button">
					{{unscheduled_credits_message}}
				</p>
            </div>
            <div class="practice-ice-footer__column practice-ice-footer__column--cart-total practice-ice-footer__column--checkout">
                <span class="practice-ice-footer__cart-total__label">TOTAL:</span><span class="practice-ice-footer__cart-total__amount">${{cart_cost}}</span>
            </div>
        </div>
        <div class="practice-ice-footer__row">
            <div class="practice-ice-footer__column practice-ice-footer__column--credits">
                <button type="button" v-if="show_credits_button" class="button button--block button--info" :disabled="disable_view_credits_button" v-on:click.prevent="launchCredits()">{{footer_credits_button_text}}</button>
            </div>
            <div class="practice-ice-footer__column practice-ice-footer__column--checkout">
                <a v-on:click="attemptCart($event)" href="/pages/cart" class="button button--block button--action">Pay</a>
                <p v-if="show_cart_error" class="input-error">*You do not have items in your cart for payment.</p>
            </div>
        </div>
    </div>
</footer>