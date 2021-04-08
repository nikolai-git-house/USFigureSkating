<!--@downstream-sync 2020-07-02 - import rhythm/theme feature
    the following file has been imported without modifications from the USFS repository master branch
-->
<theme-editor ref="theme_editor" inline-template v-on:theme-complete="handleThemeComplete" v-on:close-theme="reset" :event_segment="active_event_segment" :competition_id="competition.id" :is_view_only="music_deadline_passed">
    <div class="music-ppc-editor">
        <div class="music-ppc-editor__heading">
            <h2 class="music-ppc-editor__heading__component-name">
                Theme
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
                    <div class="theme">
                        <div class="theme-editor">
                            <div class="theme-editor__form">
                                <div class="theme-editor-form">
                                    <div class="form-group">
                                        <input id="theme" type="text" v-model="theme" class="form-field" />
                                    </div>
                                    <div class="theme-editor-form__cta">
                                        <div class="theme-editor-form__cta-element">
                                            <button v-on:click="confirm_button_action" :disabled="save_disabled" class="button button--block">Save</button>
                                        </div>
                                        <p class="input-error" v-if="save_error">Error saving Theme.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</theme-editor>
