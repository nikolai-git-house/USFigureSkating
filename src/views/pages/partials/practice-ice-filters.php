<div class="page-practice-ice__filters practice-ice-filters practice-ice-filters">
    <div class="practice-ice-filter">
			<span class="field-label practice-ice-filter__label">
				View:
			</span>
        <div class="practice-ice-filter__control noswipe">
            <accordion class="accordion--select" v-on:accordion_toggle="accordionToggle" :external_expand_check="view_select_active">
                <span slot="trigger_text">{{active_view_label}}</span>
                <div slot="expand_content" class="">
                    <rink-schedule-view-select inline-template :available_views="available_filters.views" :current_views="active_filters.view" v-on:views_changed="handleViewFilterChange">
                        <div>
                            <ul class="practice-ice-filters__view-list">
                                <li v-for="(filter,index) in available_views" class="practice-ice-filters__view-list__item">
                                    <div class="checkbox">
                                        <label :for="'view-'+index" class="field-label">
                                            <input type="checkbox" :id="'view-'+index" :value="filter.value" v-model="selected_view_filters" class="practice-ice-filters__view-list__input">
                                            {{filter.label}}
                                        </label>
                                    </div>
                                </li>
                            </ul>
                            <p class="input-error" v-if="show_error">* Please select a view
                            </p>
                            <button class="button button--block" v-on:click.prevent="applyViewSelections">
                                Apply
                            </button>
                        </div>
                    </rink-schedule-view-select>
                </div>
            </accordion>
        </div>
    </div>
    <div class="practice-ice-filter form-group">
        <label for="date_filter" class="field-label practice-ice-filter__label">Date:</label>
        <div class="practice-ice-filter__control noswipe">
            <select name="date_filter" @change="reportFilterChange" v-model="active_filters.date" id="date_filter" class="form-field">
                <option v-for="filter in available_filters.dates" :value="filter.value">{{filter.label}}</option>
            </select>
        </div>
    </div>
    <div class="page--practice-ice__download-schedule download-schedule">
        <a class="standard-link noswipe" href="#">Download Schedule</a>
    </div>
</div>