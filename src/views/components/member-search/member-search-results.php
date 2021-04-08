<div class="member-search-results">
	<div class="member-search-results__results">
		<div class="grid-container">
			<search-results-header inline-template :edit_handler="$parent.editSearch">
                <?php include( __DIR__ . '/member-search-results-header.php' ); ?>
			</search-results-header>
			<div class="member-search-results__result-list" v-if="active_results.length">
				<div class="member-search-result" v-for="(member_item,index) in active_results">
					<div class="member-search-result__content">
						<div class="member-search-result__info">
							<p class="member-search-result__primary">{{member_item.first_name}} {{member_item.last_name}} - {{member_item.member_number}}</p>
							<p class="member-search-result__secondary">{{member_item.club_name}}</p>
							<p class="member-search-result__secondary">{{member_item.city}}, {{member_item.state_abbreviation}}</p>
						</div>
						<div class="member-search-result__actions">
							<a v-on:click="ineligible_popup_index=index" class="member-result-notice member-result-notice--ineligible" href="#" v-if="member_item.ineligible">
								<span class="member-result-notice__icon">&nbsp;</span>
								<span class="member-result-notice__text">Ineligible to participate</span>
							</a>
							<span v-else-if="memberAlreadySelected(member_item.id)" class="member-result-notice member-result-notice--selected">
								<span class="member-result-notice__icon">&nbsp;</span>
								<span class="member-result-notice__text">Already Selected</span>
							</span>
							<span v-else-if="memberInvalid(member_item)" class="member-result-notice member-result-notice--alert">
								<span class="member-result-notice__icon">&nbsp;</span>
								<span class="member-result-notice__text">{{memberInvalid(member_item)}}</span>
							</span>
							<button v-else class="button button--info button--medium button--block" type="button" v-on:click="selectMember(index,member_item)" :disabled="addButtonDisabled(member_item.id)">Add</button>
						</div>
						<transition name="fade" slot="error" >
							<div v-if="showSelectionError(index)" class="session-feedback  session-feedback--error">
								<button type="button" class="session-feedback__close" v-on:click.prevent.stop="closeEventError" title="Close">
									&times;
								</button>
								<div class="session-feedback__content">
									<div class="session-feedback__text">
										{{selection_error}}
									</div>
								</div>
							</div>
						</transition>
					</div>
					<popup v-if="showIneligiblePopup(index)" v-on:close-popup="closeIneligiblePopup()">
						<span slot="heading-text">
							{{entity_descriptor}} Ineligible
						</span>
						<div slot="content">
							<p class="alert">The person selected is prohibited from participating, in any capacity, in any activity or competition authorized by, organized by U.S. Figure Skating and/or Local Affiliated Organization of U.S. Figure Skating (club).</p>
							<p>{{ineligible_instruction}}</p>
						</div>
					</popup>
				</div>
			</div>
			<div v-else>
				<p>No Results</p>
			</div>
		</div>
	</div>
	<div class="member-search-results__footer" v-if="pagination_available">
		<div class="member-search-results__pagination">
			<search-results-pagination inline-template>
                <?php include( __DIR__ . '/member-search-results-pagination.php' ); ?>
			</search-results-pagination>
		</div>
	</div>
</div>