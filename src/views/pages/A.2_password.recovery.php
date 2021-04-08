<password-reset inline-template>
	<div class="password-reset">
		<div class="page page-reset-password page--preapp">
			<div class="page__heading">
				<h1 class="page__title">Reset Password</h1>
			</div>
			<section class="page__content">
				<form action="">
					<div class="form-group">
						<label for="email" class="field-label">Enter your email address:</label>
						<input type="email" id="email" v-model="email" :class="{'has-error':email_not_found}" class="form-field">
						<p class="input-error" v-cloak v-if="email_not_found">* No user with that email found.</p>
					</div>
					<button type="submit" v-on:click.prevent="submit" class="button button--block button--large">Reset
						Password
					</button>
					<p class="u-t-align-center">
						<a href="/" class="standard-link">Cancel</a>
					</p>
				</form>
			</section>
		</div>
		<site-overlay :open_fn="showOverlay" v-cloak v-on:close-overlay="handleOverlayClose">
			<div v-if="account_select_active" class="grid-container page-reset-password__secondary page-reset-password__select-account">
				<div class="form-group">
					<select class="form-field" v-model="account" :class="{'has-error':account_select_error}"name="" id="">
						<option value="" selected disabled>Select account for password reset</option>
						<option value="2">Option 2</option>
						<option value="3">Option 3</option>
					</select>
					<p class="input-error" v-if="account_select_error" v-cloak>* Please select an account first, then reset password.</p>
				</div>
				<button type="submit" v-on:click.prevent="submit" class="button button--block button--large">Reset
					Password
				</button>
			</div>
			<div v-if="done" class="grid-container">
				<div class="page-reset-password__secondary page-reset-password__confirmation">
					<h2>You requested a password reset</h2>
					<p class="page-reset-password__confirmation__text">A message has been sent to the email address associated with your account. Please open the email to
						access a link to reset your password.</p>
				</div>
			</div>
		</site-overlay>
	</div>
</password-reset>