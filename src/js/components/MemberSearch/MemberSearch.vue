<template>
    <div class="member-search">
        <member-search-form v-show="show_form"
                            v-on:search-success="handleSearchSuccess"
                            v-on:clear-form="$emit('clear-form')">
            <div slot="pre-form"
                 slot-scope="slotProps"
                 class="form-group">
                <slot name="pre-form" :clearError="slotProps.clearError"></slot>
            </div>
            <div slot="post-form"
                 slot-scope="slotProps"
                 class="form-group">
                <slot name="post-form" :clearError="slotProps.clearError"></slot>
            </div>
        </member-search-form>
        <member-search-results v-if="show_results"></member-search-results>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {AppRootInterface} from '../../contracts/AppContracts';
    import SearchMixin from '../../mixins/SearchMixin';
    import MemberSearchForm from './MemberSearchForm.vue';
    import MemberSearchResults from './MemberSearchResults.vue';

    const extendedVue = mixins(SearchMixin);
    /**
     * Component to orchestrate member search
     */
    export default extendedVue.extend({
        components: {
            MemberSearchForm,
            MemberSearchResults
        },
        watch: {
            /**
             * When results active changes, set value in state.
             * Used by header to determine heading text
             */
            results_active: function (value: boolean) {
                const $root = this.$root as AppRootInterface;
                $root.resetScroll();
                this.$store.commit('member_search/setResultsActive', value);
            }
        },
        /**
         * When component destroyed, set results active to false in state
         */
        destroyed: function () {
            this.$store.commit('member_search/setResultsActive', false);
        }
    });
</script>