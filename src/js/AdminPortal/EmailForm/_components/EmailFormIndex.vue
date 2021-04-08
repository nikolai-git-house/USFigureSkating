<template>
    <div class="email-form-index">
        <div class="email-form__page-title">
            <h1 class="email-form__page-title__text">
                {{form_title}}
            </h1>
        </div>
        <div class="email-form-index__section email-form-index__section--summary">
            <div class="email-form-index__configurations">
                <div class="email-configuration" :class="$parent.fieldClass('target_values')">
                    <div class="email-configuration__content">
                        <p class="email-configuration__label">
                            BCC:
                        </p>
                        <p class="email-configuration__value">
                            {{$parent.form_data.bcc.label}}
                        </p>
                        <div class="email-configuration__control">
                            <button :class="!$parent.is_edit_bcc ?'inline-add-button':'inline-edit-button'" v-on:click="$parent.openRecipientSelect('bcc')">
                                {{$parent.is_edit_bcc?'Edit':'Add'}}
                            </button>
                        </div>
                    </div>
                    <p v-if="$parent.fieldMessage('target_values')" class="input-error">
                        *{{$parent.fieldMessage('target_values')}}
                    </p>
                </div>
                <div v-if="cc_available"
                     class="email-configuration"
                     :class="$parent.fieldClass('target_values')">
                    <div class="email-configuration__content">
                        <p class="email-configuration__label">
                            CC:
                        </p>
                        <p class="email-configuration__value">
                            {{$parent.form_data.cc.label}}
                        </p>
                        <div class="email-configuration__control">
                            <button :class="!$parent.is_edit_cc ?'inline-add-button':'inline-edit-button'" v-on:click="$parent.openRecipientSelect('cc')">
                                {{$parent.is_edit_cc?'Edit':'Add'}}
                            </button>
                        </div>
                    </div>
                    <p v-if="$parent.fieldMessage('target_values')" class="input-error">
                        *{{$parent.fieldMessage('target_values')}}
                    </p>
                </div>
                <div class="email-configuration" :class="$parent.fieldClass('subject')">
                    <label class="email-configuration__content"
                           for="subject-edit"
                           v-on:mousedown="subjectTriggerClick">
                        <span class="email-configuration__label">
                            Subject:
                        </span>
                        <span v-show="!subject_active" class="email-configuration__value">
                            {{$parent.form_data.subject}}
                        </span>
                    </label>
                    <div class="email-form-index__subject-edit" :class="{'active':subject_active}">
                        <textarea id="subject-edit"
                                  ref="subject"
                                  v-model="$parent.form_data.subject"
                                  class="form-field"
                                  v-on:focus="subject_active=true"
                                  v-on:blur="subject_active=false"></textarea>
                    </div>
                    <p v-if="$parent.fieldMessage('subject')" class="input-error">
                        *{{$parent.fieldMessage('subject')}}
                    </p>
                </div>
            </div>
        </div>
        <div class="email-form-index__section email-form-index__section--message">
            <div class="email-form-index__message" :class="$parent.fieldClass('message')">
                <div class="email-form-index__message-header">
                    <label for="message">Add your message</label>
                    <file-select v-on:selected="attachmentAdd">
                        <button class="icon-link icon-link--attachment">
                            Attach File
                        </button>
                    </file-select>
                </div>
                <div class="email-form-index__message-element" :class="$parent.fieldClass('message')">
                    <ul v-if="$parent.form_data.attachments.length" class="email-attachment-list">
                        <li v-for="(attachment,index) in $parent.form_data.attachments"
                            :key="index"
                            class="email-attachment-list__item"
                            :class="$parent.attachmentClass(index)">
                            <div class="email-attachment-list__item__content">
                                <span class="email-attachment-list__item__text">
                                    {{attachment.name}}
                                </span>
                                <button class="icon-button icon-button--delete icon-button--sm icon-button--pseudo" v-on:click.prevent="attachmentRemove(index)">
                                    <span class="sr-only">Remove Attachment</span>
                                </button>
                            </div>
                            <p v-if="$parent.attachmentError(index)" class="input-error">
                                {{$parent.attachmentError(index)}}
                            </p>
                        </li>
                    </ul>
                    <p v-if="$parent.fieldMessage('attachments')" class="input-error">
                        *{{$parent.fieldMessage('attachments')}}
                    </p>
                    <textarea id="message"
                              v-model="$parent.form_data.message"
                              name="message"
                              class="email-form-index__message-element__input form-field"></textarea>
                </div>
                <p v-if="$parent.fieldMessage('message')" class="input-error">
                    *{{$parent.fieldMessage('message')}}
                </p>
            </div>
            <div class="email-form-index__submit">
                <button class="button button--block button--large" v-on:click.prevent.stop="$parent.submit">
                    Send
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {EmailFormComponentInterface} from '../_contracts/EmailFormContracts';

    export default Vue.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                subject_active: true
            };
        },
        computed: {
            /**
             * Title of form page
             */
            form_title: function (): string {
                return this.$store.state.email_form.form_title;
            },
            /**
             * Whether CC selection is available
             */
            cc_available: function (): boolean {
                return this.$store.getters['email_form/options_cc'].length > 0;
            }
        },
        watch: {
            /**
             * When subject becomes active, pre-highlight the text
             */
            subject_active: function (val) {
                if (val) {
                    const subject_field: HTMLInputElement = this.$refs.subject as HTMLInputElement;
                    subject_field.setSelectionRange(0, subject_field.value.length);
                }
            }
        },
        methods: {
            /**
             * Handle click event on the label for the subject field
             */
            subjectTriggerClick: function (e: MouseEvent) {
                if (this.subject_active) {
                    e.preventDefault();
                }
            },
            /**
             * Add an attachment
             */
            attachmentAdd: function (file: File) {
                const parent = this.$parent as EmailFormComponentInterface;
                parent.form_data.attachments.push(file);
            },
            /**
             * Remove an attachment by index
             */
            attachmentRemove: function (index: number) {
                const parent = this.$parent as EmailFormComponentInterface;
                parent.form_data.attachments.splice(index, 1);
            }
        }
    });
</script>