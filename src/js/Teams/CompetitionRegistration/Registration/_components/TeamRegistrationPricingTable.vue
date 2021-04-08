<template>
    <div class="team-registration-pricing-table"
         :class="{'team-registration-pricing-table--odd-row-count':has_odd_row_count}">
        <h2 class="team-registration-pricing-table__title"
            v-html="ijsFix(config.title)"></h2>
        <table class="competition-prices-table">
            <tr class="competition-prices-table__header">
                <th class="cell cell--label">
                    <span class="label-value">{{label_column_heading}}</span>
                </th>
                <th v-for="(name,nindex) in value_column_headings"
                    :key="nindex"
                    class="cell"
                    :class="nindex===value_column_headings.length-1?'cell--price-combined':'cell--price'">
                    {{name}}
                </th>
            </tr>
            <tr v-for="(row,rindex) in rows"
                :key="rindex"
                class="competition-prices-table__row">
                <td class="cell cell--label">
                    <span class="label-value">{{row.label}}</span>
                </td>
                <td v-if="showPriceNotice(row)"
                    :colspan="row.values.length"
                    class="cell cell--notice">
                    <span class="notice-value"
                          v-html="ijsFix(config.null_row_message)">
                    </span>
                </td>
                <td v-for="(value,vindex) in row.values"
                    v-else
                    :key="vindex"
                    class="cell"
                    :class="vindex===row.values.length-1?'cell--price-combined':'cell--price'">
                    {{value|priceDisplay}}
                </td>
            </tr>
        </table>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {TeamRegistration} from '../_contracts';

    export default Vue.extend({
        filters: {
            /**
             * Display formatting for a price
             */
            priceDisplay: function (value: number | null): string {
                if (value === null) {
                    return '';
                }

                return '$' + value;
            }
        },
        props: {
            config: {
                type: Object as () => TeamRegistration.PricingTableConfiguration,
                required: true
            },
            rows: {
                type: Array as () => TeamRegistration.PricingRow[],
                required: true
            }
        },
        computed: {
            /**
             * Whether the table has an odd number of rows
             */
            has_odd_row_count: function (): boolean {
                return this.rows.length % 2 !== 0;
            },
            /**
             * Heading for label column
             */
            label_column_heading: function (): string {
                return this.config.column_names[0];
            },
            /**
             * Headings for value columns
             */
            value_column_headings: function (): string[] {
                return this.config.column_names.slice(1);
            }
        },

        methods: {
            /**
             * String fix for IJS display
             */
            ijsFix: function (value: string): string {
                return value.replace('IJS', '<span class="ijs-fix">IJS</span>');
            },
            /**
             * Whether to show a notice about lack of prices for a particular category
             */
            showPriceNotice: function (row: TeamRegistration.PricingRow): boolean {
                const price_set = row.values;
                for (let i = 0; i < price_set.length; i++) {
                    if (price_set[i]) {
                        return false;
                    }
                }

                return true;
            }
        }
    });
</script>