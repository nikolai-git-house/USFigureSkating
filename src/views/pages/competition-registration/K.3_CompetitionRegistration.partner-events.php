<competition-registration-partner-events inline-template v-cloak>
	<div class="page">
		<div class="page__heading">
			<h1 class="page__title">Partner Events</h1>
			<div class="grid-container">
				<div class="competition-registration__progress-bar">
					<competition-registration-progress :active_step="3"></competition-registration-progress>
				</div>
			</div>
		</div>
		<div class="page__content page__content--no-top-pad">
			<div class="competition-registration-partner-events">
				<page-alert class="page-alert page-alert--notice page-alert--medium">
					<div slot="trigger_text">
						Important Information
					</div>
					<div slot="expand_content">
						<p>
							Partners of foreign skaters must be U.S. Figure Skating members or account holders.
							<br>
							To create additional accounts (coach, partners) access the main login page ("Non-Member -
							Create Account").
						</p>
					</div>
				</page-alert>
				<div class="competition-registration-partner-events__content competition-registration__screen-content">
					<p class="competition-registration__screen-intro">
						If you intend to register for a partnered event, please indicate below. If not (i.e. singles
						only), click Continue to advance to Event Selection.
					</p>
					<div v-if="!component_loaded">
						<p v-if="load_error" class="text--alert">Error loading form</p>
						<p v-else-if="!loaded && loading_timeout">Loading...</p>
					</div>
					<p class="alert" v-else-if="partner_event_options.length<1">
						No partner events are configured for this competition.
					</p>
					<ul v-else class="check-list">
						<li v-for="(event_option,index) in partner_event_options">
							<label :for="'option_'+index" class="usfsa-checkbox">
								<input type="checkbox" :id="'option_'+index" :value="event_option.value" v-model="selected_events">
								<span class="usfsa-checkbox__text">{{event_option.label}}</span>
							</label>
						</li>
					</ul>
				</div>
				<div class="competition-registration-actions">
					<div class="form-actions">
						<div class="form-actions__column form-actions__column--full form-actions__column--notice" v-if="save_error">
							<p class="input-error">
								{{save_error}}
							</p>
						</div>
						<div class="form-actions__column">
							<button v-on:click.prevent="retreat" class="button button--info button--block">
								Back
							</button>
						</div>
						<div class="form-actions__column">
							<button v-on:click.prevent="advance" type="button" class="button button--block">
								{{saving ? "Saving" : "Continue"}}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</competition-registration-partner-events>