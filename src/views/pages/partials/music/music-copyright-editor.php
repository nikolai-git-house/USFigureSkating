<div class="music-copyright-editor">
	<div class="music-copyright-editor__summary" v-if="show_summary">
		<div class="music-copyright-list">
			<music-copyright-item v-for="(copyright, index) in copyrights" :copyright="copyright" :key="copyright.context_id" :is_view_only="is_view_only">
				<div slot="action" class="action-overlay__item">
					<button v-on:click="editCopyright(index)" class="icon-button icon-button--edit icon-button--labeled">
						Edit
					</button>
				</div>
				<div slot="action" class="action-overlay__item">
					<button v-on:click="deleteCopyright(index)" class="icon-button icon-button--delete icon-button--labeled">
						Remove
					</button>
				</div>
			</music-copyright-item>
		</div>
	</div>
	<div class="music-copyright-editor__form" v-else>
		<music-copyright-form inline-template :copyright_count="copyrights.length" :source_copyright="active_copyright" v-on:cancel-edit="cancelEdit" v-on:save-copyright="saveCopyright">
            <?php include __DIR__ . '/music-copyright-form.php'; ?>
		</music-copyright-form>
	</div>
	<div class="music-copyright-editor__add" v-if="show_add">
		<button class="add-button" v-on:click="addCopyright()">Add Another Copyright</button>
	</div>
</div>