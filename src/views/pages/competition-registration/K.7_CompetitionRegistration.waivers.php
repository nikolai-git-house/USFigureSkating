<competition-registration-waivers inline-template v-cloak>
	<div class="page">
		<div class="page__heading page__heading--no-pad-bottom">
			<h1 class="page__title">Waivers</h1>
			<div class="grid-container">
				<div class="competition-registration__progress-bar">
					<competition-registration-progress :active_step="active_step_number"></competition-registration-progress>
				</div>
				<p class="page__lead page__lead--full">
					All skaters are required to review and sign each of the three standard U.S. Figure Skating waivers
					below each membership year.
				</p>
			</div>
		</div>
		<div class="page__content page__content--no-top-pad">
			<div class="competition-registration__screen-content competition-registration__screen-content--waivers">
				<div v-if="!component_loaded">
					<p v-if="load_error" class="text--alert">Error loading waivers.</p>
					<p v-else-if="!loaded && loading_timeout">Loading...</p>
				</div>
				<div v-else class="competition-registration-waivers">
					<div class="accordion-group accordion-group--up-down">
						<accordion v-for="(waiver,index) in waivers" :key="waiver.id" :init_expanded="!isComplete(waiver)">
							<span slot="trigger_text" class="accordion-status-trigger" :class="isComplete(waiver) ? 'accordion-status-trigger--yes' : 'accordion-status-trigger--no'">{{waiver.name}}</span>
							<div slot="expand_content">
								<div class="waiver-accordion-content">
									<a :href="waiver.file_url" target="_blank" rel="noopener" class="download-link">
										Download {{waiver.name}}
									</a>
									<p class="waiver-accordion-content__lead">
										I have read and accepted the above
										<br>
										waiver information:
									</p>
									<div class="waiver-accordion-content__form">
										<div class="form-group">
											<label class="field-label" :for="'name_'+index">Name:</label>
											<input type="text" v-model="waiver.status.name" class="form-field" :id="'name_'+index" :name="'name_'+index">
											<p class="help-text">(If under 18, name of parent or guardian)</p>
										</div>
										<div class="form-group">
											<label class="field-label" :for="'relationship_'+index">
												Relationship:
											</label>
											<select v-model="waiver.status.relationship" :name="'relationship_'+index" :id="'relationship_'+index" class="form-field form-field--reduced-right">
												<option disabled :value="null">Select</option>
												<option v-for="option in relationship_form_options" :value="option.value">
													{{option.label}}
												</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</accordion>
					</div>
				</div>
			</div>
			<div class="competition-registration-actions" v-if="component_loaded">
				<div class="form-actions">
					<div class="form-actions__column form-actions__column--full form-actions__column--notice" v-if="save_error">
						<p class="input-error">
							{{save_error}}
						</p>
					</div>
					<div class="form-actions__column form-actions__column--full form-actions__column--notice" v-if="!waivers_complete">
						<p class="notice">
							To continue you need to sign your waivers.
						</p>
					</div>
					<div class="form-actions__column form-actions__column--full">
						<button v-on:click.prevent="retreat" type="button" class="button button--info button--block">
							Back
						</button>
					</div>
					<div class="form-actions__column form-actions__column--full">
						<button v-on:click.prevent="advance" type="button" :disabled="block_continue" class="button button--block">
							{{saving ? "Saving" : "Continue to Checkout"}}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</competition-registration-waivers>