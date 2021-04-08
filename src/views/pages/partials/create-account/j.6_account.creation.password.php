<div class="password-form">
	<div class="form-group">
		<div class="field-header">
			<label class="field-label" for="password">Password</label>
			<span class="field-header__notice field-header__notice--flush">Minimum of 6 characters</span>
		</div>
		<input type="password" class="form-field" :class="fieldClass('password')" id="password" name="password" v-model="form_data.password">
		<p v-if="fieldMessage('password')" class="input-error">{{fieldMessage('password')}}</p>
	</div>
	<div class="form-group">
		<label class="field-label" for="password_confirm">Re-enter Password</label>
		<input type="password" class="form-field" :class="fieldClass('password_confirm')" id="password_confirm" name="password_confirm" v-model="form_data.password_confirm">
		<p v-if="fieldMessage('password_confirm')" class="input-error">{{fieldMessage('password_confirm')}}</p>
	</div>
	<div class="form-actions">
		<div class="form-actions__column form-actions__column--full">
			<button type="button" class="button button--block" v-on:click.prevent="complete()" :disabled="submitting">
				{{submitting ? "Submitting" : "Save &amp; Complete"}}
			</button>
		</div>
	</div>
	<p class="input-error">{{external_error}}</p>
</div>