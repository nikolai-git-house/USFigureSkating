<competition-registration-event-selection inline-template v-cloak>
	<div class="page">
		<div class="page__heading">
			<h1 class="page__title">Event Selection</h1>
			<div class="grid-container">
				<div class="competition-registration__progress-bar">
					<competition-registration-progress :active_step="active_step_number"></competition-registration-progress>
				</div>
			</div>
		</div>
		<div class="page__content page__content--bleed page__content--no-top-pad">
			<div class="grid-container">
				<page-alert class="page-alert page-alert--notice page-alert--medium competition-registration-overview__notice">
					<div slot="trigger_text">
						Additional Information
					</div>
					<div slot="expand_content">
						<p>
							If an event you are interested in is not listed below please review the following
							information:
						</p>
						<ul class="page-alert__content__list">
							<li>
								It is possible a recently passed test has not yet been recorded. If this is the case you
								can review your test records and/or add test information in order to proceed with
								registration by using the back button below to access the Skate Test History.
							</li>
							<li>
								You are unable to select partnered events without providing your partner's information
								first. Use the back button below to access this step in the registration process.
							</li>
						</ul>
						<p>
							Contact
							<a class="standard-link" href="mailto:productsupport@usfigureskating.org">
								productsupport@usfigureskating.org
							</a>
							if you have questions.
						</p>
					</div>
				</page-alert>
			</div>
			<div class="page__content" v-if="!component_loaded">
				<p v-if="load_error" class="text--alert">Error loading events.</p>
				<p v-else-if="!loaded && loading_timeout">Loading...</p>
			</div>
			<div v-if="component_loaded" class="competition-registration__screen-content">
				<div class="grid-container">
					<p class="competition-registration__screen-intro">
						You are eligible for the events listed below.
					</p>
				</div>
				<div class="grid-container" v-if="!component_loaded">
					<p v-if="load_error" class="text--alert">Error loading events.</p>
					<p v-else-if="!loaded && loading_timeout">Loading...</p>
				</div>
				<div v-else class="event-selection">
					<event-selection inline-template ref="event_selection" :state_available_events="state_available_events">
                        <?php include __DIR__ . "/partials/event-selection.php"; ?>
					</event-selection>
					<div class="event-selection__partner-tests" v-if="show_partner_tests" ref="partner_tests">
						<div class="grid-container">
							<h4 class="event-selection__partner-tests__heading">
								Partner Skate Test History
							</h4>
							<div class="skate-test-summary" v-for="(summary_item,index) in partner_skate_test_summary">
								<div class="skate-test-summary__content">
									<div class="skate-test-summary__description">
										<p class="skate-test-summary__data skate-test-summary__data--partner">
											{{summary_item.partner.name}}
										</p>
										<p class="skate-test-summary__data skate-test-summary__data--event">
											{{summary_item.event.name}}
										</p>
                                        <p class="skate-test-summary__data skate-test-summary__data--status">
                                            <span v-if="summary_item.partner.meets_requirements"
                                                  class="skate-test-summary__status skate-test-summary__status--yes">Meets Requirements</span>
                                            <a v-else
                                               href="#"
                                               v-on:click.prevent="active_requirements = summary_item"
                                               class="skate-test-summary__status skate-test-summary__status--no">
                                                Doesn't Meet Requirements
                                                <span class="icon-button icon-button--info icon-button--info--red">&nbsp;</span>
                                            </a>
                                        </p>
									</div>
									<div class="skate-test-summary__actions">
										<button class="button button--medium button--medium-text button--info button--block" v-on:click.prevent="openPartnerSkateTest(summary_item,index)">
											Manage
										</button>
									</div>
								</div>
								<p class="input-error" v-if="partnerSkateTestLoadError(index)">
									{{partner_test_load_error}}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="component_loaded" class="competition-registration-actions" v-if="component_loaded">
				<div class="grid-container">
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
		<site-overlay :open_fn="partnerSkateTestActive" v-on:close-overlay="handlePartnerSkateTestOverlayClose()">
			<div class="competition-registration-takeover" v-if="active_test_discipline">
				<div class="competition-registration-takeover__header">
					<h2 class="competition-registration-takeover__title">
						Add {{active_test_discipline.label}}
					</h2>
				</div>
				<div class="competition-registration-takeover__content competition-registration-takeover__content--skate-test">
					<div class="skate-test-takeover">
						<div class="skate-test-takeover__section skate-test-takeover__section--add-form">
							<div class="grid-container">
								<!--@integration:
                                    see integration guide for autosuggest options on the following component
                                -->
								<skate-test-discipline-form :club_autosuggest="{active:true,restrict:false}" inline-template v-on:complete="completeSkateTest" :external_error="skate_test_submit_error" :submitting="submitting_skate_test" :is_equivalency="false" v-on:cancel="closeSkateTestDisciplineForm" :form_test_options="active_skate_test_options">
                                    <?php include __DIR__ . "/../../components/skate-test/skate-test.discipline-form.php"; ?>
								</skate-test-discipline-form>
							</div>
						</div>
						<div class="skate-test-takeover__section skate-test-takeover__section--self-reported">
							<div class="grid-container">
								<h4 class="skate-test-takeover__section-heading skate-test-takeover__section-heading--padded">
									Delete self-reported tests
								</h4>
								<skate-test-history inline-template :delete_handler="removeSkateTest">
                                    <?php include __DIR__ . "/../../components/skate-test/skate-test.self-reported-list.php"; ?>
								</skate-test-history>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="competition-registration-takeover" v-else>
				<div class="competition-registration-takeover__header">
					<h2 class="competition-registration-takeover__title">
						My Skate Test History
						<br>
						with {{skate_test_takeover_partner_name}}
					</h2>
				</div>
				<div class="competition-registration-takeover__content competition-registration-takeover__content--partner-skate-test">
					<div class="grid-container">
						<div class="partner-skate-test-history">
							<div class="partner-skate-test-history__content">
								<page-alert class="page-alert page-alert--notice page-alert--medium">
									<div slot="trigger_text">
										Important Information
									</div>
									<div slot="expand_content">
										<div class="competition-registration-skate-tests__alert-content">
											<p>
												A skater's test level determines which events they can enter at the
												competition.
											</p>
											<p>
												If you are a skater with no tests and competing up to the
												pre-preliminary level, add 'No-Test Free Skating' and 'No-Test Moves in
												the Field' using U.S. Figure Skating as the club and yesterday's date.
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
												<a href="#" class="download-link">
													U.S. Figure Skating Test Equivalency pdf
												</a>
											</p>
										</div>
									</div>
								</page-alert>
								<skate-test-history inline-template :delete_handler="removeSkateTest">
                                    <?php include __DIR__ . "/../../components/skate-test/skate-test-history.php"; ?>
								</skate-test-history>
							</div>
							<div class="partner-skate-test-history__close">
								<div class="competition-registration-takeover__actions">
									<button type="button" class="button button--large button--block" v-on:click.prevent="handlePartnerSkateTestOverlayClose()">
										Close
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</site-overlay>
        <site-overlay :open_fn="eventRequirementsActive" v-on:close-overlay="handleEventRequirementsOverlayClose()">
            <event-requirements-overlay :requirements_data="active_requirements">
                <button slot="close-button"
                        class="button button--large button--block"
                        v-on:click.prevent="handleEventRequirementsOverlayClose">Close
                </button>
            </event-requirements-overlay>
        </site-overlay>
	</div>
</competition-registration-event-selection>