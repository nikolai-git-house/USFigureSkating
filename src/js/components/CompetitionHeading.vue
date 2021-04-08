<template>
    <div v-show="loaded || always_show" class="competition-page-heading">
        <div v-cloak class="grid-container">
            <div class="competition-page-heading__primary">
                <div class="competition-page-heading__primary__icon">
                    <img :src="competition.icon"
                         :alt="competition?competition.name + ' Icon':'Competition Icon'"
                         v-on:error="setLoaded"
                         v-on:load="setLoaded">
                </div>
                <div class="competition-page-heading__primary__details">
                    <p class="competition-page-heading__competition-name">
                        {{competition.name}}
                    </p>
                    <p class="competition-page-heading__competition-info">
                        Dates: {{competition.start_date_pretty}} &mdash; {{competition.end_date_pretty}}
                    </p>

                    <div v-if="competition.directions && competition.directions.length">
                        <p v-for="(directions,index) in competition.directions"
                           :key="index"
                           class="competition-page-heading__competition-info">
                            Directions:
                            <a :href="directions.link"
                               class="standard-link standard-link--no-visited"
                               target="_blank"
                               rel="noopener noreferrer">
                                {{directions.location_name}}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <div v-if="show_links" class="competition-page-heading__secondary">
                <div class="competition-page-heading__links">
                    <a v-if="competition.announcement_url"
                       class="icon-link icon-link--download"
                       :href="competition.announcement_url">
                        Announcement
                    </a>
                    <a v-if="competition.website_url"
                       class="icon-link icon-link--external"
                       target="_blank"
                       rel="noopener noreferrer"
                       :href="competition.website_url">
                        Competition Website
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import {CompetitionHeadingSource} from '../contracts/AppContracts';

    export interface CompetitionHeadingComponent extends Vue {
        loaded: boolean;
    }

    export default Vue.extend({
        props: {
            competition_override: {
                type: Object as () => CompetitionHeadingSource
            },
            always_show: {
                type: Boolean,
                default: false
            }
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                loaded: false
            };
        },
        computed: {
            /**
             * The competition for the heading data
             */
            competition: function (): CompetitionHeadingSource {
                if (this.competition_override) {
                    return this.competition_override;
                }

                return this.$store.getters['competitions/active_competition'];
            },
            /**
             * Whether to show the links section
             */
            show_links: function (): boolean {
                return !!this.competition.announcement_url || !!this.competition.website_url;
            }
        },
        /**
         * Upon creation, update app navbar state to accommodate header
         */
        created: function () {
            this.$store.commit('app/removeNavBorder');
        },
        methods: {
            /**
             *  Set that the image in the component has been loaded
             */
            setLoaded: function () {
                this.loaded = true;
            }
        }
    });
</script>