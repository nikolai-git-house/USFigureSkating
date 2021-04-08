/* eslint-disable jsdoc/require-jsdoc */
import {ViewCompetitionCompetition, ViewCompetitionCompetitionParameters} from './ViewCompetitionCompetition';
import {ViewCompetitionData} from './ViewCompetitionDataContracts';
import {DataNavigationLinkTransformer} from '../../CompetitionPortal/_transformers/DataNavigationLinkTransformer';

export class ViewCompetitionTransformer {

    static transformFetchViewCompetitionCompetition(response_data: ViewCompetitionData): ViewCompetitionCompetition {

        const parameters: ViewCompetitionCompetitionParameters = {
            announcement_url: response_data.announcement_url || null,
            directions: response_data.directions || [],
            website_url: response_data.website_url || null,
            end_date_pretty: response_data.end_date_pretty,
            icon: response_data.icon,
            id: response_data.id,
            is_ems: response_data.is_ems,
            name: response_data.name,
            start_date_pretty: response_data.start_date_pretty,
            user_navigation: response_data.user_navigation.map((data) => {
                return DataNavigationLinkTransformer.transformDataNavigationLink(data);
            }),
            links: {
                ...response_data.links
            }
        };
        if (response_data.registration_cta_configuration) {
            parameters.registration_cta_configuration = response_data.registration_cta_configuration;
        }

        if (response_data.volunteer_cta_configuration) {
            parameters.volunteer_cta_configuration = response_data.volunteer_cta_configuration;
        }

        if (response_data.team_registration_cta_configuration) {
            parameters.team_registration_cta_configuration = response_data.team_registration_cta_configuration;
        }

        return new ViewCompetitionCompetition(parameters);
    }
}