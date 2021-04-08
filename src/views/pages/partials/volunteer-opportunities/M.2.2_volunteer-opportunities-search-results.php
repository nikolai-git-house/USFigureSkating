<div class="volunteer-opportunities-search-results">
    <div class="search-results">
        <div class="search-results__results">
            <div class="grid-container">
                <search-results-header :active_page_index="active_page_index" :parent_per_page="active_per_page" :search_results="search_results" v-on:change-per-page="updatePerPage" v-on:edit-search="editSearch"></search-results-header>
                <div class="search-results__result-list" v-if="active_results.length">
                    <volunteer-event-tile v-on:request="selectResult(result)" v-for="result in active_results" :key="result.competition_id" :volunteer_event="result"></volunteer-event-tile>
                </div>
                <div v-else>
                    <p>No Results</p>
                </div>
            </div>
        </div>
        <div class="search-results__footer" v-if="pagination_available">
            <div class="search-results__pagination">
                <pagination :paginated_items="paginated_results" :parent_page_index="active_page_index" v-on:page-changed="setActivePage"></pagination>
            </div>
        </div>
    </div>
</div>