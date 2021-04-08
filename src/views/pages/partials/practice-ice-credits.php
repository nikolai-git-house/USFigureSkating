	<practice-ice-credits inline-template>
		<div class="practice-ice-credits">

			<div class="practice-ice-credits__section" v-if="show_unscheduled_credits">
				<h2 class="practice-ice-credits__section__heading">
					Unscheduled Credits
				</h2>
				<div class="practice-ice-credits__unscheduled-event" v-for="available_credit_item in available_credit_list">
					<h3 class="practice-ice-credits__event-heading">{{available_credit_item.event_name}}</h3>
					<ul class="practice-ice-credits__unscheduled-list">
						<li v-for="(amount,credit_type) in available_credit_item.credits">{{credit_type.toUpperCase()}}: {{amount}}</li>
					</ul>
				</div>
			</div>
			<hr class="practice-ice-credits__divider" v-if="show_unscheduled_credits && can_purchase_credits">
			<credit-purchase inline-template v-if="can_purchase_credits" :package_purchase_available="package_purchase_available" :credit_purchase_available="credit_purchase_available">
				<div>
					<div class="practice-ice-credits__section" v-if="packages_available">
						<h2 class="practice-ice-credits__section__heading">
							Purchase Packages
						</h2>
						<div>
							<div class="purchase-credits__event" v-for="(event,index) in credit_package_events">
								<h3 class="practice-ice-credits__event-heading">
									{{event.name}}
								</h3>
								<div class="purchase-credits-table">
									<div class="purchase-credits-table__row purchase-credits-table__row--heading" v-if="index===0">
										<div class="purchase-credits-table__cell purchase-credits-table__cell--label purchase-credits-table__cell--type">
											Package
										</div>
										<div class="purchase-credits-table__cell purchase-credits-table__cell--label purchase-credits-table__cell--price">
											Price
										</div>
										<div class="purchase-credits-table__cell purchase-credits-table__cell--label purchase-credits-table__cell--controls">
											Qty
										</div>
									</div>
									<div class="purchase-credits-table__credit" v-for="(package,index) in event.packages">
										<div class="purchase-credits-table__row">
											<div class="purchase-credits-table__cell purchase-credits-table__cell--type">
												{{package.name}}
											</div>
											<p v-if="package_acquired_message(package)" class="purchase-credits-table__max-message purchase-credits-table__max-message--package">{{package_acquired_message(package)}}</p>
											<div v-else>
												<div class="purchase-credits-table__cell purchase-credits-table__cell--price">
													${{package.cost}}
												</div>
												<div class="purchase-credits-table__cell purchase-credits-table__cell--controls">
													<increment-input  inline-template :input_lock="input_lock" :max="1" v-on:increment_value_changed="handlePackageChange(event,package,$event)">
														<div class="increment-input increment-input--small">
															<div class="increment-input__block">
																<button class="button increment-input__remove" v-on:click.prevent="decrement" :disabled="input_lock || value<=min" type="button">
																	-
																</button>
															</div>
															<div class="increment-input__block">
																<span class="increment-input__value">{{value}}</span>
															</div>
															<div class="increment-input__block">
																<button class="button increment-input__add" v-on:click.prevent="increment" type="button" :disabled="input_lock || value>=max">
																	+
																</button>
															</div>
														</div>
													</increment-input>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr class="practice-ice-credits__divider" v-if="packages_available && credit_purchase_available">
					<div class="practice-ice-credits__section" v-if="credit_purchase_available">
						<h2 class="practice-ice-credits__section__heading">
							Purchase Credits
						</h2>
						<div class="purchase-credits">
							<div class="purchase-credits__event" v-for="(credit_config,index) in purchasable_credits">
								<h3 class="practice-ice-credits__event-heading">
									{{credit_config.event.name}}
								</h3>
								<div class="purchase-credits-table">
									<div class="purchase-credits-table__row purchase-credits-table__row--heading" v-if="index===0">
										<div class="purchase-credits-table__cell purchase-credits-table__cell--label purchase-credits-table__cell--type">
											Type
										</div>
										<div class="purchase-credits-table__cell purchase-credits-table__cell--label purchase-credits-table__cell--price">
											Price
										</div>
										<div class="purchase-credits-table__cell purchase-credits-table__cell--label purchase-credits-table__cell--controls">
											Qty
										</div>
									</div>
									<div class="purchase-credits-table__credit" v-for="(credit_type,index) in credit_config.purchasable_credits">
										<div class="purchase-credits-table__row">
											<div class="purchase-credits-table__cell purchase-credits-table__cell--type">
												{{credit_type.name}}
											</div>
											<div class="purchase-credits-table__cell purchase-credits-table__cell--price">
												${{credit_type.cost}}
											</div>
											<div class="purchase-credits-table__cell purchase-credits-table__cell--controls">
												<increment-input v-model="individual_credit_counts[index]" ref="increment" inline-template :input_lock="input_lock" :reduce_on_max_change="false" :max="individualCreditLimit(credit_config.event.id,credit_type.key)" v-on:increment_value_changed="handleCreditChange(credit_config.event,credit_type,$event)">
													<div class="increment-input increment-input--small">
														<div class="increment-input__block">
															<button class="button increment-input__remove" v-on:click.prevent="decrement" :disabled="input_lock || value<=min" type="button">
																-
															</button>
														</div>
														<div class="increment-input__block">
															<span class="increment-input__value">{{value}}</span>
														</div>
														<div class="increment-input__block">
															<button class="button increment-input__add" v-on:click.prevent="increment" type="button" :disabled="input_lock || value>=max">
																+
															</button>
														</div>
													</div>
												</increment-input>
											</div>
										</div>
										<p class="purchase-credits-table__max-message" v-if="showCreditLimitMessage(credit_config.event.id,credit_type,index)">Maximum
											{{credit_type.name}} reached.
										</p>
									</div>
								</div>
							</div>
							<div class="purchase-credits__cta">
								<div class="purchase-credits__subtotal">
									SUBTOTAL: ${{total_credit_cost}}
								</div>
								<div class="purchase-credits__button">
									<button v-on:click.prevent="addCreditsToCart()" type="button" class="button  button--info" :disabled="disable_button">
										Add to Cart
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</credit-purchase>
		</div>
	</practice-ice-credits>
