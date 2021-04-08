<template>
    <page class="competition-documents-page"
          :header="page_header">
        <competition-portal-page-heading v-if="competition_portal_heading_binding"
                                         slot="competition-heading"
                                         v-bind="competition_portal_heading_binding"></competition-portal-page-heading>
        <component-loader v-if="!component_loaded"
                          slot="loader"
                          :container="true"
                          :source="this"
                          error_message="Error loading competition documents."></component-loader>
        <div slot="content"
             class="page__content">
            <competition-documents :documents="documents"
                                   :toggle_method="toggleActionDocument"></competition-documents>
        </div>
    </page>
</template>
<script lang="ts">
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import mixins from 'vue-typed-mixins';
    import {default as CompetitionDocumentsComponent} from '../../components/CompetitionDocuments.vue';
    import {ActionCompetitionDocument, CompetitionDocuments} from '../../contracts/app/CompetitionDocumentsContracts';
    import CompetitionPortalPageMixin from '../_mixins/CompetitionPortalPageMixin';

    const extendedVue = mixins(HasDataDependencies, CompetitionPortalPageMixin);

    // @vue/component
    export default extendedVue.extend({
        components: {
            'competition-documents': CompetitionDocumentsComponent
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies for component to load
                 */
                dependencies: {
                    competition_documents: false
                },
                /**
                 * Title to display for the page in the header block
                 */
                page_title: 'Competition Documents'
            };
        },
        computed: {
            /**
             * The documents to display
             */
            documents: function (): CompetitionDocuments {
                return this.$store.state.competition_portal.competition_documents;
            }
        },
        methods: {
            /**
             * Load data dependencies for component
             */
            loadData: function (): Promise<void> {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('competition_portal/fetchCompetitionDocuments')
                        .then(() => {
                            this.dependencies.competition_documents = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Method used to toggle an Action document in the sub-component
             */
            toggleActionDocument: function (document: ActionCompetitionDocument): Promise<void> {
                return this.$store.dispatch('competition_portal/toggleActionCompetitionDocument', document);
            }
        }
    });
</script>