import {ActionTree, GetterTree, MutationTree} from 'vuex';
import {CheckInEntityComment} from '../../_contracts/CheckInContracts';
import {CheckInEntityStateInterface} from '../../_contracts/CheckInEntityContracts';
import {
    FetchActiveEntityCommentsResponse,
    SubmitActiveEntityCommentResponse
} from '../_contracts/EntityCheckInServiceContracts';
import CheckInCommentsService from '../_services/EntityCheckInCommentsService';

export class State {
    /**
     * List of check-in comments for active entity
     */
    comments: CheckInEntityComment[] = [];
    /**
     * The id of the entity to which the comments data currently in state belongs
     */
    comments_entity_id: string | null = null;

}

const actions = <ActionTree<State, any>>{
    /**
     * Fetch the list of comments for the active check-in entity
     */
    fetchComments: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            const active_entity: CheckInEntityStateInterface = context.rootState.checkin.active_entity;

            if (!active_entity) {

                return;
            }
            const active_entity_id = active_entity.id;
            // If the active list is for the active entity, do nothing
            if (context.state.comments_entity_id === active_entity_id) {
                resolve();

                return;
            }

            CheckInCommentsService.fetchActiveEntityComments()
                .then((response: FetchActiveEntityCommentsResponse) => {
                    context.commit('setComments', response);
                    context.commit('setCommentsEntityId', active_entity_id);
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Submit a new check-in comment
     */
    submitNewCheckInComment: function (context, comment: string): Promise<void> {
        return new Promise((resolve, reject) => {
            CheckInCommentsService.submitActiveEntityComment(comment)
                .then((response: SubmitActiveEntityCommentResponse) => {
                    context.commit('addCheckInComment', response.comment);
                    context.commit('checkin/setActiveEntityCommentCount', context.state.comments.length, {root: true});
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
     * List of CheckInComment items for active entity
     */
    comments: function (state): CheckInEntityComment[] {
        return state.comments;
    },
    /**
     * Amount of comments for the current entity
     */
    comments_count: function (state, getters): number {
        return getters.comments.length;
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Add a checkin comment to state at the beginning of the list
     */
    addCheckInComment: function (state, comment: CheckInEntityComment): void {
        state.comments.unshift(comment);
    },
    /**
     * Set the list of comments in state
     */
    setComments: function (state, comments: CheckInEntityComment[]): void {
        state.comments = comments;
    },
    /**
     * Set the owner id of the comments in state
     */
    setCommentsEntityId: function (state, id: string): void {
        state.comments_entity_id = id;
    }
};

export const EntityCheckInCommentsState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};