<template>
    <div class="total-member-cost">
        <span class="cost-display"><span class="cost-display__label">Total {{label}} Cost:</span> <span class="cost-display__value">${{total_member_cost | price}}</span></span>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        filters: {
            /**
             * Format a price
             */
            price: function (value: number): string {
                return value.toFixed(2)
                    .replace('.00', '');
            }
        },
        props: {
            label: {
                type: String,
                required: true
            },
            per_member_fee: {
                type: Number,
                required: true
            },
            current_roster_size: {
                type: Number,
                required: true
            }
        },
        computed: {
            /**
             * The total fees associated with the roster
             */
            total_member_cost: function (): number {
                if (!this.per_member_fee) {
                    return 0;
                }
                const int_cast = Math.round(this.per_member_fee * 100);
                const total = int_cast * this.current_roster_size;

                return total / 100;
            }
        }
    });
</script>