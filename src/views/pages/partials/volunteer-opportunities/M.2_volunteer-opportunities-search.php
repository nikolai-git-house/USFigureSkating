<div class="volunteer-opportunities-search">
    <div class="volunteer-opportunities-search__header">
        <div class="grid-container">
            <h2 class="site-overlay__heading">
                Volunteer Opportunities
            </h2>
            <h3 class="site-overlay__subheading">
                {{ subheading_text }}
            </h3>
        </div>
    </div>
    <div class="volunteer-opportunities-search__content">
        <div v-if="show_form" class="volunteer-opportunities-search__search-form">
            <volunteer-opportunities-search-form inline-template v-on:complete="handleSearchSuccess">
                <?php include __DIR__ . "/M.2.1_volunteer-opportunities-search-form.php"; ?>
            </volunteer-opportunities-search-form>
        </div>
        <div v-if="show_results" class="volunteer-opportunities-search__search-results">
            <volunteer-opportunities-search-results inline-template v-on:edit-search="editSearch">
                <?php include __DIR__ . "/M.2.2_volunteer-opportunities-search-results.php"; ?>
            </volunteer-opportunities-search-results>
        </div>
    </div>
</div>