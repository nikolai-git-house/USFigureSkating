<div class="my-coaches-search-results-header">
    <div class="my-coaches-search-results-header__summary">
        <p class="my-coaches-search-results-header__result-description">
            Viewing <span class="my-coaches-search-results-header__result-span">{{current_spread.start}}-{{current_spread.end}}</span> of <span class="my-coaches-search-results-header__result-count">{{total_count}}</span> items
        </p>
        <a class="my-coaches-search-results-header__edit-link back-link" href="#" v-on:click.prevent="edit_handler">Edit
            Search
        </a>
    </div>
    <div class="my-coaches-search-results-header__per-page">
        <div class="form-group">
            <select v-model="per_page" class="form-field" name="" id="">
                <option v-for="option in per_page_options" :value="option.value">{{option.label}}</option>
            </select>
        </div>
    </div>
</div>