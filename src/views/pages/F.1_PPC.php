<music-and-ppc inline-template v-cloak>
    <page class="music-ppc"
        :header="page_header">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="competition-heading"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading music and PCC."></component-loader>
        <div slot="content"
             class="page__content page__content--no-top-pad">
            <div class="music-ppc__content">
                <page-alert class="page-alert page-alert--notice music-ppc__deadline-information page-alert--medium" :class="{'page-alert--warning':music_deadline_passed||ppc_deadline_passed}">
                    <div slot="trigger_text">
                        Music &amp; PPC Deadlines
                    </div>
                    <div slot="expand_content">
                        <p>
                            {{music_ppc_deadline_information.description}}
                        </p>
                        <ul class="label-list music-ppc__deadline-list" :class="{'music-ppc__deadline-list--deadline-passed':ppc_deadline_passed}" v-if="music_ppc_deadline_information.ppc">
                            <li>
                                <span class="label-list__label">PPC Deadline: </span>{{music_ppc_deadline_information.ppc.formatted}}
                            </li>
                            <li>
                                <span class="label-list__label">PPC Late Fee: </span>{{music_ppc_deadline_information.ppc.late_fee}}
                            </li>
                        </ul>
                        <ul class="label-list music-ppc__deadline-list" :class="{'music-ppc__deadline-list--deadline-passed':music_deadline_passed}" v-if="music_ppc_deadline_information.music">
                            <li>
                                <span class="label-list__label">Music Deadline: </span>{{music_ppc_deadline_information.music.formatted}}
                            </li>
                            <li>
                                <span class="label-list__label">Music Late Fee: </span>{{music_ppc_deadline_information.music.late_fee}}
                            </li>
                        </ul>
                    </div>
                </page-alert>
                <p v-if="!event_segments.length" class="text--alert">You are not registered for any events in this competition.</p>
                <div v-else class="music-ppc-item" v-for="(event_segment, index) in event_segments" :key="index">
                    <h2 class="music-ppc-item__title">{{event_segment.event_name}}</h2>
                    <h4 class="music-ppc-item__segment">Segment: {{event_segment.segment_name}}</h4>
                    <p class="music-ppc-item__deadline-alert" v-if="deadline_passed_message">{{deadline_passed_message}}</p>
                    <div class="music-ppc-sub-item">
                        <div class="music-ppc-sub-item__data">
                            <div class="music-ppc-sub-item__data-content">
                                <div class="music-ppc-sub-item__status">
                                    <i v-if="event_segment.ppc_required" class="icon-status" :class="'icon-status--'+(event_segment.is_ppc_complete?'yes':'no')">
                                        &nbsp;
                                    </i>
                                </div>
                                <div class="music-ppc-sub-item__description">
                                    <p class="music-ppc-sub-item__name">
                                        PPC
                                    </p>
                                    <p v-if="!event_segment.ppc_required" class="music-ppc-sub-item__information music-ppc-sub-item__information--notice">
                                        Event segment does not require PPC.
                                    </p>
                                    <p v-else-if="event_segment.ppc_last_modified" class="music-ppc-sub-item__information">
                                        Modified: {{event_segment.ppc_last_modified}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-if="event_segment.ppc_required" class="music-ppc-sub-item__cta">
                            <button type="button" class="button button--medium button--info button--block" v-on:click="openPPC(event_segment)">
                                {{ppc_button_text}}
                            </button>
                        </div>
                    </div>
                    <div class="music-ppc-sub-item">
                        <div class="music-ppc-sub-item__data">
                            <div class="music-ppc-sub-item__data-content">
                                <div class="music-ppc-sub-item__status">
                                    <i v-if="event_segment.music_required" class="icon-status" :class="'icon-status--'+(event_segment.is_music_complete?'yes':'no')">
                                        &nbsp;
                                    </i>
                                </div>
                                <div class="music-ppc-sub-item__description">
                                    <p class="music-ppc-sub-item__name">
                                        Music
                                    </p>
                                    <p v-if="!event_segment.music_required" class="music-ppc-sub-item__information music-ppc-sub-item__information--notice">
                                        Event segment does not require Music.
                                    </p>
                                    <p v-else-if="event_segment.music_last_modified" class="music-ppc-sub-item__information">
                                        Modified: {{event_segment.music_last_modified}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-if="event_segment.music_required" class="music-ppc-sub-item__cta">
                            <button type="button" class="button button--medium button--info button--block" v-on:click="openMusic(event_segment)">
                                {{music_button_text}}
                            </button>
                        </div>
                    </div>
                    <!--@downstream-sync 2020-07-02 - import rhythm/theme feature-->
                    <div class="music-ppc-sub-item" v-if="event_segment.rhythm_required">
                        <div class="music-ppc-sub-item__data">
                            <div class="music-ppc-sub-item__data-content">
                                <div class="music-ppc-sub-item__status">
                                    <i class="icon-status" :class="'icon-status--'+(event_segment.is_rhythm_complete?'yes':'no')">
                                        &nbsp;
                                    </i>
                                </div>
                                <div class="music-ppc-sub-item__description">
                                    <p class="music-ppc-sub-item__name">
                                        Rhythm
                                    </p>
                                    <p class="music-ppc-sub-item__information">
                                        {{event_segment.rhythms.filter(f => f.length > 0).join(", ")}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-if="event_segment.music_required && !music_deadline_passed" class="music-ppc-sub-item__cta">
                            <button type="button" class="button button--medium button--info button--block" v-on:click="openRhythm(event_segment)">
                                Edit Rhythms
                            </button>
                        </div>
                    </div>
                    <!--@downstream-sync 2020-07-02 - import rhythm/theme feature-->
                    <div class="music-ppc-sub-item" v-if="event_segment.theme_required">
                        <div class="music-ppc-sub-item__data">
                            <div class="music-ppc-sub-item__data-content">
                                <div class="music-ppc-sub-item__status">
                                    <i class="icon-status" :class="'icon-status--'+(event_segment.is_theme_complete?'yes':'no')">
                                        &nbsp;
                                    </i>
                                </div>
                                <div class="music-ppc-sub-item__description">
                                    <p class="music-ppc-sub-item__name">
                                        Theme
                                    </p>
                                    <p class="music-ppc-sub-item__information">
                                        {{event_segment.theme}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-if="event_segment.music_required && !music_deadline_passed" class="music-ppc-sub-item__cta">
                            <button type="button" class="button button--medium button--info button--block" v-on:click="openTheme(event_segment)">
                                Edit Theme
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <site-overlay :open_fn="overlayActive" v-on:close-overlay="closeOverlay()" class="site-overlay--music-ppc">
            <div v-if="ppc_active">
                <!-- @integration - to facilitate development, both environment imports are below.
                    @{ await Html.RenderPartialAsync("_PPCEditor"); }
                -->
                <?php include __DIR__ . "/partials/ppc-editor.php"; ?>
            </div>
            <div v-if="music_active">
                <!-- @integration - to facilitate development, both environment imports are below.
                    @{ await Html.RenderPartialAsync("_MusicEditor"); }
               -->
                <?php include __DIR__ . "/partials/music-editor.php"; ?>
            </div>
            <!--@downstream-sync 2020-07-02 - import rhythm/theme feature-->
            <div v-if="rhythm_active">
                <!-- @integration - to facilitate development, both environment imports are below.
                    @{ await Html.RenderPartialAsync("_RhythmEditor"); }
                -->
                <?php include __DIR__ . "/partials/rhythm-editor.php"; ?>
            </div>
            <!--@downstream-sync 2020-07-02 - import rhythm/theme feature-->
            <div v-if="theme_active">
                <!-- @integration - to facilitate development, both environment imports are below.
                    @{ await Html.RenderPartialAsync("_ThemeEditor"); }
                -->
                <?php include __DIR__ . "/partials/theme-editor.php"; ?>
            </div>
        </site-overlay>
        <popup class="popup--notice popup--active-edits" v-if="show_component_close_confirm" v-on:close-popup="unsavedAlertClose()" :math_center="true">
            <span slot="heading-text">
                Unsaved changes
            </span>
            <div slot="content">
                <p>{{unsaved_alert.description}}</p>
                <div class="popup__cta">
                    <div class="popup__cta-item popup__cta-item--full">
                        <button class="button button--block" :disabled="saving_component" v-on:click="unsaved_alert.button_1.action">
                            {{unsaved_alert.button_1.text}}
                        </button>
                    </div>
                    <div class="popup__cta-item popup__cta-item--full">
                        <button class="button button--block button--info" :disabled="saving_component" v-on:click="exitWithoutSave">
                            Exit Without Saving
                        </button>
                    </div>
                </div>
                <div v-show="component_save_error" class="popup__error">Error saving.</div>
            </div>
        </popup>
    </page>
</music-and-ppc>