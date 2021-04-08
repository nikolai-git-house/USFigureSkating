import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {TeamRegistrationEventSelectionApiService} from '../_services/TeamRegistrationEventSelectionApiService';
import {EventSelectionEvent} from '../_models';
import {TeamRegistrationService} from '../_contracts';

export class State {
    events: EventSelectionEvent[] = [];
}

const actions = <ActionTree<State, any>>{
    /**
     * Select an event for registration
     */
    addEvent: function (context, event: EventSelectionEvent) {
        return new Promise((resolve, reject) => {
            TeamRegistrationEventSelectionApiService.addEvent(event.id)
                .then((response: TeamRegistrationService.AddEventServiceResponse) => {
                    context.commit('setEvents', response.events);
                    resolve();
                })
                .catch((error_message: string) => {
                    reject(error_message);
                });
        });
    },
    /**
     * Fetch Event Selection
     */
    fetch: function (context) {
        return new Promise((resolve, reject) => {
            TeamRegistrationEventSelectionApiService.fetchEventSelection()
                .then((response: TeamRegistrationService.FetchEventSelectionServiceResponse) => {
                    context.commit('setEvents', response.events);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Remove a selected event from registration
     */
    removeEvent: function (context, event: EventSelectionEvent) {
        return new Promise((resolve, reject) => {
            TeamRegistrationEventSelectionApiService.removeEvent(event.id)
                .then((response: TeamRegistrationService.RemoveEventServiceResponse) => {
                    context.commit('setEvents', response.events);
                    resolve();
                })
                .catch((error_message: string) => {
                    reject(error_message);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{};

const mutations = <MutationTree<State>>{
    /**
     * Set events in state
     */
    setEvents: function (state, payload: EventSelectionEvent[]) {
        state.events = payload;
    }
};

export const TeamRegistrationEventSelectionState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};