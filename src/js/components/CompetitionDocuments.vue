<template>
    <div class="competition-documents">
        <div class="competition-documents__section">
            <h3 class="competition-documents__section-heading">
                Action Documents
            </h3>
            <p v-if="action_documents.length" class="competition-documents__section-lead">
                Download action items before the deadline and check off items to track your progress.
            </p>
            <ul v-if="action_documents.length" class="competition-documents__list competition-documents__list--action">
                <li v-for="(document,index) in action_documents"
                    :key="document.id"
                    class="competition-documents__list__item">
                    <div class="action-competition-document">
                        <div class="action-competition-document__row">
                            <div class="action-competition-document__column action-competition-document__column--information">
                                <a class="icon-link icon-link--document"
                                   :href="document.url"
                                   target="_blank"
                                   rel="noreferrer noopener">
                                    {{document.name}}
                                </a>
                                <p v-if="document.deadline_formatted" class="action-competition-document__deadline text--muted">
                                    Deadline: {{document.deadline_formatted}}
                                </p>
                            </div>
                            <div class="action-competition-document__column action-competition-document__column--action">
                                <label :for="'action_document'+index"
                                       class="usfsa-status-checkbox"
                                       :disabled="documentIsSubmitting(document)">
                                    <input :id="'action_document'+index"
                                           :disabled="documentIsSubmitting(document)"
                                           type="checkbox"
                                           :checked="document.is_complete"
                                           v-on:click.prevent="toggleDocument(document)">
                                    <span class="usfsa-status-checkbox__check">&nbsp;</span>
                                </label>
                            </div>
                        </div>
                        <p v-if="documentError(document)" class="action-competition-document__error input-error">
                            {{documentError(document)}}
                        </p>
                    </div>
                </li>
            </ul>
            <p v-else class="competition-documents__message text--muted">
                No action documents available
            </p>
        </div>
        <div class="competition-documents__section">
            <h3 class="competition-documents__section-heading">
                Reference Documents
            </h3>
            <ul v-if="reference_documents.length" class="competition-documents__list competition-documents__list--reference">
                <li v-for="document in reference_documents"
                    :key="document.id"
                    class="competition-documents__list__item">
                    <a class="icon-link icon-link--document"
                       :href="document.url"
                       target="_blank"
                       rel="noreferrer noopener">
                        {{document.name}}
                    </a>
                </li>
            </ul>
            <p v-else class="competition-documents__message text--muted">
                No reference documents available
            </p>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {IdIndexedSubmissionStatus} from '../contracts/AppContracts';
    import {
        ActionCompetitionDocument,
        ActionDocumentToggleFunction,
        CompetitionDocument,
        CompetitionDocuments
    } from '../contracts/app/CompetitionDocumentsContracts';

    export default Vue.extend({
        props: {
            /**
             * External document list to use instead of state-based documents
             */
            documents: {
                type: Object as () => CompetitionDocuments,
                required: false
            },
            /**
             * Method to use to toggle document instead of default state method
             */
            toggle_method: {
                type: Function as ActionDocumentToggleFunction,
                required: false
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Status of individual item submissions
                 */
                item_submission_state: <IdIndexedSubmissionStatus>{}
            };
        },
        computed: {
            /**
             * List of action documents
             */
            action_documents: function (): ActionCompetitionDocument[] {
                if (this.documents) {
                    return this.documents.action_documents;
                }

                /**
                 * @deprecated 2020-06-17
                 */
                return this.$store.getters['competitions/active_competition_action_documents'];
            },
            /**
             * List of reference documents
             */
            reference_documents: function (): CompetitionDocument[] {
                if (this.documents) {
                    return this.documents.reference_documents;
                }

                /**
                 * @deprecated 2020-06-17
                 */
                return this.$store.getters['competitions/active_competition_reference_documents'];
            }
        },
        methods: {
            /**
             * The error associated with a document, if there is one
             */
            documentError: function (document: ActionCompetitionDocument): string | null {
                const document_key = document.id.toString();
                if (document_key in this.item_submission_state) {
                    if (this.item_submission_state[document_key].error) {
                        return this.item_submission_state[document_key].error || null;
                    }
                }

                return null;
            },
            /**
             * Whether a document is in the process of submitting
             */
            documentIsSubmitting: function (document: ActionCompetitionDocument) {
                const document_key = document.id.toString();

                return document_key in this.item_submission_state && this.item_submission_state[document_key].submitting === true;
            },
            /**
             * Perform the toggle of an action document
             */
            reportActionDocumentChange(document: ActionCompetitionDocument): Promise<void> {
                if (this.toggle_method) {
                    return this.toggle_method(document);
                }

                return this.$store.dispatch('competitions/toggleCompetitionDocumentCompletion', document);
            },
            /**
             * Toggle whether an action document has been completed
             */
            toggleDocument: function (document: ActionCompetitionDocument) {
                const document_key = document.id.toString();
                this.$set(this.item_submission_state, document_key, {submitting: true});
                this.reportActionDocumentChange(document)
                    .then(() => {
                        this.item_submission_state[document_key].submitting = false;
                    })
                    .catch((error: string) => {
                        this.item_submission_state[document_key].submitting = false;
                        this.item_submission_state[document_key].error = error;
                    });
            }
        }
    });
</script>