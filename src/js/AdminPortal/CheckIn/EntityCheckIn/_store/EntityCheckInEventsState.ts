import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {
    CheckInEvent,
    CheckInEventSegment,
    CheckInEventSegmentStatusOverridePayload
} from '../../_contracts/CheckInContracts';
import {CheckInEntityStateInterface} from '../../_contracts/CheckInEntityContracts';
import {FetchCheckInEventsResponse} from '../_contracts/EntityCheckInServiceContracts';
import CheckInEventsService from '../_services/EntityCheckInEventsService';

export class State {
    /**
     * List of CheckInEvents (with cCheckInEventSegments) for active entity
     */
    events: CheckInEvent[] = [];
    /**
     * The id of the entity to which the events currently in state belong
     */
    events_entity_id: string | null = null;

    /**
     * Find CheckInEvent in state
     */
    findEvent(id: number): CheckInEvent | null {
        for (let i = 0; i < this.events.length; i++) {
            const activeEntityEvent = this.events[i];
            if (activeEntityEvent.id === id) {
                return activeEntityEvent;
            }
        }

        return null;
    }

    /**
     * Find an CheckInEventSegment in state
     */
    findEventSegment(id: number, event_id: number): CheckInEventSegment | null {
        const event = this.findEvent(event_id);
        if (event) {
            for (let j = 0; j < event.segments.length; j++) {
                const eventElement = event.segments[j];
                if (eventElement.id === id) {
                    return eventElement;
                }
            }
        }

        return null;
    }
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch the list of events for the active check-in entity
     */
    fetchEvents: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            const active_entity: CheckInEntityStateInterface = context.rootState.checkin.active_entity;

            if (!active_entity) {
                reject('No active check-in entity');

                return;
            }
            const active_entity_id = active_entity.id;
            // If the active list is for the active entity, do nothing
            if (context.state.events_entity_id === active_entity_id) {
                resolve();

                return;
            }
            CheckInEventsService.fetchActiveEntityEvents()
                .then((response: FetchCheckInEventsResponse) => {
                    context.commit('setEvents', response);
                    context.commit('setEventsEntityId', active_entity_id);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Set the music status overridden state on a CheckInEventSegment
     */
    overrideEventSegmentMusicStatus: function (context, payload: CheckInEventSegmentStatusOverridePayload): Promise<void> {
        return new Promise((resolve, reject) => {
            CheckInEventsService.overrideActiveEntityEventSegmentMusicStatus(payload)
                .then(() => {
                    context.commit('setEventSegmentMusicStatusOverride', payload);
                    context.commit('checkin/setActiveEntityEventsComplete', context.getters.entity_complete, {root: true});
                    resolve();
                })
                .catch((message: string) => {
                    reject(message);
                });
        });
    },

    /**
     * Set the ppc status overridden state on a CheckInEventSegment
     */
    overrideEventSegmentPpcStatus: function (context, payload: CheckInEventSegmentStatusOverridePayload) {
        return new Promise((resolve, reject) => {
            CheckInEventsService.overrideActiveEntityEventPPCStatus(payload)
                .then(() => {
                    context.commit('setEventSegmentPpcStatusOverride', payload);
                    context.commit('checkin/setActiveEntityEventsComplete', context.getters.entity_complete, {root: true});
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
     * The list of CheckInEvent items for the active entity
     */
    events: function (state): CheckInEvent[] {
        return state.events;
    },

    /**
     * Whether all CheckInEvents are checkin-complete
     */
    entity_complete: function (state, getters): boolean {
        const entity_events = getters.events;
        for (let i = 0; i < entity_events.length; i++) {
            const event = entity_events[i];
            if (!getters.eventCheckInComplete(event)) {
                return false;
            }
        }

        return true;
    },

    /**
     * Whether a given CheckInEventSegment is PPC and Music complete
     */
    segmentCheckInComplete: function (state, getters): (segment: CheckInEventSegment) => boolean {
        return function (segment: CheckInEventSegment): boolean {
            return getters.segmentCheckInMusicComplete(segment) && getters.segmentCheckInPpcComplete(segment);
        };
    },

    /**
     * Whether a given CheckInEventSegment is Music complete
     */
    segmentCheckInMusicComplete: function (): (segment: CheckInEventSegment) => boolean {
        return function (segment: CheckInEventSegment): boolean {
            return segment.music_required === false || segment.music_status.completed || segment.music_status.overridden;
        };
    },

    /**
     * Whether a given CheckInEventSegment is PPC complete
     */
    segmentCheckInPpcComplete: function (): (segment: CheckInEventSegment) => boolean {
        return function (segment: CheckInEventSegment): boolean {
            return segment.ppc_required === false || segment.ppc_status.completed || segment.ppc_status.overridden;
        };
    },

    /**
     * Whether a given CheckInEvent is PPC and Music complete
     */
    eventCheckInComplete: function (state, getters): (event: CheckInEvent) => boolean {
        return function (event: CheckInEvent): boolean {
            for (let i = 0; i < event.segments.length; i++) {
                const segment = event.segments[i];
                if (!getters.segmentCheckInComplete(segment)) {
                    return false;
                }
            }

            return true;
        };
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Set a CheckInEventSegment item's Music status in state
     */
    setEventSegmentMusicStatusOverride: function (state, payload: CheckInEventSegmentStatusOverridePayload) {
        const event = state.findEventSegment(payload.segment.id, payload.segment.event_id);
        if (event) {
            event.music_status.overridden = payload.is_overridden;
        }
    },

    /**
     * Set a CheckInEventSegment item's PPC status in state
     */
    setEventSegmentPpcStatusOverride: function (state, payload: CheckInEventSegmentStatusOverridePayload) {
        const event = state.findEventSegment(payload.segment.id, payload.segment.event_id);
        if (event) {
            event.ppc_status.overridden = payload.is_overridden;
        }
    },
    /**
     * Set the active events in state
     */
    setEvents: function (state, events: CheckInEvent[]) {
        state.events = events;
    },
    /**
     * Set the ID for the entity owning the events in state
     */
    setEventsEntityId: function (state, id: string) {
        state.events_entity_id = id;
    }
};

export const EntityCheckInEventsState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};