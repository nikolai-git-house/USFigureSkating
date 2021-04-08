<template>
    <a :href="link.url"
       class="data-navigation-link ada-text"
       :class="root_classes"
       :disabled="link.is_disabled"
       v-on:click="linkClick">
        <div class="data-navigation-link__content">
            <div class="data-navigation-link__label">
                {{link.label}}
            </div>
            <div v-if="link.data"
                 class="data-navigation-link__information">
                <div v-for="(information,iindex) in link.data"
                     :key="iindex"
                     class="data-navigation-link__information__item"
                     :class="informationItemClass(information)">
                    <ul v-if="isListContent(information)"
                        class="data-navigation-link__information__list">
                        <template v-for="(additional,cindex) in information.content">
                            <li :key="cindex"
                                class="data-navigation-link__information__list__item"
                                :class="additional.type_key|status_class">
                                {{additional.text}}
                            </li>
                            <li v-if="cindex < (information.content.length-1)"
                                :key="-1 - cindex"
                                class="data-navigation-link__information__list__pipe">|
                            </li>
                        </template>
                    </ul>
                    <div v-else
                         class="data-navigation-link__information__message">
                        <i v-if="information.icon"
                           :class="information.icon|icon_class">&nbsp;
                        </i>
                        <span :class="getTextClass(information)">{{information.content}}</span>
                    </div>
                </div>
            </div>
        </div>
    </a>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {DataNavigationLinkComponent} from './_contracts';

    export default Vue.extend({
        filters: {
            /**
             * Map icon keys to icon HTML classes
             */
            icon_class: function (value: DataNavigationLinkComponent.DataNavigationLinkDataIcon): string {
                const map = {
                    'warning': 'inline-icon icon-warning-alt',
                    'scheduled': 'inline-icon icon-scheduled',
                    'pending': 'inline-icon icon-pending',
                    'incomplete': 'inline-icon icon-status-x',
                    'complete': 'inline-icon icon-status-check',
                    'new': 'icon-new-badge'
                };

                return map[value];
            },
            /**
             * The text color class to apply in the case of an icon
             */
            icon_text_class: function (value: DataNavigationLinkComponent.DataNavigationLinkDataIcon): string {
                const map = {
                    'warning': 'text--standard',
                    'scheduled': 'text--success',
                    'pending': 'text--warning',
                    'incomplete': 'text--alert',
                    'complete': 'text--success',
                    'new': 'text--standard'
                };

                return map[value];
            }

        },
        props: {
            /**
             * The source link
             */
            link: {
                type: Object as () => DataNavigationLinkComponent.DataNavigationLink,
                required: true
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                root_class: 'data-navigation-link'
            };
        },
        computed: {
            /**
             * Classes to apply to the root element
             */
            root_classes: function (): string[] {
                const result = [this.root_class];
                if (this.link.is_disabled) {
                    result.push(`${this.root_class}--disabled`);
                }
                if (this.link.is_complete) {
                    result.push(`${this.root_class}--complete`);
                }
                if (this.link.is_complete === false) {
                    result.push(`${this.root_class}--incomplete`);
                }
                if (!this.link.data) {
                    result.push(`${this.root_class}--no-data`);
                }

                return result;
            }
        },
        methods: {
            /**
             * Handle click event on link
             */
            linkClick: function (e: Event) {
                if (this.link.is_disabled) {
                    e.preventDefault();
                }
            },
            /**
             * Class to add to a supporting information item.  Identify list, icon, and standard versions
             */
            informationItemClass: function (value: DataNavigationLinkComponent.DataNavigationLinkData): string {
                const base = 'data-navigation-link__information__item';
                if (this.isListContent(value)) {
                    return `${base}--list`;
                }
                if (value.icon) {
                    return `${base}--icon`;
                }

                return `${base}--standard`;
            },
            /**
             * Whether the content for a supporting information point is list content
             */
            isListContent: function (information: DataNavigationLinkComponent.DataNavigationLinkData): boolean {
                const isArray = Array.isArray || function (obj) {
                    return Object.prototype.toString.call(obj) == '[object Array]';
                };

                return isArray(information.content);
            },
            /**
             * Get the text class to apply to a text node
             */
            getTextClass: function (value: DataNavigationLinkComponent.DataNavigationLinkData): string | null {
                const filters = this.$options.filters;
                if (filters && value.icon) {
                    return filters.icon_text_class(value.icon);
                }
                if (filters && value.status_type) {
                    return filters.status_class(value.status_type);
                }

                return null;
            }
        }
    });
</script>