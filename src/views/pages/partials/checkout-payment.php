
	<div class="checkout-step__content">
		<div>
			<div v-if="step_complete" class="checkout-step__result">
				<div class="selected-card">
					<p class="selected-card__info">
						<span class="selected-card__type" :class="'selected-card__type--'+selected_card.type">&nbsp;</span>
						<span class="selected-card__number"><span class="selected-card__number__mask">****</span> {{selected_card.last_group}}</span>
						<span class="selected-card__expiration">Exp {{selected_card.expiration_formatted}}</span>
					</p>
				</div>
				<div class="checkout-step__actions checkout-step__actions--selected-card">
					<div class="checkout-step__actions__control">
						<button type="button" v-on:click.prevent="reloadStep()" class="button button--block button--info">
							Edit
						</button>
					</div>
				</div>
			</div>
			<credit-card-form v-else inline-template v-on:payment_completed="complete($event)" :source_card="selected_card">
				<fieldset class="payment-form checkout-form checkout-form--payment">
					<div class="checkout-form__row">
						<div class="form-group form-group--card-number">
							<label class="field-label" for="card_number">Card Number</label>
							<credit-card-input ref="credit_card_input" v-on:change="updateCreditCardInfo($event)" :input_class="fieldClass('card_number')" :initial="form_data.card_number"></credit-card-input>
							<p v-if="fieldMessage('card_number')" class="input-error">*{{fieldMessage('card_number')}}
							</p>
						</div>
					</div>


					<div class="checkout-form__row">
						<div class="form-group form-group--cvc">
							<label class="field-label" for="cvc">CVC</label>
							<input v-model="form_data.cvc" v-number-input :class="fieldClass('cvc')" id="cvc" type="tel" class="form-field">
							<p v-if="fieldMessage('cvc')" class="input-error">*{{fieldMessage('cvc')}}</p>
						</div>
						<div class="form-group form-group--expiration">
							<span class="field-label">Expiration Date</span>
							<div class="checkout-form__row">
								<div class="form-group form-group--expiration-month">
									<label class="field-label sr-only" for="expiration_month">Expiration Month</label>
									<select v-model="form_data.expiration_month" :class="fieldClass('expiration_month')" class="form-field" id="expiration_month">
										<option v-for="month in months" :value="month.value" :disabled="month.value===null">{{month.label}}</option>
									</select>
									<p v-if="fieldMessage('expiration_month')" class="input-error">
										*{{fieldMessage('expiration_month')}}
									</p>
								</div>
								<div class="form-group form-group--expiration-year">
									<label class="field-label sr-only" for="expiration_year">Expiration Year</label>
									<select v-model="form_data.expiration_year" :class="fieldClass('expiration_year')" class="form-field" id="expiration_year">
										<option v-for="year in years" :value="year.value" :disabled="year.value===null">{{year.label}}</option>
									</select>
									<p v-if="fieldMessage('expiration_year')" class="input-error">
										*{{fieldMessage('expiration_year')}}
									</p>
								</div>
							</div>
							<p v-if="fieldMessage('expiration_date')" class="input-error">*{{fieldMessage('expiration_date')}}
							</p>
						</div>
					</div>

					<div class="checkout-step__actions checkout-step__actions--payment-form payment-form-actions">
						<div class="payment-form-actions__cancel">
							<button type="button" v-on:click.prevent="cancel()" class="button button--block button--info">
								Cancel
							</button>
						</div>
						<div class="payment-form-actions__continue">
							<button type="button" v-on:click.prevent="complete()" class="button button--block button--action">
								Continue
							</button>
						</div>
					</div>
				</fieldset>
			</credit-card-form>
		</div>
	</div>
