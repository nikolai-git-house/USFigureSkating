<script lang="ts">
    import MyCoachesSearchForm from './MyCoachesSearchForm.vue';
    import MyCoachesSearchResults from './MyCoachesSearchResults.vue';
    import SearchMixin from '../../mixins/SearchMixin';
    import mixins from 'vue-typed-mixins';

    const extendedVue = mixins(SearchMixin);
    export default extendedVue.extend({
        components: {
            'my-coaches-search-form': MyCoachesSearchForm,
            'my-coaches-search-results': MyCoachesSearchResults
        }
    });
</script>