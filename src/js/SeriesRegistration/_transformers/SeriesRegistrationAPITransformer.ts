/* eslint-disable jsdoc/require-jsdoc */
import {
    FetchSeriesRegistrationSeriesListApiResponse,
    SeriesRegistrationApi
} from '../_contracts/SeriesRegistrationApiContracts';
import {SeriesRegistration, SeriesRegistrationIndexSeries} from '../_contracts/SeriesRegistrationContracts';
import {SeriesRegistrationData, SeriesRegistrationIndexSeriesData} from '../_contracts/SeriesRegistrationDataContracts';
import {
    FetchSeriesRegistrationSeriesListServiceResponse,
    FetchSeriesTeamSelectServiceResponse
} from '../_contracts/SeriesRegistrationServiceContracts';
import {SeriesManagedTeam} from '../_models';

export class SeriesRegistrationAPITransformer {
    static transformFetchSeriesRegistrationSeriesList(data: FetchSeriesRegistrationSeriesListApiResponse): FetchSeriesRegistrationSeriesListServiceResponse {
        return {
            series: data.series.map((datum: SeriesRegistrationIndexSeriesData): SeriesRegistrationIndexSeries => {
                return {
                    application_deadline_date_formatted: datum.application_deadline_date_formatted,
                    icon: datum.icon,
                    id: datum.id,
                    name: datum.name,
                    overview_link: datum.links.overview
                };
            })
        };
    }

    static transformApplicationDeadline(data: { date: string; time?: string; }): string {
        const application_deadline_formatted: string[] = [data.date];
        if (data.time) {
            application_deadline_formatted.push(data.time);
        }

        return application_deadline_formatted.join(' ');
    }

    static transformFetchSeriesSelectTeam(response_data: SeriesRegistrationApi.FetchTeamSelectApiResponse): FetchSeriesTeamSelectServiceResponse {
        return {
            series: this.transformSubpageSeriesSummary(response_data.series),
            teams: response_data.teams.map((team_datum: SeriesRegistrationData.ManagedTeam): SeriesManagedTeam => {
                return this.transformSelectableTeam(team_datum);
            })
        };
    }

    private static transformSubpageSeriesSummary(series_data: SeriesRegistrationData.SupageSeriesSummary): SeriesRegistration.SubpageSeriesSummary {
        return {
            id: series_data.id,
            name: series_data.name,
            icon: series_data.icon,
            is_team_series: !!series_data.is_team_series,
            application_deadline_formatted: series_data.application_deadline_formatted,
            links: {
                overview: series_data.links.overview
            }
        };
    }

    private static transformSelectableTeam(data: SeriesRegistrationData.ManagedTeam): SeriesManagedTeam {
        const button = data.selection_information.button;
        delete data.selection_information.button; // after extracting button from data, remove it to prevent application to parent classes

        return new SeriesManagedTeam({
            ...data,
            select_button: button || null
        });
    }
}