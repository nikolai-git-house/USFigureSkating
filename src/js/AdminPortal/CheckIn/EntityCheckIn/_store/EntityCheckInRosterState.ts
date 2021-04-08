import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {CheckInEntityStateInterface} from '../../_contracts/CheckInEntityContracts';
import {FetchActiveEntityRosterInformationResponse} from '../_contracts/EntityCheckInServiceContracts';
import {CheckInSubEntitySkater} from '../_models/CheckInSubEntitySkater';
import CheckInRosterService from '../_services/EntityCheckInRosterService';

export class State {
    /**
     * The ids of the roster members attending the competition
     */
    active_roster_skater_ids: number[] = [];
    /**
     * The id of the entity to which the roster data currently in state belongs
     */
    roster_entity_id: string | null = null;
    /**
     * The full team roster for the active team
     */
    team_roster: CheckInSubEntitySkater[] = [];
    /**
     * The roster rules for the team
     */
    team_roster_rules: string[] = [];
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch data needed for roster subpage and its subpages
     */
    fetchRosterInformation: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            const active_entity: CheckInEntityStateInterface = context.rootState.checkin.active_entity;

            if (!active_entity) {
                reject('No active check-in entity');

                return;
            }
            const active_entity_id = active_entity.id;
            // If the active list is for the active entity, do nothing
            if (context.state.roster_entity_id === active_entity_id) {
                resolve();

                return;
            }
            CheckInRosterService.fetchActiveEntityRosterInformation()
                .then((response: FetchActiveEntityRosterInformationResponse) => {
                    context.commit('setTeamRoster', response.roster);
                    context.commit('setActiveRosterSkaterIds', response.active_roster_skater_ids);
                    context.commit('setRosterEntityId', active_entity_id);
                    context.commit('setTeamRosterRules', response.team_roster_rules);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Update the competition roster for an entity
     */
    updateCompetitionRoster: function (context, competition_roster_team_member_ids: number[]): Promise<void> {
        return new Promise((resolve, reject) => {
            CheckInRosterService.updateActiveEntityCompetitionRoster(competition_roster_team_member_ids)
                .then(() => {
                    context.commit('setActiveRosterSkaterIds', competition_roster_team_member_ids);
                    context.commit('checkin/setActiveEntityRosterCount', competition_roster_team_member_ids.length, {root: true});
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
     * Get the list of skater ids associated with the active competition roster
     */
    active_roster_skater_ids: function (state): number[] {
        return state.active_roster_skater_ids;
    },
    /**
     * Get the full active competition roster
     */
    competition_roster: function (state, getters): CheckInSubEntitySkater[] {
        return getters.full_roster.filter((team_member: CheckInSubEntitySkater) => {
            return getters.skaterInCompetitionRoster(team_member);
        });
    },
    /**
     * The size of the active, saved competition roster
     */
    competition_roster_size: function (state, getters) {
        return getters.active_roster_skater_ids.length;
    },
    /**
     * The full team roster for the active team
     */
    full_roster: function (state): CheckInSubEntitySkater[] {
        return state.team_roster;
    },
    /**
     * The rule messages for editing the team roster
     */
    roster_rules: function (state): string[] {
        return state.team_roster_rules;
    },
    /**
     * Determine whether a skater is part of the active competition roster
     */
    skaterInCompetitionRoster: function (state, getters): (member: CheckInSubEntitySkater) => boolean {
        return function (skater: CheckInSubEntitySkater): boolean {
            return getters.active_roster_skater_ids.indexOf(skater.id) !== -1;
        };
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Update the skater ids associated with the active competition roster in state
     */
    setActiveRosterSkaterIds: function (state, skater_ids: number[]): void {
        state.active_roster_skater_ids = skater_ids;
    },
    /**
     * Set the team roster in state
     */
    setTeamRoster: function (state, data: CheckInSubEntitySkater[]): void {
        state.team_roster = data;
    },
    /**
     * Set the active roster owner entity id in state
     */
    setRosterEntityId: function (state, id: string): void {
        state.roster_entity_id = id;
    },
    /**
     * Set the team roster rules in state
     */
    setTeamRosterRules: function (state, payload: string[]): void {
        state.team_roster_rules = payload;
    }
};

export const EntityCheckInRosterState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};