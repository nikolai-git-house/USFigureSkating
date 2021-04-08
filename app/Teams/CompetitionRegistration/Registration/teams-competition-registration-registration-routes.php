<?php

use App\Teams\CompetitionRegistration\Registration\TeamsCompetitionRegistrationRegistrationManager;

/**
 *
 * Fetch Team Registration Shell
 *
 * Purpose: Fetch data required across the entire team registration workflow
 * Source: Team registration load
 *
 * Request Payload: `none`
 * Response: `TeamRegistrationApi.FetchShellApiResponse`
 */
$router->get('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/shell',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('load_error')) {
            http_response_code(500);

            return;
        }
        $manager  = new TeamsCompetitionRegistrationRegistrationManager();
        $response = $manager->getFetchShellApiResponse($competition_id, $team_id);
        $manager->cache();

        return json_encode($response);
    });

/**
 * Fetch Team Verification
 *
 * Purpose: Fetch data required to power the Team Verification Page
 * Source: Team Registration SPA Team Verification Page load
 *
 * Request Payload: `none`
 * Response: `TeamRegistrationApi.FetchTeamVerificationApiResponse`
 */
$router->get('/api/competition-registration/competitions/{competition_id}/teams/{team_id}',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('verification_error')) {
            http_response_code(500);

            return;
        }
        $manager  = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $response = $manager->getFetchTeamVerificationApiResponse($competition_id, $team_id);

        return json_encode($response);
    });

/**
 * Update Team Name
 *
 * Purpose: Change the team name
 * Source: Team Verification team name form submission
 *
 * Request Payload: `TeamRegistrationApi.UpdateTeamNameApiPayload`
 * Response: `APISubmissionResponse`
 */
$router->put('/api/competition-registration/competitions/{competition_id}/teams/{team_id}',
    function ($competition_id, $team_id) {

        $data = json_decode(file_get_contents('php://input'));

        $team_name = $data->name;
        if (strpos($team_name, 'error') !== false) {
            return json_encode([
                'success' => false,
                'error'   => 'Server side error message.',
            ]);
        }

        $manager  = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $response = $manager->getChangeTeamNameApiResponse($team_id, $team_name);
        $manager->cache();

        return json_encode($response);
    });

/**
 * Fetch Registration Overview
 *
 * Purpose: Fetch data required to power the Registration Overview Page
 * Source: Team Registration SPA Registration Overview Page load
 *
 * Request Payload: `none`
 * Response: `TeamRegistrationApi.FetchRegistrationOverviewApiResponse`
 */
$router->get('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/registration-overview',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('overview_error')) {
            http_response_code(500);

            return;
        }
        $manager  = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $response = $manager->getFetchRegistrationOverviewApiResponse($competition_id, $team_id);

        return json_encode($response);
    });

/**
 * Fetch Event Selection
 *
 * Purpose: Fetch data required to power the Event Selection Page
 * Source: Team Registration SPA Event Selection Page load
 *
 * URL: `GET: /api/competition-registration/competitions/{competition_id}/teams/{team_id}/events`
 *
 * Request Payload: `none`
 *
 * Response: `TeamRegistrationApi.FetchEventSelectionApiResponse`
 */
$router->get('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/events',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('events_load_error')) {
            http_response_code(500);

            return;
        }
        $manager  = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $response = $manager->getFetchEventSelectionApiResponse($competition_id, $team_id);
        $manager->cache();

        return json_encode($response);
    });

/**
 *  Remove Event
 *
 * Purpose: Remove an event from the team's selections
 * Source: Team Registration SPA Event Selection Page remove event button click
 *
 * Request Payload: `none`
 * Response: `TeamRegistrationApi.RemoveEventApiResponse`
 */
$router->delete('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/events/{event_id}',
    function ($competition_id, $team_id, $event_id) {
        if (simulation_arg_present('remove_event_error')) {
            return json_encode([
                'success' => false,
                'error'   => 'Server configurable error message.'
            ]);
        }
        $manager  = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $response = $manager->removeEvent($event_id);
        $manager->cache();

        return json_encode(array_merge($response, [
            'success' => true,
            'error'   => ''
        ]));
    });
/**
 * Add Event
 *
 * Purpose: Add an event to the team's selections
 * Source: Team Registration SPA Event Selection Page add event button click
 *
 * Request Payload: `none`
 * Response: `TeamRegistrationApi.AddEventApiResponse`
 */
$router->put('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/events/{event_id}',
    function ($competition_id, $team_id, $event_id) {
        if (simulation_arg_present('add_event_error')) {
            return json_encode([
                'success' => false,
                'error'   => 'Server configurable error message.'
            ]);
        }
        $manager  = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $response = $manager->addEvent($event_id);
        $manager->cache();

        return json_encode(array_merge($response, [
            'success' => true,
            'error'   => ''
        ]));
    });

/**
 *  Fetch Competition Roster
 *
 * Purpose: Fetch data required to power the Competition Roster Page
 * Source: Team Registration SPA Competition Roster Page load
 *
 * Request Payload: `none`
 * Response: `TeamRegistrationApi.FetchCompetitionRosterApiResponse`
 */
$router->get('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/competition-roster',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('roster_error')) {
            http_response_code(500);

            return;
        }
        $manager  = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $response = $manager->getFetchCompetitionRosterApiResponse();
        $manager->cache();

        return json_encode($response);
    });
/**
 * Update Competition Roster
 *
 * Purpose: Update the roster for a competition
 * Source: Edit roster component "Confirm" button click
 *
 * Request Payload: `TeamRegistrationApi.UpdateCompetitionRosterApiPayload`
 * Response: `APISubmissionResponse`
 */
$router->put('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/competition-roster',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('roster_submit_error')) {
            return json_encode([
                'success' => false,
                'error'   => 'Server error message.'
            ]);

            return;
        }
        $data = json_decode(file_get_contents('php://input'));

        $manager = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $manager->updateCompetitionRoster($data);
        $manager->cache();

        return json_encode([
            'success' => true,
            'error'   => ''
        ]);
    });

/**
 *  Fetch Competition Coaches
 *
 * Purpose: Fetch data required to power the Coaches Page
 * Source: Team Registration SPA Coaches Page load
 *
 * Request Payload: `none`
 * Response: `TeamRegistrationApi.FetchCoachesApiResponse`
 */
$router->get('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/coaches',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('coaches_error')) {
            http_response_code(500);

            return;
        }
        $manager  = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $response = $manager->FetchCoachesApiResponse();
        $manager->cache();

        return json_encode($response);
    });
/**
 *  Update Competition Coaches
 *
 * Purpose: Update the coach list for a competition
 * Source: Edit coach list component "Confirm" button click
 *
 * Request Payload: `TeamRegistrationApi.UpdateCoachesApiPayload`
 * Response: `APISubmissionResponse`
 */
$router->put('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/coaches',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('coaches_submit_error')) {
            return json_encode([
                'success' => false,
                'error'   => 'Server error message.'
            ]);

            return;
        }
        $data = json_decode(file_get_contents('php://input'));

        $manager = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $manager->updateCompetitionCoaches($data);
        $manager->cache();

        return json_encode([
            'success' => true,
            'error'   => ''
        ]);
    });

/**
 * Fetch Competition Team Service Personnel
 *
 * Purpose: Fetch data required to power the Team Service Personnel Page
 * Source: Team Registration SPA Team Service Personnel Page load
 *
 * Request Payload: `none`
 * Response: `TeamRegistrationApi.FetchTeamServicePersonnelApiResponse`
 */
$router->get('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/team-service-personnel',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('tsp_error')) {
            http_response_code(500);

            return;
        }
        $manager  = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $response = $manager->getFetchTeamServicePersonnelApiResponse();
        $manager->cache();

        return json_encode($response);
    });
/**
 * Update Competition Team Service Personnel
 *
 * Purpose: Update the team service personnel list for a competition
 * Source: Edit TSP component "Confirm" button click
 *
 * Request Payload: `TeamRegistrationApi.UpdateTeamServicePersonnelApiPayload`
 * Response: `APISubmissionResponse`
 */
$router->put('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/team-service-personnel',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('tsp_submit_error')) {
            return json_encode([
                'success' => false,
                'error'   => 'Server error message.'
            ]);

            return;
        }
        $data = json_decode(file_get_contents('php://input'));

        $manager = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $manager->updateCompetitionTeamServicePersonnel($data);
        $manager->cache();

        return json_encode([
            'success' => true,
            'error'   => ''
        ]);
    });

/**
 * Fetch Competition Prop Crew
 *
 * Purpose: Fetch data required to power the Prop Crew Page
 * Source: Team Registration SPA Prop Crew Page load
 *
 * Request Payload: `none`
 * Response: `TeamRegistrationApi.FetchPropCrewApiResponse`
 */
$router->get('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/prop-crew',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('prop_crew_error')) {
            http_response_code(500);

            return;
        }
        $manager  = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $response = $manager->getFetchPropCrewApiResponse();
        $manager->cache();

        return json_encode($response);
    });
/**
 * Update Competition Prop Crew
 *
 * Purpose: Update the prop crew list for a competition
 * Source: Edit roster component "Confirm" button click
 *
 *
 * Request Payload: `TeamRegistrationApi.UpdatePropCrewApiPayload`
 * Response: `APISubmissionResponse`
 */
$router->put('/api/competition-registration/competitions/{competition_id}/teams/{team_id}/prop-crew',
    function ($competition_id, $team_id) {
        if (simulation_arg_present('prop_crew_submit_error')) {
            return json_encode([
                'success' => false,
                'error'   => 'Server error message.'
            ]);

            return;
        }
        $data = json_decode(file_get_contents('php://input'));

        $manager = TeamsCompetitionRegistrationRegistrationManager::getCurrent();
        $manager->updateCompetitionPropCrew($data);
        $manager->cache();

        return json_encode([
            'success' => true,
            'error'   => ''
        ]);
    });