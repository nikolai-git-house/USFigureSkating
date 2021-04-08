import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {
    CheckEntityInPayload,
    CheckInCompetitionInterface,
    CheckInEntityCoachedSkater,
    CheckInIndexFilterCriteria,
    CheckInIndexStatusFilter,
    CheckInIndexStatusFilterValue,
    UpdateEntityCheckInStatusStatePayload
} from '../_contracts/CheckInContracts';
import {CheckActiveEntityInResponse, FetchCheckInEntitiesResponse} from '../_contracts/CheckInServiceContracts';
import {AbstractCheckInEntity} from '../_models/CheckInEntities/AbstractCheckInEntity';
import CheckInService from '../_services/CheckInService';
import {FetchCheckInCoachedSkatersResponse} from '../EntityCheckIn/_contracts/EntityCheckInServiceContracts';
import SkatersCheckInService from '../EntityCheckIn/_services/EntityCheckInSkatersService';
import {EntityCheckInCommentsState} from '../EntityCheckIn/_store/EntityCheckInCommentsState';
import {EntityCheckInComplianceState} from '../EntityCheckIn/_store/EntityCheckInComplianceState';
import {EntityCheckInEventsState} from '../EntityCheckIn/_store/EntityCheckInEventsState';
import {EntityCheckInRosterState} from '../EntityCheckIn/_store/EntityCheckInRosterState';
import {EntityCheckInSkaterCoachesState} from '../EntityCheckIn/_store/EntityCheckInSkaterCoachesState';
import {EntityCheckInTeamCoachesState} from '../EntityCheckIn/_store/EntityCheckInTeamCoachesState';
import {EntityCheckInTeamServicePersonnelState} from '../EntityCheckIn/_store/EntityCheckInTeamServicePersonnelState';

export class State {
    /**
     * The active competition for check-in
     */
    active_competition: CheckInCompetitionInterface | null = null;
    /**
     * The active entity being checked in
     */
    active_entity: AbstractCheckInEntity | null = null;
    /**
     * List of coached skaters for active entity
     */
    active_entity_coached_skaters: CheckInEntityCoachedSkater[] = [];
    /**
     * Entity owning the list of coached skaters in state
     */
    active_entity_coached_skaters_entity_id: string | null = null;
    /**
     * The list of entities for checkin
     */
    checkin_entities: AbstractCheckInEntity[] = [];
    /**
     * Whether checkin entities have been fetched
     */
    checkin_entities_fetched: boolean = false;
}

const actions = <ActionTree<State, any>>{
    /**
     * Check the active entity in
     */
    checkActiveEntityIn: function (context, payload: CheckEntityInPayload): Promise<void> {
        return new Promise((resolve, reject) => {
            const entity = context.state.active_entity;
            if (!entity) {
                console.error('No active entity to check in');
                reject('No entity');

                return;
            }
            CheckInService.checkActiveEntityIn(payload)
                .then((response: CheckActiveEntityInResponse) => {
                    const payload: UpdateEntityCheckInStatusStatePayload = {
                        status: response,
                        entity
                    };
                    context.commit('setEntityCheckInStatus', payload);
                    context.commit('comments/setCommentsEntityId', null);
                    resolve();
                })
                .catch((message: string) => {
                    reject(message);
                });
        });
    },
    /**
     * Fetch the list of coached skaters for the active entity
     */
    fetchCoachedSkaters: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            const active_entity = context.state.active_entity;
            if (!active_entity) {
                reject('No active check-in entity');

                return;
            }
            const active_entity_id = active_entity.id;
            // If the active skater list is for the active entity, do nothing
            if (context.state.active_entity_coached_skaters_entity_id === active_entity_id) {
                resolve();

                return;
            }
            SkatersCheckInService.fetchActiveEntityCoachedSkaters()
                .then((response: FetchCheckInCoachedSkatersResponse) => {
                    context.commit('setActiveCoachedSkatersEntityId', active_entity_id);
                    context.commit('setActiveCoachedSkaters', response);
                    resolve();
                })
                .catch(() => {
                    reject();
                });

        });
    },

    /**
     * Fetch the check-in entity list
     */
    fetchEntities: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            if (context.state.checkin_entities_fetched) {
                resolve();

                return;
            }
            CheckInService.fetchActiveCompetitionCheckInEntities()
                .then((response: FetchCheckInEntitiesResponse) => {
                    context.commit('setCheckInEntities', response);
                    context.commit('setCheckInEntitiesFetched', true);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch additional data needed by the active check-in entity to begin check-in
     */
    fetchEntityCheckIn: function (context) {
        return new Promise((resolve, reject) => {
            const active_entity = context.state.active_entity;
            if (!active_entity) {
                console.warn('No active entity');
                reject();

                return;
            }
            if (!active_entity.check_in_fetch_required) {
                resolve();

                return;
            }
            CheckInService.fetchEntityCheckIn(active_entity)
                .then((response: AbstractCheckInEntity) => {
                    context.commit('setActiveCheckInEntity', response);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Undo check-in for the active entity
     */
    undoEntityCheckIn: function (context, entity: AbstractCheckInEntity): Promise<void> {
        return new Promise((resolve, reject) => {
            CheckInService.undoEntityCheckIn(entity)
                .then(() => {
                    const payload: UpdateEntityCheckInStatusStatePayload = {
                        status: {
                            checked_in: false,
                            checked_in_by: null,
                            checked_in_date_time_formatted: null,
                            credential_received: false,
                            unpaid_fees_received: false
                        },
                        entity
                    };
                    context.commit('setEntityCheckInStatus', payload);
                    context.commit('comments/setCommentsEntityId', null);
                    resolve();
                })
                .catch((message: string) => {
                    reject(message);
                });
        });
    }

};

const getters = <GetterTree<State, any>>{

    /**
     * The name of the active checkin entity
     */
    active_entity_name: function (state): string {
        if (state.active_entity) {
            return state.active_entity.name;
        }

        return '';
    },

    /**
     * The level of the active checkin entity, if applicable
     */
    active_entity_level: function (state): string | false {
        if (state.active_entity) {
            return state.active_entity.team_level || false;
        }

        return false;
    },
    /**
     * Full list of entities to show on checkin page
     */
    checkin_entities: function (state): AbstractCheckInEntity[] {
        return state.checkin_entities;
    },
    /**
     * The count associated with a certain check in entity status type
     */
    checkin_entity_count: function (state, getters): (filter_key: CheckInIndexStatusFilterValue) => number {
        return function (filter_key: CheckInIndexStatusFilterValue) {
            const checkinEntities = getters.checkin_entities;
            if (filter_key === 'all') {
                return checkinEntities.length;
            }
            if (filter_key === 'checked_in') {
                return checkinEntities.filter(getters.entityIsCheckedIn).length;
            }
            if (filter_key === 'not_checked_in') {
                return checkinEntities.filter(getters.entityIsNotCheckedIn).length;
            }

            return checkinEntities.filter(getters.entityIsIneligible).length;

        };
    },
    /**
     * CheckIn Entities that pass a provided set of CheckInFilterCriteria
     */
    filtered_checkin_entities: function (state, getters): (filter_criteria: CheckInIndexFilterCriteria) => AbstractCheckInEntity[] {
        return function (filter_criteria: CheckInIndexFilterCriteria) {
            return getters.checkin_entities.filter((entity: AbstractCheckInEntity) => {
                if (!getters.entityPassesStatusFilters(entity, filter_criteria.selected_status_filters)) {
                    return false;
                }

                return getters.entityPassesFreeFilter(entity, filter_criteria.filter_term);
            });
        };
    },
    /**
     * Whether an entity is Checked In
     */
    entityIsCheckedIn: function (): (entity: AbstractCheckInEntity) => boolean {
        return function (entity: AbstractCheckInEntity): boolean {
            return entity.checked_in;
        };
    },
    /**
     * Whether an entity is Ineligible
     */
    entityIsIneligible: function (): (entity: AbstractCheckInEntity) => boolean {
        return function (entity: AbstractCheckInEntity): boolean {
            return !entity.checked_in && !entity.eligible;
        };
    },
    /**
     * Whether an entity is Not Checked In
     */
    entityIsNotCheckedIn: function (): (entity: AbstractCheckInEntity) => boolean {
        return function (entity: AbstractCheckInEntity): boolean {
            return !entity.checked_in && entity.eligible;
        };
    },
    /**
     * Whether a checkin entity passes the status filter(s)
     */
    entityPassesStatusFilters: function (state, getters): (entity: AbstractCheckInEntity, filters: CheckInIndexStatusFilter[]) => boolean {
        return function (entity: AbstractCheckInEntity, filters: CheckInIndexStatusFilter[]) {
            const status_filter_values = filters.map((filter: CheckInIndexStatusFilter) => {
                return filter.value;
            });
            if (status_filter_values.indexOf('ineligible') !== -1 && getters.entityIsIneligible(entity)) {
                return true;
            }
            if (status_filter_values.indexOf('not_checked_in') !== -1 && getters.entityIsNotCheckedIn(entity)) {
                return true;
            }
            if (status_filter_values.indexOf('checked_in') !== -1 && getters.entityIsCheckedIn(entity)) {
                return true;
            }

            return false;

        };
    },
    /**
     * Whether a checkin entity passes the free filter
     */
    entityPassesFreeFilter: function (): (entity: AbstractCheckInEntity, filter_term: string) => boolean {
        return function (entity: AbstractCheckInEntity, filter_term: string) {
            filter_term = filter_term.trim()
                .toLowerCase();
            if (!filter_term) {
                return true;
            }
            if (entity.member_number.toString()
                .match(filter_term)) {
                return true;
            }
            if (entity.name.toLowerCase()
                .match(filter_term)) {
                return true;
            }
            if (entity.entity_type_description.toLowerCase()
                .match(filter_term)) {
                return true;
            }

            return false;
        };
    }
};

const mutations = <MutationTree<State>>{

    /**
     * Set the active entity being checked in
     */
    setActiveCheckInEntity: function (state, entity: AbstractCheckInEntity | null): void {
        state.active_entity = entity;
        CheckInService.active_entity = entity;
    },
    /**
     * Set the check-in information on the active entity
     */
    setEntityCheckInStatus: function (state, payload: UpdateEntityCheckInStatusStatePayload) {
        payload.entity.check_in_status = payload.status;
    },
    /**
     * Set the coach count on the active entity
     */
    setActiveEntityCoachesCount: function (state, count: number): void {
        if (!state.active_entity) {
            return;
        }
        state.active_entity.coach_count = count;
    },
    /**
     * Set the comment count on the active entity
     */
    setActiveEntityCommentCount: function (state, comment_count: number): void {
        if (!state.active_entity) {
            return;
        }
        state.active_entity.comment_count = comment_count;
    },
    /**
     * Set the events complete status on the active entity
     */
    setActiveEntityEventsComplete: function (state, is_complete: boolean): void {
        if (!state.active_entity) {
            return;
        }
        state.active_entity.events_complete = is_complete;
    },
    /**
     * Set the compliance status on the active entity
     */
    setActiveEntityIsCompliant: function (state, is_compliant: boolean): void {
        if (!state.active_entity) {
            return;
        }
        state.active_entity.is_compliant = is_compliant;
    },
    /**
     * Set the coach count on the active entity
     */
    setActiveEntityRosterCount: function (state, count: number): void {
        if (!state.active_entity) {
            return;
        }
        state.active_entity.roster_count = count;
    },
    /**
     * Set the team service personnel count on the active entity
     */
    setActiveEntityTeamServicePersonnelCount: function (state, count: number): void {
        if (!state.active_entity) {
            return;
        }
        state.active_entity.team_service_personnel_count = count;
    },
    /**
     * Set the list of checkin entities in state
     */
    setCheckInEntities: function (state, checkin_entities: AbstractCheckInEntity[]) {
        state.checkin_entities = checkin_entities;
    },
    /**
     * Set whether entities fetched in state
     */
    setCheckInEntitiesFetched: function (state, are_fetched: boolean) {
        state.checkin_entities_fetched = are_fetched;
    },
    /**
     * Set the list of coached skaters for the active entity in state
     */
    setActiveCoachedSkaters: function (state, coached_skaters: CheckInEntityCoachedSkater[]) {
        state.active_entity_coached_skaters = coached_skaters;
    },
    /**
     * Set the entity id that owns the current list of skaters
     */
    setActiveCoachedSkatersEntityId: function (state, id: string) {
        state.active_entity_coached_skaters_entity_id = id;
    },
    /**
     * Set the active competition in state
     */
    setActiveCompetition: function (state, competition: CheckInCompetitionInterface) {
        state.active_competition = competition;
        CheckInService.active_competition = competition;
    }
};

export const CheckInState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations,
    modules: {
        comments: EntityCheckInCommentsState,
        compliance: EntityCheckInComplianceState,
        events: EntityCheckInEventsState,
        roster: EntityCheckInRosterState,
        skater_coaches: EntityCheckInSkaterCoachesState,
        team_coaches: EntityCheckInTeamCoachesState,
        team_service_personnel: EntityCheckInTeamServicePersonnelState
    }
};