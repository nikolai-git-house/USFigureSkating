<!--@integration:
	the back_url property on the following element dictates the URL for the page to access when the user clicks the back
	button and should be the URL for the competition registration index
-->
<competition-registration-overview back_url="/pages/competition-registration" inline-template>
	<div class="page">
		<div class="page__heading">
			<h1 class="page__title">Registration Overview</h1>
		</div>
		<div class="page__content page__content--bleed" v-cloak>
			<div class="grid-container" v-if="!component_loaded">
				<p v-if="load_error" class="text--alert">Error loading competition information.</p>
				<p v-else-if="!loaded && loading_timeout">Loading...</p>
			</div>
			<div v-else class="competition-registration-overview">
				<div class="grid-container">
					<page-alert class="page-alert page-alert--notice page-alert--medium competition-registration-overview__notice">
						<div slot="trigger_text">
							Registration Information
						</div>
						<div slot="expand_content">
							<ul class="page-alert__content__list">
								<li v-for="overview_point in registration_information">
									{{overview_point}}
								</li>
							</ul>
						</div>
					</page-alert>
					<div class="competition-registration-overview__competition-summary">
						<div class="competition-overview-summary">
							<div class="competition-overview-summary__content">
								<div class="competition-overview-summary__image">
									<img :src="competition.icon" :alt="competition.name+' logo'">
								</div>
								<div class="competition-overview-summary__description" v-if="competition">
									<p class="competition-overview-summary__text competition-overview-summary__text--primary">
										{{competition.name}}
									</p>
									<p class="competition-overview-summary__text competition-overview-summary__text--secondary">
										{{competition.start_date}} - {{competition.end_date}}
									</p>
									<p class="competition-overview-summary__text competition-overview-summary__text--secondary">
										{{competition.city}},
										{{competition.state}}
									</p>
									<p class="competition-overview-summary__text competition-overview-summary__text--secondary">
										{{competition.club}}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="competition-registration-overview__prices">
					<tabs class="tabs--justified tabs--reduced">
						<tab name="IJS Prices" trigger_template='<span class="ijs-fix">IJS</span> Prices' :selected="true">
							<div class="competition-registration-overview__prices__tab-body">
								<p class="competition-registration-overview__prices__absent-notice" v-if="prices.ijs.length===0">
									<span class="ijs-fix">IJS</span> events are not offered at this competition.
								</p>
								<table v-else class="competition-prices-table">
									<tr class="competition-prices-table__header">
										<th class="cell cell--label">
											<span class="label-value">Category</span>
										</th>
										<th class="cell cell--price">1st</th>
										<th class="cell cell--price">2nd</th>
										<th class="cell cell--price">3rd</th>
										<th class="cell cell--price-combined">Combined</th>
									</tr>
									<tr v-for="price_row in prices.ijs" class="competition-prices-table__row">
										<td class="cell cell--label">
											<span class="label-value">{{price_row.category}}</span>
										</td>
										<td colspan="4" class="cell cell--notice" v-if="showPriceNotice(price_row)">
											<span class="notice-value">
												<span class="ijs-fix">IJS</span> events are not offered at this competition
											</span>
										</td>
										<td v-if="!showPriceNotice(price_row)" class="cell cell--price">
											{{priceDisplay(price_row.first_price)}}
										</td>
										<td v-if="!showPriceNotice(price_row)" class="cell cell--price">
											{{priceDisplay(price_row.second_price)}}
										</td>
										<td v-if="!showPriceNotice(price_row)" class="cell cell--price">
											{{priceDisplay(price_row.third_price)}}
										</td>
										<td v-if="!showPriceNotice(price_row)" class="cell cell--price-combined">
											{{priceDisplay(price_row.combined_price)}}
										</td>
									</tr>
								</table>
							</div>
						</tab>
						<tab name="6.0 Prices">
							<div class="competition-registration-overview__prices__tab-body">
								<p class="competition-registration-overview__prices__absent-notice" v-if="prices.six_point_zero.length===0">
									6.0 events are not offered at this competition.
								</p>
								<table v-else class="competition-prices-table">
									<tr class="competition-prices-table__header">
										<th class="cell cell--label">
											<span class="label-value">Category</span>
										</th>
										<th class="cell cell--price">1st</th>
										<th class="cell cell--price">2nd</th>
										<th class="cell cell--price">3rd</th>
										<th class="cell cell--price-combined">Combined</th>
									</tr>
									<tr v-for="price_row in prices.six_point_zero" class="competition-prices-table__row">
										<td class="cell cell--label">
											<span class="label-value">{{price_row.category}}</span>
										</td>
										<td colspan="4" class="cell cell--notice" v-if="showPriceNotice(price_row)">
											<span class="notice-value">
												6.0 events are not offered at this competition
											</span>
										</td>
										<td v-if="!showPriceNotice(price_row)" class="cell cell--price">
											{{priceDisplay(price_row.first_price)}}
										</td>
										<td v-if="!showPriceNotice(price_row)" class="cell cell--price">
											{{priceDisplay(price_row.second_price)}}
										</td>
										<td v-if="!showPriceNotice(price_row)" class="cell cell--price">
											{{priceDisplay(price_row.third_price)}}
										</td>
										<td v-if="!showPriceNotice(price_row)" class="cell cell--price-combined">
											{{priceDisplay(price_row.combined_price)}}
										</td>
									</tr>
								</table>
							</div>
						</tab>
					</tabs>
				</div>
				<div class="competition-registration-terms">
					<div class="grid-container">
						<p class="competition-registration-terms__description">
							By clicking the box below and continuing with registration I acknowledge, accept and agree
							to abide by all bylaws, rules, policies, procedures and guidelines as outlined in the
							2018-19 U.S. Figure Skating Rulebook and as listed within the official announcement for the
							sanctioned competition I am registering for. Compliance with all such provisions as updated
							or amended is the responsibility of the participants.
						</p>
						<div class="competition-registration-terms__confirm">
							<label for="terms_confirm" class="usfsa-checkbox">
								<input type="checkbox" id="terms_confirm" v-model="screenData.confirmed">
								<span class="usfsa-checkbox__text">I have read and understand the above overview of the U.S. Figure Skating online registration process.</span>
							</label>
						</div>
						<div class="competition-registration-actions">
							<div class="form-actions">
								<div class="form-actions__column">
									<button v-on:click.prevent="retreat" type="button"  class="button button--info button--block">
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
			</div>
		</div>
	</div>
</competition-registration-overview>