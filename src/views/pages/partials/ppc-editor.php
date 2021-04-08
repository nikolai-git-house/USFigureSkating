<ppc-editor ref="ppc_editor" inline-template v-on:ppc-complete="handlePPCComplete" v-on:close-ppc="reset" :event_segment="active_event_segment" :competition_id="competition.id" :is_view_only="ppc_deadline_passed">
	<div class="music-ppc-editor">
		<div class="music-ppc-editor__heading">
			<h2 class="music-ppc-editor__heading__component-name">
				Planned Program Content
			</h2>
			<h3 class="music-ppc-editor__heading__event-name">{{event_segment.event_name}}
				<small class="music-ppc-editor__heading__segment-name">{{event_segment.segment_name}}</small>
			</h3>
		</div>
		<section class="music-ppc-editor__content">
			<div class="music-ppc-editor__container">
				<p :class="{'alert':load_error}" v-if="show_notice">{{notice}}</p>
				<div class="ppc" v-else-if="data_loaded">
					<p class="ppc__deadline-alert" v-if="deadline_passed_message">{{deadline_passed_message}}</p>
					<div class="ppc__reorder" v-if="!reorder_hidden">
						<div class="ppc__reorder__restore">
							<button class="button button--link button--restore" v-on:click="restoreCachedOrder()" v-if="reorder_active" :disabled="restore_disabled">
								Restore
							</button>
						</div>
						<div class="ppc__reorder__controls">
							<div class="ppc-reorder-controls" :class="{'ppc-reorder-controls--disabled':reorder_disabled}">
								<span class="ppc-reorder-controls__label">
									{{reorder_toggle_label}}
								</span>
								<div class="ppc-reorder-controls__toggle toggle" :disabled="reorder_disabled">
									<input type="checkbox" id="reorder-toggle" :disabled="reorder_disabled" class="toggle__input" v-model="reorder_active">
									<label for="reorder-toggle" class="toggle__user-input"></label>
								</div>
							</div>
						</div>
					</div>
					<div class="ppc__elements">
						<ppc-element ref="element_items" v-for="element,index in ppc.elements" inline-template v-if="showElement(index)" :reorder_active="reorder_active" :element="element" :key="element.id" :is_first="index===0" :is_last="index== ppc.length - 1" :item_number="index+1" :is_disabled="elementIsDisabled(element.id)" :is_view_only="is_view_only" v-on:delete-element="handleDelete(index)" v-on:form-toggle="setEditActive($event,element.id)" v-on:reorder-element="handleReorder($event,index)" v-on:element-canceled="handleCancel(index)">
                            <?php include __DIR__ . "/ppc-element.php"; ?>
						</ppc-element>
						<div class="ppc-element ppc__add-element" v-if="show_add_element">
							<button :disabled="add_element_disabled" class="add-button" v-on:click="addElement()">
								Add Elements
							</button>
						</div>
						<button v-on:click="confirm_button_action" v-if="!confirm_hidden" :disabled="confirm_disabled" class="ppc__save-button button button--block">
							{{confirm_button_text}}
						</button>
						<p class="input-error" v-if="save_error">Error saving PPC.</p>
					</div>
				</div>
			</div>
		</section>
	</div>
</ppc-editor>