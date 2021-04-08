<div class="page page--ems-support">
	<div class="page__heading">
		<h1 class="page__title">EMS Support</h1>
	</div>
	<div class="page__content">
		<ems-support inline-template v-cloak>
			<div class="ems-support">
				<p v-if="!loaded && loading_timeout">Loading...</p>
				<section class="ems-support__confirmation" v-else-if="loaded && show_confirmation">
					<p>
						Thank You for contacting U.S. Figure Skating Product Support. A member of the support team will
						reach out to you by phone or email as soon as possible.
					</p>
					<p>
						<a v-on:click.prevent="reset()" href="#" class="standard-link">Submit another issue</a>
					</p>
				</section>
				<div class="ems-support__content" v-else-if="loaded">
					<section>
						<p class="page__lead">
							Complete the form below to submit an issue or question about the EMS. A member of the
							Support team will contact you as soon as possible.
						</p>
						<p class="ems-support__legend">*required fields</p>
					</section>
					<p v-if="load_error" class="text--alert">Error loading EMS Support form.</p>
					<ems-support-form v-else class="ems-support__form" inline-template v-on:submission-success="handleSubmissionSuccess">
                        <?php include __DIR__ . '/partials/ems-support-form.php'; ?>
					</ems-support-form>
					<section class="ems-support__footer">
						<ul class="ems-support-contact-list">
							<li class="ems-support-contact-list__item">
								<span class="ems-support-contact-list__label ems-support-contact-list__label--hours">Hours:</span>
								<span>M&ndash;F 8:00AM&ndash;4:30PM MT</span>
							</li>
							<li class="ems-support-contact-list__item">
								<span class="ems-support-contact-list__label ems-support-contact-list__label--email">Email:</span>
								<a class="standard-link" href="mailto:productsupport@usfigureskating.org">
									productsupport@usfigureskating.org
								</a>
							</li>
							<li class="ems-support-contact-list__item">
								<span class="ems-support-contact-list__label ems-support-contact-list__label--phone">Phone:</span>
								<a class="standard-link" href="tel:7196355200">(719) 635 - 5200</a>
							</li>
						</ul>
						<p>For after hours support please expect up to 24 hours response time</p>
					</section>
				</div>
			</div>
		</ems-support>
	</div>
</div>