/* eslint-disable max-lines */
import {AbstractAPIService} from '../../services/AbstractAPIService';
import {CompetitionPortalApiTransformer} from '../_transformers/CompetitionPortalApiTransformer';
import {CompetitionPortalApi, CompetitionPortalService} from '../_contracts';
import {CompetitionPortalAppService} from './CompetitionPortalAppService';
import {ActionCompetitionDocument} from '../../contracts/app/CompetitionDocumentsContracts';

export class CompetitionPortalApiService extends AbstractAPIService {
    /**
     * Fetch data for the the My Teams page
     */
    static fetchMyTeams() {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();

        const url = `/api/user/managed-teams/competitions/${competition_id}/registered-teams`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchMyTeamsApiResponse): CompetitionPortalService.FetchMyTeamsServiceResponse {

                return CompetitionPortalApiTransformer.transformFetchMyTeams(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionPortalApi.FetchMyTeamsApiResponse): boolean {
                if (!response.teams) {
                    console.error('teams not provided in response');

                    return false;
                }
                if (!response.competition_summary) {
                    console.error('competition summary not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    /**
     * Fetch data for the the Competition Portal Main page
     */
    static fetchCompetitionMain(): Promise<CompetitionPortalService.FetchCompetitionMainServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = team_id ? `/api/competitions/${competition_id}/teams/${team_id}/main` : `/api/competitions/${competition_id}/main`;

        return AbstractAPIService.fetchAndTransformResponse({
            url,
            /**
             * Validate that the response is present and is an object
             */
            validateResponse: function (response: CompetitionPortalApi.FetchCompetitionMainApiResponse): boolean {
                const required_props = ['competition'];
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);

                        return false;
                    }
                }

                return true;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchCompetitionMainApiResponse): CompetitionPortalService.FetchCompetitionMainServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchCompetitionMain(response);
            }
        });
    }

    /**
     * Fetch data for the the Select Competition Entity page
     */
    static fetchEntitySelect(): Promise<CompetitionPortalService.FetchEntitySelectServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const url = `/api/competitions/${competition_id}/entity-select`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchEntitySelectApiResponse): CompetitionPortalService.FetchEntitySelectServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchEntitySelect(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionPortalApi.FetchEntitySelectApiResponse): boolean {
                const required_props = ['competition_summary', 'entities'];
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);

                        return false;
                    }
                }

                return true;
            }
        });
    }

    /**
     * Fetch data for the competition documents page
     */
    static fetchCompetitionDocuments(): Promise<CompetitionPortalService.FetchCompetitionDocumentsServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = team_id ? `/api/competitions/${competition_id}/teams/${team_id}/documents` : `/api/competitions/${competition_id}/documents`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchCompetitionDocumentsApiResponse): CompetitionPortalService.FetchCompetitionDocumentsServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchCompetitionDocuments(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionPortalApi.FetchCompetitionDocumentsApiResponse): boolean {
                if (!response.competition_documents) {
                    console.error('competition documents not provided in response');

                    return false;
                }
                if (!response.competition_summary) {
                    console.error('competition summary not provided in response');

                    return false;
                }

                return true;
            }
        });
    }

    /**
     * Update the completion status on a competition document
     */
    static updateCompetitionDocumentCompletion(document: ActionCompetitionDocument): Promise<void> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const payload: CompetitionPortalApi.ChangeActionCompetitionDocumentCompletionAPIPayload = {
            is_complete: !document.is_complete
        };
        const url = team_id ? `/api/competitions/${competition_id}/teams/${team_id}/documents/${document.id}` : `/api/competitions/${competition_id}/documents/${document.id}`;

        return CompetitionPortalApiService.submitForAPISubmissionResponse({
            error_message: 'Error updating document status',
            method: 'put',
            payload,
            url
        });
    }

    /**
     * Fetch data for the the Competition Portal Competition Contacts page
     */
    static fetchCompetitionContacts(): Promise<CompetitionPortalService.FetchCompetitionContactsServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = team_id ? `/api/competitions/${competition_id}/teams/${team_id}/contacts` : `/api/competitions/${competition_id}/contacts`;

        return AbstractAPIService.fetchAndTransformResponse({
            url,
            /**
             * Validate that the response contains the proper structures
             */
            validateResponse: function (response: CompetitionPortalApi.FetchCompetitionContactsApiResponse): boolean {
                const required_props = ['contacts', 'competition_summary'];
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);

                        return false;
                    }
                }

                return true;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchCompetitionContactsApiResponse): CompetitionPortalService.FetchCompetitionContactsServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchCompetitionContacts(response);
            }
        });
    }

    /**
     * Fetch data for the Competition Information page
     */
    static fetchCompetitionInformation(): Promise<CompetitionPortalService.FetchCompetitionInformationServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = team_id ? `/api/competitions/${competition_id}/teams/${team_id}/competition-information` : `/api/competitions/${competition_id}/competition-information`;

        return AbstractAPIService.fetchAndTransformResponse({
            url,
            /**
             * Validate that the response is present and contains the necessary properties
             */
            validateResponse: function (response: CompetitionPortalApi.FetchCompetitionInformationApiResponse): boolean {
                const required_props = ['competition_summary', 'competition_information'];
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);

                        return false;
                    }
                }

                return true;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchCompetitionInformationApiResponse): CompetitionPortalService.FetchCompetitionInformationServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchCompetitionInformation(response);
            }
        });

    }

    /**
     * Fetch data for the Music & PPC page
     */
    static fetchMusicAndPpc(): Promise<CompetitionPortalService.FetchMusicAndPpcServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = team_id ? `/api/competitions/${competition_id}/teams/${team_id}/music-and-ppc` : `/api/competitions/${competition_id}/music-and-ppc`;

        return AbstractAPIService.fetchAndTransformResponse({
            url,
            /**
             * Validate that the response is present and contains the necessary properties
             */
            validateResponse: function (response: CompetitionPortalApi.FetchMusicAndPpcApiResponse): boolean {
                const required_props = ['competition_summary', 'competition_information', 'entity_event_segments'];
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);

                        return false;
                    }
                }

                return true;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchMusicAndPpcApiResponse): CompetitionPortalService.FetchMusicAndPpcServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchMusicAndPpc(response);
            }
        });
    }

    /**
     * Transform a Music & PPC API URL to add support for teams
     */
    static transformMusicPpcUrl(segment: string): string {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const replacement = team_id ? `/api/competitions/${competition_id}/teams/${team_id}` : `/api/competitions/${competition_id}`;

        return `${replacement}/${segment}`;
    }

    /**
     * Fetch data for the Practice Ice Schedule page
     */
    static fetchPracticeIceSchedule(): Promise<CompetitionPortalService.FetchPracticeIceScheduleServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = team_id ? `/api/competitions/${competition_id}/teams/${team_id}/practice-ice-schedules` : `/api/competitions/${competition_id}/practice-ice-schedules`;

        return AbstractAPIService.fetchAndTransformResponse({
            url,
            /**
             * Validate that the response is present and contains the necessary properties
             */
            validateResponse: function (response: CompetitionPortalApi.FetchPracticeIceScheduleApiResponse): boolean {
                const required_props = ['competition_summary', 'cart', 'entity_credits', 'competition_information', 'active_sales_window'];
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);

                        return false;
                    }
                }

                return true;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchPracticeIceScheduleApiResponse): CompetitionPortalService.FetchPracticeIceScheduleServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchPracticeIceSchedule(response);
            }
        });
    }

    /**
     * Fetch data for the Practice Ice Pre-Purchase page
     */
    static fetchPracticeIcePrePurchase(): Promise<CompetitionPortalService.FetchPracticeIcePrePurchaseServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = team_id ? `/api/competitions/${competition_id}/teams/${team_id}/practice-ice-prepurchase` : `/api/competitions/${competition_id}/practice-ice-prepurchase`;

        return AbstractAPIService.fetchAndTransformResponse({
            url,
            /**
             * Validate that the response is present and contains the necessary properties
             */
            validateResponse: function (response: CompetitionPortalApi.FetchPracticeIcePrePurchaseApiResponse): boolean {
                const required_props = ['competition_summary', 'cart', 'competition_information', 'entity_credits', 'competition_schedule', 'entity_schedule', 'active_sales_window'];
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);

                        return false;
                    }
                }

                return true;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchPracticeIcePrePurchaseApiResponse): CompetitionPortalService.FetchPracticeIcePrePurchaseServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchPracticeIcePrePurchase(response);
            }
        });
    }

    /**
     * Fetch competition portal competition schedule page data
     */
    static fetchCompetitionSchedule(): Promise<CompetitionPortalService.FetchCompetitionPortalCompetitionScheduleServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();
        const team_id = CompetitionPortalAppService.getActiveCompetitionPortalTeamId();
        const url = team_id ? `/api/competitions/${competition_id}/teams/${team_id}/competition-schedule` : `/api/competitions/${competition_id}/competition-schedule`;

        return AbstractAPIService.fetchAndTransformResponse({
            url,
            /**
             * Validate that the response is present and contains the necessary properties
             */
            validateResponse: function (response: CompetitionPortalApi.FetchCompetitionScheduleApiResponse): boolean {
                const required_props = ['competition_summary', 'competition_schedule'];
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);

                        return false;
                    }
                }

                return true;
            },
            /**
             * Transform API data to App data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchCompetitionScheduleApiResponse): CompetitionPortalService.FetchCompetitionPortalCompetitionScheduleServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchCompetitionSchedule(response);
            }
        });
    }

    /**
     * Fetch competition portal "My Skaters" page data
     */
    static fetchMySkaters(): Promise<CompetitionPortalService.FetchMySkatersServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();

        const url = `/api/competitions/${competition_id}/coach-skaters`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchMySkatersApiResponse): CompetitionPortalService.FetchMySkatersServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchMySkaters(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionPortalApi.FetchMySkatersApiResponse): boolean {
                const required_props = ['competition_summary', 'skaters'];
                let valid = true;
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);
                        valid = false;
                    }
                }

                return valid;
            }
        });
    }

    /**
     * Fetch competition portal "My Coaches" page data
     */
    static fetchMyCoaches(): Promise<CompetitionPortalService.FetchMyCoachesServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();

        const url = `/api/competitions/${competition_id}/my-coaches`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchMyCoachesApiResponse): CompetitionPortalService.FetchMyCoachesServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchMyCoaches(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionPortalApi.FetchMyCoachesApiResponse): boolean {
                const required_props = ['competition_summary', 'event_categories'];
                let valid = true;
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);
                        valid = false;
                    }
                }

                return valid;
            }
        });
    }

    /**
     * Fetch competition portal "My Schedule (Coach)" page data
     */
    static fetchMyScheduleCoach(): Promise<CompetitionPortalService.FetchMyScheduleCoachServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();

        const url = `/api/competitions/${competition_id}/my-schedule/coach`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchMyScheduleCoachApiResponse): CompetitionPortalService.FetchMyScheduleCoachServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchMyScheduleCoach(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionPortalApi.FetchMyScheduleCoachApiResponse): boolean {
                const required_props = ['competition_summary', 'schedule_available'];
                let valid = true;
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);
                        valid = false;
                    }
                }
                if (response.schedule_available && !response.coach_schedule) {
                    console.error('Schedule available but coach schedule missing from response');
                    valid = false;
                }

                return valid;
            }
        });

    }

    /**
     * Fetch competition portal "My Schedule (Skater)" page data
     */
    static fetchMyScheduleSkater(): Promise<CompetitionPortalService.FetchMyScheduleSkaterServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();

        const url = `/api/competitions/${competition_id}/my-schedule`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchMyScheduleSkaterApiResponse): CompetitionPortalService.FetchMyScheduleSkaterServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchMyScheduleSkater(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionPortalApi.FetchMyScheduleSkaterApiResponse): boolean {
                const required_props = ['competition_summary', 'schedule_available'];
                let valid = true;
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);
                        valid = false;
                    }
                }

                if (response.schedule_available && !response.skater_schedule) {
                    console.error('Schedule available but skater schedule missing from response');
                    valid = false;
                }

                return valid;
            }
        });
    }

    static fetchCoachCompetitionSchedule(): Promise<CompetitionPortalService.FetchCoachCompetitionScheduleServiceResponse> {
        const competition_id = CompetitionPortalAppService.getActiveCompetitionPortalCompetitionId();

        const url = `/api/competitions/${competition_id}/coach-competition-schedule`;

        return this.fetchAndTransformResponse({
            url,
            /**
             * Transform API data to App Data
             */
            transformResponse: function (response: CompetitionPortalApi.FetchCoachCompetitionScheduleApiResponse): CompetitionPortalService.FetchCoachCompetitionScheduleServiceResponse {
                return CompetitionPortalApiTransformer.transformFetchCoachCompetitionSchedule(response);
            },
            /**
             * Validate API response
             */
            validateResponse: function (response: CompetitionPortalApi.FetchCoachCompetitionScheduleApiResponse): boolean {
                const required_props = ['competition_summary', 'competition_information', 'coached_skater_schedule', 'competition_schedule'];
                let valid = true;
                for (let i = 0; i < required_props.length; i++) {
                    const requiredProp = required_props[i];
                    if (!Object.prototype.hasOwnProperty.call(response, requiredProp)) {
                        console.error(`${requiredProp} missing from response`);
                        valid = false;
                    }
                }

                return valid;
            }
        });
    }
}