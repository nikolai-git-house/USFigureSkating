<template>
    <div class="entity-check-in-comments">
        <div class="entity-check-in-subpage__content-container  entity-check-in-subpage__content-container--pad-lg">
            <div v-if="!component_loaded" class="entity-check-in-subpage__notice">
                <p v-if="load_error" class="text--alert">
                    Error loading comments.
                </p>
                <p v-else-if="!loaded && loading_timeout">
                    Loading...
                </p>
            </div>
            <div v-else class="entity-check-in-comments__content">
                <div class="entity-check-in-subpage__section">
                    <div class="entity-check-in-comments__form">
                        <div class="form-group">
                            <label class="field-label" for="new_comment">Add New Check-In Comment</label>
                            <textarea id="new_comment"
                                      v-model="new_comment"
                                      :disabled="submitting"
                                      class="form-field"
                                      :class="{'has-error':invalid}"
                                      name="new_comment"></textarea>
                            <p v-if="invalid" class="input-error">
                                *This field is required
                            </p>
                        </div>
                        <div class="form-group">
                            <p v-if="submission_error" class="input-error">
                                {{submission_error}}
                            </p>
                            <button ref="add-button"
                                    :disabled="submitting"
                                    class="button button--block button--large"
                                    v-on:click.prevent="submitNewComment">
                                {{submitting?'Adding Comment':'Add'}}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="entity-check-in-subpage__section">
                    <p v-if="!comments.length" class="text--muted">
                        No comments for {{active_entity_name}} yet.
                    </p>
                    <div v-else class="accordion-group accordion-group--up-down">
                        <accordion v-for="comment in comments"
                                   :key="comment.id"
                                   ref="comment-accordions"
                                   class="entity-check-in-comments__accordion">
                            <span slot="trigger_text" class="entity-check-in-comments__accordion__trigger accordion-trigger-raw">
                                <span class="entity-check-in-comments__accordion__trigger__author">{{comment.author}}</span>
                                <span class="entity-check-in-comments__accordion__trigger__datetime text--muted">{{comment.datetime_formatted}}</span>
                            </span>
                            <div slot="expand_content">
                                <p class="entity-check-in-comments__accordion__comment">
                                    {{comment.comment}}
                                </p>
                            </div>
                        </accordion>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {AccordionComponentInterface} from '../../../../components/Accordion.vue';
    import HasDataDependencies from '../../../../mixins/HasDataDependencies';
    import {CheckInEntityComment} from '../../_contracts/CheckInContracts';

    const vueClass = mixins(HasDataDependencies);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies for component
                 */
                dependencies: {
                    comments: false
                },
                /**
                 * Whether the form is invalid
                 */
                invalid: false,
                /**
                 * Comment text for new comment
                 */
                new_comment: '',
                /**
                 * Error resulting from previous submission
                 */
                submission_error: '',
                /**
                 * Whether the form is actively submitting
                 */
                submitting: false
            };
        },
        computed: {
            /**
             * The name of the active check-in entity
             */
            active_entity_name: function (): string {
                return this.$store.getters['checkin/active_entity_name'];
            },
            /**
             * Array of comment accordion component elements
             */
            comment_accordions: function (): AccordionComponentInterface[] {
                const accordions = this.$refs['comment-accordions'] as AccordionComponentInterface[];
                if (accordions) {
                    return accordions;
                }

                return [];
            },
            /**
             * Full list of saved comments
             */
            comments: function (): CheckInEntityComment[] {
                return this.$store.getters['checkin/comments/comments'];
            }
        },
        watch: {
            /**
             * Watch input for change. Clear submission and validation errors
             */
            new_comment: function () {
                this.submission_error = '';
                this.invalid = false;
            }
        },
        methods: {
            /**
             * Load component data, then open the first comment
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('checkin/comments/fetchComments')
                        .then(() => {
                            this.dependencies.comments = true;
                            this.$nextTick(() => {
                                this.openFirstComment();
                            });
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                });
            },
            /**
             * Open first comment in list
             */
            openFirstComment: function () {
                if (this.comment_accordions.length) {
                    const first_comment: AccordionComponentInterface = this.comment_accordions[0];
                    first_comment.open();
                }
            },
            /**
             * Submit the entered comment message as a new comment
             */
            submitNewComment: function () {
                if (this.submitting) {
                    return;
                }
                if (!this.new_comment) {
                    this.invalid = true;

                    return;
                }
                this.submitting = true;
                this.submission_error = '';
                this.$store.dispatch('checkin/comments/submitNewCheckInComment', this.new_comment)
                    .then(() => {
                        this.new_comment = '';
                        this.submitting = false;
                    })
                    .catch((error_msg: string) => {
                        this.submission_error = error_msg;
                        this.submitting = false;
                    });
            }
        }
    });
</script>