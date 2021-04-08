<div class="edit-profile">
	<div class="grid-container">
		<div class="edit-profile__content">
			<h3 class="edit-profile__member-heading">
				{{display_name}} - Member #{{display_member_number}}
			</h3>
			<div v-if="!component_loaded">
				<p v-if="load_error" class="text--alert">Error loading form</p>
				<p v-else-if="!loaded && loading_timeout">Loading...</p>
			</div>
			<div v-else>
				<div class="accordion-group accordion-group--up-down">
					<accordion :init_expanded="init_section==='main'">
						<span slot="trigger_text">Main Info</span>
						<div slot="expand_content">
							<div class="edit-profile__section">
								<div class="edit-profile__form">
									<div class="form-group">
										<label class="field-label" for="prefix">
											Prefix
										</label>
										<select class="form-field form-field--reduced-right" v-model="form_data.prefix" :class="fieldClass('prefix')" id="prefix">
											<option selected :value="null">Select Prefix</option>
											<option v-for="prefix_option in form_options.prefixes" :value="prefix_option.value">
												{{prefix_option.label}}
											</option>
										</select>
										<p v-if="fieldMessage('prefix')" class="input-error">
											*{{fieldMessage('prefix')}}
										</p>
									</div>
									<div class="form-group">
										<label for="first_name" class="field-label">
											First Name<span class="field-label__required-notice">*</span>
										</label>
										<input type="text" class="form-field" v-model="form_data.first_name" :class="fieldClass('first_name')" id="first_name">
										<p v-if="fieldMessage('first_name')" class="input-error">
											*{{fieldMessage('first_name')}}
										</p>
									</div>
									<div class="form-group">
										<label class="field-label" for="pronunciation_firstname">Pronunciation</label>
										<input type="text" class="form-field" v-model="form_data.pronunciation_firstname" :class="fieldClass('pronunciation_firstname')" id="pronunciation_firstname" name="pronunciation_firstname">
										<p v-if="fieldMessage('pronunciation_firstname')" class="input-error">
											*{{fieldMessage('pronunciation_firstname')}}
										</p>
									</div>
									<div class="form-group">
										<label class="field-label" for="middle_name">Middle Name</label>
										<input type="text" class="form-field" v-model="form_data.middle_name" :class="fieldClass('middle_name')" id="middle_name" name="middle_name">
										<p v-if="fieldMessage('middle_name')" class="input-error">
											*{{fieldMessage('middle_name')}}
										</p>
									</div>
									<div class="form-group">
										<label for="last_name" class="field-label">
											Last Name<span class="field-label__required-notice">*</span>
										</label>
										<input type="text" class="form-field" v-model="form_data.last_name" :class="fieldClass('last_name')" id="last_name">
										<p v-if="fieldMessage('last_name')" class="input-error">
											*{{fieldMessage('last_name')}}
										</p>
									</div>
									<div class="form-group">
										<label class="field-label" for="pronunciation_lastname">Pronunciation</label>
										<input type="text" class="form-field" v-model="form_data.pronunciation_lastname" :class="fieldClass('pronunciation_lastname')" id="pronunciation_lastname" name="pronunciation_lastname">
										<p v-if="fieldMessage('pronunciation_lastname')" class="input-error">
											*{{fieldMessage('pronunciation_lastname')}}
										</p>
									</div>
									<div class="form-group">
										<label class="field-label" for="prefix">
											Suffix
										</label>
										<select class="form-field form-field--reduced-right" v-model="form_data.suffix" :class="fieldClass('suffix')" id="suffix">
											<option selected :value="null">Select Suffix</option>
											<option v-for="suffix_option in form_options.suffixes" :value="suffix_option.value">
												{{suffix_option.label}}
											</option>
										</select>
										<p v-if="fieldMessage('suffix')" class="input-error">
											*{{fieldMessage('suffix')}}
										</p>
									</div>
									<div class="form-group">
										<label for="birth_date" class="field-label">
											Birth Date<span class="field-label__required-notice">*</span>
										</label>
										<date-input placeholder="mm/dd/yyyy" v-model="form_data.birth_date" :initial="form_data.birth_date" :class="fieldClass('birth_date')" id="birth_date"></date-input>
										<p v-if="fieldMessage('birth_date')" class="input-error">
											*{{fieldMessage('birth_date')}}
										</p>
									</div>
								</div>
								<div class="edit-profile__display-data">
									<ul class="label-list">
										<li>
											<span class="label-list__label">Eligibility:</span>
											<span class="label-list__value">{{saved_profile.eligibility.description}}</span>
										</li>
										<li>
											<span class="label-list__label">Status:</span>
											<span class="label-list__value">{{saved_profile.eligibility.status_description}}</span>
										</li>
									</ul>
									<ul class="label-list">
										<li>
											<span class="label-list__label">Gender:</span>
											<span class="label-list__value">{{displayGender(saved_profile.gender)}}</span>
										</li>
										<li class="edit-profile__display-notice">
											If gender is incorrect please contact
											<a class="standard-link" href="#">Member Services</a>
										</li>
									</ul>
									<ul class="label-list">
										<li>
											<span class="label-list__label">US Citizen:</span>
											<span class="label-list__value">{{saved_profile.is_us_citizen?'Yes':'No'}}</span>
										</li>
										<li class="edit-profile__display-notice">
											If citizenship is incorrect please contact
											<a class="standard-link" href="#">Member Services</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</accordion>
					<accordion :init_expanded="init_section==='email_phone'">
						<span slot="trigger_text">Email/Phone</span>
						<div slot="expand_content">
							<div class="edit-profile__section">
								<div class="edit-profile__form">
									<div class="form-group">
										<label class="field-label" for="primary_email">Primary Email</label>
										<input type="email" class="form-field" v-model="form_data.primary_email" :class="fieldClass('primary_email')" id="primary_email" name="primary_email">
										<p v-if="fieldMessage('primary_email')" class="input-error">
											*{{fieldMessage('primary_email')}}
										</p>
										<div class="form-group-options">
											<div class="form-group-options__option">
												<label for="publish_primary_email" class="usfsa-checkbox">
													<input type="checkbox" v-model="form_data.publish_primary_email" :class="fieldClass('publish_primary_email')" id="publish_primary_email">
													<p v-if="fieldMessage('publish_primary_email')" class="input-error">
														*{{fieldMessage('publish_primary_email')}}
													</p>
													<span class="usfsa-checkbox__text">Publish in directory</span>
												</label>
											</div>
											<div class="form-group-options__option">
												<label for="opt_out_primary_email" class="usfsa-checkbox">
													<input type="checkbox" v-model="form_data.opt_out_primary_email" :class="fieldClass('opt_out_primary_email')" id="opt_out_primary_email">
													<p v-if="fieldMessage('opt_out_primary_email')" class="input-error">
														*{{fieldMessage('opt_out_primary_email')}}
													</p>
													<span class="usfsa-checkbox__text">Opt Out</span>
												</label>
											</div>
										</div>
									</div>
									<div class="form-group form-group--increased-spacing">
										<label class="field-label" for="secondary_email">Secondary Email</label>
										<input type="email" class="form-field" v-model="form_data.secondary_email" :class="fieldClass('secondary_email')" id="secondary_email" name="secondary_email">
										<p v-if="fieldMessage('secondary_email')" class="input-error">
											*{{fieldMessage('secondary_email')}}
										</p>
										<div class="form-group-options">
											<div class="form-group-options__option">
												<label for="publish_secondary_email" class="usfsa-checkbox">
													<input type="checkbox" v-model="form_data.publish_secondary_email" :class="fieldClass('publish_secondary_email')" id="publish_secondary_email">
													<p v-if="fieldMessage('publish_secondary_email')" class="input-error">
														*{{fieldMessage('publish_secondary_email')}}
													</p>
													<span class="usfsa-checkbox__text">Publish in directory</span>
												</label>
											</div>
											<div class="form-group-options__option">
												<label for="opt_out_secondary_email" class="usfsa-checkbox">
													<input type="checkbox" v-model="form_data.opt_out_secondary_email" :class="fieldClass('opt_out_secondary_email')" id="opt_out_secondary_email">
													<p v-if="fieldMessage('opt_out_secondary_email')" class="input-error">
														*{{fieldMessage('opt_out_secondary_email')}}
													</p>
													<span class="usfsa-checkbox__text">Opt Out</span>
												</label>
											</div>
										</div>
									</div>
									<div class="form-group form-group--increased-spacing">
										<label class="field-label" for="primary_phone">Primary Phone</label>
										<input type="tel" class="form-field" v-model="form_data.primary_phone" :class="fieldClass('primary_phone')" id="primary_phone" name="primary_phone">
										<p v-if="fieldMessage('primary_phone')" class="input-error">
											*{{fieldMessage('primary_phone')}}
										</p>
									</div>
									<div class="form-group">
										<label class="field-label" for="primary_phone_carrier">
											Select if Mobile
										</label>
										<select class="form-field form-field--reduced-right" v-model="form_data.primary_phone_carrier" :class="fieldClass('primary_phone_carrier')" id="primary_phone_carrier">
											<option selected :value="null">Select Mobile Carrier</option>
											<option v-for="carrier_option in form_options.mobile_carriers" :value="carrier_option.value">
												{{carrier_option.label}}
											</option>
										</select>
										<p v-if="fieldMessage('primary_phone_carrier')" class="input-error">
											*{{fieldMessage('primary_phone_carrier')}}
										</p>
									</div>
								</div>
							</div>
						</div>
					</accordion>
				</div>
			</div>
		</div>
		<div class="competition-registration-takeover__actions">
			<p class="input-error" v-if="save_error">{{save_error}}</p>
			<button type="button" class="button button--large button--block" :disabled="saving" v-on:click="save">
				{{saving?'Saving':'Save'}}
			</button>
		</div>
	</div>
</div>