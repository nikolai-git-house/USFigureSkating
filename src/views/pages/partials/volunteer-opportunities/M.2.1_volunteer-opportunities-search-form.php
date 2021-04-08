<div class="volunteer-opportunities-search-form">
    <div class="grid-container">
        <div class="form-row">
            <div class="form-column">
                <div class="form-group">
                    <label class="field-label" for="state">State</label>
                    <select name="state" id="state" class="form-field form-field--reduced-right" v-model="form_data.state">
                        <option selected :value="null">Select State</option>
                        <option v-for="option in state_form_options" :value="option">{{option.label}}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label class="field-label" for="club">Club</label>
            <select name="club" id="club" class="form-field form-field--reduced-right" v-model="form_data.club">
                <option selected :value="null">Select Club</option>
                <option v-for="option in club_form_options" :value="option">{{option.label}}</option>
            </select>
        </div>
        <div class="form-group">
            <label class="field-label" for="competition_name">Event Name</label>
            <input type="text" class="form-field" id="competition_name" name="competition_name" v-model="form_data.event_name">
        </div>
        <div class="form-row">
            <div class="form-column">
                <div class="form-group">
                    <label class="field-label" for="start_date">Start Date</label>
                    <date-input placeholder="mm/dd/yyyy" :class="fieldClass('start_date')" id="start_date" name="start_date" v-model="form_data.start_date" :initial="form_data.start_date"></date-input>
                    <p v-if="fieldMessage('start_date')" class="input-error">*{{fieldMessage('start_date')}}</p>
                </div>
            </div>
            <div class="form-column">
                <div class="form-group">
                    <label class="field-label" for="end_date">End Date</label>
                    <date-input placeholder="mm/dd/yyyy" :class="fieldClass('end_date')" id="end_date" name="end_date" v-model="form_data.end_date" :initial="form_data.end_date"></date-input>
                    <p v-if="fieldMessage('end_date')" class="input-error">*{{fieldMessage('end_date')}}</p>
                </div>
            </div>
        </div>
        <div class="form-actions">
            <div class="form-actions__column form-actions__column--sm">
                <button class="button button--block button--info" :disabled="searching" v-on:click.prevent="clear">
                    Clear
                </button>
            </div>
            <div class="form-actions__column form-actions__column--lg">
                <button v-on:click.prevent="complete" :disabled="searching" class="button button--block">{{searching ? "Searching" : "Search"}}</button>
            </div>
        </div>
        <p v-if="fieldMessage('global')" class="input-error">*{{fieldMessage('global')}}</p>
        <p v-if="search_error" class="input-error">{{search_error}}</p>
    </div>
</div>