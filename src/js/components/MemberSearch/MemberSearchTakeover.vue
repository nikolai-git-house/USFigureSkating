<template>
    <site-takeover v-if="true||memberSearchActive()"
                   :return_to_scroll_location="true"
                   v-on:close="memberSearchClose()">
        <div class="member-search-takeover">
            <h2 class="site-takeover__title">
                {{heading_entity}} Search {{results_active?'Results':''}}
            </h2>
            <member-search></member-search>
        </div>
    </site-takeover>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {MemberSearchState} from '../../store/Modules/MemberSearchState';
    import {MemberSearchService} from '../../services/MemberSearchService';
    import {MemberSearchResult} from '../../contracts/app/MemberSearchContracts';

    export default Vue.extend({
        props: {
            use_defaults: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            /**
             * The entity name for the component heading
             */
            heading_entity: function (): string {
                return this.$store.state.member_search.entity_descriptor;
            },
            /**
             * Whether the member search results are active
             */
            results_active: function (): boolean {
                return this.$store.state.member_search.results_active;
            }
        },
        /**
         * Before creation, ensure state module exists
         */
        beforeCreate: function (): void {
            if (typeof this.$store.state.member_search === 'undefined') {
                this.$store.registerModule('member_search', MemberSearchState);
            }
        },
        /**
         * Upon creation, configure member search state using default generics
         */
        created: function () {
            if (this.use_defaults) {
                this.$store.commit('member_search/configure', {
                    search_function: MemberSearchService.memberSearch,
                    selection_method: this.selectResult,
                    close_method: this.close,
                    entity_descriptor: 'Member',
                    result_validators: [],
                    form_validators: []
                });
            }
        },
        methods: {
            /**
             * Close the member search
             */
            memberSearchClose: function (): void {
                this.$emit('close');
            },
            /**
             * Generic select result handler.  Emit selection and close
             */
            selectResult: function (result: MemberSearchResult): Promise<void> {
                return new Promise((resolve) => {
                    this.$emit('result-selected', result);
                    this.close();
                    resolve();
                });
            },
            /**
             * Generic close.  Emit close event
             */
            close: function (): void {
                this.$emit('close');
            }
        }
    });
</script>