import {ActionTree, GetterTree, MutationTree} from "vuex"
import {CoachService} from "../../services/CoachService";
import {CoachSkater} from "../../contracts/AppContracts";
import {SessionCollection} from "../../models/Collections/SessionCollection";
import {CoachSkatersSchedule} from "../../models/Schedule/CoachSkatersSchedule";


export class State {
    active_competition_skaters: CoachSkater[] = [];
    active_competition_skater_schedule: CoachSkatersSchedule = CoachSkatersSchedule.blank()
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch the list of coached skaters for the competition, along with their Music and PPC Status
     *
     * @deprecated 2020-07-28
     */
    fetchCompetitionSkaters: function (context, competition_id: number) {
        return new Promise(function (resolve, reject) {
            CoachService.fetchCompetitionSkaters(competition_id).then(function (result: CoachSkater[]) {
                context.commit('setCompetitionSkaters', result);
                resolve();
            }).catch(function () {
                reject();
            })
        });
    },

    /**
     * Fetch the CoachSkaterSchedule for a competition
     *
     * @deprecated 2020-07-29
     */
    fetchCompetitionSkatersSchedule: function (context, competition_id: number) {
        return new Promise(function (resolve, reject) {
            CoachService.fetchCompetitionSkaterSchedule(competition_id).then(function (result: CoachSkatersSchedule) {
                context.commit('setCompetitionSkaterSchedule', result);
                resolve();
            }).catch(function () {
                reject();
            })
        });
    }
};

const getters = <GetterTree<State, any>>{
    active_competition_skater_sessions: function (state): SessionCollection {
        return state.active_competition_skater_schedule.sessions;
    },
    /**
     * Get the coached skaters for a given Session within the active schedule
     */
    session_skaters: function (state) {
        return function (session_id: number) {
            return state.active_competition_skater_schedule.getSessionSkaters(session_id);
        }
    }
};

const mutations = <MutationTree<State>>{
    setCompetitionSkaters: function (state, skaters: CoachSkater[]) {
        state.active_competition_skaters = skaters;
    },
    setCompetitionSkaterSchedule: function (state, schedule: CoachSkatersSchedule) {
        state.active_competition_skater_schedule = schedule;
    }
};


export const CoachState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};