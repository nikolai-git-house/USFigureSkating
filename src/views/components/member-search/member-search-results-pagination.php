<div class="pagination">
	<a class="pagination__nav pagination__nav--previous" v-on:click.prevent="setActivePage(active_page_index-1)" href="#" :disabled="previous_disabled">
		Previous page
	</a>
	<ul class="pagination__list">
		<li class="pagination__list-item" v-for="option in pagination_options" :class="{'pagination__list-item--ellipses':option.page_index===false}">
			<a class="pagination__list-link" v-if="option.page_index!==false" :class="{'pagination__list-link--active':option.page_index===active_page_index}" href="#" v-on:click.prevent="setActivePage(option.page_index)">
				{{option.page_number}}
			</a>
			<div class="pagination__ellipses" v-else>
				<span class="pagination__ellipsis">.</span><span class="pagination__ellipsis">.</span><span class="pagination__ellipsis">.</span>
			</div>
		</li>
	</ul>
	<a class="pagination__nav pagination__nav--next" v-on:click.prevent="setActivePage(active_page_index+1)" href="#" :disabled="next_disabled">
		Next page
	</a>
</div>