import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {ComplianceRequirementsSummaryItem} from '../../../_contracts/AdminPortalContracts';
import {ComplianceRequirementsSummaryItemOverridePayload} from '../../_contracts/CheckInContracts';
import {CheckInEntityStateInterface} from '../../_contracts/CheckInEntityContracts';
import CheckInComplianceService from '../_services/EntityCheckInComplianceService';

export class State {
    /**
     * The active compliance summary information
     */
    active_compliance_summary: ComplianceRequirementsSummaryItem[] = [];
    /**
     * The Id of the entity the active summary is for
     */
    active_compliance_summary_entity_id: string | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch the compliance summary for the active check-in entity
     */
    fetchActiveComplianceSummary: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            const active_entity: CheckInEntityStateInterface = context.rootState.checkin.active_entity;
            if (!active_entity) {
                reject('No active check-in entity');

                return;
            }
            // If the active summary is for the active entity, do nothing
            if (context.state.active_compliance_summary_entity_id === active_entity.id) {
                resolve();

                return;
            }
            CheckInComplianceService.fetchActiveEntityCompliance()
                .then((response: ComplianceRequirementsSummaryItem[]) => {
                    context.commit('setActiveComplianceSummaryEntityId', active_entity.id);
                    context.commit('setActiveComplianceSummary', response);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Override a single compliance item
     */
    overrideComplianceItem: function (context, payload: ComplianceRequirementsSummaryItemOverridePayload): Promise<void> {
        return new Promise((resolve, reject) => {
            const active_entity: CheckInEntityStateInterface = context.rootState.checkin.active_entity;
            if (!active_entity) {
                reject('No active check-in entity');

                return;
            }
            CheckInComplianceService.overrideActiveEntityComplianceItem(payload)
                .then(() => {
                    context.commit('overrideComplianceItem', payload);
                    context.commit('checkin/setActiveEntityIsCompliant', context.getters.is_compliance_complete, {root: true});
                    resolve();
                })
                .catch((error_message: string) => {
                    reject(error_message);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * Whether the current compliance summary is complete for compliance
     */
    is_compliance_complete: function (state) {
        for (let i = 0; i < state.active_compliance_summary.length; i++) {
            const compliance_status_item = state.active_compliance_summary[i];
            if (!compliance_status_item.overridden && !compliance_status_item.complete) {
                return false;
            }
        }

        return true;
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Set the active compliance summary in state
     */
    setActiveComplianceSummary: function (state, compliance_summary: ComplianceRequirementsSummaryItem[]) {
        state.active_compliance_summary = compliance_summary;
    },
    /**
     * Set the active compliance summary entity id in state
     */
    setActiveComplianceSummaryEntityId: function (state, entity_id: string) {
        state.active_compliance_summary_entity_id = entity_id;
    },
    /**
     * Override a compliance item in state
     */
    overrideComplianceItem: function (state, payload: ComplianceRequirementsSummaryItemOverridePayload) {
        const compliance_summary = state.active_compliance_summary;
        if (compliance_summary) {
            for (let i = 0; i < compliance_summary.length; i++) {
                const compliance_item = compliance_summary[i];
                if (compliance_item.id === payload.compliance_item.id) {
                    compliance_item.overridden = payload.overridden;

                    return;
                }
            }
        }
    }
};

export const EntityCheckInComplianceState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};