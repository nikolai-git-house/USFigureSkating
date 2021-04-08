<template>
    <div class="competition-user-navigation">
        <ul class="competition-user-navigation__list panel-link-group">
            <li v-for="(link,index) in links" :key="index">
                <data-navigation-link :link="link"></data-navigation-link>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {DataNavigationLinkComponent} from '../../CompetitionPortal/_components/DataNavigationLink/_contracts';

    export default Vue.extend({
        props: {
            /**
             * The links for display in the navigation
             */
            links: {
                type: Array as () => DataNavigationLinkComponent.DataNavigationLink[],
                required: true
            }
        }
    });
</script>