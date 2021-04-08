import {ActionTree, GetterTree, MutationTree} from "vuex"
import {AppService} from "../../services/AppService";
import {PPCOptionFetchParams} from "../../contracts/app/PPCContracts";
import {PPCElementFormData} from "../../models/PPC/PPCElementFormData";
import {SkaterService} from "../../services/SkaterService";
import {PPC} from "../../models/PPC/PPC";
import {PPCFormOptionsManager} from "../../models/PPC/PPCFormOptionsManager";
import {PPCCollection} from "../../models/Collections/PPCCollection";
import {PPCFetchArgs, PPCFormOptions, PPCSavePayload, PPCSaveResponse} from "../../contracts/app/PPCContracts";
import {PPCElementMove} from "../../contracts/app/PPCContracts";


export class State {
    form_options_loaded: boolean = false;
    form_option_load_error: boolean = false;
    active_ppc: PPC = new PPC();
    form_options_manager = new PPCFormOptionsManager([], []);
    ppc_collection = new PPCCollection();
}


const actions = <ActionTree<State, any>>{
    /**
     * Save a PPC object
     */
    savePPC: function (context, payload: PPCSavePayload): Promise<PPCSaveResponse> {
        return new Promise(function (resolve, reject) {
            SkaterService.savePPC(payload).then(function (response: PPCSaveResponse) {
                context.commit("storePPC", payload.ppc);
                resolve(response);
            }).catch(function () {
                reject();
            })
        });
    },
    /**
     * Fetch the options for the PPC element form
     */
    fetchPPCElementOptions: function (context, fetch_params: PPCOptionFetchParams) {
        context.commit('setLoadError', false);
        return new Promise(function (resolve, reject) {
            if (context.state.form_options_loaded) {
                resolve();
                return;
            }
            AppService.getPPCFormOptions(fetch_params).then(function (options: PPCFormOptions) {
                context.commit('setPPCFormOptions', options);
                resolve();
            }).catch(function () {
                context.commit('setLoadError', true);
                reject();
            })
        });
    },
    /**
     * Fetch PPC data
     */
    fetchPPC: function (context, fetch_args: PPCFetchArgs) {
        return new Promise(function (resolve, reject) {
            /**
             * if prudent, remove this code.  Searches for local PPCs before fetching from server.
             */
            let existing = context.getters.find_ppc(fetch_args);
            if (existing) {
                context.commit('setActivePPC', existing.clone());
                resolve();
                return;
            }
            SkaterService.getPPC(fetch_args).then(function (ppc: PPC) {
                context.commit('storePPC', ppc);
                context.commit('setActivePPC', ppc);
                resolve();
                return;
            }).catch(function () {
                reject();
            })
        });
    },
};

const getters = <GetterTree<State, any>>{
    /**
     * Find a stored PPC instance
     */
    find_ppc: function (state) {
        return function (fetch_args: PPCFetchArgs): PPC | null {
            return state.ppc_collection.find(fetch_args);
        }
    },
    /**
     * Return the active PPC instance
     */
    active_ppc: function (state): PPC {
        return state.active_ppc;
    },
    /**
     * Get the available type options for the PPC editor form
     */
    type_options: function (state) {
        return state.form_options_manager.getTypeOptions()
    },
    /**
     * Get the available element options for the PPC editor form
     */
    type_element_options: function (state) {
        return function (form_data: PPCElementFormData): PPCElementMove[] {
            return state.form_options_manager.getElementOptions(form_data);
        }
    },
    /**
     * Get the available move options for the PPC editor form
     */
    move_options: function (state) {
        return function (form_data: PPCElementFormData): PPCElementMove[] {
            return state.form_options_manager.getMoveOptions(form_data);
        }
    },
    /**
     * Compare a PPC to the active to determine if there are any changes
     */
    ppc_changed: function (state, getters) {
        return function (ppc: PPC) {
            return !ppc.equals(getters.active_ppc);
        }
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Set the PPC form options in state
     */
    setPPCFormOptions: function (state, options: PPCFormOptions) {
        let {moves, types} = options;
        state.form_options_manager = new PPCFormOptionsManager(moves, types);
        state.form_options_loaded = true;
    },
    /**
     * Set whether there was a form options loading error in state
     */
    setLoadError: function (state, is_error: boolean): void {
        state.form_option_load_error = is_error;
    },
    /**
     * Set the active PPC instance in state
     */
    setActivePPC: function (state, ppc: PPC) {
        state.active_ppc = ppc;
    },
    /**
     * Clear the active PPC instance from state
     */
    clearActivePPC: function (state) {
        state.active_ppc = new PPC();
    },
    /**
     * Add a PPC instance to the stored state collection
     */
    storePPC: function (state, ppc: PPC) {
        state.ppc_collection.add(ppc);
    }
};


export const PPCState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};