/* eslint-disable jsdoc/require-jsdoc */
import {CompetitionPortalApi, CompetitionPortalData, CompetitionPortalService} from '../_contracts';
import {TeamsApiTransformer} from '../../Teams/TeamsApiTransformer';
import {
    ActiveCompetitionSummary,
    ActiveEntitySummary,
    CompetitionPortalCompetitionInformation,
    CompetitionSelectableEntity
} from '../_models';
import {ActiveEntitySummaryParams} from '../_models/ActiveEntitySummary';
import {AppAPIAdaptor} from '../../adaptors/APIAdaptors/AppAPIAdaptor';
import {ViewCompetitionTransformer} from '../../pages/ViewCompetition/ViewCompetitionTransformer';
import {CompetitionContactDataAdaptor} from '../../adaptors/CompetitionContactDataAdaptor';
import {SkaterSkatingEventSegmentAdaptor} from '../../adaptors/SkaterSkatingEventSegmentAdaptor';
import {CompetitionInformationDataAdaptor} from '../../adaptors/CompetitionInformationDataAdaptor';
import {PracticeIceSchedulesDataAdaptor} from '../../adaptors/PracticeIceSchedulesDataAdaptor';
import {CartDataAdaptor} from '../../adaptors/CartDataAdaptor';
import {SkaterCreditDataAdaptor} from '../../adaptors/SkaterCreditDataAdaptor';
import {CompetitionScheduleDataAdaptor} from '../../adaptors/CompetitionScheduleDataAdaptor';
import {SessionDataAdaptor} from '../../adaptors/SessionDataAdaptor';
import {SkaterEventDataAdaptor} from '../../adaptors/SkaterEventDataAdaptor';
import {CoachSkatersAdaptor} from '../../adaptors/CoachSkatersAdaptor';
import {SkaterCoachedEventCategoryCollection} from '../../models/Collections/SkaterCoachedEventCollection';
import {CoachSkaterScheduleAdaptor} from '../../adaptors/CoachSkaterScheduleAdaptor';
import {FetchCompetitionScheduleServiceResponse} from '../../CompetitionSchedule/_contracts/CompetitionScheduleContracts';
import {FetchCompetitionScheduleAPIResponse} from '../../CompetitionSchedule/_contracts/CompetitionScheduleAPIContracts';

export class CompetitionPortalApiTransformer {

    static transformFetchMyTeams(response: CompetitionPortalApi.FetchMyTeamsApiResponse): CompetitionPortalService.FetchMyTeamsServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            teams: TeamsApiTransformer.transformManagedTeams(response.teams)
        };
    }

    static transformCompetitionSummary(data: CompetitionPortalData.ActiveCompetitionSummary): ActiveCompetitionSummary {
        return new ActiveCompetitionSummary({
            ...data,
            directions: data.directions || [],
            announcement_url: data.announcement_url || null,
            website_url: data.website_url || null
        });
    }

    static transformFetchCompetitionDocuments(response: CompetitionPortalApi.FetchCompetitionDocumentsApiResponse): CompetitionPortalService.FetchCompetitionDocumentsServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            competition_documents: {
                ...response.competition_documents
            }
        };
    }

    private static transformEntitySummary(entity?: CompetitionPortalData.ActiveEntitySummary): ActiveEntitySummary | null {
        if (!entity) {
            return null;
        }
        const params: ActiveEntitySummaryParams = {};
        if (entity.name) {
            params.name = entity.name;
        }
        if (entity.compliance) {
            const message = AppAPIAdaptor.adaptStatusMessageData(entity.compliance.status);
            const supporting_description_data = entity.compliance.supporting_description;
            params.compliance = {
                status_description: message.text,
                status_key: message.type_key,
                link: entity.compliance.link
            };
            if (supporting_description_data) {
                params.compliance.supporting_description = AppAPIAdaptor.adaptStatusMessageData(supporting_description_data);
            }

            if (entity.compliance.role_items) {
                params.compliance.role_items = entity.compliance.role_items.slice();
            }
        }

        return new ActiveEntitySummary(params);
    }

    /**
     * Transform core Competition Portal information from a page fetch response
     */
    static transformFetchCompetitionPortalCore(response: CompetitionPortalApi.FetchCompetitionPortalCoreApiResponse): CompetitionPortalService.FetchCompetitionPortalCoreServiceResponse {
        return {
            competition_summary: this.transformCompetitionSummary(response.competition_summary),
            back_link: response.back_link || null,
            entity_summary: this.transformEntitySummary(response.entity_summary)
        };
    }

    static transformFetchEntitySelect(response: CompetitionPortalApi.FetchEntitySelectApiResponse): CompetitionPortalService.FetchEntitySelectServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            entities: response.entities.map((entity_data: CompetitionPortalData.CompetitionSelectableEntity) => {
                return new CompetitionSelectableEntity(entity_data);
            })
        };
    }

    static transformFetchCompetitionMain(response: CompetitionPortalApi.FetchCompetitionMainApiResponse): CompetitionPortalService.FetchCompetitionMainServiceResponse {
        const competition_data = response.competition;

        return {
            competition_summary: this.transformCompetitionSummary({
                id: competition_data.id,
                announcement_url: competition_data.announcement_url,
                directions: competition_data.directions,
                end_date_pretty: competition_data.end_date_pretty,
                icon: competition_data.icon,
                name: competition_data.name,
                start_date_pretty: competition_data.start_date_pretty,
                website_url: competition_data.website_url
            }),
            back_link: response.back_link || null,
            entity_summary: this.transformEntitySummary(response.entity_summary),
            view_competition: ViewCompetitionTransformer.transformFetchViewCompetitionCompetition(competition_data),
            user_manages_competition_eligible_teams: response.user_manages_competition_eligible_teams
        };
    }

    static transformFetchCompetitionContacts(response: CompetitionPortalApi.FetchCompetitionContactsApiResponse): CompetitionPortalService.FetchCompetitionContactsServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            contacts: CompetitionContactDataAdaptor.adaptArray(response.contacts)
        };
    }

    static transformFetchCompetitionInformation(response: CompetitionPortalApi.FetchCompetitionInformationApiResponse): CompetitionPortalService.FetchCompetitionInformationServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            competition_information: this.transformCompetitionInformation(response)
        };
    }

    private static transformCompetitionInformation(response: CompetitionPortalApi.FetchCompetitionInformationApiResponse) {
        const information_data = response.competition_information;

        return new CompetitionPortalCompetitionInformation({
            registered_events: information_data.registered_events,
            practice_ice: {
                instructions: information_data.practice_ice.instructions,
                terminology: information_data.practice_ice.terminology,
                not_offered: information_data.practice_ice.not_offered,
                pricing_message: information_data.practice_ice.pricing_message || null,
                event_pricing: information_data.practice_ice.event_pricing || [],
                sales_windows: information_data.practice_ice.sales_windows || []
            }
        });
    }

    static transformFetchMusicAndPpc(response: CompetitionPortalApi.FetchMusicAndPpcApiResponse): CompetitionPortalService.FetchMusicAndPpcServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            competition_information: CompetitionInformationDataAdaptor.adapt(response.competition_information),
            entity_event_segments: SkaterSkatingEventSegmentAdaptor.adaptArray(response.entity_event_segments)
        };
    }

    static transformFetchPracticeIceSchedule(response: CompetitionPortalApi.FetchPracticeIceScheduleApiResponse): CompetitionPortalService.FetchPracticeIceScheduleServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            ...PracticeIceSchedulesDataAdaptor.adapt(response),
            cart: CartDataAdaptor.adapt(response.cart),
            competition_information: CompetitionInformationDataAdaptor.adapt(response.competition_information),
            active_sales_window: response.active_sales_window,
            entity_credits: SkaterCreditDataAdaptor.adaptCompetitionCredits(response.entity_credits)
        };
    }

    static transformFetchPracticeIcePrePurchase(response: CompetitionPortalApi.FetchPracticeIcePrePurchaseApiResponse): CompetitionPortalService.FetchPracticeIcePrePurchaseServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            cart: CartDataAdaptor.adapt(response.cart),
            competition_information: CompetitionInformationDataAdaptor.adapt(response.competition_information),
            entity_credits: SkaterCreditDataAdaptor.adaptCompetitionCredits(response.entity_credits),
            competition_schedule: CompetitionScheduleDataAdaptor.adapt(response.competition_schedule),
            entity_schedule: {
                sessions: SessionDataAdaptor.adaptScheduledArray(response.entity_schedule.sessions),
                events: SkaterEventDataAdaptor.adaptArray(response.entity_schedule.events)
            },
            active_sales_window: response.active_sales_window
        };
    }

    static transformFetchCompetitionSchedule(response: CompetitionPortalApi.FetchCompetitionScheduleApiResponse): CompetitionPortalService.FetchCompetitionPortalCompetitionScheduleServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            competition_schedule: this.transformCompetitionSchedule(response.competition_schedule)
        };
    }

    static transformFetchMySkaters(response: CompetitionPortalApi.FetchMySkatersApiResponse): CompetitionPortalService.FetchMySkatersServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            coach_skaters: CoachSkatersAdaptor.adaptArray(response.skaters)
        };
    }

    static transformFetchMyCoaches(response: CompetitionPortalApi.FetchMyCoachesApiResponse): CompetitionPortalService.FetchMyCoachesServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            event_categories: new SkaterCoachedEventCategoryCollection(
                SkaterEventDataAdaptor.adaptCoachedEventArray(response.event_categories)
            )
        };
    }

    static transformFetchMyScheduleCoach(response: CompetitionPortalApi.FetchMyScheduleCoachApiResponse): CompetitionPortalService.FetchMyScheduleCoachServiceResponse {
        const result: CompetitionPortalService.FetchMyScheduleCoachServiceResponse = {
            ...this.transformFetchCompetitionPortalCore(response),
            schedule_available: response.schedule_available
        };
        if (response.coach_schedule) {
            result.coach_schedule = CoachSkaterScheduleAdaptor.adapt(response.coach_schedule.sessions, response.coach_schedule.skater_session_map);
        }

        return result;
    }

    static transformFetchMyScheduleSkater(response: CompetitionPortalApi.FetchMyScheduleSkaterApiResponse): CompetitionPortalService.FetchMyScheduleSkaterServiceResponse {
        const result: CompetitionPortalService.FetchMyScheduleSkaterServiceResponse = {
            ...this.transformFetchCompetitionPortalCore(response),
            schedule_available: response.schedule_available
        };
        if (response.skater_schedule) {
            result.skater_schedule = {
                sessions: SessionDataAdaptor.adaptScheduledArray(response.skater_schedule.sessions),
                events: SkaterEventDataAdaptor.adaptArray(response.skater_schedule.events)
            };
        }

        return result;
    }

    static transformFetchCoachCompetitionSchedule(response: CompetitionPortalApi.FetchCoachCompetitionScheduleApiResponse): CompetitionPortalService.FetchCoachCompetitionScheduleServiceResponse {
        return {
            ...this.transformFetchCompetitionPortalCore(response),
            competition_schedule: this.transformCompetitionSchedule(response.competition_schedule),
            competition_information: CompetitionInformationDataAdaptor.adapt(response.competition_information),
            coached_skater_schedule: CoachSkaterScheduleAdaptor.adapt(response.coached_skater_schedule.sessions, response.coached_skater_schedule.skater_session_map)
        };
    }

    private static transformCompetitionSchedule(response: FetchCompetitionScheduleAPIResponse): FetchCompetitionScheduleServiceResponse {
        if (response.schedule_unavailable) {
            return {
                schedule_available: false
            };
        }

        return {
            schedule_available: true,
            schedule: CompetitionScheduleDataAdaptor.adapt(response)
        };
    }
}