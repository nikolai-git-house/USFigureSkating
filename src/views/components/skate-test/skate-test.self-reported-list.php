<ul class="skate-test-takeover__self-reported-list">
	<li class="skate-test-takeover__self-reported-list__discipline" v-for="(discipline,index) in self_reported_test_disciplines">
		<ul class="skate-test-takeover__self-reported-list__discipline__list">
			<li class="self-reported-test" v-for="(test,test_index) in discipline.self_reported_tests">
				<div class="self-reported-test__heading">
					<h5 class="self-reported-test__heading__name">
						{{discipline.label}}
					</h5>
					<button v-on:click.prevent="removeTest(discipline,test,[index,test_index])" class="self-reported-test__button icon-button icon-button--delete icon-button--labeled-inline">
						Remove
					</button>
				</div>
				<p class="self-reported-test__test-name">
					{{test.name}}
				</p>
				<p class="input-error" v-if="testError([index,test_index])">
					{{testError([index,test_index])}}
				</p>
			</li>
		</ul>
	</li>
	<li class="self-reported-test" v-if="!self_reported_test_disciplines.length">
		<span class="self-reported-test__no-test-notice">
			No self-reported tests
		</span>
	</li>
</ul>