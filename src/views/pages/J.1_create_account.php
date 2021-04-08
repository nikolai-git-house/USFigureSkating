<div class="page page--preapp page--content-height">
	<div class="create-account-page__content">
		<div class="page__heading">
			<h1 class="page__title">Create Account</h1>
		</div>
		<div class="page__content">
			<!--
				@integration - [2019-07-01] - An option has been added to Create Account functionality to skip submission
				of blank emergency contact forms to the server.  It is currently configured so that functionality remains
				unchanged from the previous release, but empty data submissions can be skipped by changing the ":post_blank_emergency_contact"
				attribute on the following element to "false"
			-->
			<create-account :post_blank_emergency_contact="true" inline-template v-cloak>
				<div class="create-account">
					<p v-if="!loaded && loading_timeout">Loading...</p>
					<p v-else-if="load_error" class="text--alert">Error loading Create Account form.</p>
					<div v-else-if="loaded" class="create-account-component">
						<div class="create-account__steps-indicator" :class="{'create-account__steps-indicator--extended':required_step_count>4}" v-if="show_steps_indicator">
							<steps-indicator :available_step_count="required_step_count" :active_step_number="active_step_number"></steps-indicator>
						</div>
						<div class="create-account__help" v-if="showScreen('landing')">
							<p>Do you ned help creating your account?</p>
							<!--@integration: this link needs a target-->
							<a href="#" class="icon-link icon-link--document">View Instructions</a>
						</div>
						<div class="create-account__screen create-account__screen--landing" v-if="showScreen('landing')">
							<account-type-select inline-template v-on:type-selected="selectAccountType($event)">
                                <?php include __DIR__ . '/partials/create-account/j.2_account.creation.landing.php' ?>
							</account-type-select>
						</div>
						<div class="create-account__screen" v-if="showScreen('personal_info')">
							<h2 class="create-account__screen-title">Personal Info</h2>
							<personal-info-form :external_error="screen_server_error" :duplicate_account_attempt="duplicate_account_attempt" v-on:cancel="cancelPersonalInfo()" v-on:complete="completePersonalInfo" v-on:changed="clearServerError" :submitting="submitting" inline-template>
                                <?php include __DIR__ . '/partials/create-account/j.3_account.creation.personal-info.php' ?>
							</personal-info-form>
						</div>
						<div class="create-account__screen" v-if="showScreen('address')">
							<h2 class="create-account__screen-title">Address</h2>
							<address-form :external_error="screen_server_error" v-on:complete="completeAddress" v-on:changed="clearServerError" :submitting="submitting" inline-template>
                                <?php include __DIR__ . '/partials/create-account/j.4_account.creation.location.php' ?>
							</address-form>
						</div>
						<div class="create-account__screen" v-if="showScreen('emergency_contact')">
							<h2 class="create-account__screen-title">Emergency Contact</h2>
							<emergency-contact-form :external_error="screen_server_error" v-on:complete="completeEmergencyContact" v-on:changed="clearServerError" :submitting="submitting" inline-template>
                                <?php include __DIR__ . '/partials/create-account/j.5_account.creation.emergency.php' ?>
							</emergency-contact-form>
						</div>
						<div class="create-account__screen" v-if="showScreen('federation')">
							<h2 class="create-account__screen-title">ISU Member Federation</h2>
							<p class="create-account__lead">
								<!--@integration: the link at the end of this text requires a target-->
								To participate at a U.S. Figure Skating sanctioned nonqualifying competition, foreign
								account holders (athletes and coaches) must provide a letter from their federation
								documenting they are a member in good standing and have permission to participate. If
								you have questions with regard to this requirement, please email
								<a class="standard-link" href="#">Product Support</a>.
							</p>
							<foreign-info-form :external_error="screen_server_error" v-on:complete="completeFederationInfo" v-on:changed="clearServerError" :submitting="submitting" inline-template>
                                <?php include __DIR__ . '/partials/create-account/j.7_account.creation.federation.php' ?>
							</foreign-info-form>
						</div>
						<div class="create-account__screen" v-if="showScreen('skate_test')">
							<h2 class="create-account__screen-title">Skate Test Equivalency</h2>
							<!--@integration: the link at the end of this text requires a target-->
							<p class="create-account__lead">
								A skater’s test level determines which events they can enter at the competition. Please
								review the Test Equivalency document to confirm which events meet your skill set and
								highest level for disciplines that apply. If you need assistance with this requirement,
								please email
								<a class="standard-link" href="#">Product Support</a>.
							</p>
							<p class="create-account__lead-link">
								<!--@integration: this link requires a target-->
								<a class="standard-link" href="#">Download - Test Equivalency</a>
							</p>
							<div class="create-account__skate-test-equivalency">
								<skate-test-equivalency :external_error="screen_server_error" v-on:complete="completeSkateTestEquivalency" v-on:changed="clearServerError" :submitting="submitting" inline-template>
                                    <?php include __DIR__ . '/../components/skate-test/skate-test-equivalency-component.php' ?>
								</skate-test-equivalency>
							</div>
						</div>
						<div class="create-account__screen" v-if="showScreen('password')">
							<h2 class="create-account__screen-title">Password</h2>
							<p class="create-account__lead">
								Access to USFSA online for non-members will require the account number below with a
								password. Please use the space provided below to create a password.
							</p>
							<div class="create-account__screen__member-number">Member Number:
								<span class="create-account-member-number__value">{{member_number}}</span>
							</div>
							<password-form :external_error="screen_server_error" v-on:complete="completePassword" v-on:changed="clearServerError" :submitting="submitting" inline-template>
                                <?php include __DIR__ . '/partials/create-account/j.6_account.creation.password.php' ?>
							</password-form>
						</div>
					</div>
				</div>
			</create-account>
		</div>
	</div>
</div>