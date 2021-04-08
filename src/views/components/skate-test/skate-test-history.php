<div class="skate-test-history">
	<div class="skate-test-history__section" v-for="(discipline,index) in disciplines">
		<div class="skate-test-history__section-header">
			<h6 class="skate-test-history__section-header__name">{{discipline.label}}</h6>
			<div class="skate-test-history__section-header__actions">
				<span class="skate-test-history__section-header__actions__help-text" :disabled="disableDisciplineActions(discipline)" v-if="index===0">Tap to add</span>
				<button class="icon-button icon-button--add icon-button--lg" :disabled="disableDisciplineActions(discipline)" v-on:click.prevent="addTest(discipline)">
					<span class="sr-only">Add</span>
				</button>
			</div>
		</div>
		<div v-for="(skate_test,test_index) in discipline.key_test">
			<div class="skate-test-history__existing-test">
				<button v-on:click.prevent="removeTest(discipline, skate_test,[index,test_index])" class="skate-test-history__existing-test__button icon-button icon-button--delete" :style="{visibility:skate_test.is_self_reported?'visible':'hidden'}" :disabled="!skate_test.is_self_reported">
					<span class="sr-only">Remove</span>
				</button>
				<span class="skate-test-history__existing-test__name">
               		{{skate_test.name}}
           		</span>
			</div>
			<p class="input-error" v-if="testError([index,test_index])">{{testError([index,test_index])}}</p>
		</div>
	</div>
</div>