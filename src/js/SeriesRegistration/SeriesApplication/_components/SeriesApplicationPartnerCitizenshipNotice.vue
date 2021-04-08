<template>
    <div>
        <p>
            The selected person is not eligible to register for the {{series.name}} at this time due to citizenship
            status.
        </p>
        <p>
            Please email
            <br>
            <a href="mailto:MemberServices@usfigureskating.org"
               class="standard-link">MemberServices@usfigureskating.org
            </a>
            <br>
            for more information.
        </p>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {SeriesApplication} from '../_contracts';

    export default Vue.extend({
        props: {
            series: {
                type: Object as () => SeriesApplication.CitizenshipNoticeSeries,
                required: true
            }
        }
    });
</script>