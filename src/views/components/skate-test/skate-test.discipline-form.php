<div class="skate-test-discipline-form">
	<div v-if="!component_loaded">
		<p v-if="load_error" class="text--alert">Error loading form.</p>
		<p v-else-if="!loaded && loading_timeout">Loading form...</p>
	</div>
	<div v-else>
		<div class="form-group">
			<label class="field-label" for="test">
				Test
			</label>
			<select class="form-field" :class="fieldClass('test')" id="test" v-model="form_data.test">
				<option disabled selected :value="null">Select Test</option>
				<option v-for="test_option in test_options" :disabled="test_option.value===null" :value="test_option">
					{{test_option.label}}
				</option>
			</select>
			<p v-if="fieldMessage('test')" class="input-error">*{{fieldMessage('test')}}</p>
		</div>
		<div class="form-group">
			<label for="club" class="field-label">
				Club
			</label>
			<auto-suggest v-if="show_auto_suggest" :initial_value="{label:form_data.club,value:form_data.club_id}" :restricted="club_autosuggest.restrict" :options="clubs" v-on:input="clubChange" :input_attrs="{id:'club',class:[fieldClass('club'),'form-field'],type:'text'}"></auto-suggest>
			<input v-else type="text" class="form-field" :class="fieldClass('club')" id="club" v-model="form_data.club">
			<p v-if="fieldMessage('club')" class="input-error">*{{fieldMessage('club')}}</p>
		</div>
		<div class="form-group">
			<label for="date" class="field-label">
				Date
			</label>
			<date-input id="date" placeholder="mm/dd/yyyy" :class="fieldClass('date')" :initial="form_data.date" v-model="form_data.date"></date-input>
			<p v-if="fieldMessage('date')" class="input-error">*{{fieldMessage('date')}}</p>
		</div>
		<div class="form-actions">
			<div class="form-actions__column form-actions__column--full form-actions__column--notice" v-if="external_error">
				<p class="input-error">
					{{external_error}}
				</p>
			</div>
			<div class="form-actions__column form-actions__column--sm" v-if="allow_cancel">
				<button type="button" class="button button--info button--block" v-on:click.prevent="cancel()">
					Cancel
				</button>
			</div>
			<div class="form-actions__column form-actions__column--lg" :class="allow_cancel?'form-actions__column--lg':'form-actions__column--full'">
				<button type="button" class="button button--block" v-on:click.prevent="complete()" :disabled="submitting">
					{{submitting?"Saving":"Save"}}
				</button>
			</div>
		</div>
	</div>
</div>