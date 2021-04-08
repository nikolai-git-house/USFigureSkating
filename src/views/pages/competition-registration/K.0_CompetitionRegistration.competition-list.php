<div class="page page--no-pad-bottom page-competition-registration-index">
	<div class="page__heading">
		<h1 class="page__title">Competition Registration</h1>
	</div>
	<div class="page__content page__content--bleed">
		<competition-registration-index inline-template v-cloak>
			<div class="competition-registration-index">
				<div class="grid-container" v-if="!component_loaded">
					<p v-if="load_error" class="text--alert">Error loading competitions.</p>
					<p v-else-if="!loaded && loading_timeout">Loading...</p>
				</div>
				<div v-else>
					<div class="competition-registration-index__tabs">
						<div class="tabs tabs--justified tabs--reduced">
							<div class="tabs__triggers">
								<ul class="tabs__list">
									<li class="tabs__item">
										<a href="#" v-on:click.prevent="selectActiveType('qualifying')" class="tabs__trigger" :class="{'active':active_type==='qualifying'}">
											Qualifying
										</a>
									</li>
									<li class="tabs__item">
										<a href="#" v-on:click.prevent="selectActiveType('non_qualifying')" class="tabs__trigger" :class="{'active':active_type==='non_qualifying'}">
											Nonqualifying
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div class="competition-registration-index__content page__section page__section--accent">
						<div class="grid-container">
							<div class="competition-registration-index__search" v-if="show_search">
								<competition-search inline-template v-model="search_criteria" :state_options="available_state_filters" ref="search">
                                    <?php include __DIR__ . '/partials/competition-search.php'; ?>
								</competition-search>
							</div>
							<div v-if="no_active_configured_competitions">
								<p>
									For questions regarding {{active_type.replace('_','')}} events, contact
									events@usfigureskating.org.
								</p>
								<p class="alert">
									There are no {{active_type.replace('_','')}} competitions setup and currently
									accepting entries. Check back again.
								</p>
							</div>
							<div v-else class="competition-registration-index__competition-list">
								<p class="alert competition-registration-index__competition-list__no-results" v-if="visible_competitions.length===0">
									No competitions match your filters.
								</p>
								<competition-tile :class="{'competition-tile--with-banners':hasBanner(competition)}" v-for="(competition, index) in visible_competitions" :competition="competition" :key="competition.id">
									<div slot="banners" class="competition-tile__banners" v-if="hasBanner(competition)">
										<div class="competition-tile-banner competition-tile-banner--registered" v-if="isRegistered(competition)">
											Registered
										</div>
									</div>
									<!--
										@deprecated 2019-12-30
									-->
									<div slot="drawer" class="competition-tile__drawer">
										<div class="competition-tile__cta">
											<button v-on:click.prevent="beginRegistration(competition)" class="button button--block" :disabled="isFuture(competition)" :class="buttonClass(competition)">
												{{buttonText(competition)}}
											</button>
										</div>
										<p class="competition-tile__text competition-tile__text--secondary" :class="{'competition-tile__text--alert':hasDeadlineWarning(competition)}">
											Registration deadline: {{competition.registration_deadline}}
										</p>
									</div>
									<!-- end @deprecated-->

									<!--  @integration -
										if desired, the following component can be used instead of the unique markup above.
										If used, methods marked "@deprecated" in src/js/pages/CompetitionRegistration/CompetitionRegistrationIndex.vue
										can be removed

									<competition-registration-cta
										slot="drawer"
										:competition="competition"
										class="competition-tile__drawer">
									</competition-registration-cta>
									-->
								</competition-tile>
							</div>
						</div>
						<div class="competition-registration-index__footer" v-if="show_pagination">
							<div class="grid-container">
								<pagination :paginated_items="paginated_competitions" v-on:page-changed="handleActivePageChange" ref="pagination" inline-template>
                                    <?php include __DIR__ . '/../../components/pagination.php'; ?>
								</pagination>
							</div>
						</div>
					</div>
				</div>
			</div>
		</competition-registration-index>
	</div>
</div>