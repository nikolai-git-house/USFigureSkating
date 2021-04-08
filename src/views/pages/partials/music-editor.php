<music-editor ref="music_editor" inline-template v-on:music-complete="handleMusicComplete" v-on:close-music="reset" :event_segment="active_event_segment" :competition_id="competition.id" :is_view_only="music_deadline_passed">
	<div class="music-ppc-editor">
		<div class="music-ppc-editor__heading">
			<h2 class="music-ppc-editor__heading__component-name">
				Music
			</h2>
			<h3 class="music-ppc-editor__heading__event-name">{{event_segment.event_name}}
				<small class="music-ppc-editor__heading__segment-name">{{event_segment.segment_name}}</small>
			</h3>
		</div>

		<section class="music-ppc-editor__content">
			<div class="grid-container" v-if="deadline_passed_message">
				<p class="music__deadline-alert">{{deadline_passed_message}}</p>
			</div>
			<div class="grid-container" v-if="show_notice">
				<p :class="{'alert':load_error}">{{notice}}</p>
			</div>

			<div class="music" v-else-if="data_loaded">
				<popup class="popup--music-remove popup--notice" v-if="confirm_remove" :math_center="true" v-on:close-popup="closeConfirmRemove">
					<span slot="heading-text">
						Remove Music?
					</span>
					<div slot="content" class="">
						<p>Are you sure you want to remove the music from your program?</p>
						<div class="popup__cta">
							<div class="popup__cta-item">
								<button class="button button--block button--info" v-on:click="closeConfirmRemove">
									Cancel
								</button>
							</div>
							<div class="popup__cta-item">
								<button class="button button--block" v-on:click="removeMusic">
									Remove
								</button>
							</div>
						</div>
					</div>
				</popup>
				<div class="music__launchpoint" v-if="launch_point_active">
					<page-alert class="music-notice page-alert--bleed page-alert--notice" v-if="!is_view_only">
						<div slot="trigger_text">
							Music File Requirements
						</div>
						<div slot="expand_content" class="music-notice__content">
							<ul class="label-list">
								<li>
									<span class="label-list__label">Maximum play length:</span>
									5 minutes
								</li>
								<li>
									<span class="label-list__label">File format:</span>
									mp3
								</li>
								<li>
									<span class="label-list__label">Maximum file size:</span>
									12mb
								</li>
								<li>
									<span class="label-list__label">Proper bit rate:</span>
									128–320 kbps
								</li>
								<li>
									<span class="label-list__label">Valid audio channels:</span>
									stereo, joint stereo, dual channel mono (Single Channel Mono is not)
								</li>
								<li>
									<span class="label-list__label">Trailers/Dead air:</span>
									2 seconds maximum at beginning or end of music
								</li>
								<li>
									<span class="label-list__label">Copyright information:</span>
									required for each piece of music used in your program.
								</li>
							</ul>
							<!-- @integration - this link needs a target -->
							<a href="#" class="standard-link">Music Upload - File Conversion</a>
						</div>
					</page-alert>
					<div class="music-ppc-editor__container" v-if="!is_view_only">
						<div class="music__path-selection">
                            <?php include __DIR__ . '/../partials/music/music-path-selection.php'; ?>
						</div>
					</div>
				</div>
				<div class="music__editor" v-else>
					<div class="music-ppc-editor__container">
						<div class="music-editor-step music-editor-step--music">
							<div class="music-editor-step__summary music-editor-step-summary">
								<div class="music-editor-step-summary__number">
									<span class="music-editor-step-summary__value">1</span>
								</div>
								<div class="music-editor-step-summary__name">
									<span class="music-editor-step-summary__value">{{step_one_name}}</span>
								</div>
								<div class="music-editor-step-summary__actions" v-if="show_music_actions">
									<button v-on:click="show_music_action_items=!show_music_action_items" class="icon-button" :class="show_music_action_items?'icon-button--close':'icon-button--more'">
										Toggle
									</button>
								</div>
							</div>
							<div class="music-editor-step__content">
								<div v-if="show_music_action_items" class="music-editor-step__overlay">
									<div class="action-overlay">
										<div class="action-overlay__item">
											<button v-on:click="openSongEdit()" class="icon-button icon-button--edit icon-button--labeled">
												Edit
											</button>
										</div>
										<div class="action-overlay__item">
											<button v-on:click="confirmRemoveMusic()" class="icon-button icon-button--delete icon-button--labeled">
												Remove
											</button>
										</div>
									</div>
								</div>
								<div v-if="library_active">
									<music-library inline-template v-on:upload-new-file="selectFile" v-on:library-song-selected="handleLibrarySelect">
                                        <?php include __DIR__ . "/../partials/music/music-library.php"; ?>
									</music-library>
								</div>
								<music-song-editor ref="song_editor" v-else inline-template :editor_active="song_editor_active" :is_initial_upload="is_initial_upload" v-on:close-editor="handleCloseSongEditor()" v-on:return-to-library="openLibrary()" v-on:select-new-file="selectFile()" v-on:cancel-upload-path="cancelUploadPath">
                                    <?php include __DIR__ . '/../partials/music/music-song-editor.php'; ?>
								</music-song-editor>
							</div>
						</div>
						<div class="music-editor-step music-editor-step--copyright" :class="{'music-editor-step--disabled':copyright_disabled}">
							<div class="music-editor-step__summary music-editor-step-summary music-editor-step-summary--no-actions">
								<div class="music-editor-step-summary__number">
									<span class="music-editor-step-summary__value">2</span>
								</div>
								<div class="music-editor-step-summary__name">
									<span class="music-editor-step-summary__value">Copyright</span>
									<button class="music-editor-step-summary__info icon-button icon-button--info" :disabled="copyright_disabled" :class="{'icon-button--info--muted':show_copyright_information}" v-on:click="toggleCopyrightInformation()">More Info</button>
								</div>
							</div>
							<div class="music-editor-step__content" v-if="!copyright_disabled">
								<div v-if="show_copyright_information" class="music-editor-step__additional-info">
									<p>For copyright and publicity purposes, U.S. Figure Skating gathers information on
										any music that may be used in a television broadcast or video-on-demand
										broadcast (i.e. IceNetwork)
									</p>
									<p>Program music is generally created using multiple pieces of music. You are
										required to enter copyright information for each piece used in each music
										upload. For assistance in gathering the copyright information,
										<!--@integration: this link needs a target-->
										<a class="standard-link" href="#">click here</a>.
									</p>
									<button class="tray-close" v-on:click="toggleCopyrightInformation(false)">Close</button>
								</div>
								<music-copyright-editor inline-template v-on:copyright-editor-active="handleCopyrightFormToggle" :is_view_only="is_view_only">
                                    <?php include __DIR__ . '/../partials/music/music-copyright-editor.php'; ?>
								</music-copyright-editor>
							</div>
						</div>
						<div class="music__submit">
							<button class="button button--block" :disabled="save_disabled" v-on:click="confirm_button_action">
								{{save_button_text}}
							</button>
							<p class="input-error" v-if="save_error">Error saving Music.</p>
						</div>
					</div>
				</div>
			</div>
			<form ref="input_form" action="" style="display:none;">
				<!-- @integration - if you want to limit file browser file types, add:
						accept="audio/mpeg" to the input below
						or provide your own set of memetypes
				-->
				<input type="file" ref="file_input" v-on:change="fileSelected">
			</form>
		</section>
	</div>
</music-editor>