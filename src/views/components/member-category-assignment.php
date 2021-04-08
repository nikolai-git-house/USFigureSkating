<div class="member-category-assignment">
	<div class="member-selection-list">
		<p v-if="event_categories.length<1" class="alert member-selection-list__notice">{{no_item_notice}}</p>
		<div class="member-selection-category" v-for="(event_category, category_index) in event_categories" :key="event_category.id">
			<h2 class="member-selection-category__title">{{event_category.name}}</h2>
			<div class="member-selection-category__content">
				<div class="member-selection-member" v-for="(member, member_index) in event_category.members" :key="member.id">
					<p class="member-selection-member__name member-name">
						<span class="member-name__position" v-if="member_label">
							{{ordinal(member_index)}} {{member_label}}:
						</span>
						<span class="member-name__name">
							{{member.first_name}} {{member.last_name}}
						</span>
						<span class="member-name__status text--alert" v-if="member.ineligible">(Ineligible)</span>
					</p>
					<div class="member-selection-member__cta">
						<div class="member-selection-member__cta-element">
							<button class="button button--medium button--block" :class="changeButtonClass(member)" type="button" :disabled="disable_buttons" v-on:click="editMember(category_index,member,event_category.id)">
								Change
							</button>
						</div>
						<div class="member-selection-member__cta-element member-selection-member__cta-element--centered" v-if="showRemove(member_index, category_index)">
							<button class="icon-button icon-button--delete icon-button--labeled-inline" type="button" v-on:click="removeMember(event_category.id,member)" :disabled="disable_buttons">
								Remove
							</button>
						</div>
					</div>
					<p class="input-error" v-if="memberError(event_category.id,member)">
						{{memberError(event_category.id,member)}}
					</p>
				</div>
				<div class="member-selection-category__cta" v-if="showAddButton(event_category)">
					<button class="member-selection-category__add-coach add-link" type="button" :disabled="disable_buttons" v-on:click="addMember(event_category.id)">
						{{add_button_text}}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>