<div class="checkout-step__content">
	<div v-if="!component_loaded">
		<p v-if="load_error" class="text--alert">{{error_notice?error_notice:"Error loading address information."}}</p>
		<p v-else-if="!loaded && loading_timeout">Loading...</p>
	</div>
	<div v-else>
		<div v-if="step_complete" class="checkout-step__result">
			<div class="selected-address">
				<address class="checkout-address">
					<span>{{selected_address.full_name}}</span>
					<span>{{selected_address.full_address}}</span>
				</address>
			</div>
			<div class="checkout-step__actions checkout-step__actions--selected-address selected-address-actions">
				<div class="selected-address-actions__reactivate">
					<button type="button" v-on:click.prevent="reloadStep()" class="button button--block button--info">
						Select/Add New
					</button>
				</div>
				<div class="selected-address-actions__edit">
					<button type="button" v-on:click.prevent="editAddress()" class="button button--block button--info">
						Edit
					</button>
				</div>
			</div>
		</div>
		<billing-address-form-manager inline-template v-if="form_active" v-on:address_completed="completeAddress($event)" v-on:cancel_edit="cancelEdit()" :source_address="edit_address">
			<billing-address-form :submitting="submitting" :external_error="submit_error" v-on:cancel="cancel" v-on:complete="complete" :existing_data="existing_data" :cancel_button_text="cancel_button_text" :show_default_input="show_default_input" inline-template>
				<div>
                    <?php include __DIR__ . "/../../components/billing-address-form-fields.php"; ?>
					<div class="checkout-step__actions address-form-actions">
						<div class="address-form-actions__notice" v-if="external_error">
							<p class="input-error">
								{{external_error}}
							</p>
						</div>
						<div class="address-form-actions__cancel">
							<button :disabled="submitting" type="button" v-on:click.prevent="cancel()" class="button button--block button--info">
								{{cancel_button_text}}
							</button>
						</div>
						<div class="address-form-actions__continue">
							<button :disabled="submitting" type="button" v-on:click.prevent="complete()" class="button button--block button--action">
								{{submitting?"Saving":"Save &amp; Continue"}}
							</button>
						</div>
					</div>
				</div>
			</billing-address-form>
		</billing-address-form-manager>
		<saved-addresses v-if="show_saved_addresses" inline-template v-on:saved_address_selected="selectAddress($event)" v-on:edit_address="editSavedAddress($event)" v-on:add_address="addAddress()">
            <?php include( __DIR__ . '/saved-addresses.php' ) ?>
		</saved-addresses>
	</div>
</div>
