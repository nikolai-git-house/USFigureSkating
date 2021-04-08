<practice-ice-pre-purchase inline-template v-cloak>
    <page class="page--practice-ice-pre-purchase" :header="page_header_override">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="competition-heading"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading practice ice pre-purchase sales."></component-loader>
        <div slot="content"
             class="page__content page__content--no-top-pad">
            <div v-if="is_available">
                <?php include( __DIR__ . '/partials/practice-ice-credits.php' ); ?>
                <practice-ice-footer inline-template
                                     :is_credits_active="true">
                    <?php include( __DIR__ . '/partials/practice-ice-footer.php' ); ?>
                </practice-ice-footer>
            </div>
            <div v-else>
                Pre-Purchase sales are not currently available for this competition.
            </div>
        </div>
    </page>
</practice-ice-pre-purchase>