<template>
    <div class="competition-schedule-legend">
        <page-alert class="page-alert page-alert--notice page-alert--medium">
            <div slot="trigger_text">
                Key to abbreviations and color codes
            </div>
            <div slot="expand_content">
                <div class="competition-schedule-legend__content">
                    <div class="competition-schedule-legend__section">
                        <ul class="competition-schedule-legend__list">
                            <li v-for="(abbreviation,index) in abbreviations"
                                :key="index"
                                class="competition-schedule-legend__list__item">
                                {{abbreviation.label}}: {{abbreviation.value}}
                            </li>
                        </ul>
                    </div>
                    <div class="competition-schedule-legend__section">
                        <ul class="competition-schedule-legend__list competition-schedule-legend__list--sessions">
                            <li v-for="(color_key_item,index) in color_key"
                                :key="index"
                                class="competition-schedule-legend__list__item">
                                <div class="color-key-item">
                                    <span class="color-key-item__icon session__icon"
                                          :style="colorKeyIconStyle(color_key_item)">&nbsp;</span>
                                    <span class="color-key-item__label">{{color_key_item.label}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </page-alert>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {
        CompetitionScheduleLegend,
        CompetitionScheduleLegendAbbreviation,
        CompetitionScheduleLegendColorKeyItem
    } from '../_contracts/CompetitionScheduleContracts';

    export default Vue.extend({
        props: {
            /**
             * Source data for the component
             */
            source_data: {
                type: Object as () => CompetitionScheduleLegend,
                required: true
            }
        },
        computed: {
            /**
             * The items for display in the abbreviation key
             */
            abbreviations: function (): CompetitionScheduleLegendAbbreviation[] {
                return this.source_data.abbreviations;
            },
            /**
             * The items to show in the session key
             */
            color_key: function (): CompetitionScheduleLegendColorKeyItem[] {
                return this.source_data.color_key;
            }
        },
        methods: {
            /**
             * Style attribute for a color key icon element
             */
            colorKeyIconStyle: function (color_key_item: CompetitionScheduleLegendColorKeyItem) {
                return `background-color:${color_key_item.color};`;
            }
        }
    });
</script>