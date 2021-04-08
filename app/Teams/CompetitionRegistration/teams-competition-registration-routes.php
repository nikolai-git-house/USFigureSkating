<?php

use App\Teams\CompetitionRegistration\TeamsCompetitionRegistrationManager;

/**
 * Fetch Team Registration Competition List
 *
 * Purpose: Fetch the data needed for the Team Registration Competition List page
 * Source: Team Registration Competition List page load
 *
 * Request Payload: `none`
 * Response: `TeamsCompetitionRegistrationApi.FetchCompetitionListApiResponse`
 */
$router->get('api/competition-registration/teams/{team_id}', function ($team_id) {
    if (simulation_arg_present('error')) {
        http_response_code(500);

        return;
    }
    $manager = new TeamsCompetitionRegistrationManager();
    $manager->cache();

    return $manager->getFetchCompetitionListApiResponse((int) $team_id);
});

include __DIR__ . '/Registration/teams-competition-registration-registration-routes.php';