<competition-registration-skater-profile inline-template v-cloak>
	<div class="page page--accent">
		<div class="competition-registration-profile">
			<div class="page__heading page__heading--no-pad-bottom">
				<h1 class="page__title">My Profile</h1>
				<div class="grid-container">
					<div class="competition-registration__progress-bar">
						<competition-registration-progress :active_step="1"></competition-registration-progress>
					</div>
					<p class="page__lead page__lead--full">
						Please review your profile below in full. Your name and contact information will be provided to
						the local organizing committee at the conclusion of registration. To make changes, click the
						Edit button. If your home club is listed incorrectly, please contact Member Services at
						719.635.5200
					</p>
					<div v-if="loaded">
						<hr class="page__divider">
						<div class="competition-registration-profile__summary">
							<h5 class="competition-registration-profile__summary__header">
								{{profile_summary.name}} - Member #{{profile_summary.member_number}}
							</h5>
							<div class="competition-registration-profile__summary__data">
								<ul class="label-list">
									<li v-if="profile_summary.home_club && profile_summary.home_club.name">
										<span class="label-list__label">Home Club:</span>
										<span class="label-list__value" v-if="profile_summary.home_club">{{profile_summary.home_club.name}}<span v-if="profile_summary.home_club.membership_validity_formatted"> (Valid Through: {{profile_summary.home_club.membership_validity_formatted}})</span></span>
										<span v-else><em>None</em></span>
									</li>
									<li>
										<span class="label-list__label">Region:</span>
										<span class="label-list__value">{{profile_summary.region_name}}</span>
									</li>
									<li>
										<span class="label-list__label">Section:</span>
										<span class="label-list__value">{{profile_summary.section_name}}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="page__content">
				<div class="page__content" v-if="!component_loaded">
					<p v-if="load_error" class="text--alert">Error loading profile information.</p>
					<p v-else-if="!loaded && loading_timeout">Loading...</p>
				</div>
				<div v-else>
					<div class="competition-registration-profile__profile-display">
						<div class="user-profile-display">
							<div class="user-profile-display__section">
								<div class="user-profile-display__section-heading">
									<h3 class="user-profile-display__section-heading__text">
										Main Info
									</h3>
									<div class="user-profile-display__section-heading__edit">
										<button v-on:click.prevent="openEdit('main')" class="icon-button icon-button--edit icon-button--md icon-button--pseudo">
											<span class="sr-only">Edit Icon Button</span>
										</button>
									</div>
								</div>
								<div class="user-profile-display__data">
									<ul class="label-list">
										<li v-if="lts_programs && lts_programs.summary.description">
											<span class="label-list__label">Learn to Skate Program:</span>
											<span class="label-list__value">{{lts_programs.summary.description}}<span v-if="lts_programs.summary.validity_date_formatted"> (Valid Through: {{lts_programs.summary.validity_date_formatted}})</span></span>
										</li>
										<li v-for="field in main_summary_data">
											<span class="label-list__label">{{field.label}}:</span>
											<span class="label-list__value">{{field.value}}</span>
										</li>
									</ul>
								</div>
							</div>
							<div class="user-profile-display__section">
								<div class="user-profile-display__section-heading">
									<h3 class="user-profile-display__section-heading__text">
										Email and Phone
									</h3>
									<div class="user-profile-display__section-heading__edit">
										<button v-on:click.prevent="openEdit('email_phone')" class="icon-button icon-button--edit icon-button--md icon-button--pseudo">
											<span class="sr-only">Edit Icon Button</span>
										</button>
									</div>
								</div>
								<div class="user-profile-display__data">
									<ul class="label-list">
										<li v-for="field in contact_summary_data">
											<span class="label-list__label">{{field.label}}:</span>
											<span class="label-list__value">{{field.value}}</span>
										</li>
										<li v-if="!contact_summary_data.length">
											<span class="label-list__value"><em>No information provided.</em></span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="competition-registration-terms">
						<div class="competition-registration-terms__confirm">
							<label for="terms_confirm" class="usfsa-checkbox" :disabled="default_representation_submitting">
								<button v-if="!screenData.confirmed" :disabled="default_representation_submitting" class="competition-registration-terms__interrupt" v-on:click.prevent="openRepresentation">
									<span class="sr-only">Select Representation</span>
								</button>
								<input type="checkbox" id="terms_confirm" v-model="screenData.confirmed">
								<span class="usfsa-checkbox__text">I have verified my information is accurate.</span>
								<p class="input-error" v-if="default_representation_error">
									{{default_representation_error}}
								</p>
							</label>
						</div>
					</div>
					<div class="competition-registration-actions">
						<div class="form-actions" ref="actions">
							<div class="form-actions__column">
								<button v-on:click.prevent="retreat" type="button" class="button button--info button--block">
									Back
								</button>
							</div>
							<div class="form-actions__column">
								<button v-on:click.prevent="advance" type="button" :disabled="block_continue" class="button button--block">
									Continue
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="loaded">
			<site-overlay :open_fn="editActive" v-on:close-overlay="closeEdit()">
				<div class="competition-registration-takeover">
					<div class="competition-registration-takeover__header">
						<h2 class="competition-registration-takeover__title">
							Edit Member
						</h2>
					</div>
					<div class="competition-registration-takeover__content competition-registration-takeover__content--edit-member">
						<edit-profile inline-template :init_section="edit_section" v-on:saved="closeEdit">
                            <?php include __DIR__ . "/../../components/edit-profile.php"; ?>
						</edit-profile>
					</div>
				</div>
			</site-overlay>
			<site-overlay :open_fn="representationActive" v-on:close-overlay="closeRepresentation">
				<div class="competition-registration-takeover">
					<div class="competition-registration-takeover__header">
						<h2 class="competition-registration-takeover__title">
							Select Representation
						</h2>
					</div>
					<div class="competition-registration-takeover__content competition-registration-takeover__content--representation">
						<select-representation inline-template v-on:saved="saveRepresentation">
                            <?php include __DIR__ . "/../../components/edit-representation.php"; ?>
						</select-representation>
					</div>
				</div>
			</site-overlay>
		</div>
	</div>
</competition-registration-skater-profile>