<template>
    <div class="member-category-assignment">
        <div class="member-selection-list">
            <p v-if="event_categories.length<1" class="alert member-selection-list__notice">
                {{no_item_notice}}
            </p>
            <div v-for="(event_category, category_index) in event_categories"
                 :key="event_category.id"
                 class="member-selection-category">
                <h2 class="member-selection-category__title">
                    {{event_category.name}}
                </h2>
                <div class="member-selection-category__content">
                    <div v-for="(member, member_index) in event_category.members"
                         :key="member.id"
                         class="member-selection-member">
                        <slot name="member"
                              :member="member"
                              :ordinal="ordinal(member_index)"
                              :member_label="member_label?member_label:''">
                            <div class="member-selection-member__description">
                                <p class="member-selection-member__name member-name">
                                    <span v-if="member_label" class="member-name__position">
                                        {{ordinal(member_index)}} {{member_label}}:
                                    </span>
                                    <span class="member-name__name">
                                        {{member.first_name}} {{member.last_name}}
                                    </span>
                                    <span v-if="member.ineligible" class="member-name__status text--alert">(Ineligible)</span>
                                </p>
                            </div>
                        </slot>
                        <div class="member-selection-member__cta">
                            <div class="member-selection-member__cta-element">
                                <button class="button button--medium button--block"
                                        :class="changeButtonClass(member)"
                                        type="button"
                                        :disabled="disable_buttons"
                                        v-on:click="editMember(category_index,member,event_category.id)">
                                    Change
                                </button>
                            </div>
                            <div v-if="showRemove(member_index, category_index)" class="member-selection-member__cta-element member-selection-member__cta-element--centered">
                                <button class="icon-button icon-button--delete icon-button--labeled-inline"
                                        type="button"
                                        :disabled="disable_buttons"
                                        v-on:click="removeMember(event_category.id,member)">
                                    Remove
                                </button>
                            </div>
                        </div>
                        <p v-if="memberError(event_category.id,member)" class="input-error">
                            {{memberError(event_category.id,member)}}
                        </p>
                    </div>
                    <div v-if="showAddButton(event_category)" class="member-selection-category__cta">
                        <button class="member-selection-category__add-coach add-link"
                                type="button"
                                :disabled="disable_buttons"
                                v-on:click="addMember(event_category.id)">
                            {{add_button_text}}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    /* eslint-disable */
    import Vue from "vue";
    import {
        AssignableMember,
        MemberAssignmentCategory,
        MemberRemoveFunction
    } from "../contracts/app/CompetitionRegistrationContracts";

    /**
     * Component displaying the assignment of members to categories
     */
    export default Vue.extend({
        props: {
            /**
             * Categories to show on the component
             */
            event_categories: {
                type: Array as () => MemberAssignmentCategory[],
                required: true
            },
            /**
             * If showing labels on listed members, the label to use.
             * ex: "Coach Attending"
             */
            member_label: {
                type: String,
                default: ""
            },
            /**
             * Function to call when an item is removed
             */
            remove_fn: {
                type: Function as MemberRemoveFunction,
                required: false
            },
            /**
             * Whether to disable action buttons
             */
            disable_buttons: {
                type: Boolean,
                default: false
            },
            /**
             * Notice to display when list is empty
             */
            no_item_notice: {
                type: String,
                default: "No selections available."
            },
            /**
             * Add button wording
             */
            add_button_text: {
                type: String,
                default: "Add"
            }
        },
        data: function () {
            return {
                /**
                 * Active error on the component
                 */
                active_error: <{
                    category_id: number
                    member: AssignableMember,
                    message: string
                } | null>null
            }
        },
        methods: {
            /**
             * Based whether member is eligible, display normal change button class or alert class for member change button
             */
            changeButtonClass: function (member: AssignableMember) {
                if (member.ineligible) {
                    return "button--action";
                }
                return "button--info";
            },
            /**
             * Whether to show the add button at the end of a given category
             */
            showAddButton: function (event_category: MemberAssignmentCategory) {
                return event_category.member_limit > event_category.members.length;
            },
            /**
             * Determine whether the remove button should show for a category coach item
             * Only show the remove button for the last item in a category
             */
            showRemove: function (member_index: number, category_index: number) {
                let member_array = this.event_categories[category_index].members;
                return member_index === member_array.length - 1;
            },
            /**
             * Return the ordinal for a member based on position
             */
            ordinal: function (index: number): string {
                if (index > 2) {
                    return "";
                }
                return ["1st", "2nd", "3rd"][index];
            },
            /**
             * Emit event that add member button has been clicked
             */
            addMember: function (category_id: number) {
                this.active_error = null;
                this.$emit('add', category_id);
            },
            /**
             * Emit event that edit member button has been clicked
             */
            editMember: function (category_index: number, member: AssignableMember, category_id: number) {
                this.active_error = null;
                let payload: any = {
                    category_id,
                    member
                };
                this.$emit('edit', payload);
            },
            /**
             * Handle remove member button click.
             * 1. If remove function provided, use it.
             *
             * 2. Otherwise, emit event that remove button has been clicked
             */
            removeMember: function (category_id: number, member: AssignableMember) {
                this.active_error = null;
                if (typeof this.remove_fn === "function") {
                    this.remove_fn(category_id, member).catch((message: string) => {
                        this.active_error = {
                            category_id,
                            member,
                            message
                        }
                    });
                    return;
                }
                let payload: any = {
                    category_id,
                    member
                };
                this.$emit('remove', payload);
            },
            /**
             * Whether an error should show for a given member
             */
            memberError: function (category_id: number, member: AssignableMember): string | false {
                return this.active_error && this.active_error.category_id === category_id && this.active_error.member.id === member.id ? this.active_error.message : false;
            }
        }
    });
</script>