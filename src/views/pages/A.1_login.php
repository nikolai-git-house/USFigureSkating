<div class="page login-page page--preapp">
	<div class="login-page__content">
		<div class="page__heading">
			<h1 class="page__title">Members Only Login</h1>
		</div>
		<login-form inline-template>
			<div class="page__content">
				<form @submit.prevent="formSubmit" action="/login" method="POST">
					<div class="form-group">
						<label for="member_number" class="field-label">Member Number</label>
						<input type="text" v-model="member_number" id="member_number" class="form-field" :class="{'has-success':login_success}">
					</div>
					<div class="form-group">
						<label for="password" class="field-label">Password</label>
						<input type="password" v-model="password" id="password" class="form-field" :class="{'has-success':login_success}">
					</div>
					<button type="submit" :disabled="submitting" class="button button--block button--large">Login
					</button>
					<p v-if="server_message" v-cloak class="input-error">*{{server_message}}</p>
					<p class="login-page__forgot-link">
						<a href="/pages/reset-password" class="standard-link">Forgot Password?</a>
					</p>
					<p class="login-page__create-link">
						<a href="/pages/create-account" class="icon-link icon-link--profile">Create New Account</a>
					</p>
				</form>
				<form ref="secondaryForm" action="/Account/InitialLogOn" id="LoginForm" method="post">
					<input name="userNameOrEmail" v-model="member_number" type="hidden">
					<input name="password" type="hidden" v-model="password" value="">
					<input id="SuccessfulLogin" name="SuccessfulLogin" type="hidden" v-model="login_success">
				</form>
			</div>
		</login-form>
	</div>
	<div class="login-page__footer">
        <?php include( __DIR__ . '/../layouts/partials/footer.php' ); ?>
	</div>
</div>

