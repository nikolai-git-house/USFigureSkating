<div class="address-form">
    <?php include __DIR__ . "/../../../components/address-form-fields.php"; ?>
	<div class="form-actions">
		<div class="form-actions__column form-actions__column--full">
			<button type="button" class="button button--block" :disabled="submitting" v-on:click.prevent="complete()">
				{{submitting ? "Submitting" : "Continue"}}
			</button>
		</div>
	</div>
	<p class="input-error">{{external_error}}</p>
</div>
