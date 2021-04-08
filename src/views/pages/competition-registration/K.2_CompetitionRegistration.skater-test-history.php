<competition-registration-skate-tests inline-template v-cloak>
	<div class="page">
		<div class="page__heading">
			<h1 class="page__title">My Skate Tests</h1>
			<div class="grid-container">
				<div class="competition-registration__progress-bar">
					<competition-registration-progress :active_step="2"></competition-registration-progress>
				</div>
			</div>
		</div>
		<div class="page__content page__content--no-top-pad">
			<div class="competition-registration-skate-tests">
				<page-alert class="page-alert page-alert--notice page-alert--medium competition-registration-overview__notice">
					<div slot="trigger_text">
						Important Information
					</div>
					<div slot="expand_content">
						<div class="competition-registration-skate-tests__alert-content">
							<p>
								A skater's test level determines which events they can enter at the competition.
							</p>
							<p>
								If you are a skater with no tests and competing up to the pre-preliminary level, add
								'No-Test Free Skating' and 'No-Test Moves in the Field' using U.S. Figure Skating as the
								club and yesterday's date.
							</p>
							<p>
								If you need assistance with this requirement, please email
								<a href="mailto:ProductSupport@usfigureskating.org" class="standard-link standard-link--no-underline">
									ProductSupport@usfigureskating.org
								</a>
							</p>
							<p>
								Foreign Skaters:
							</p>
							<p>
								<!--@integration: this link needs a target-->
								<a href="#" class="download-link">U.S. Figure Skating Test Equivalency pdf</a>
							</p>
						</div>
					</div>
				</page-alert>
				<div v-if="!component_loaded">
					<p v-if="load_error" class="text--alert">Error loading skate test history.</p>
					<p v-else-if="!loaded && loading_timeout">Loading...</p>
				</div>
				<div v-else class="competition-registration-skate-tests__tests">
					<skate-test-history inline-template>
                        <?php include __DIR__ . "/../../components/skate-test/skate-test-history.php"; ?>
					</skate-test-history>
				</div>
				<div v-if="component_loaded" class="competition-registration-actions">
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
		<site-overlay :open_fn="skateTestActive" v-on:close-overlay="closeSkateTest">
			<div class="competition-registration-takeover">
				<div class="competition-registration-takeover__header">
					<h2 class="competition-registration-takeover__title">
						{{takeover_title}}
					</h2>
				</div>
				<div class="competition-registration-takeover__content competition-registration-takeover__content--skate-test">
					<div class="skate-test-takeover">
						<div class="skate-test-takeover__section skate-test-takeover__section--add-form">
							<div class="grid-container">
								<!--@integration:
									see integration guide for autosuggest options on the following component
								-->
								<skate-test-discipline-form :club_autosuggest="{active:true,restrict:false}" inline-template v-on:complete="completeSkateTest" :external_error="test_submit_error" :submitting="submitting_test" :is_equivalency="false" :allow_cancel="false" :form_test_options="active_test_options">
                                    <?php include __DIR__ . "/../../components/skate-test/skate-test.discipline-form.php"; ?>
								</skate-test-discipline-form>
							</div>
						</div>
						<div class="skate-test-takeover__section skate-test-takeover__section--self-reported">
							<div class="grid-container">
								<h4 class="skate-test-takeover__section-heading skate-test-takeover__section-heading--padded">
									Delete self-reported tests
								</h4>
								<skate-test-history inline-template>
                                    <?php include __DIR__ . "/../../components/skate-test/skate-test.self-reported-list.php"; ?>
								</skate-test-history>
							</div>
						</div>
					</div>
				</div>
			</div>
		</site-overlay>
	</div>
</competition-registration-skate-tests>