<div class="page page-my-competitions">
	<div class="page__heading">
		<h1 class="page__title">My Competitions</h1>
	</div>
    <div class="page__content">
		<competition-list v-cloak inline-template>
			<div v-if="competitions.length" class="panel-link-group">
				<a :href="competition.detail_link" v-for="competition in competitions" :key="competition.id" class="panel-link">
					<div class="panel-link__content">
						<div class="competition-summary">
							<div class="competition-summary__icon">
								<img :src="competition.icon" :alt="'Competition Icon for '+competition.name">
							</div>
							<div class="competition-summary__details">
								<p class="competition-summary__details-primary">{{competition.name}}</p>
								<p class="competition-summary__details-secondary">
									Dates: {{competition.start_date_pretty}} - {{competition.end_date_pretty}}
								</p>
							</div>
						</div>
					</div>
				</a>
			</div>
			<div v-else-if="!loaded">Loading...</div>
			<div v-else>
				<p>You are not registered for any competitions at this time.</p>
				<a href="#" class="standard-link" target="_blank" rel="noopener">Register on EMS Desktop Site</a>
			</div>
		</competition-list>
    </div>
</div>