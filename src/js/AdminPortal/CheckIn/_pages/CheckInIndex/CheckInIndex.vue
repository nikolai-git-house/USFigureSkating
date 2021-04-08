<template>
    <div class="check-in-index">
        <div class="check-in-index__header">
            <div class="grid-container">
                <div class="check-in-index__header__links">
                    <a v-if="competition.check_in_report_url"
                       class="icon-link icon-link--lg icon-link--download"
                       :href="competition.check_in_report_url"
                       target="_blank"
                       rel="noopener noreferrer">Check-In Report
                    </a>
                    <a href="#"
                       class="icon-link icon-link--lg icon-link--email"
                       v-on:click.prevent="emailOverlayOpen">
                        Email Participants
                    </a>
                </div>
            </div>
        </div>
        <div class="check-in-index__content">
            <div class="check-in-index__search">
                <competition-management-check-in-filters :active_filter_criteria="filter_criteria" v-on:terms-updated="handleFilterChange"></competition-management-check-in-filters>
            </div>
            <p v-if="$store.state.checkin.checkin_entities.length===0" class="text--alert">
                Check-in is currently unavailable.
            </p>
            <p v-else-if="filtered_entities.length===0" class="text--muted">
                No results match your current filters.
            </p>
            <check-in-entity-card v-for="entity in display_entities"
                                  v-else
                                  :key="entity.id"
                                  :entity="entity"
                                  v-on:view-comments="viewComments(entity)"
                                  v-on:check-in="beginCheckInEntity(entity)">
            </check-in-entity-card>
        </div>
        <div v-if="show_pagination" class="entity-check-in-subpage__footer">
            <div class="entity-check-in-subpage__footer__content">
                <pagination ref="pagination"
                            :paginated_items="paginated_items"
                            v-on:page-changed="handleActivePageChange"></pagination>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import {AUTOLOAD_ENTITY_CHECK_IN_INDEX} from '../../../../config/AppConfig';
    import HasPaginatedItems from '../../../../mixins/HasPaginatedItems';
    import CheckInEntityCard from '../../_components/CheckInEntityCard.vue';
    import {
        CheckInCompetitionInterface,
        CheckInIndexFilterCriteria,
        CheckInIndexStatusFilter
    } from '../../_contracts/CheckInContracts';
    import {CheckInIndexEntity} from '../../_contracts/CheckInEntityContracts';
    import CompetitionManagementCheckInFilters from './_components/CheckInIndexFilters.vue';

    const vueClass = mixins(HasPaginatedItems);
    // @vue/component
    export default vueClass.extend({
        components: {
            CheckInEntityCard,
            CompetitionManagementCheckInFilters
        },
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * The active filter criteria for the entity list
                 */
                filter_criteria: <CheckInIndexFilterCriteria>{
                    /**
                     * The text term entered by the user
                     */
                    filter_term: '',
                    /**
                     * The status filters selected by the user
                     */
                    selected_status_filters: <CheckInIndexStatusFilter[]> [
                        {
                            label: 'Checked-In',
                            value: 'checked_in'
                        },
                        {
                            label: 'Not Checked-In',
                            value: 'not_checked_in'
                        },
                        {
                            label: 'Ineligible',
                            value: 'ineligible'
                        }
                    ]
                },
                /**
                 * The amount of items per page of pagination
                 */
                pagination_per_page: 50
            };
        },
        computed: {
            /**
             * The active competition
             */
            competition: function (): CheckInCompetitionInterface {
                return this.$store.state.checkin.active_competition;
            },
            /**
             * List of entities that pass filters
             */
            filtered_entities: function (): CheckInIndexEntity[] {
                return this.$store.getters['checkin/filtered_checkin_entities'](this.filter_criteria);
            },
            /**
             * The CheckInIndexEntity items to paginate
             */
            pagination_items: function (): CheckInIndexEntity[] {
                return this.filtered_entities;
            },
            /**
             * The entities visible on the active page
             */
            display_entities: function (): CheckInIndexEntity[] {
                return this.visible_items;
            }
        },
        /**
         * On component mount, autoload entity if configured to do so
         */
        mounted: function () {
            if (typeof AUTOLOAD_ENTITY_CHECK_IN_INDEX === 'number') {
                this.beginCheckInEntity(this.filtered_entities[AUTOLOAD_ENTITY_CHECK_IN_INDEX]);
            }
        },
        methods: {
            /**
             * Trigger event to load check-in flow for the provided entity.
             */
            beginCheckInEntity: function (entity: CheckInIndexEntity) {
                this.$emit('check-in', entity);
            },
            /**
             * Open the email overlay
             */
            emailOverlayOpen: function (): void {
                this.$emit('open-email-form');
            },
            /**
             * Handle filter change event
             */
            handleFilterChange: function (values: CheckInIndexFilterCriteria) {
                this.filter_criteria = values;
            },
            /**
             * Trigger event to view comments for the provided entity.
             */
            viewComments: function (entity: CheckInIndexEntity) {
                this.$emit('view-comments', entity);
            }
        }
    });
</script>