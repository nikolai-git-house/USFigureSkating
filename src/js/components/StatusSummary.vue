<!--
    Status Summary Component

    Displays a list of status items with either a complete "√" or incomplete "x"
-->
<template>
    <div class="status-summary">
        <p v-if="heading"
           class="status-summary__heading"
           :class="overall_complete?'status-summary__heading--complete':'status-summary__heading--incomplete'">
            {{heading}}
        </p>
        <ul class="status-summary__list">
            <li v-for="(status_item,index) in status_items"
                :key="index"
                class="status-summary__list__item">
                <div class="status-summary__item"
                     :class="{
                         'status-summary__item--complete':status_item.complete,
                         'status-summary__item--incomplete':!status_item.complete
                     }">
                    <div class="status-summary__item__name">
                        <span>{{status_item.name}}<slot :item="status_item"
                                                        name="name_support"></slot></span>
                    </div>
                </div>
                <slot :item="status_item"
                      name="additional_content"></slot>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {StatusSummaryItem} from '../contracts/AppContracts';

    export default Vue.extend({
        props: {
            /**
             * The heading for the compliance list (optional)
             */
            heading: {
                type: String,
                required: false
            },
            /**
             * The list of Status Summary items to display
             */
            status_items: {
                type: Array as () => StatusSummaryItem[],
                required: true
            }
        },
        computed: {
            /**
             * Whether the list of items is complete overall
             */
            overall_complete: function (): boolean {
                for (let i = 0; i < this.status_items.length; i++) {
                    const status_item = this.status_items[i];
                    if (!status_item.complete) {

                        return false;
                    }
                }

                return true;
            }
        }
    });
</script>