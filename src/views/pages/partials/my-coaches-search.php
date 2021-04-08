<my-coaches-search inline-template>
	<div class="my-coaches-search">
		<my-coaches-search-form inline-template v-show="show_form" v-on:search-success="handleSearchSuccess">
            <?php include( __DIR__ . '/my-coaches-search-form.php' ); ?>
		</my-coaches-search-form>
		<my-coaches-search-results inline-template v-if=show_results>
            <?php include( __DIR__ . '/my-coaches-search-results.php' ); ?>
		</my-coaches-search-results>
	</div>
</my-coaches-search>
