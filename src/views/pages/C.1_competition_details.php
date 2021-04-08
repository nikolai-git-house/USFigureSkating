<!--
    @deprecated 2020-01-22

    Replaced with src/views/pages/O.2_view_competition.php

-->
<competition-detail inline-template v-cloak>
	<div class="page page-competition-detail">
		<competition-heading></competition-heading>
		<div class="page__content">
			<div class="panel-link-group">
				<a v-if="is_skater" v-on:click.prevent="openSchedule()" :href="competition.schedule_link" class="panel-link panel-link--simple">
					<div class="panel-link__content">
						<div class="panel-link__text">
							My Schedule
							<p class="panel-link__error" v-if="schedule_error">The schedule has not been posted. Try
								again later.
							</p>
						</div>
					</div>
				</a>
				<a v-if="is_coach" :href="competition.coach_competition_schedule_link" v-on:click.prevent="openCoachCompetitionSchedule()" class="panel-link panel-link--simple">
					<div class="panel-link__content">
						<div class="panel-link__text">
							Competition Schedule (Coach)
							<p class="panel-link__error" v-if="coach_competition_schedule_error">The schedule has not been posted. Try
								again later.
							</p>
						</div>
					</div>
				</a>
				<a v-if="is_coach" :href="competition.coach_schedule_link" v-on:click.prevent="openCoachSchedule()" class="panel-link panel-link--simple">
					<div class="panel-link__content">
						<div class="panel-link__text">
							Coach Schedule
							<p class="panel-link__error" v-if="coach_schedule_error">The schedule has not been posted. Try
								again later.
							</p>
						</div>
					</div>
				</a>
				<a :href="competition.information_link" class="panel-link panel-link--simple">
					<div class="panel-link__content">
						<div class="panel-link__text">
							Competition Information
						</div>
					</div>
				</a>
				<a v-if="is_skater" v-on:click.prevent="openPracticeIce" :href="competition.practice_ice_link" class="panel-link panel-link--simple">
					<div class="panel-link__content">
						<div class="panel-link__text">
							Practice Ice / Schedule
							<p class="panel-link__error" v-if="practice_ice_error">Practice Ice sales have not started
								yet. Try again later.
							</p>
						</div>
					</div>
				</a>
				<a v-if="is_skater" :href="competition.music_and_ppc_link" class="panel-link panel-link--simple">
					<div class="panel-link__content">
						<div class="panel-link__text">
							Music &amp; PPC
						</div>
					</div>
				</a>
				<a v-if="is_skater" :href="competition.my_coaches_link" class="panel-link panel-link--simple">
					<div class="panel-link__content">
						<div class="panel-link__text">
							My Coaches
						</div>
					</div>
				</a>
				<a v-if="is_coach" :href="competition.my_skaters_link" class="panel-link panel-link--simple">
					<div class="panel-link__content">
						<div class="panel-link__text">
							My Skaters
						</div>
					</div>
				</a>
				<a :href="competition.contacts_link" class="panel-link panel-link--simple">
					<div class="panel-link__content">
						<div class="panel-link__text">
							Competition Contacts
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>
</competition-detail>