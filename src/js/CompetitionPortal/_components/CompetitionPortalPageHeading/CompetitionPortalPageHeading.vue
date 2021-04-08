<template>
    <div class="competition-portal-page-heading"
         :class="{
             'competition-portal-page-heading--with-entity':!!entity
         }">
        <competition-heading :always_show="true"
                             :competition_override="competition"></competition-heading>
        <page-entity-header v-if="entity"
                            :entity="entity"></page-entity-header>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {PageEntityHeaderComponentEntity} from '../../../components/_contracts/PageEntityHeaderComponentContracts';
    import {CompetitionHeadingSource} from '../../../contracts/AppContracts';

    export default Vue.extend({
        props: {
            entity: {
                type: Object as () => PageEntityHeaderComponentEntity,
                required: false
            },
            competition: {
                type: Object as () => CompetitionHeadingSource,
                required: true
            }
        }
    });
</script>