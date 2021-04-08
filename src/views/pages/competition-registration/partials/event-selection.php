<div class="event-selection-component">
	<div class="event-selection__selected">
		<div class="grid-container">
			<transition name="fade">
				<div class="event-selection__my-events-status" v-if="element_added||element_removed" :class="{'recent':element_added,'recent--out':element_removed}">
					&nbsp;
				</div>
			</transition>
			<accordion class="accordion--blank accordion--up-down">
				<span slot="trigger_text">
					My Events: ({{my_events_count}})
				</span>
				<div slot="expand_content">
					<div class="event-selection__event-list">
						<event-selection-card v-for="(event,index) in my_events" :event="event" :key="event.id">
							<div class="event-card__actions" slot="actions">
								<button disabled="disabled" v-if="event.is_registered_for" class="button--medium-text button button--block button--medium button--medium--text">
									Registered
								</button>
								<button v-else-if="event.is_selected" :disabled="disable_event_selection" v-on:click.prevent="removeEvent(event,event.id*-1)" class="icon-button--md-text icon-button icon-button--delete icon-button--labeled-inline">
									Remove
								</button>
							</div>
							<div :class="'session-feedback--'+active_event_status" class="session-feedback session-feedback--small" slot="error" v-if="eventMessage(-1 * event.id)">
								<button type="button" class="session-feedback__close" v-if="active_event_status==='error'" v-on:click.prevent.stop="closeEventError" title="Close">
									&times;
								</button>
								<div class="session-feedback__content">
									<div class="session-feedback__text">
										{{eventMessage(-1 * event.id)}}
									</div>
								</div>
							</div>
						</event-selection-card>
					</div>
				</div>
			</accordion>
		</div>
	</div>
	<div class="event-selection__available">
		<div class="grid-container">
			<div class="event-selection__filters form-group">
				<label for="type_filter" class="field-label event-selection__filters__label">
					Available Events:
				</label>
				<div class="event-selection__filters__control">
					<select name="type_filter" v-model="active_type" id="type_filter" class="form-field form-field--reduced-right">
						<option :value="null">All Events</option>
						<option v-for="option in event_type_options" :value="option">
							{{option}}
						</option>
					</select>
				</div>
			</div>
			<div class="event-selection__event-list">
				<event-selection-card v-for="(event,index) in visible_events" :event="event" :key="event.id">
					<div class="event-card__actions" slot="actions">
						<button disabled="disabled" v-if="event.is_registered_for" class="button--medium-text button button--block button--medium button--medium--text">
							Registered
						</button>
						<button v-else-if="event.is_selected" :disabled="disable_event_selection" v-on:click.prevent="removeEvent(event,event.id)" class="icon-button--md-text icon-button icon-button--delete icon-button--labeled-inline">
							Remove
						</button>
						<button v-else :disabled="disable_event_selection" v-on:click.prevent="addEvent(event,event.id)" class="button--medium-text button button--block button--info button--medium button--medium--text">
							Add
						</button>
					</div>
					<transition name="fade" slot="error">
						<div :class="'session-feedback--'+active_event_status" class="session-feedback session-feedback--small" v-if="eventMessage(event.id)">
							<button type="button" class="session-feedback__close" v-if="active_event_status==='error'" v-on:click.prevent.stop="closeEventError" title="Close">
								&times;
							</button>
							<div class="session-feedback__content">
								<div class="session-feedback__text">
									{{eventMessage(event.id)}}
								</div>
							</div>
						</div>
					</transition>
				</event-selection-card>
			</div>
			<div class="event-selection__pagination">
				<pagination v-if="show_pagination" :paginated_items="paginated_events" v-on:page-changed="updateActivePage" ref="pagination" inline-template>
                    <?php include __DIR__ . '/../../../components/pagination.php'; ?>
				</pagination>
			</div>
		</div>
	</div>
</div>