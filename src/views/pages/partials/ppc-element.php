<div class="ppc-element" :class="{'ppc-element--reorder':reorder_active,'ppc-element--disabled':is_disabled}">
	<div class="ppc-element-summary" v-if="!hide_summary">
		<div class="ppc-element-summary__number">
			<span class="ppc-element-summary__value">{{item_number}}</span>
		</div>
		<div class="ppc-element-summary__code">
			<span class="ppc-element-summary__value">
                <span v-if="element.transition_description"
                      class="ppc-element-summary__transition-summary">
                    <span class="ppc-element-summary__transition-summary__code">{{element.short_description}}</span>
                    <span class="ppc-element-summary__transition-summary__summary">
                        ({{element.transition_description}})
                    </span>
                </span>
                <span v-else>
                    {{element.short_description}}
                </span>
            </span>
		</div>
		<div class="ppc-element-summary__actions">
			<div class="ppc-element-summary__reorder" v-if="reorder_active">
				<div class="ppc-element-summary__reorder-item">
					<button class="icon-button icon-button--up" :disabled="is_first" title="Reorder PPC Element Up" v-on:click="reorder()">
						Up
					</button>
				</div>
				<div class="ppc-element-summary__reorder-item">
					<button class="icon-button icon-button--down" :disabled="is_last" title="Reorder PPC Element Down" v-on:click="reorder('down')">
						Down
					</button>
				</div>
			</div>
			<div class="ppc-element-summary__cancel-action" v-else-if="form_active">
				<button class="button button--link" v-on:click="toggleForm(false)">Cancel</button>
			</div>
			<div class="ppc-element-summary__standard-actions" :class="{'ppc-element-summary__standard-actions--read-only':is_view_only}" v-else>
				<button class="icon-button icon-button--info" :disabled="is_disabled" :class="{'icon-button--info--muted':details_active}" v-on:click="toggleDetails()" title="View PPC Element Details">
					View Info
				</button>
				<button class="icon-button icon-button--edit" :disabled="is_disabled" v-if="!is_view_only" title="Edit PPC Element" v-on:click="toggleForm()">
					Edit
				</button>
				<button class="icon-button icon-button--delete" :disabled="is_disabled" v-if="!is_view_only" v-on:click="triggerDelete" title="Delete PPC Element">
					Delete
				</button>
			</div>
		</div>
	</div>
	<div class="ppc-element__detail" v-if="details_active">
		<div class="ppc-element__detail-content">
			<ul class="ppc-element__detail-list label-list">
				<li>
					<span class="label-list__label">Type:</span>
					{{element.type_description}}
				</li>
				<li>
					<span class="label-list__label">Element:</span>
					{{element.element_description}}
				</li>
				<li v-for="(move,index) in element.moves">
					<span class="label-list__label">Move {{index+1}}:</span>
					{{move.name}}
				</li>
			</ul>
		</div>
		<button class="ppc-element__detail-close" v-on:click="toggleDetails(false)">^</button>
	</div>
	<ppc-element-form inline-template v-if="form_active" :class="{'ppc-element__form--add':this.element.is_new}" :ppc_element="element" v-on:element-edited="handleUpdate" v-on:element-canceled="triggerCancel">
        <?php include __DIR__ . "/ppc-element-form.php"; ?>
	</ppc-element-form>
</div>