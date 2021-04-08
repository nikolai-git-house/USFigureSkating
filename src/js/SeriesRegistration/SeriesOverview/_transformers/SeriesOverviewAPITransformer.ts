/* eslint-disable jsdoc/require-jsdoc */
import {SeriesOverview, SeriesOverviewApi, SeriesOverviewData, SeriesOverviewService} from '../_contracts';
import {SeriesApplicationAPITransformer} from '../../SeriesApplication/_transformers/SeriesApplicationAPITransformer';
import {SeriesApplication, SeriesApplicationData} from '../../SeriesApplication/_contracts';
import {AppAPIAdaptor} from '../../../adaptors/APIAdaptors/AppAPIAdaptor';
import {SeriesRegistrationAPITransformer} from '../../_transformers/SeriesRegistrationAPITransformer';

export class SeriesOverviewAPITransformer {

    static transformFetchSeriesRegistrationSeriesOverview(data: SeriesOverviewApi.FetchSeriesOverviewApiResponse): SeriesOverviewService.FetchSeriesOverviewServiceResponse {
        const {series, user_application} = data;

        const series_transformation = this.transformSeries(series);
        if (series.is_team_series) {
            return {
                series: this.transformSeries(series),
                user_application: null,
                applied_teams: this.transformAppliedTeams(data.applied_teams)
            };
        }

        return {
            series: this.transformSeries(series),
            user_application: this.transformApplication(user_application, series_transformation.application_configuration),
            applied_teams: null
        };
    }

    private static transformSeries(series: SeriesOverviewData.SeriesData): SeriesOverview.Series {
        return {
            icon: series.icon,
            name: series.name,
            application_deadline_formatted: SeriesRegistrationAPITransformer.transformApplicationDeadline(series.application_deadline_formatted),
            is_team_series: !!series.is_team_series,
            links: {
                application: series.links.application,
                checkout: series.links.checkout,
                standings: series.links.standings,
                series_list: series.links.series_list
            },
            application_configuration: SeriesApplicationAPITransformer.transformApplicationConfiguration(series.application_configuration),
            status: {
                message: series.status.message ? AppAPIAdaptor.adaptStatusMessageData(series.status.message) : null,
                applications_open: series.status.applications_open,
                standings_available: series.status.standings_available
            },
            contact_email_address: series.contact_email_address,
            refund_email_address: series.refund_email_address,
            statement: series.statement,
            reports: series.reports ? series.reports.slice() : null,
            resource_documents: series.resource_documents.slice()
        };
    }

    /**
     * Use base application transformer, but strip out any disciplines the user hasn't applied for.
     */
    private static transformApplication(user_application: SeriesApplicationData.SavedUserApplicationData | null | undefined, application_configuration: SeriesApplication.ApplicationConfiguration): SeriesApplication.UserApplication | null {
        if (!user_application) {
            return null;
        }
        const base: SeriesApplication.UserApplication = SeriesApplicationAPITransformer.transformApplication(user_application, application_configuration);

        return {
            disciplines: base.disciplines.filter((discipline: SeriesApplication.ApplicationDiscipline) => {
                if (discipline.partners.length) {
                    return true;
                }
                if (discipline.levels.length) {
                    return true;
                }
                if (discipline.coaches.length) {
                    return true;
                }

                return false;
            })
        };

    }

    private static transformAppliedTeams(applied_teams_data: SeriesOverviewData.SeriesAppliedTeamsData | undefined): SeriesApplication.AppliedTeams | null {
        if (applied_teams_data) {
            return {
                teams: applied_teams_data.teams.map((datum: SeriesOverviewData.SeriesAppliedTeamData): SeriesApplication.AppliedTeam => {
                    return {
                        handbook: datum.handbook ? {
                            url: datum.handbook.url,
                            name: datum.handbook.name
                        } : null,
                        id: datum.id,
                        name: datum.name,
                        level: datum.level,
                        levels: datum.levels.map((level_datum: SeriesApplicationData.SavedUserApplicationDisciplineLevelData): SeriesApplication.ApplicationDisciplineLevelSelected => {
                            return {
                                ...level_datum
                            };
                        })
                    };
                })
            };
        }

        return null;
    }
}