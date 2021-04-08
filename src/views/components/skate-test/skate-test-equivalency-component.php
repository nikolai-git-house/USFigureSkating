<div class="skate-test-equivalency">
	<div class="skate-test-equivalency__section" v-for="(discipline,index) in disciplines" :disabled="disciplineDisabled(discipline.key)" :class="{'skate-test-equivalency__section--disabled':disciplineDisabled(discipline.key)}">
		<div class="skate-test-equivalency__section-header">
			<h6 class="skate-test-equivalency__section-header__name">{{discipline.label}}</h6>
			<div class="skate-test-equivalency__section-header__actions">
				<span class="skate-test-equivalency__section-header__actions__help-text" :disabled="disable_buttons" v-if="index===0">Tap to <span v-if="!discipline_data(discipline.key)">add</span><span v-else>edit</span></span>
				<button class="icon-button icon-button--edit icon-button--lg" v-on:click.prevent="edit(discipline.key)" :disabled="disable_buttons" v-if="discipline_data(discipline.key)">
					<span class="sr-only">Edit</span>
				</button>
				<button class="icon-button icon-button--add icon-button--lg" v-on:click.prevent="add(discipline.key)" :disabled="disable_buttons" v-else>
					<span class="sr-only">Add</span>
				</button>
			</div>
		</div>
		<div class="skate-test-equivalency__selected-test" v-if="showExistingTest(discipline.key)">
			<button class="skate-test-equivalency__selected-test__button icon-button icon-button--delete" v-on:click.prevent="remove(discipline.key)" :disabled="disable_buttons">
				<span class="sr-only">Remove</span>
			</button>
			<span class="skate-test-equivalency__selected-test__name">
				{{discipline_test(discipline.key).label}}
			</span>
		</div>
		<div class="skate-test-equivalency__form" v-if="disciplineActive(discipline.key)">
			<!--@integration:
				see integration guide for autosuggest options on the following component
			-->
			<discipline-form inline-template v-on:cancel="cancelDisciplineForm" v-on:complete="completeDisciplineForm" :existing_data="discipline_data(discipline.key)" :discipline_key="discipline.key">
                <?php include __DIR__ . '/skate-test.discipline-form.php' ?>
			</discipline-form>
		</div>
	</div>
	<div class="skate-test-equivalency__primary-form-actions form-actions">
		<div class="form-actions__column form-actions__column--full">
			<button type="button" class="button button--block" v-on:click.prevent="complete()" :disabled="disable_buttons">
				{{submitting?"Submitting":"Continue"}}
			</button>
		</div>
	</div>
	<p class="input-error">{{external_error}}</p>
</div>