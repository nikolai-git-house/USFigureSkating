<!--@downstream-sync 2020-07-02 - import rhythm/theme feature
    the following file has been imported without modifications from the USFS repository master branch
-->
<rhythm-editor ref="rhythm_editor" inline-template v-on:rhythm-complete="handleRhythmComplete" v-on:close-rhythm="reset" :event_segment="active_event_segment" :competition_id="competition.id" :is_view_only="music_deadline_passed">
    <div class="music-ppc-editor">
        <div class="music-ppc-editor__heading">
            <h2 class="music-ppc-editor__heading__component-name">
                Rhythms
            </h2>
            <h3 class="music-ppc-editor__heading__event-name">
                {{event_segment.event_name}}
                <small class="music-ppc-editor__heading__segment-name">{{event_segment.segment_name}}</small>
            </h3>
        </div>
        <section class="music-ppc-editor__content">
            <div class="music-ppc-editor__container">
                <p :class="{'alert':load_error}" v-if="show_notice">{{notice}}</p>
                <div class="" v-else-if="data_loaded">
                    <div class="rhythms">
                        <div class="rhythm-editor">
                            <div class="rhythm-editor__form">
                                <div class="rhythm-editor-form">
                                    <div class="form-group">
                                        <label for="rhythm-1" class="form-label">Rhythm 1</label>
                                        <input id="rhythm-1" type="text" v-model="rhythms[0]" class="form-field" />
                                    </div>
                                    <div class="form-group">
                                        <label for="rhythm-2" class="form-label">Rhythm 2</label>
                                        <input id="rhythm-2" type="text" v-model="rhythms[1]" class="form-field" />
                                    </div>
                                    <div class="form-group">
                                        <label for="rhythm-3" class="form-label">Rhythm 3</label>
                                        <input id="rhythm-3" type="text" v-model="rhythms[2]" class="form-field" />
                                    </div>
                                    <div class="rhythm-editor-form__cta">
                                        <div class="rhythm-editor-form__cta-element">
                                            <button v-on:click="confirm_button_action" :disabled="save_disabled" class="button button--block">Save</button>
                                        </div>
                                        <p class="input-error" v-if="save_error">Error saving Rhythms.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</rhythm-editor>
