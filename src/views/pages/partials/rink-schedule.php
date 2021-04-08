<rink-schedule :active_filters="active_filters" :selections_blocked="selections_blocked" v-cloak inline-template v-for="(rink_schedule,index) in rink_schedules" :rink_schedule="rink_schedule" :skater_schedule="skater_schedule"  :key="index" v-on:lock="lockSwipers()" v-on:unlock="unlockSwipers()" v-on:feedback-change="sessionFeedbackChange">
	<div class="swiper-slide">
		<div class="page-practice-ice__sessions" :style="'padding-bottom:'+session_list_bottom_pad">
			<div class="session-list">
				<standard-session v-for="(session,index) in filtered_sessions" :key="index" v-on:session-click="selectSession(index,session)" :class="sessionClass(session)" :session="session" ref="session_items">
					<div class="session-feedback" :class="'session-feedback--'+session_messages[index].type" v-if="session_messages[index]">
						<div class="session-feedback__content">
							<div class="session-feedback__text">
								{{session_messages[index].message}}
							</div>
						</div>
					</div>
					<secondary-session-selection-action class="noswipe" v-if="showSecondaryAction(index)" v-on:secondary_canceled="handleClosedSecondary()" :secondary_action="secondary_action" :selected_session="selected_session" v-on:reselect="reselectSession()"></secondary-session-selection-action>
				</standard-session>
			</div>
			<div v-if="!filtered_sessions.length" class="page-practice-ice__no-sessions">
				No sessions match your current filters.
			</div>
		</div>
	</div>
</rink-schedule>