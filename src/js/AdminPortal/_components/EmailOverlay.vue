<template>
    <div class="email-overlay" :class="{'email-overlay--accent':index_active}">
        <div class="email-overlay__sticky-header">
            <div class="site-overlay__header">
                <div class="site-overlay__close">
                    <button type="button"
                            class="site-overlay__close-button active"
                            v-on:click.prevent="handleCloseClick">
                        <span class="nav-toggle__line nav-toggle__line--top">&nbsp;</span>
                        <span class="nav-toggle__line nav-toggle__line--middle">&nbsp;</span>
                        <span class="nav-toggle__line nav-toggle__line--bottom">&nbsp;</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="email-overlay__content">
            <div v-if="!component_loaded" class="check-in-index__notice">
                <p v-if="load_error" class="text--alert">
                    Error loading email form.
                </p>
                <p v-else-if="!loaded && loading_timeout">
                    Loading...
                </p>
            </div>
            <email-form
                v-else
                ref="form"
                v-on:page-change="handlePageChange"
                v-on:complete="handleFormComplete"></email-form>
        </div>
        <div v-if="dialog_active" class="email-overlay__confirmation">
            <div class="confirmation-overlay"
                 :class="{'confirmation-overlay--submitting':submission_status.submitting}">
                <div class="confirmation-overlay__content">
                    <div class="confirmation-overlay__dialog">
                        <div v-show="submission_status.submitting || submission_status.success"
                             class="confirmation-overlay__dialog__icon">
                            <animated-email-icon ref="confirmation-icon"></animated-email-icon>
                        </div>
                        <p v-if="submission_status.submitting" class="confirmation-overlay__dialog__progress-text">
                            Sending
                        </p>
                        <div v-if="submission_status.success">
                            <div class="confirmation-overlay__dialog__message">
                                Your email has been sent
                            </div>
                            <button class="button button--small" v-on:click="confirmDialog">
                                OK
                            </button>
                        </div>
                        <div v-if="submission_status.error">
                            <div class="confirmation-overlay__dialog__message text--alert">
                                {{submission_status.error}}
                            </div>
                            <button class="button button--small" v-on:click="confirmDialog">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {AppRootInterface} from '../../contracts/AppContracts';
    import HasDataDependencies from '../../mixins/HasDataDependencies';
    import {SubmitCheckInEmailPayload} from '../CheckIn/_contracts/CheckInContracts';
    import {EmailFormComponentInterface, ExportedEmailForm} from '../EmailForm/_contracts/EmailFormContracts';
    import {AnimatedEmailIconInterface} from './AnimatedEmailIcon.vue';

    const vueClass = mixins(HasDataDependencies);

    /**
     * Tracks submission status on the component
     */
    interface EmailOverlaySubmissionStatus {
        [key: string]: string | boolean;

        /**
         * Error resulting from last submission
         */
        error: string;
        /**
         * Whether the component is submitting
         */
        submitting: boolean;
        /**
         * Whether the last component submission was successful
         */
        success: boolean;
    }

    // @vue/component
    export default vueClass.extend({

        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Data dependencies for the component
                 */
                dependencies: {
                    recipients: false
                },
                /**
                 * Whether the index of the email form is active
                 */
                index_active: true,
                /**
                 * Submission status on the component
                 */
                submission_status: <EmailOverlaySubmissionStatus> {
                    submitting: false,
                    success: false,
                    error: ''
                }
            };
        },
        computed: {
            /**
             * Whether the dialog is active
             */
            dialog_active: function (): boolean {
                for (const i in this.submission_status) {
                    if (Object.prototype.hasOwnProperty.call(this.submission_status, i)) {
                        const submissionStatusElement = this.submission_status[i];
                        if (submissionStatusElement !== false && submissionStatusElement !== '') {
                            return true;
                        }
                    }
                }

                return false;
            }
        },
        /**
         * Upon mount, reset root scroll position
         */
        mounted: function () {
            this.$nextTick(() => {
                const $root = this.$root as AppRootInterface;
                $root.resetScroll();
            });
        },
        /**
         * Upon destruction, reset root scroll position
         */
        destroyed: function () {
            this.$nextTick(() => {
                const $root = this.$root as AppRootInterface;
                $root.resetScroll();
            });
        },
        methods: {
            /**
             * Handle click on dialog button
             */
            confirmDialog: function () {
                if (this.submission_status.error) {
                    this.submission_status.error = '';

                    return;
                }
                this.$emit('close');
            },
            /**
             * Ensure a delay has elapsed before showing complete of email send/fail.  Allows animation to play
             */
            ensureDelay: function (start_time: number) {
                // The time to ensure the process takes
                const minimum_time_send = 2000;

                return new Promise((resolve) => {
                    const current_time = new Date()
                        .getTime();
                    const elapsed = current_time - start_time;
                    const wait_duration = minimum_time_send - elapsed;
                    if (wait_duration <= 0) {
                        resolve();

                        return;
                    }
                    setTimeout(() => {
                        resolve();
                    }, wait_duration);
                });
            },
            /**
             * Handle click on overlay close element
             */
            handleCloseClick: function () {
                const form = this.$refs.form as EmailFormComponentInterface;
                if (form && form.closeSubpages()) {
                    return;
                }
                this.$emit('close');
            },
            /**
             * Handle completion event on email form
             */
            handleFormComplete: function (form_data: ExportedEmailForm) {
                this.submit(this.prepareData(form_data));
            },
            /**
             * Handle a page change event on the child form
             *
             * Reset the root scroll
             */
            handlePageChange: function (page: string) {
                this.index_active = page === 'index';
                const $root = this.$root as AppRootInterface;
                $root.resetScroll();
            },
            /**
             * Load data dependencies
             */
            loadData: function () {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('email_form/fetchEmailConfiguration')
                        .then(() => {
                            this.dependencies.recipients = true;
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });

                });
            },
            /**
             * Prepare data for submission.  Transform Exported Email Form into action payload
             */
            prepareData: function (args: ExportedEmailForm): SubmitCheckInEmailPayload {
                const data = new FormData();
                for (let i = 0; i < args.attachments.length; i++) {
                    const attachment = args.attachments[i];
                    data.append('attachments', attachment);
                }
                data.append('bcc', JSON.stringify(args.bcc));
                data.append('cc', JSON.stringify(args.cc));
                data.append('message', args.message);
                data.append('subject', args.subject);

                return data as SubmitCheckInEmailPayload;
            },
            /**
             * Submit the email
             */
            submit: function (data: SubmitCheckInEmailPayload) {
                if (this.submission_status.submitting) {
                    return;
                }
                const start_time = new Date()
                    .getTime();
                this.submission_status.submitting = true;
                this.submission_status.error = '';
                this.submission_status.success = false;

                this.$nextTick(() => {
                    const confirmation_icon = this.$refs['confirmation-icon'] as AnimatedEmailIconInterface;
                    this.$nextTick(() => {
                        confirmation_icon.play();
                    });
                    this.$store.dispatch('email_form/submitEmail', data)
                        .then(() => {
                            this.ensureDelay(start_time)
                                .then(() => {
                                    confirmation_icon.complete();
                                    this.submission_status.submitting = false;
                                    this.submission_status.success = true;
                                });
                        })
                        .catch((message) => {
                            this.ensureDelay(start_time)
                                .then(() => {
                                    this.submission_status.submitting = false;
                                    this.submission_status.error = message;
                                });
                        });
                });

            }
        }
    });
</script>