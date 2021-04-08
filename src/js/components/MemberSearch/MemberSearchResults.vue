<template>
    <div class="member-search-results">
        <div class="member-search-results__results">
            <div class="grid-container">
                <search-results-header :edit_handler="$parent.editSearch"></search-results-header>
                <div v-if="active_results.length" class="member-search-results__result-list">
                    <div v-for="(member_item,index) in active_results"
                         :key="member_item.id"
                         class="member-search-result">
                        <div class="member-search-result__content">
                            <div class="member-search-result__info">
                                <p class="member-search-result__primary">
                                    {{member_item.first_name}}
                                    {{member_item.last_name}} - {{member_item.member_number}}
                                </p>
                                <p class="member-search-result__secondary">
                                    {{member_item.club_name}}
                                </p>
                                <p class="member-search-result__secondary">
                                    {{member_item.city}},
                                    {{member_item.state_abbreviation}}
                                </p>
                            </div>
                            <div class="member-search-result__actions">
                                <a v-if="member_item.ineligible"
                                   class="member-result-notice member-result-notice--ineligible"
                                   href="#"
                                   v-on:click.prevent="ineligible_popup_index=index">
                                    <span class="member-result-notice__icon">&nbsp;</span>
                                    <span class="member-result-notice__text">Ineligible to participate</span>
                                </a>
                                <span v-else-if="memberAlreadySelected(member_item.id)" class="member-result-notice member-result-notice--selected">
                                    <span class="member-result-notice__icon">&nbsp;</span>
                                    <span class="member-result-notice__text">Already Selected</span>
                                </span>
                                <span v-else-if="memberInvalid(member_item)" class="member-result-notice member-result-notice--alert">
                                    <span class="member-result-notice__icon">&nbsp;</span>
                                    <span class="member-result-notice__text">{{memberInvalid(member_item)}}</span>
                                </span>
                                <button v-else
                                        class="button button--info button--medium button--block"
                                        type="button"
                                        :disabled="addButtonDisabled(member_item.id)"
                                        v-on:click="selectMember(index,member_item)">
                                    Add
                                </button>
                            </div>
                            <transition slot="error" name="fade">
                                <div v-if="showSelectionError(index)" class="session-feedback  session-feedback--error">
                                    <button type="button"
                                            class="session-feedback__close"
                                            title="Close"
                                            v-on:click.prevent.stop="closeEventError">
                                        &times;
                                    </button>
                                    <div class="session-feedback__content">
                                        <div class="session-feedback__text">
                                            {{selection_error}}
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>
                        <popup v-if="showIneligiblePopup(index)" v-on:close-popup="closeIneligiblePopup()">
                            <span slot="heading-text">
                                {{entity_descriptor}} Ineligible
                            </span>
                            <div slot="content">
                                <p class="alert">
                                    The person selected is prohibited from participating, in any capacity,
                                    in any activity or competition authorized by, organized by U.S. Figure Skating
                                    and/or Local Affiliated Organization of U.S. Figure Skating (club).
                                </p>
                                <p>{{ineligible_instruction}}</p>
                            </div>
                        </popup>
                    </div>
                </div>
                <div v-else>
                    <p>No Results</p>
                </div>
            </div>
        </div>
        <div v-if="pagination_available" class="member-search-results__footer">
            <div class="member-search-results__pagination">
                <search-results-pagination></search-results-pagination>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    /* eslint-disable */
    import Vue from "vue";
    import {MemberSearchResult} from "../../contracts/app/MemberSearchContracts";
    import SearchResultsHeader from "./MemberSearchResultsHeader.vue"
    import SearchResultsPagination from "./MemberSearchResultsPagination.vue"

    /**
     * Extension of My Coaches search results intended to function as an abstract member search results.
     * Created as an extension from existing source file:
     * src/js/pages/MyCoaches/MyCoachesSearchResults.vue
     */
    export default Vue.extend({
        data: function () {
            return {
                ineligible_popup_index: -1,
                processing_index: -1,
                selection_index: -1,
                selection_error: ""
            }
        },
        computed: {
            active_results: function (): MemberSearchResult[] {
                return this.$store.getters['member_search/active_results'];
            },
            pagination_available: function (): boolean {
                return this.$store.getters['member_search/pagination_available'];
            },
            ineligible_instruction: function (): string {
                return this.$store.state.member_search.ineligible_instruction;
            },
            entity_descriptor: function (): string {
                return this.$store.state.member_search.entity_descriptor;
            }
        },
        methods: {
            /**
             * Disable Add buttons when an ineligible popup is active or
             * the member is already selected for the active category
             */
            addButtonDisabled: function (member_id: number): boolean {
                if (this.ineligible_popup_index !== -1) {
                    return true;
                }
                if (this.processing_index !== -1) {
                    return true;
                }
                return this.memberAlreadySelected(member_id);
            },
            /**
             * Return whether a member has already been selected for the active category
             */
            memberAlreadySelected: function (member_id: number): boolean {
                return this.$store.getters['member_search/previously_selected_selection_blocked'](member_id);
            },
            /**
             * Handle member selection event
             */
            selectMember: function (index: number, member: MemberSearchResult): void {
                this.selection_index = index;
                this.selection_error = "";
                this.processing_index = index;
                this.$store.dispatch('member_search/handleSelection', member).then(() => {
                    this.$store.commit('member_search/closeSearch');
                    this.processing_index = -1;
                }).catch((message: string) => {
                    this.selection_error = message;
                    this.processing_index = -1;
                });
            },
            /**
             * Show a selection error on a result based on its index
             */
            showSelectionError: function (index: number): boolean {
                return index === this.selection_index && !!this.selection_error;
            },
            /**
             * Close the active error showing on a result
             */
            closeEventError: function () {
                this.selection_error = "";
            },
            /**
             * Whether to show the warning popup when selecting an ineligible member
             */
            showIneligiblePopup: function (index: number): boolean {
                return this.ineligible_popup_index === index;
            },
            /**
             * Close the ineligible popup
             */
            closeIneligiblePopup: function (): void {
                this.ineligible_popup_index = -1;
            },
            /**
             * Get the invalid message for a member item if it's invalid.
             * Returns false if result is valid
             */
            memberInvalid: function (member_item: MemberSearchResult): string | false {
                return this.$store.getters['member_search/memberResultInvalid'](member_item);
            }
        },
        components: {
            'search-results-header': SearchResultsHeader,
            'search-results-pagination': SearchResultsPagination
        }
    });
</script>