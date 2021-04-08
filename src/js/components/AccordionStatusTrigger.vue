<template>
    <span class="accordion-data-trigger__data">
        <span v-for="(summary_item,index) in status_data"
              :key="index"
              class="accordion-data-trigger__datum">
            <span class="accordion-data-trigger__datum__content">
                <span class="accordion-data-trigger__datum__value" :class="'accordion-data-trigger__datum__value--'+summary_item.status_key">
                    {{summary_item.label?summary_item.label+': ':''}}{{summary_item.value}}
                </span>
                <span v-if="index< status_data.length - 1" class="accordion-data-trigger__datum__divider">|</span>
            </span>
        </span>
    </span>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {AccordionStatusTriggerDataInterface} from '../contracts/AppContracts';

    export default Vue.extend({
        props: {
            status_data: {
                type: Array as () => AccordionStatusTriggerDataInterface[],
                required: true
            }
        }
    });
</script>