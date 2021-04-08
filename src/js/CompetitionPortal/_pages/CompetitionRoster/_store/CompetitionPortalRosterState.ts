import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {CompetitionPortalRosterMember} from '../_models';
import {CompetitionPortalRosterApiService} from '../_services/CompetitionPortalRosterApiService';
import {CompetitionRosterService} from '../_contracts';
import {CompetitionTeamPersonnel} from '../../CompetitionTeamPersonnel/_contracts';
import {TeamRosterMember} from '../../../../Teams/CompetitionRegistration/Registration/_models/TeamRosterMember';

export class State {
    /**
     * The selected competition roster
     */
    competition_roster: CompetitionPortalRosterMember[] = [];
    /**
     * The URL for the download roster link
     */
    download_link: string = '';
    /**
     * The loading status of edit information
     */
    edit_load_status: CompetitionTeamPersonnel.EditLoadStatus = {
        error: false,
        is_loading: false
    };

    page_introduction: string = '';

    /**
     * Whether the roster can be edited
     */
    roster_can_be_edited: boolean = true;

    /**
     * Minimum roster size allowed
     */
    roster_minimum: number | null = null;
    /**
     * Maximum roster size allowed
     */
    roster_maximum: number | null = null;
    /**
     * Rules to display when editing the roster
     */
    roster_rules: string[] = [];
    /**
     * The full team roster for the team
     */
    team_roster: TeamRosterMember[] | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch data to load the Competition Portal roster page
     */
    fetch: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalRosterApiService.fetchCompetitionRoster()
                .then((response: CompetitionRosterService.FetchCompetitionRosterServiceResponse) => {
                    context.dispatch('competition_portal/setCompetitionPortalCore', response, {root: true});
                    context.commit('setCompetitionRoster', response.competition_roster);
                    context.commit('setDownloadLink', response.download_link);
                    context.commit('setRosterRules', response.roster_rules);
                    context.commit('setRosterMinimum', response.roster_minimum);
                    context.commit('setRosterMaximum', response.roster_maximum);
                    context.commit('setRosterCanBeEdited', response.roster_can_be_edited);
                    context.commit('setPageIntroText', response.page_introduction);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Open the edit overlay
     */
    openEdit: function (context) {
        // If the full roster of the type has already been fetched, resolve immediately
        if (context.state.team_roster !== null) {
            return;
        }
        const status_payload: CompetitionTeamPersonnel.EditLoadStatus = {
            error: false,
            is_loading: true
        };
        context.commit('setEditLoadStatus', status_payload);

        CompetitionPortalRosterApiService.fetchTeamRoster()
            .then((response: CompetitionRosterService.FetchTeamRosterServiceResponse) => {
                const edit_load_status_payload: CompetitionTeamPersonnel.EditLoadStatus = {
                    error: false,
                    is_loading: false
                };
                context.commit('setTeamRoster', response.team_roster);
                context.commit('setEditLoadStatus', edit_load_status_payload);
            })
            .catch(() => {
                const edit_load_status_payload: CompetitionTeamPersonnel.EditLoadStatus = {
                    is_loading: false,
                    error: true
                };
                context.commit('setEditLoadStatus', edit_load_status_payload);
            });
    },
    /**
     * Update the competition roster
     */
    updateRoster: function (context, selected_ids: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            CompetitionPortalRosterApiService.updateCompetitionRoster(selected_ids)
                .then((response: CompetitionRosterService.UpdateCompetitionRosterServiceResponse) => {
                    context.commit('setCompetitionRoster', response.competition_roster);
                    resolve();
                })
                .catch((message: string) => {
                    reject(message);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{};

const mutations = <MutationTree<State>>{
    /**
     * Set the selected competition roster in state
     */
    setCompetitionRoster: function (state, payload: CompetitionPortalRosterMember[]) {
        state.competition_roster = payload;
    },
    /**
     * Set download link in state
     */
    setDownloadLink: function (state, payload: string) {
        state.download_link = payload;
    },
    /**
     * Set the loading status of edit information
     */
    setEditLoadStatus: function (state, payload: CompetitionTeamPersonnel.EditLoadStatus): void {
        state.edit_load_status = payload;
    },
    /**
     * Set page intro text in state
     */
    setPageIntroText: function (state, payload: string) {
        state.page_introduction = payload;
    },
    /**
     * Set whether the roster can be edited
     */
    setRosterCanBeEdited: function (state, payload: boolean) {
        state.roster_can_be_edited = payload;
    },
    /**
     * Set the roster maximum
     */
    setRosterMaximum: function (state, payload: number | null) {
        state.roster_maximum = payload;
    },
    /**
     * Set the roster minimum
     */
    setRosterMinimum: function (state, payload: number | null) {
        state.roster_minimum = payload;
    },
    /**
     * Set the roster rules
     */
    setRosterRules: function (state, payload: string[]): void {
        state.roster_rules = payload;
    },
    /**
     * Set a full roster of a certain type in state
     */
    setTeamRoster: function (state, payload: TeamRosterMember[]): void {
        state.team_roster = payload;
    }
};

export const CompetitionPortalRosterState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};