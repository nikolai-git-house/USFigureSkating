/* eslint-disable jsdoc/require-jsdoc */
import {SeriesStandings, SeriesStandingsApi, SeriesStandingsData, SeriesStandingsService} from '../_contracts';
import {SeriesRegistrationAPITransformer} from '../../_transformers/SeriesRegistrationAPITransformer';
import {StringHelpers} from '../../../helpers/StringHelpers';

export class SeriesStandingsApiTransformer {
    private static uid: number = 1;
    private data: SeriesStandingsApi.FetchSeriesStandingsApiResponse;

    constructor(data: SeriesStandingsApi.FetchSeriesStandingsApiResponse) {
        this.data = data;
    }

    static transformFetchSeriesStandings(data: SeriesStandingsApi.FetchSeriesStandingsApiResponse): SeriesStandingsService.FetchSeriesStandingsServiceResponse {
        const {series, standings} = data;

        return {
            series: {
                name: series.name,
                icon: series.icon,
                application_deadline_formatted: SeriesRegistrationAPITransformer.transformApplicationDeadline(series.application_deadline_formatted),
                links: {
                    overview: series.links.overview
                },
                resource_documents: series.resource_documents
            },
            standings: {
                meta: {
                    last_updated_datetime_formatted: standings.meta.last_updated_datetime_formatted
                },
                events: standings.events.map((event: SeriesStandingsData.StandingsEventData) => {
                    return SeriesStandingsApiTransformer.transformStandingsEvent(event);
                })
            },
            filters: {
                sections: standings.meta.available_filters.section_keys
                    .map((section_key: SeriesStandings.SeriesSectionKey) => {
                        return {
                            label: StringHelpers.titleCase(section_key),
                            value: section_key
                        };
                    }),
                disciplines: standings.meta.available_filters.discipline_names
                    .map((discipline: string) => {
                        return {
                            label: StringHelpers.titleCase(discipline),
                            value: discipline
                        };
                    }),
                levels: standings.meta.available_filters.level_names
                    .map((level: string) => {
                        return {
                            label: StringHelpers.titleCase(level),
                            value: level
                        };
                    })
            }
        };
    }

    private static transformStandingsEvent(event: SeriesStandingsData.StandingsEventData): SeriesStandings.StandingsEvent {

        return {
            uid: SeriesStandingsApiTransformer.uid++,
            name: event.name,
            discipline_name: event.discipline_name,
            level_name: event.level_name,
            standings: SeriesStandingsApiTransformer.transformStandingsEventStandings(event.standings)
        };
    }

    private static transformStandingsEventStandings(standings: SeriesStandingsData.StandingsRowData[]): SeriesStandings.StandingsRow[] {
        return standings.map((standing_data: SeriesStandingsData.StandingsRowData): SeriesStandings.StandingsRow => {
            return standing_data;
        });
    }
}