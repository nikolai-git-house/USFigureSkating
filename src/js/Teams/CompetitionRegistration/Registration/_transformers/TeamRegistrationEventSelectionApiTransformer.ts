import {TeamRegistrationApi, TeamRegistrationData, TeamRegistrationService} from '../_contracts';
import {EventSelectionEvent} from '../_models';

export class TeamRegistrationEventSelectionApiTransformer {

    static transformFetchEventSelection(response: TeamRegistrationApi.FetchEventSelectionApiResponse): TeamRegistrationService.FetchEventSelectionServiceResponse {
        return {
            events: response.events.map((event_data: TeamRegistrationData.EventSelectionEvent) => {
                return new EventSelectionEvent({
                    ...event_data
                });
            })
        };
    }
}