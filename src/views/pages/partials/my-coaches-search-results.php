<div class="my-coaches-search-results">
	<div class="my-coaches-search-results__header grid-container">
		<h2 class="my-coaches-search__heading">Coach Search Results</h2>
	</div>
	<div class="my-coaches-search-results__results">
		<div class="grid-container">
			<search-results-header inline-template :edit_handler="$parent.editSearch">
                <?php include( __DIR__ . '/my-coaches-search-results-header.php' ); ?>
			</search-results-header>
			<div class="my-coaches-search-results__result-list" v-if="active_results.length">
				<div class="my-coaches-search-result" v-for="(coach_item,index) in active_results">
					<div class="my-coaches-search-result__content">
						<div class="my-coaches-search-result__info">
							<p class="my-coaches-search-result__number">{{coach_item.member_number}}</p>
							<p class="my-coaches-search-result__name-state">{{coach_item.first_name}} {{coach_item.last_name}} | {{coach_item.state_abbreviation}}</p>
							<p class="my-coaches-search-result__club">{{coach_item.club_name}}</p>
						</div>
						<div class="my-coaches-search-result__actions">
							<a v-on:click="ineligible_popup_index=index" class="coach-result-notice coach-result-notice--ineligible" href="#" v-if="coach_item.ineligible">
								<span class="coach-result-notice__icon">&nbsp;</span>
								<span class="coach-result-notice__text">Ineligible</span>
							</a>
							<span v-else-if="coachAlreadySelected(coach_item.id)" class="coach-result-notice coach-result-notice--selected">
								<span class="coach-result-notice__icon">&nbsp;</span>
								<span class="coach-result-notice__text">Already Selected</span>
							</span>
							<button v-else class="button button--info button--block" type="button" v-on:click="selectCoach(index,coach_item)" :disabled="addButtonDisabled(coach_item.id)">Add</button>
							<p class="input-error" v-if="showSelectionError(index)">{{selection_error}}</p>
						</div>
					</div>
					<popup v-if="showIneligiblePopup(index)" v-on:close-popup="closeIneligiblePopup()">
						<span slot="heading-text">
							Coach Ineligible
						</span>
						<div slot="content">
							<p class="alert">The person selected is prohibited from participating, in any capacity, in any activity or competition authorized by, organized by U.S. Figure Skating and/or Local Affiliated Organization of U.S. Figure Skating (club).</p>
							<p>Please choose another coach or leave blank</p>
						</div>
					</popup>
				</div>
			</div>
			<div v-else>
				<p>No Results</p>
			</div>
		</div>
	</div>
	<div class="my-coaches-search-results__footer" v-if="pagination_available">
		<div class="my-coaches-search-results__pagination">
			<search-results-pagination inline-template>
                <?php include( __DIR__ . '/my-coaches-search-results-pagination.php' ); ?>
			</search-results-pagination>
		</div>
	</div>
</div>

