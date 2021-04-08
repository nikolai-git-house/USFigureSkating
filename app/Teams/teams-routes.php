<?php

use App\Teams\TeamsManager;

/**
 * Fetch Managed Teams
 *
 * Purpose: Fetch information about the teams managed by the current user to enable team selection
 * Source: Team Registration Select Team page load
 *
 * Request Payload: `none`
 * Response: `TeamsApi.FetchManagedTeamsApiResponse`
 */
$router->get('api/user/managed-teams', function () {
    if (simulation_arg_present('load_error')) {
        http_response_code(500);

        return;
    }

    $manager  = new TeamsManager();
    $response = $manager->getFetchManagedTeamsApiResponse();
    $manager->cache();

    return json_encode($response);
});