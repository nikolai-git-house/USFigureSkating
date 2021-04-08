<template>
    <div class="competition-management-contacts-index">
        <div class="competition-management-contacts-index__tabs page--accent__standard-content">
            <div class="tabs tabs--justified tabs--equal tabs--reduced-more">
                <div class="tabs__triggers">
                    <ul class="tabs__list">
                        <li class="tabs__item">
                            <a href="#competition-management-contact-list"
                               class="tabs__trigger"
                               :class="{'active':active_type==='contact'}"
                               v-on:click.prevent="selectActiveType('contact')">
                                LOC Contacts
                            </a>
                        </li>
                        <li class="tabs__item">
                            <a href="#competition-management-contact-list"
                               class="tabs__trigger"
                               :class="{'active':active_type==='official'}"
                               v-on:click.prevent="selectActiveType('official')">
                                Officials
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="competition-management-contacts-index__body">
            <page-alert class="page-alert page-alert--notice page-alert--medium page--accent__standard-content">
                <div slot="trigger_text">
                    Information
                </div>
                <div slot="expand_content">
                    <p>
                        After you set up your competition, we recommend you add or update your key LOC members for EMS
                        access. Here, you can edit which LOC member email addresses are visible to skaters and coaches.
                    </p>
                    <p>
                        Please note, all LOC members must have an active U.S. Figure Skating account (i.e. club
                        membership or volunteer account).
                    </p>
                </div>
            </page-alert>
            <div class="competition-management-contacts-index__search">
                <label for="competition-management-contacts-index-search-input" class="sr-only">Search Input</label>
                <input id="competition-management-contacts-index-search-input"
                       v-model="active_free_filter"
                       placeholder="Search by Name, Member # or Position"
                       class="form-field form-field--search form-field--reduced-right">
            </div>
            <div class="competition-management-contacts-index__controls">
                <button class="add-link add-link--sm" v-on:click.prevent="$emit('open-add')">
                    Add {{active_type_label}}
                </button>
                <a href="#"
                   class="standard-link standard-link--no-visited"
                   v-on:click.prevent="$emit('open-filters')">
                    Filter
                </a>
            </div>
            <div id="competition-management-contact-list" class="competition-management-contacts-index__contact-list">
                <p v-if="active_list_entities.length===0" class="text--alert">
                    {{no_items_message}}
                </p>
                <p v-else-if="visible_entities.length===0" class="text--muted">
                    No {{active_type_label}}s match your current filters.
                </p>
                <status-entity-card v-for="(entity,index) in visible_entities"
                                    v-else
                                    :key="entity.id"
                                    ref="entities"
                                    :is_success="entity.is_compliant">
                    <div slot="primary-content">
                        {{entity.last_name}}, {{entity.first_name}}
                        <span class="text--muted">({{entity.member_number}})</span>
                    </div>
                    <div slot="secondary-content" slot-scope="slotProps">
                        <p class="status-entity-card__secondary status-entity-card__secondary--highlight">
                            {{entity.position.label}}
                        </p>
                        <ul class="status-entity-card__secondary-list">
                            <li>
                                <a class="standard-link" :href="'mailto:'+entity.email_address">
                                    {{entity.email_address}}
                                </a>
                            </li>
                            <li>
                                <a class="standard-link" :href="'tel:'+entity.phone_number">
                                    {{entity.phone_number}}
                                </a>
                            </li>
                        </ul>
                        <p v-if="active_type==='contact' && !slotProps.card_expanded" class="status-entity-card__secondary">
                            Skater Contact: {{entity.is_display?'Yes':'No'}}
                        </p>
                    </div>
                    <div slot="actions"
                         slot-scope="slotProps"
                         class="competition-management-contacts-index__entity-card-actions">
                        <button v-show="active_type==='contact'"
                                class="icon-button icon-button--edit icon-button--sm icon-button--pseudo"
                                :class="{'icon-edit--disabled':slotProps.expanded}"
                                :disabled="remove_entity.confirmation_id || entityDisplayChanging(entity)"
                                v-on:click.prevent="clearDisplayStatus(entity,slotProps.expandHandler)">
                            edit
                        </button>
                        <button class="icon-button icon-button--delete icon-button--sm icon-button--pseudo"
                                :class="{'icon-button--delete--disabled' : preventEntityRemove(entity)}"
                                :disabled="remove_entity.confirmation_id || entityDisplayChanging(entity)"
                                v-on:click.prevent="removeEntity(entity)">
                            delete
                        </button>
                    </div>
                    <div slot="expand-content" class="competition-management-contacts-index__entity-display-edit">
                        <p class="competition-management-contacts-index__entity-display-edit__description">
                            Display as a contact on the Competitor/Coach portals? Name and email will show if marked
                            Yes.
                        </p>
                        <div class="competition-management-contacts-index__entity-display-edit__controls">
                            <label :for="'entity_contact_yes'+entity.id"
                                   :disabled="entityDisplayChanging(entity)"
                                   class="usfsa-radio usfsa-radio--small">
                                <input :id="'entity_contact_yes'+entity.id"
                                       type="radio"
                                       :name="'entity_contact'+entity.id"
                                       :checked="entity.is_display"
                                       :disabled="entityDisplayChanging(entity)"
                                       v-on:click.prevent="changeEntityDisplay(entity,true,index)">
                                <span class="usfsa-radio__text text--muted">Yes</span>
                            </label>
                            <label :for="'entity_contact_no'+entity.id"
                                   :disabled="entityDisplayChanging(entity)"
                                   class="usfsa-radio usfsa-radio--small">
                                <input :id="'entity_contact_no'+entity.id"
                                       type="radio"
                                       :name="'entity_contact'+entity.id"
                                       :checked="!entity.is_display"
                                       :disabled="entityDisplayChanging(entity)"
                                       v-on:click.prevent="changeEntityDisplay(entity,false,index)">
                                <span class="usfsa-radio__text text--muted">No</span>
                            </label>
                            <p v-if="entityDisplaySuccess(entity)" class="text--success competition-management-contacts-index__entity-display-edit__message">
                                Saved
                            </p>
                        </div>
                        <p v-if="entityDisplayError(entity)" class="text--error competition-management-contacts-index__entity-display-edit__error">
                            {{entityDisplayError(entity)}}
                        </p>
                    </div>
                    <div v-if="showEntityRemoveConfirmation(entity)"
                         slot="overlay"
                         class="card-overlay">
                        <p class="card-overlay__text">
                            Are you sure you want to remove
                            <br>
                            this person from the {{active_type_label}}s list?
                        </p>
                        <div class="card-overlay__controls">
                            <div class="card-overlay__controls__control">
                                <button class="button button--info button--block"
                                        :disabled="remove_entity.submitting"
                                        v-on:click.prevent="entityRemoveCancel">
                                    Cancel
                                </button>
                            </div>
                            <div class="card-overlay__controls__control">
                                <button class="button button--primary button--block"
                                        :disabled="remove_entity.submitting"
                                        v-on:click.prevent="removeEntity(entity)">
                                    Ok
                                </button>
                            </div>
                        </div>
                        <p v-if="remove_entity.error_message" class="card-overlay__error">
                            {{remove_entity.error_message}}
                        </p>
                    </div>
                </status-entity-card>
            </div>
        </div>
        <div v-if="show_pagination" class="competition-management-contacts-index__footer">
            <div class="grid-container">
                <pagination ref="pagination"
                            :paginated_items="paginated_items"
                            v-on:page-changed="handleActivePageChange"></pagination>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import mixins from 'vue-typed-mixins';
    import HasPaginatedItems from '../../../../mixins/HasPaginatedItems';
    import {StatusEntityCardComponentInterface} from '../../../_contracts/AdminPortalComponentContracts';
    import {
        CompetitionManagementContactsIndexEntityInterface,
        CompetitionManagementContactTypeKey
    } from '../_contracts/CompetitionManagementContactsContracts';

    /**
     * Tracks the status of display boolean change for all entities in component
     */
    type EntityIdIndexedDisplayChangeStatus = {
        [key: string]: EntityDisplayChangeStatus;
    }

    /**
     * Tracks the status of display boolean change for a single entity
     */
    type EntityDisplayChangeStatus = {
        submitting: boolean;        // Whether the change is submitting
        success: boolean;           // Whether the change was successful
        error_message: string;      // Error associated with the submission attempt
    }

    const vueClass = mixins(HasPaginatedItems);
    // @vue/component
    export default vueClass.extend({
        /**
         * Reactive data
         */
        data: function () {
            return {
                /**
                 * Information about an entity whose boolean display status is being changed
                 */
                display_entity_change: <EntityIdIndexedDisplayChangeStatus> {},
                /**
                 * The amount of items to show on each page of pagination
                 */
                pagination_per_page: 50,
                /**
                 * Information about an entity being removed
                 */
                remove_entity: {
                    /**
                     * ID of entity for active remove confirmation
                     */
                    confirmation_id: <number | null>null,
                    /**
                     * Error message resulting from a removal attempt
                     */
                    error_message: <string>'',
                    /**
                     * Whether the removal is submitting
                     */
                    submitting: false
                }
            };
        },
        computed: {
            /**
             * The free text filter
             */
            active_free_filter: {
                /**
                 * Get from state
                 */
                get: function (): string {
                    return this.$store.state.competition_management.contacts.active_filters.free;
                },
                /**
                 * Set in state
                 */
                set: function (value: string) {
                    this.$store.commit('competition_management/contacts/setFreeFilter', value);
                }
            },
            /**
             * The full unfiltered list of active type entities
             */
            active_list_entities: function () {
                return this.$store.getters['competition_management/contacts/active_list'];
            },
            /**
             * The active contact type on the page ('contact' or 'official')
             */
            active_type: {
                /**
                 * Get from state
                 */
                get: function (): CompetitionManagementContactTypeKey {
                    return this.$store.state.competition_management.contacts.active_type;
                },
                /**
                 * Set in state
                 */
                set: function (value: CompetitionManagementContactTypeKey) {
                    this.$store.commit('competition_management/contacts/setActiveType', value);
                }
            },
            /**
             * The active type display label
             */
            active_type_label: function (): string {
                return this.$store.getters['competition_management/contacts/active_type_label'];
            },
            /**
             * Entities that pass active filters
             */
            entities_filtered: function (): CompetitionManagementContactsIndexEntityInterface[] {
                return this.$store.getters['competition_management/contacts/active_list_filtered'];
            },
            /**
             * Message to show when no entities are available for a tab
             */
            no_items_message: function () {
                return `There are no ${this.active_type_label}s configured for this competition.`;
            },
            /**
             * The items to paginate.  Filtered entities in alphabetical order
             */
            pagination_items: function (): CompetitionManagementContactsIndexEntityInterface[] {
                return this.entities_filtered.slice()
                    .sort((item1: CompetitionManagementContactsIndexEntityInterface, item2: CompetitionManagementContactsIndexEntityInterface) => {
                        return item1.last_name.localeCompare(item2.last_name);
                    });
            },
            /**
             * The set of entities currently visible on the active pagination page
             */
            visible_entities: function (): CompetitionManagementContactsIndexEntityInterface[] {
                return this.visible_items;
            }
        },
        methods: {
            /**
             * Whether the removal for an entity is disabled
             */
            preventEntityRemove: function (entity: CompetitionManagementContactsIndexEntityInterface): boolean {
                return !this.$store.getters['competition_management/contacts/entity_can_be_removed'](entity, this.active_type);
            },
            /**
             * Change whether an entity is set to display for the competition
             */
            changeEntityDisplay: function (entity: CompetitionManagementContactsIndexEntityInterface, is_display: boolean, index: number) {
                if (is_display === entity.is_display) {
                    return;
                }
                // Track status of entity submission
                this.$set(this.display_entity_change, entity.id.toString(), {
                    submitting: true,
                    error_message: '',
                    success: false
                });
                // Report change to store
                this.$store.dispatch('competition_management/contacts/changeEntityDisplay', {
                    entity,
                    is_display
                })
                    .then(() => {
                        // Set to success status, and clear after 2 seconds
                        this.$set(this.display_entity_change, entity.id.toString(), {
                            submitting: false,
                            error_message: '',
                            success: true
                        });
                        setTimeout(() => {
                            this.clearDisplayStatus(entity);
                            this.closeEntityCard(index);
                        }, 2000);
                    })
                    .catch((error: string) => {
                        // Set to error status, and clear after 2 seconds
                        this.$set(this.display_entity_change, entity.id.toString(), {
                            submitting: false,
                            error_message: error,
                            success: false
                        });
                        setTimeout(() => {
                            this.clearDisplayStatus(entity);
                        }, 2000);
                    });
            },
            /**
             * Clear the display change status on an entity
             */
            clearDisplayStatus: function (entity: CompetitionManagementContactsIndexEntityInterface, toggleFn?: Function) {
                if (Object.prototype.hasOwnProperty.call(this.display_entity_change, entity.id.toString())) {
                    this.$delete(this.display_entity_change, entity.id.toString());
                }
                if (typeof toggleFn == 'function') {
                    toggleFn();
                }
            },
            /**
             * Close an entity card by index
             */
            closeEntityCard: function (index: number) {
                const entities: StatusEntityCardComponentInterface[] = <StatusEntityCardComponentInterface[]> this.$refs.entities;
                const entity_card = entities[index];
                if (entity_card) {
                    entity_card.close();
                }
            },
            /**
             * Whether an entity display status change is submitting
             */
            entityDisplayChanging: function (entity: CompetitionManagementContactsIndexEntityInterface): boolean {
                if (Object.prototype.hasOwnProperty.call(this.display_entity_change, entity.id.toString())) {
                    return this.display_entity_change[entity.id].submitting === true;
                }

                return false;
            },
            /**
             * The error for an entity's display change submission
             */
            entityDisplayError: function (entity: CompetitionManagementContactsIndexEntityInterface): string {
                if (Object.prototype.hasOwnProperty.call(this.display_entity_change, entity.id.toString())) {
                    return this.display_entity_change[entity.id].error_message;
                }

                return '';
            },
            /**
             * Whether an entity has a success state on its display change submission
             */
            entityDisplaySuccess: function (entity: CompetitionManagementContactsIndexEntityInterface): boolean {
                if (Object.prototype.hasOwnProperty.call(this.display_entity_change, entity.id.toString())) {
                    return this.display_entity_change[entity.id].success === true;
                }

                return false;
            },
            /**
             * Cancel the removal of an entity via confirmation dialog
             */
            entityRemoveCancel: function (): void {
                this.remove_entity.confirmation_id = null;
                this.remove_entity.error_message = '';
            },
            /**
             * Remove an entity
             *
             * Require confirmation before performing actual removal
             */
            removeEntity: function (entity: CompetitionManagementContactsIndexEntityInterface) {
                if (this.preventEntityRemove(entity)) {
                    this.showRemovalPreventedNotice(entity);

                    return;
                }
                // Do nothing if the entity is being removed
                if (this.remove_entity.submitting) {
                    return;
                }
                // If the entity hasn't been confirmed for removal, prompt
                if (this.remove_entity.confirmation_id !== entity.id) {
                    this.remove_entity.confirmation_id = entity.id;

                    return;
                }
                // Set initial state for removal
                this.remove_entity.error_message = '';
                this.remove_entity.submitting = true;

                // Report change to store
                this.$store.dispatch('competition_management/contacts/removeContact', {
                    entity
                })
                    .then(() => {
                        this.remove_entity.confirmation_id = null;
                        this.remove_entity.submitting = false;
                        this.remove_entity.error_message = '';
                    })
                    .catch((error_message: string) => {
                        this.remove_entity.error_message = error_message;
                        this.remove_entity.submitting = false;
                    });

            },
            /**
             * Select the active competition type
             */
            selectActiveType: function (type: CompetitionManagementContactTypeKey) {
                this.active_type = type;
                this.remove_entity.confirmation_id = null;
                this.remove_entity.submitting = false;
                this.remove_entity.error_message = '';
            },
            /**
             * Whether to show the entity removal confirmation for an entity
             */
            showEntityRemoveConfirmation: function (entity: CompetitionManagementContactsIndexEntityInterface): boolean {
                return entity.id === this.remove_entity.confirmation_id;
            },
            /**
             * Show the alert notice that the user can't delete the last instance of a required role
             */
            showRemovalPreventedNotice: function (entity: CompetitionManagementContactsIndexEntityInterface) {
                const message = `There must be at least one <span class="nowrap text--highlight">${entity.position.label}</span> for this competition.  If you would like to remove <span class="nowrap text--highlight">${entity.first_name} ${entity.last_name}</span>, add a new <span class="nowrap text--highlight">${entity.position.label}</span> then remove <span class="nowrap text--highlight">${entity.first_name} ${entity.last_name}</span>.`;
                this.$store.commit('app/setNotice', {
                    notice: message
                });
            }
        }
    });
</script>