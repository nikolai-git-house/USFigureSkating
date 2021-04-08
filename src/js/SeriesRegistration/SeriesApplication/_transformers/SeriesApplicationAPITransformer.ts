/* eslint-disable jsdoc/require-jsdoc,arrow-parens,arrow-body-style */
import {SeriesApplication, SeriesApplicationApi, SeriesApplicationData, SeriesApplicationService} from '../_contracts';
import {SkateTestHistoryAPIAdaptor} from '../../../adaptors/APIAdaptors/SkateTestHistoryAPIAdaptor';
import {SeriesRegistrationAPITransformer} from '../../_transformers/SeriesRegistrationAPITransformer';

export class SeriesApplicationAPITransformer {
    /**
     * Create the base application from API data.
     *
     * If saved application in data, use it for base
     *
     * If not, create a blank application
     */
    static transformApplication(data: SeriesApplicationData.SavedSeriesApplicationData | null, configuration: SeriesApplication.ApplicationConfiguration): SeriesApplication.UserApplication {
        const application_disciplines: SeriesApplicationData.SavedApplicationDisciplineData[] = data ? data.disciplines : [];
        const application_discipline_indicies = application_disciplines.map(discipline_data => discipline_data.discipline_id);

        return {
            disciplines: configuration.disciplines.map((configuration_data: SeriesApplication.ApplicationConfigurationDiscipline): SeriesApplication.ApplicationDiscipline => {

                const application_discipline_index = application_discipline_indicies.indexOf(configuration_data.id);

                let application_discipline;
                if (application_discipline_index !== -1) {
                    application_discipline = application_disciplines[application_discipline_index];
                }

                return SeriesApplicationAPITransformer.transformApplicationDiscipline(configuration_data, application_discipline);
            })
        };
    }

    static transformApplicationDiscipline(configuration_data: SeriesApplication.ApplicationConfigurationDiscipline, data?: SeriesApplicationData.SavedApplicationDisciplineData): SeriesApplication.ApplicationDiscipline {
        let coaches: SeriesApplication.ApplicationDisciplineCoach[] = [];
        let levels: SeriesApplication.ApplicationDisciplineLevelSelected[] = [];
        let partners: SeriesApplication.ApplicationDisciplinePartner[] = [];

        if (data) {
            coaches = data.coaches ? data.coaches.map((coach_data: SeriesApplicationData.SavedUserApplicationDisciplineCoachData): SeriesApplication.ApplicationDisciplineCoach => {
                return {
                    ...coach_data
                };
            }) : [];
            levels = data.levels.map((level_data: SeriesApplicationData.SavedUserApplicationDisciplineLevelData): SeriesApplication.ApplicationDisciplineLevelSelected => {
                return {
                    ...level_data
                };
            });
            partners = data.partner && data.partner.id ? [data.partner] : [];
        }

        return {
            id: configuration_data.id,
            name: configuration_data.name,
            coach_limit: configuration_data.coach_limit,
            partner_configuration: {
                ...configuration_data.partner_configuration
            },
            coaches,
            levels,
            partners
        };
    }

    static transformSeriesRegistrationUserApplicationProfile(data: SeriesApplicationData.UserApplicationProfileData): SeriesApplication.UserApplicationProfile {
        return {
            full_name: data.full_name,
            email: data.email,
            member_number: data.member_number,
            birth_date: data.birth_date,
            home_club: data.home_club,
            region_name: data.region_name,
            section_name: data.section_name,
            gender: data.gender,
            series_level_eligibility: data.series_level_eligibility.slice(),
            skate_test_history: SkateTestHistoryAPIAdaptor.adaptUserSkateTestHistoryDataToUserSkateTestHistory(data.skate_test_history),
            is_series_citizenship_ineligible: data.is_series_citizenship_ineligible
        };
    }

    static transformFetchSeriesRegistrationSeriesApplicationCommon(data: SeriesApplicationApi.FetchAbstractApplicationApiResponse) {
        const {series, user_application} = data;

        const application_configuration: SeriesApplication.ApplicationConfiguration = this.transformApplicationConfiguration(series.application_configuration);

        return {
            series: {
                icon: series.icon,
                name: series.name,
                application_deadline_formatted: SeriesRegistrationAPITransformer.transformApplicationDeadline(series.application_deadline_formatted),
                application_configuration,
                links: {
                    ...series.links
                },
                refund_email_address: series.refund_email_address
            },
            saved_application_exists: user_application !== null,
            user_application: SeriesApplicationAPITransformer.transformApplication(user_application, application_configuration),
            team_application_profile: null,
            user_application_profile: null
        };
    }

    static transformFetchSeriesRegistrationSeriesApplication(data: SeriesApplicationApi.FetchApplicationAPIResponse): SeriesApplicationService.FetchUserApplicationServiceResponse {
        return {
            ...this.transformFetchSeriesRegistrationSeriesApplicationCommon(data),
            is_team_series: false,
            user_application_profile: SeriesApplicationAPITransformer.transformSeriesRegistrationUserApplicationProfile(data.user_application_profile)
        };
    }

    static transformFetchSeriesRegistrationSeriesApplicationTeam(data: SeriesApplicationApi.FetchTeamApplicationAPIResponse): SeriesApplicationService.FetchTeamApplicationServiceResponse {
        return {
            ...this.transformFetchSeriesRegistrationSeriesApplicationCommon(data),
            is_team_series: true,
            team_application_profile: SeriesApplicationAPITransformer.transformSeriesRegistrationTeamApplicationProfile(data.user_application_profile)
        };
    }

    static transformSaveSeriesApplication(app_data: SeriesApplicationService.SaveApplicationServicePayload): SeriesApplicationApi.SaveApplicationAPIPayload {
        return {
            disciplines: app_data.disciplines.map((discipline: SeriesApplication.ApplicationDiscipline): SeriesApplicationData.SaveApplicationDisciplineData => {
                return {
                    discipline_id: discipline.id,
                    partner_id: discipline.partners.length ? discipline.partners[0].id : null,
                    level_ids: discipline.levels.map(level => level.id),
                    coach_ids: discipline.coaches.map(coach => coach.id)
                };
            })
        };
    }

    static transformSaveSeriesApplicationTeam(app_data: SeriesApplicationService.SaveApplicationServicePayload): SeriesApplicationApi.SaveApplicationTeamAPIPayload {
        return {
            disciplines: app_data.disciplines.map((discipline: SeriesApplication.ApplicationDiscipline): SeriesApplicationData.SaveApplicationDisciplineDataTeam => {
                return {
                    discipline_id: discipline.id,
                    level_ids: discipline.levels.map(level => level.id)
                };
            })
        };
    }

    public static transformApplicationConfiguration(data: SeriesApplicationData.ApplicationConfigurationData): SeriesApplication.ApplicationConfiguration {
        return {
            disciplines: data.disciplines.slice(),
            levels_information: data.levels_information,
            level_maximum: data.level_maximum,
            eligibility_documents: data.eligibility_documents.slice()
        };
    }

    private static transformSeriesRegistrationTeamApplicationProfile(data: SeriesApplicationData.TeamApplicationProfileData): SeriesApplication.TeamApplicationProfile {
        return {
            name: data.name,
            member_number: data.member_number,
            level: data.level,
            home_club: data.home_club || null,
            region_name: data.region_name || null,
            section_name: data.section_name || null,
            series_level_eligibility: data.series_level_eligibility.slice()
        };
    }
}