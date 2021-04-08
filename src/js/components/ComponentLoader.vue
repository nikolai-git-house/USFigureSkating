<!--
    Loading block component.
    Displays loading state for data-dependent component content

    Usage:
    1. Component can be used within any component that uses the HasDataDependencies mixin.
    2. Within the appropriate component, add the following as a preceding sibling to the data-dependent content, and
       include a v-else on the data-dependent content:
         <component-loader v-if="!component_loaded"></component-loader>
         <div v-else>
            // data-dependent component template code
         </div>

    3. If a component-loader element does not have a grid container as an ancestor, include the :container=true binding
    4. To modify the load error message, include the error_message binding with an appropriate error string
-->
<template>
    <div class="component-loader">
        <div :class="{'grid-container':container}">
            <p v-if="provider.load_error"
               class="text--alert component-loader__error">
                {{display_error_message}}
            </p>
            <p v-else-if="!provider.loaded && provider.loading_timeout"
               class="component-loader__loading">
                Loading...
            </p>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {ComponentLoaderStatusSource} from '../contracts/AppContracts';

    export default Vue.extend({
        props: {
            /**
             * Whether the loading display requires a grid-container
             */
            container: {
                type: Boolean,
                default: false
            },
            /**
             * The message to display in the event of a load error
             */
            error_message: {
                type: String,
                default: 'Error loading component.'
            },
            /**
             * Source to use to determine state
             */
            source: {
                type: Object as () => ComponentLoaderStatusSource
            }
        },
        computed: {
            /**
             * The error message to display
             */
            display_error_message: function (): string {
                if (this.source && Object.prototype.hasOwnProperty.call(this.source, 'error_message')) {
                    return <string> this.source.error_message;
                }

                return this.error_message;
            },
            /**
             * The provider to use to determine component state
             */
            provider: function () {
                if (this.source) {
                    return this.source;
                }

                return this.$parent;
            }
        }
    });
</script>