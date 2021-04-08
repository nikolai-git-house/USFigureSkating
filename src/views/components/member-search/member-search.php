<member-search inline-template>
	<div class="member-search">
		<member-search-form inline-template v-show="show_form" v-on:search-success="handleSearchSuccess">
            <?php include( __DIR__ . '/member-search-form.php' ); ?>
		</member-search-form>
		<member-search-results inline-template v-if=show_results>
            <?php include( __DIR__ . '/member-search-results.php' ); ?>
		</member-search-results>
	</div>
</member-search>