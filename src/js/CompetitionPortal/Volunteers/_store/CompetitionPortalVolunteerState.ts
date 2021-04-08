import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {MyVolunteerScheduleDay, MyVolunteerScheduleShift} from '../_pages/MySchedule/_models';
import {CompetitionPortalVolunteerApiService} from '../_services/CompetitionPortalVolunteerApiService';
import {CompetitionPortalVolunteer, CompetitionPortalVolunteerService} from '../_contracts';
import {CompetitionContact} from '../../../contracts/AppContracts';

export class State {
    contacts: CompetitionContact[] = [];

    links: CompetitionPortalVolunteer.MyVolunteerScheduleLinks = {
        download_schedule: '',
        user_compliance: '',
        product_support: ''
    };

    user_is_compliant: boolean = true;
    user_schedule: MyVolunteerScheduleDay[] = [];
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch information needed by the My Volunteer Schedule page
     */
    fetchMyVolunteerSchedule: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalVolunteerApiService.fetchMyVolunteerSchedule()
                .then((response: CompetitionPortalVolunteerService.FetchMyVolunteerScheduleServiceResponse) => {
                    context.dispatch('competition_portal/setCompetitionPortalCore', response, {root: true});
                    context.commit('setMyScheduleLinks', response.links);
                    context.commit('setSchedule', response.schedule);
                    context.commit('setUserIsCompliant', response.user_is_compliant);
                    context.commit('setContacts', response.contacts);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Remove a shift from the active user's volunteer schedule
     */
    removeShift: function (context, shift: MyVolunteerScheduleShift): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalVolunteerApiService.removeShift(shift)
                .then(() => {
                    context.commit('removeShift', shift);
                    resolve();
                })
                .catch((error: string) => {
                    reject(error);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{};

const mutations = <MutationTree<State>>{
    /**
     * Remove a shift from the active user's volunteer schedule in state
     */
    removeShift: function (state, shift: MyVolunteerScheduleShift) {
        for (let i = 0; i < state.user_schedule.length; i++) {
            const schedule_day = state.user_schedule[i];
            if (schedule_day.id === shift.schedule_day_id) {
                for (let j = 0; j < schedule_day.shifts.length; j++) {
                    const shift_day = schedule_day.shifts[j];
                    if (shift_day.id === shift.id) {
                        schedule_day.shifts.splice(j, 1);

                        return;
                    }
                }
            }
        }
    },
    /**
     * Set contacts for my schedule page in state
     */
    setContacts: function (state, payload: CompetitionContact[]) {
        state.contacts = payload;
    },
    /**
     * Set links for my schedule page in state
     */
    setMyScheduleLinks: function (state, payload: CompetitionPortalVolunteer.MyVolunteerScheduleLinks) {
        state.links = {
            ...payload
        };
    },
    /**
     * Set the schedule in state
     */
    setSchedule: function (state, payload: MyVolunteerScheduleDay[]) {
        state.user_schedule = payload;
    },

    /**
     * Set the user's compliance status relative to the schedule in state
     */
    setUserIsCompliant(state, payload: boolean) {
        state.user_is_compliant = payload;
    }
};

export const CompetitionPortalVolunteerState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};