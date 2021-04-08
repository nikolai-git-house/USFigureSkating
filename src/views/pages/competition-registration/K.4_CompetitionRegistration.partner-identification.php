<competition-registration-partner-identification inline-template v-cloak>
	<div class="page">
		<div class="page__heading">
			<h1 class="page__title">My Partners</h1>
			<div class="grid-container">
				<div class="competition-registration__progress-bar">
					<competition-registration-progress :active_step="4"></competition-registration-progress>
				</div>
			</div>
		</div>
		<div class="page__content page__content--no-top-pad">
			<page-alert class="page-alert page-alert--notice page-alert--medium competition-registration-overview__notice">
				<div slot="trigger_text">
					Important Information
				</div>
				<div slot="expand_content">
					<p>
						Registration for the "team" is through your account. Thus you may be required to verify your
						partner(s) test since you are the registration owner.
					</p>
					<p>
						Partners of foreign skaters must be U.S. Figure Skating members or account holders.
					</p>
					<p>
						To create additional accounts (coach, partners) access the main login page ("Non-Member - Create
						Account").
					</p>
				</div>
			</page-alert>
			<div class="competition-registration__screen-content">
				<p class="competition-registration__screen-intro">
					You have indicated you wish to register for an event(s) that requires a partner. Please choose your
					partner below.
				</p>
				<div class="grid-container" v-if="!component_loaded">
					<p v-if="load_error" class="text--alert">Error loading partner information.</p>
					<p v-else-if="!loaded && loading_timeout">Loading...</p>
				</div>
				<div class="partner-identification" v-else>
					<member-category-assignment inline-template v-on:add="addPartner" v-on:edit="editPartner" :disable_buttons="disable_buttons" :remove_fn="removePartner" :event_categories="event_categories" no_item_notice="No partner selections available." add_button_text="Add Partner">
                        <?php include __DIR__ . "/../../components/member-category-assignment.php"; ?>
					</member-category-assignment>
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
		</div>
		<site-overlay :open_fn="searchActive" v-on:close-overlay="closeSearch()">
			<div class="competition-registration-takeover">
				<div class="competition-registration-takeover__header">
					<h2 class="competition-registration-takeover__title">
						{{search_header}}
					</h2>
				</div>
				<div class="competition-registration-takeover__content competition-registration-takeover__content--blank">
                    <?php include __DIR__ . "/../../components/member-search/member-search.php"; ?>
				</div>
			</div>
		</site-overlay>
	</div>
</competition-registration-partner-identification>