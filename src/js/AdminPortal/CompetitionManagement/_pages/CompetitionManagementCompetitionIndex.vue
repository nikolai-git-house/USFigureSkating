<template>
    <div class="competition-management-competition-index">
        <competition-heading ref="heading"
                             :always_show="true"
                             :competition_override="competition"></competition-heading>
        <div class="competition-management-competition-index__content">
            <div class="panel-link-group">
                <a v-for="(link,index) in competition.index_links"
                   :key="index"
                   :href="link.url"
                   class="panel-link panel-link--simple"
                   :class="{'panel-link--external':link.is_external}"
                   :target="linkTarget(link)"
                   :rel="linkRel(link)"
                   v-on:click="handleLinkClick($event,link)">
                    <div class="panel-link__content">
                        <div class="panel-link__text">
                            {{link.label}}
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {
        CompetitionManagementCompetitionIndexLink,
        CompetitionManagementCompetitionInterface
    } from '../_contracts/CompetitionManagementContracts';

    export default Vue.extend({
        props: {
            /**
             * Source competition
             */
            competition: {
                type: Object as () => CompetitionManagementCompetitionInterface,
                required: true
            }
        },
        methods: {
            /**
             * Get the target attribute for a link
             */
            linkTarget: function (link: CompetitionManagementCompetitionIndexLink) {
                if (link.is_new_tab) {
                    return '_blank';
                }

                return null;
            },
            /**
             * Get the rel attribute for a link
             */
            linkRel: function (link: CompetitionManagementCompetitionIndexLink) {
                if (link.is_new_tab) {
                    return 'noopener noreferrer';
                }

                return null;
            },
            /**
             * Handle click on a link
             *
             * 1. If it's a component link, prevent the default action and emit open event for the component
             */
            handleLinkClick: function (event: MouseEvent, link: CompetitionManagementCompetitionIndexLink) {
                if (link.component_link) {
                    event.preventDefault();
                    this.$emit('component-link', link.component_link);
                }
            }
        }
    });
</script>