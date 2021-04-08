<competition-registration-coach-information inline-template v-cloak>
	<div class="page page-competition-registration-coaches">
		<div class="page__heading">
			<h1 class="page__title">My Coaches</h1>
			<div class="grid-container">
				<div class="competition-registration__progress-bar">
					<competition-registration-progress :active_step="active_step_number"></competition-registration-progress>
				</div>
			</div>
		</div>
		<div class="page__content page__content--no-top-pad">
			<page-alert class="page-alert page-alert--notice page-alert--medium competition-registration-overview__notice">
				<div slot="trigger_text">
					Foreign skaters information
				</div>
				<div slot="expand_content">
					Coaches of foreign skaters attending nonqualifying competitions must be U.S. Figure Skating members
					or account holders. To create additional accounts (coach, partners) access the main log in page
					("Non-Member - Create Account").
				</div>
			</page-alert>
			<popup v-cloak class="popup--info popup--competition-schedule-key" v-if="additional_information_popup_active" v-on:close-popup="additional_information_popup_active=false" :math_center="true">
				<span slot="heading-text">
					Additional Information
				</span>
				<div slot="content">
					<p>
						Named coaches will have access to your event registration and personal scheduling information.
						Note: you can update your coaches information via the EMS Skater Portal at any time after
						registration is complete. Refer to the competition website for additional information on coach
						requirements and credentials.
					</p>
				</div>
			</popup>
			<div class="competition-registration__screen-content">
				<div class="competition-registration__help-intro">
					<p class="competition-registration__help-intro__text competition-registration__screen-intro">
						Please use the Search button below to find the coach(es) who will be attending this competition with
						you.
					</p>
					<div class="competition-registration__help-intro__help">
						<button class="icon-button icon-button--lg icon-button--info" v-on:click="additional_information_popup_active=true">&nbsp;</button>
					</div>
				</div>
				<div v-if="!component_loaded">
					<p v-if="load_error" class="text--alert">Error loading coach information.</p>
					<p v-else-if="!loaded && loading_timeout">Loading...</p>
				</div>
				<div class="competition-registration-coaches" v-else>
					<member-category-assignment inline-template v-on:add="addCoach" v-on:edit="editCoach" :disable_buttons="disable_buttons" :remove_fn="doRemoveCoach" :event_categories="coach_identification" member_label="Coach Attending" no_item_notice="No coach selections available." add_button_text="Add Coach">
                        <?php include __DIR__ . "/../../components/member-category-assignment.php"; ?>
					</member-category-assignment>
				</div>
			</div>
			<div class="competition-registration-terms" v-if="component_loaded">
				<div class="competition-registration-terms__confirm">
					<label for="terms_confirm" class="usfsa-checkbox">
						<input type="checkbox" id="terms_confirm" v-model="screenData.confirmed">
						<span class="usfsa-checkbox__text" v-if="coach_has_been_identified">I approve the coach(es) listed above to have access to my event registration and scheduling information.</span>
						<span class="usfsa-checkbox__text" v-else>I will not have coach(es) attending with me for this competition.</span>
					</label>
				</div>
			</div>
			<div class="competition-registration-actions" v-if="component_loaded">
				<div class="form-actions">
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
		<site-overlay :open_fn="searchActive" v-on:close-overlay="closeSearch()">
			<div class="competition-registration-takeover">
				<div class="competition-registration-takeover__header">
					<h2 class="competition-registration-takeover__title">
						{{search_header}}
					</h2>
				</div>
				<div class="competition-registration-takeover__content  competition-registration-takeover__content--blank">
                    <?php include __DIR__ . "/../../components/member-search/member-search.php"; ?>
				</div>
			</div>
		</site-overlay>
	</div>
</competition-registration-coach-information>