<div class="select-representation">
	<div class="grid-container">
		<div class="select-representation__content">
			<p class="select-representation__lead">
				Select the organization you will represent at this competition:
			</p>
			<div class="select-representation__form">
				<p class="text--alert" v-if="!user_club && !lts_programs.length">No organizations available.</p>
				<ul class="radio-list" v-if="user_club">
					<li>
						<label for="club_1" class="usfsa-radio">
							<input type="radio" id="club_1" name="representation_type" value="home_club" v-model="representation_type">
							<span class="usfsa-radio__text">{{user_club.name}}</span>
						</label>
					</li>
					<li v-if="lts_programs.length">
						<label for="club_other" class="usfsa-radio">
							<input type="radio" id="club_other" name="representation_type" value="lts_program" v-model="representation_type">
							<span class="usfsa-radio__text">Other Organization</span>
						</label>
					</li>
				</ul>
				<div :class="{'select-representation__other-select':user_club}" v-if="show_sub_organization">
					<ul class="radio-list" :class="{'radio-list--small':user_club}">
						<li v-for="(program,index) in lts_programs">
							<label :for="'org_'+index" class="usfsa-radio" :class="{'usfsa-radio--small':user_club}">
								<input type="radio" :id="'org_'+index" :value="program.value" name="lts_program" v-model="lts_program">
								<span class="usfsa-radio__text">{{program.label}}</span>
							</label>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="competition-registration-takeover__actions">
			<p class="input-error" v-if="save_error">
				{{save_error}}
			</p>
			<button type="button" class="button button--large button--block" :disabled="save_disabled" v-on:click="saveRepresentation">
				{{button_text}}
			</button>
		</div>
	</div>
</div>