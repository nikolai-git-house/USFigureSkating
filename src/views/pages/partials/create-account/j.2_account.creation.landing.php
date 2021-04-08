<div class="create-account-landing">
	<div class="create-account-landing__section">
		<div class="create-account-landing__section__content">
			<div class="create-account-landing__section__heading">
				<div class="create-account-landing__section__heading__text">I am a Volunteer</div>
				<button class="icon-button icon-button--info" v-on:click.prevent="launchInfo('volunteer', $event)">
					<span class="sr-only">More Info</span>
				</button>
			</div>
			<button type="button" class="create-account-landing__section__button button button--block" v-on:click.prevent="select('volunteer')">
				Create Account
			</button>
			<popup v-cloak class="popup--info popup--create-account-type popup--create-account-type--volunteer" v-if="volunteer_info_active" v-on:close-popup="closeInfo()">
				<span slot="heading-text">
					Volunteer Details
				</span>
				<div slot="content">
					<p>
						To volunteer at any club or U.S. Figure Sating activity, an account must be created.
					</p>
				</div>
			</popup>
		</div>
	</div>
	<hr class="create-account-landing__divider">
	<div class="create-account-landing__section">
		<div class="create-account-landing__section__content">
			<div class="create-account-landing__section__heading">
				<div class="create-account-landing__section__heading__text">
					I am a Foreign Athlete, Coach, or Official
				</div>
				<button class="icon-button icon-button--info" v-on:click.prevent="launchInfo('foreign', $event)">
					<span class="sr-only">More Info</span>
				</button>
			</div>
			<button type="button" class="create-account-landing__section__button button button--block" v-on:click.prevent="select('foreign')">
				Create Account
			</button>
			<popup v-cloak class="popup--info popup--create-account-type popup--create-account-type--foreign" v-if="foreign_info_active" v-on:close-popup="closeInfo()">
				<span slot="heading-text">
					Foreign Details
				</span>
				<div slot="content">
					<p>
						To compete and/or coach at a sanctioned non-qualifying competition, individuals that belong to
						ISU member countries must create a U.S. Figure Skating account.
					</p>
				</div>
			</popup>
		</div>
	</div>
</div>