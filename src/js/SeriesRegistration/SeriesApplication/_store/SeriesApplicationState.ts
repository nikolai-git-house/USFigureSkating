/* eslint-disable max-lines-per-function,max-lines */
import {ActionContext, ActionTree, GetterTree, MutationTree} from 'vuex';
import {SeriesApplicationAPIService} from '../_services/SeriesApplicationAPIService';
import {MemberSearchState} from '../../../store/Modules/MemberSearchState';
import {AppNoticeStatePayload, StateFormOption} from '../../../contracts/AppContracts';
import {
    AbstractMemberSearchResultValidationFunction,
    MemberSearchConfig,
    MemberSearchParameters,
    MemberSearchResult
} from '../../../contracts/app/MemberSearchContracts';
import {validateResultActive} from '../../../components/MemberSearch/MemberSearchValidators';
import {
    SaveSkateTestActionPayload,
    SkateTestRemoveAppPayload,
    UserSkateTestHistory
} from '../../../contracts/app/SkateTestContracts';
import {SeriesApplication, SeriesApplicationService} from '../_contracts';
import {MemberSearchValidationFunctionFactory} from '../../../components/MemberSearch/MemberSearchValidationFunctionFactory';
import SeriesApplicationPartnerCitizenshipNotice from '../_components/SeriesApplicationPartnerCitizenshipNotice.vue';

/**
 * @future_optimization: extract SeriesApplicationSearch state to handle partner and coach searching
 */
export class State {
    /**
     * The active type of the active member search.  Null if no member search is active
     */
    active_search_type: 'partner' | 'coach' | null = null;
    /**
     * The teams that have been applied for the series
     */
    applied_teams: SeriesApplication.AppliedTeams | null = null;
    /**
     * Coach search state options.  Saved to prevent repeated API calls for same data
     */
    coach_search_state_options: StateFormOption[] = [];
    is_team_series: boolean = false;
    /**
     * Partner search state options.  Saved to prevent repeated API calls for same data
     */
    partner_search_state_options: StateFormOption[] = [];
    /**
     * Whether a saved application exists for the current user
     */
    saved_application_exists: boolean = true;
    /**
     * The active series
     */
    series: SeriesApplication.Series | null = null;
    /**
     * Active user application
     */
    user_application: SeriesApplication.UserApplication | null = null;
    /**
     * Active series application user profile
     */
    user_profile: SeriesApplication.UserApplicationProfile | null = null;

    /**
     * Active series application user profile
     */
    team_profile: SeriesApplication.TeamApplicationProfile | null = null;
}

const actions = <ActionTree<State, any>>{
    /**
     * Save the current application
     */
    save: function (context): Promise<string> {
        const service_method: (app_payload: SeriesApplicationService.SaveApplicationServicePayload) => Promise<SeriesApplicationService.SaveApplicationServiceResponse> = context.state.is_team_series ? SeriesApplicationAPIService.saveApplicationTeam : SeriesApplicationAPIService.saveApplication;
        const service_payload: SeriesApplicationService.SaveApplicationServicePayload = context.getters.application_save_payload;

        return new Promise((resolve, reject) => {
            service_method(service_payload)
                .then((response: SeriesApplicationService.SaveApplicationServiceResponse) => {
                    resolve(response.cart_link);
                })
                .catch((message: string) => {
                    reject(message);
                });
        });
    },
    /**
     * Close member search, either for coaches or partners
     */
    closeSearch: function (context) {
        context.commit('setActiveSearchType', null);
    },
    /**
     * Fetch the search form options for coach search
     */
    fetchCoachSearchFormOptions: function (context): Promise<StateFormOption[]> {
        return new Promise((resolve, reject) => {
            const stateFormOptions = context.state.coach_search_state_options;
            if (stateFormOptions.length) {
                resolve(stateFormOptions);

                return;
            }
            SeriesApplicationAPIService.fetchCoachSearchStateOptions()
                .then((result: StateFormOption[]) => {
                    resolve(result);
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch the search form options for partner search
     */
    fetchPartnerSearchFormOptions: function (context): Promise<StateFormOption[]> {
        return new Promise((resolve, reject) => {
            const stateFormOptions = context.state.partner_search_state_options;
            if (stateFormOptions.length) {
                resolve(stateFormOptions);

                return;
            }
            SeriesApplicationAPIService.fetchPartnerSearchStateOptions()
                .then((result: StateFormOption[]) => {
                    resolve(result);
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Fetch the series application page data
     */
    fetchSeriesApplication: function (context): Promise<void> {
        return new Promise((resolve, reject) => {
            SeriesApplicationAPIService.fetchSeriesApplication()
                .then((result: SeriesApplicationService.FetchApplicationServiceResponse) => {
                    context.commit('setSeries', result.series);
                    context.commit('setIsTeamSeries', result.is_team_series);
                    context.commit('setUserApplication', result.user_application);
                    context.commit('setUserProfile', result.user_application_profile);
                    context.commit('setTeamProfile', result.team_application_profile);
                    context.commit('setSavedApplicationExists', result.saved_application_exists);
                    if (!result.is_team_series) {
                        context.commit('skate_test_history/setActiveSkateTestHistory', result.user_application_profile.skate_test_history, {root: true});
                    }

                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    },
    /**
     * Handle a change in eligibility
     *
     * 1. Following eligible level changes, remove all unpaid levels user is no longer eligible for
     */
    handleEligibilityChange: function (context) {
        const userApplication = context.state.user_application;
        const discipline_levels_to_remove: SeriesApplication.RemoveLevelPayload[] = [];
        if (!userApplication) {
            return;
        }
        const disciplines = userApplication.disciplines;
        /**
         * Loop over application disciplines
         */
        for (let i = 0; i < disciplines.length; i++) {
            const discipline = disciplines[i];
            const eligible_discipline_levels: SeriesApplication.ApplicationDisciplineLevel[] = context.getters.user_selectable_discipline_levels(discipline);
            // eslint-disable-next-line arrow-parens,arrow-body-style
            const eligible_level_ids = eligible_discipline_levels.map(level => level.id);
            /**
             * Loop over discipline selected levels
             */
            for (let j = 0; j < discipline.levels.length; j++) {
                const level = discipline.levels[j];
                /**
                 * If level is no longer available to the user and it hasn't been paid for, add it to the list of levels to remove
                 */
                if (!level.is_paid && eligible_level_ids.indexOf(level.id) === -1) {
                    discipline_levels_to_remove.push({
                        discipline,
                        level
                    });
                }
            }
        }
        /**
         * Remove all flagged levels
         */
        for (let i = 0; i < discipline_levels_to_remove.length; i++) {
            const payload = discipline_levels_to_remove[i];
            context.dispatch('removeLevel', payload);
        }
    },
    /**
     * Initiate searching for a coach
     */
    openCoachSearch: function (context, discipline: SeriesApplication.ApplicationDiscipline): void {
        /**
         * Ensure state module is registered
         */
        if (!this.state.member_search) {
            this.registerModule('member_search', MemberSearchState);
        }

        /**
         * Get the search form options
         */
        context.dispatch('fetchCoachSearchFormOptions')
            .then((result: StateFormOption[]) => {
                context.commit('member_search/setStateOptions', result, {root: true});
                context.commit('setCoachSearchStateOptions', result);
            })
            .catch(() => {
                // fail silently
            });

        /**
         * Configure the member search
         */
        const config: MemberSearchConfig = {
            search_function: SeriesApplicationAPIService.coachSearch,
            selection_method: (result: MemberSearchResult) => {
                return context.dispatch('selectCoach', <SeriesApplication.SelectCoachPayload>{
                    result,
                    discipline
                });
            },
            close_method: () => {
                context.dispatch('closeSearch');
            },
            ineligible_instruction: 'Please choose another coach or leave blank.',
            entity_descriptor: 'Coach',
            result_validators: [validateResultActive]
        };
        context.commit('member_search/configure', config, {root: true});

        /**
         * Prevent selection of duplicate coaches for the same discipline
         */
        context.commit('member_search/setBlockedPreviousSelection', discipline.coaches.map((coach) => {
            return coach.id;
        }), {root: true});

        /**
         * Update state to indicate coach search is active
         */
        context.commit('setActiveSearchType', 'coach');
    },
    /**
     * Initiate searching for a partner
     */
    openPartnerSearch: function (context, discipline: SeriesApplication.ApplicationDiscipline): void {
        if (!this.state.member_search) {
            this.registerModule('member_search', MemberSearchState);
        }

        context.dispatch('fetchPartnerSearchFormOptions')
            .then((result: StateFormOption[]) => {
                context.commit('member_search/setStateOptions', result, {root: true});
                context.commit('setPartnerSearchStateOptions', result);
            })
            .catch(() => {
                // fail silently
            });

        context.commit('setActiveSearchType', 'partner');
        const config: MemberSearchConfig = context.getters.member_search_configuration_partner(discipline, context);
        context.commit('member_search/configure', config, {root: true});
    },
    /**
     * Remove a coach from a discipline
     */
    removeCoach: function (context, payload: SeriesApplication.RemoveCoachPayload) {
        context.commit('removeDisciplineCoach', payload);
    },
    /**
     * Remove a level for a discipline
     */
    removeLevel: function (context, payload: SeriesApplication.RemoveLevelPayload) {
        context.commit('removeLevel', payload);
    },
    /**
     * Remove a partner from a discipline
     */
    removePartner: function (context, payload: SeriesApplication.RemovePartnerPayload) {
        context.commit('removeDisciplinePartner', payload);
    },
    /**
     * Remove a skate test for the series application
     *
     * Must resolve with updated skate test history for use in skate test history state module
     */
    removeSkateTest: function (context, payload: SkateTestRemoveAppPayload): Promise<UserSkateTestHistory> {
        return new Promise((resolve, reject) => {
            SeriesApplicationAPIService.removeSkateTest(payload)
                .then((response: SeriesApplicationService.RemoveSkateTestServiceResponse) => {
                    context.commit('updateUserDisciplineLevelEligibility', response.user_discipline_eligibility_update);
                    context.dispatch('handleEligibilityChange');
                    resolve(response.skate_test_history);
                })
                .catch((error_message) => {
                    reject(error_message);
                });
        });
    },
    /**
     * Save a new skate test for the series application
     *
     * Must resolve with updated skate test history for use in skate test history state module
     */
    saveSkateTest: function (context, payload: SaveSkateTestActionPayload): Promise<UserSkateTestHistory> {
        const {test_data, active_discipline} = payload;

        return new Promise((resolve, reject) => {
            SeriesApplicationAPIService.saveSkateTest(test_data, active_discipline.key)
                .then((response: SeriesApplicationService.SaveSkateTestServiceResponse) => {
                    context.commit('updateUserDisciplineLevelEligibility', response.user_discipline_eligibility_update);
                    context.dispatch('handleEligibilityChange');
                    resolve(response.skate_test_history);
                })
                .catch((error_message) => {
                    reject(error_message);
                });
        });
    },
    /**
     * Select a coach from member search results
     */
    selectCoach: function (context, payload: SeriesApplication.SelectCoachPayload) {
        context.commit('setDisciplineCoach', payload);
    },
    /**
     * Select a level for a discipline
     */
    selectLevel: function (context, payload: SeriesApplication.SelectLevelPayload) {
        context.commit('selectLevel', payload);
    },
    /**
     * Select a partner from member search results
     */
    selectPartner: function (context, payload: SeriesApplication.SelectPartnerPayload) {
        return new Promise((resolve, reject) => {
            if (payload.result.is_citizenship_ineligible) {
                context.commit('app/setNotice', <AppNoticeStatePayload>{
                    notice: new SeriesApplicationPartnerCitizenshipNotice({
                        propsData: {
                            series: context.state.series
                        }
                    })
                }, {root: true});
                reject();

                return;
            }

            context.commit('setDisciplinePartner', payload);
            resolve();
        });
    },
    /**
     * Update the user's profile for the series application
     */
    updateProfile: function (context, payload: SeriesApplication.UpdateProfilePayload) {
        return new Promise((resolve, reject) => {
            SeriesApplicationAPIService.updateUserProfile(payload)
                .then(() => {
                    context.commit('updateProfile', payload);
                    resolve();
                })
                .catch((error: string) => {
                    reject(error);
                });
        });
    }
};

const getters = <GetterTree<State, any>>{
    /**
     * Payload for service when saving an application
     */
    application_save_payload: function (state): SeriesApplicationService.SaveApplicationServicePayload {
        const userApplication = state.user_application;
        if (userApplication) {
            return userApplication;
        }
        throw 'Unable to process application data.';
    },
    /**
     * Eligibility documents for the current series
     */
    eligibility_documents: function (state): SeriesApplication.SeriesEligibilityDocument[] {
        const series = state.series;

        return series ? series.application_configuration.eligibility_documents : [];
    },
    /**
     * The active application series
     */
    series: function (state): SeriesApplication.Series | null {
        return state.series;
    },
    /**
     * The maximum number of levels the user can select for a discipline
     */
    max_levels: function (state): number {
        return state.series ? state.series.application_configuration.level_maximum : 2;
    },
    /**
     * Whether member search is active
     */
    member_search_active: function (state): boolean {
        return state.active_search_type !== null;
    },
    /**
     * Get the active application
     */
    active_application: function (state): SeriesApplication.UserApplication | null {
        return state.user_application;
    },
    /**
     * The total cost of the active series application
     */
    total_cost: function (state): number {
        let result = 0;
        const disciplines: SeriesApplication.ApplicationDiscipline[] = state.user_application ? state.user_application.disciplines : [];
        for (let i = 0; i < disciplines.length; i++) {
            const discipline = disciplines[i];
            for (let j = 0; j < discipline.levels.length; j++) {
                const level: SeriesApplication.ApplicationDisciplineLevelSelected = discipline.levels[j];
                if (!level.is_paid) {
                    result = Math.round((result * 100) + (level.price * 100)) / 100;
                }
            }
        }

        return result;
    },
    /**
     * The list of levels that can be selected by a user.
     *
     * The user's eligible levels for a singles discipline, or the user/partner level combined eligibility
     */
    user_selectable_discipline_levels: function (state, getters) {
        return function (discipline: SeriesApplication.ApplicationDiscipline): SeriesApplication.ApplicationDisciplineLevel[] {

            const eligibility: SeriesApplication.ApplicationDisciplineLevel[] = getters.user_eligible_discipline_levels(discipline);

            if (discipline.partner_configuration.is_partnered) {
                const partner_eligibility = discipline.partners.length ? discipline.partners[0].eligible_levels : [];

                const partner_level_ids: number[] = partner_eligibility.map((level) => {
                    return level.id;
                });

                return eligibility.filter((level) => {
                    return partner_level_ids.indexOf(level.id) !== -1;
                });
            }

            return eligibility;
        };
    },
    /**
     * Get the user-eligible levels for a discipline
     */
    user_eligible_discipline_levels: function (state): (discipline: SeriesApplication.ApplicationDiscipline) => SeriesApplication.ApplicationDisciplineLevel[] {
        return function (discipline: SeriesApplication.ApplicationDiscipline): SeriesApplication.ApplicationDisciplineLevel[] {

            const source = state.user_profile ? state.user_profile.series_level_eligibility : state.team_profile ? state.team_profile.series_level_eligibility : [];
            for (let i = 0; i < source.length; i++) {
                const userLevelEligibilityElement: SeriesApplication.DisciplineLevelEligibility = source[i];

                if (userLevelEligibilityElement.discipline_id === discipline.id) {
                    return userLevelEligibilityElement.eligible_levels;
                }
            }

            return [];
        };
    },
    /**
     * Get the active application user profile
     */
    user_profile: function (state): SeriesApplication.UserApplicationProfile | null {
        return state.user_profile;
    },
    /**
     * Factory getter to return member search partner configuration
     */
    member_search_configuration_partner: function (state, getters) {
        return function (discipline: SeriesApplication.ApplicationDiscipline, context: ActionContext<State, any>): MemberSearchConfig<SeriesApplication.PartnerSearchResult> {
            const result_validators: AbstractMemberSearchResultValidationFunction<SeriesApplication.PartnerSearchResult>[] = [validateResultActive];
            if (discipline.partner_configuration.partner_rules.indexOf('opposite_gender') !== -1) {
                result_validators.push(MemberSearchValidationFunctionFactory.opposite_gender(state.user_profile ? state.user_profile.gender : null));
            }
            if (discipline.partner_configuration.partner_rules.indexOf('compatible_levels') !== -1) {
                result_validators.push(MemberSearchValidationFunctionFactory.compatible_levels(getters.user_eligible_discipline_levels(discipline)));
            }

            return {
                // eslint-disable-next-line jsdoc/require-jsdoc
                search_function: function (search_params: MemberSearchParameters) {
                    return SeriesApplicationAPIService.partnerSearch(search_params, discipline.id);
                },
                selection_method: (result: SeriesApplication.PartnerSearchResult) => {
                    return context.dispatch('selectPartner', {
                        result,
                        discipline
                    });
                },
                close_method: () => {
                    context.dispatch('closeSearch');
                },
                ineligible_instruction: 'Please choose another partner.',
                entity_descriptor: 'Partner',
                result_validators
            };
        };
    },
    /**
     * Whether a paid level exists on the active user application
     */
    paid_level_exists: function (state): boolean {
        if (state.user_application) {
            for (let i = 0; i < state.user_application.disciplines.length; i++) {
                const discipline = state.user_application.disciplines[i];
                for (let j = 0; j < discipline.levels.length; j++) {
                    const level = discipline.levels[j];
                    if (level.is_paid) {
                        return true;
                    }
                }
            }
        }

        return false;
    },
    /**
     * Whether the current user is blocked from registering for the series due to their citizenship status
     */
    user_citizenship_ineligible: function (state): boolean {
        return !!state.user_profile && state.user_profile.is_series_citizenship_ineligible;
    }
};

const mutations = <MutationTree<State>>{
    /**
     * Remove a coach from a discipline in state
     */
    removeDisciplineCoach: function (state, payload: SeriesApplication.RemoveCoachPayload) {
        const userApplication = state.user_application;
        if (userApplication) {
            const discipline_ids = userApplication.disciplines.map((discipline) => {
                return discipline.id;
            });
            const discipline_index = discipline_ids.indexOf(payload.discipline.id);
            const discipline = userApplication.disciplines[discipline_index];
            const coach_ids = discipline.coaches.map((coach) => {
                return coach.id;
            });
            const coach_index = coach_ids.indexOf(payload.coach.id);
            if (coach_index !== -1) {
                discipline.coaches.splice(coach_index, 1);
            }
        }
    },
    /**
     * Remove a partner from a discipline in state
     *
     * Also removes subsequent elements in discipline (levels and coaches)
     */
    removeDisciplinePartner: function (state, payload: SeriesApplication.RemovePartnerPayload) {
        const userApplication = state.user_application;
        if (userApplication) {
            const discipline_ids = userApplication.disciplines.map((discipline) => {
                return discipline.id;
            });
            const discipline_index = discipline_ids.indexOf(payload.discipline.id);
            const discipline = userApplication.disciplines[discipline_index];
            const partner_ids = discipline.partners.map((partner) => {
                return partner.id;
            });
            const partner_index = partner_ids.indexOf(payload.partner.id);
            if (partner_index !== -1) {
                discipline.partners.splice(partner_index, 1);
            }
            discipline.levels = [];
            discipline.coaches = [];
        }
    },
    /**
     * Remove a level from a discipline
     *
     * If removal results in no levels for discipline, remove all coaches as well
     */
    removeLevel: function (state, payload: SeriesApplication.RemoveLevelPayload) {
        const userApplication = state.user_application;
        if (userApplication) {
            for (let i = 0; i < userApplication.disciplines.length; i++) {
                const discipline = userApplication.disciplines[i];
                if (discipline.id === payload.discipline.id) {
                    const level_ids = discipline.levels.map((level) => {
                        return level.id;
                    });
                    const level_index = level_ids.indexOf(payload.level.id);
                    if (level_index !== -1) {
                        discipline.levels.splice(level_index, 1);
                    }
                    if (discipline.levels.length === 0) {
                        discipline.coaches = [];
                    }

                    return;
                }
            }
        }
    },
    /**
     * The active search type, or null if search is not currently active
     */
    setActiveSearchType: function (state, payload: 'partner' | 'coach' | null) {
        state.active_search_type = payload;
    },
    /**
     * Set the applied teams in state
     */
    setAppliedTeams: function (state, payload: SeriesApplication.AppliedTeams | null) {
        state.applied_teams = payload;
    },
    /**
     * Set the state form options for coach search in state
     */
    setCoachSearchStateOptions: function (state, payload: StateFormOption[]) {
        state.coach_search_state_options = payload;
    },
    setIsTeamSeries: function (state, payload: boolean) {
        state.is_team_series = payload;
    },
    /**
     * Set the state form options for partner search in state
     */
    setPartnerSearchStateOptions: function (state, payload: StateFormOption[]) {
        state.partner_search_state_options = payload;
    },
    /**
     * Set a coach for a discipline in state
     */
    setDisciplineCoach: function (state, payload: SeriesApplication.SelectCoachPayload) {
        const userApplication = state.user_application;
        if (userApplication) {
            for (let i = 0; i < userApplication.disciplines.length; i++) {
                const discipline = userApplication.disciplines[i];
                if (discipline.id === payload.discipline.id) {
                    discipline.coaches.push(payload.result);
                }
            }
        }
    },
    /**
     * Set a partner for a discipline in state
     */
    setDisciplinePartner: function (state, payload: SeriesApplication.SelectPartnerPayload) {
        const userApplication = state.user_application;
        if (userApplication) {
            for (let i = 0; i < userApplication.disciplines.length; i++) {
                const discipline = userApplication.disciplines[i];
                if (discipline.id === payload.discipline.id) {
                    discipline.partners.push(payload.result);
                }
            }
        }
    },
    /**
     * Select/Add a level to a discipline
     */
    selectLevel: function (state, payload: SeriesApplication.SelectLevelPayload) {
        const userApplication = state.user_application;
        if (userApplication) {
            for (let i = 0; i < userApplication.disciplines.length; i++) {
                const discipline = userApplication.disciplines[i];
                if (discipline.id === payload.discipline.id) {
                    discipline.levels.push({
                        ...payload.level,
                        is_paid: false
                    });
                }
            }
        }
    },
    /**
     * Set whether a saved application exists in state
     */
    setSavedApplicationExists: function (state, payload: boolean) {
        state.saved_application_exists = payload;
    },
    /**
     * Set the application series in state
     */
    setSeries: function (state, payload: SeriesApplication.Series) {
        state.series = payload;
    },
    /**
     * Set the active user application in state
     */
    setUserApplication: function (state, payload: SeriesApplication.UserApplication) {
        state.user_application = payload;
    },
    /**
     * Set the user application profile in state
     */
    setUserProfile: function (state, payload: SeriesApplication.UserApplicationProfile | null) {
        state.user_profile = payload;
    },
    setTeamProfile: function (state, payload: SeriesApplication.TeamApplicationProfile | null) {
        state.team_profile = payload;
    },
    /**
     * Update the user discipline level eligibility for 0 or more disciplines
     */
    updateUserDisciplineLevelEligibility: function (state, payload: SeriesApplication.DisciplineLevelEligibility[]) {
        const source: SeriesApplication.DisciplineLevelEligibility[] = state.user_profile ? state.user_profile.series_level_eligibility : [];
        // eslint-disable-next-line arrow-parens,arrow-body-style
        const source_discipline_ids = source.map(item => item.discipline_id);
        for (let i = 0; i < payload.length; i++) {
            const payloadElement: SeriesApplication.DisciplineLevelEligibility = payload[i];
            const source_index = source_discipline_ids.indexOf(payloadElement.discipline_id);
            if (source_index !== -1) {
                source[source_index].eligible_levels = payloadElement.eligible_levels;
            }
        }
    },
    /**
     * Update the user series application profile in state
     */
    updateProfile: function (state, payload: SeriesApplication.UpdateProfilePayload) {
        if (state.user_profile) {
            if (payload.email) {
                state.user_profile.email = payload.email;
            }
        }
    }
};

export const SeriesApplicationState = {
    namespaced: true,
    state: new State(),
    actions: actions,
    getters: getters,
    mutations: mutations
};