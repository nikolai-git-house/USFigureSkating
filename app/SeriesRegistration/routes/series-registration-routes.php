<?php

use App\FormOptions;
use App\Search;
use App\SeriesRegistration\SeriesRegistrationManager;

/**
 * Fetch Series Registration Series List
 *
 * Purpose: Fetch the list of available series to display on the "Series Information" Page
 * Source: "Series Information" page load
 *
 * Request Payload: `none`
 * Response: `FetchSeriesRegistrationSeriesListApiResponse`
 */
$router->get('/api/series-registration/series', function () {
    session_start();
    if (simulation_arg_present('error')) {
        http_response_code(500);

        return;
    }
    $manager = new SeriesRegistrationManager();

    $manager->cache();

    return $manager->getFetchSeriesRegistrationSeriesListApiResponse();
});

/**
 * Fetch Series Registration Series Application
 *
 * Purpose: Fetch information for the "Series Application" page for a series
 * Source: "Series Application" page load
 *
 * Request Payload: `none`
 * Response: `SeriesApplicationApi.FetchApplicationAPIResponse`
 */
$router->get('/api/series-registration/{series_id}/application', function ($series_id) {
    session_start();
    if (simulation_arg_present('error')) {
        http_response_code(500);

        return;
    }
    $manager = SeriesRegistrationManager::getCurrent();

    return $manager->getFetchSeriesRegistrationSeriesApplicationApiResponse($series_id);
});

/**
 * Fetch Series Registration Series Application (Teams)
 *
 * Purpose: Fetch information for the "Series Application" page for a series for a team
 * Source: "Series Application" page load
 *
 * Request Payload: `none`
 * Response: `SeriesApplicationApi.FetchApplicationAPIResponse`
 */
$router->get('/api/series-registration/{series_id}/teams/{team_id}/application', function ($series_id, $team_id) {
    session_start();
    if (simulation_arg_present('error')) {
        http_response_code(500);

        return;
    }
    $manager = SeriesRegistrationManager::getCurrent();

    return $manager->getFetchSeriesRegistrationSeriesApplicationTeamApiResponse($series_id, $team_id);
});

/**
 * Update Series Registration User Profile
 *
 * Purpose: Update the active user's profile relative to a series registration
 * Source: "Series Application" page email edit form submission
 *
 * Request Payload: `SeriesApplicationApi.UpdateProfileAPIPayload`
 * Response: `APISubmissionResponse`
 */
$router->patch('/api/series-registration/{series_id}/profile', function () {
    $success = true;
    $error   = "";
    $data    = json_decode(file_get_contents('php://input'), true);

    if (strpos($data['email'], 'error') !== false) {
        $success = false;
        $error   = "Server configurable error message.";
    }

    return json_encode([
        'success' => $success,
        'error'   => $error,
    ]);

});

/**
 * Fetch Series Application Coach Search Form Options
 *
 * Purpose: Fetch state form options for the Coach Search form on a Series Application
 * Source: "Series Application" page "Add Coach" search form load
 *
 * Request Payload: `none`
 * Response: `SeriesApplicationApi.CoachSearchFormOptionsAPIResponse`
 */
$router->get('/api/series-registration/{series_id}/coach-search', function () {
    return json_encode([
        'states' => FormOptions::state_options(),
    ]);
});

/**
 * Run Series Application Coach Search
 *
 * Purpose: Run the series application coach search
 * Source: "Series Application" page "Add Coach" search form submit
 *
 * Request Payload: `MemberSearchAPIParameters`
 * Response: `SeriesApplicationApi.CoachSearchAPIResponse`
 */
$router->post('/api/series-registration/{series_id}/coach-search', function () {
    $data   = json_decode(file_get_contents('php://input'), true);
    $search = new Search($data, false);

    return json_encode([
        'results' => $search->results
    ]);
});

/**
 * Fetch Series Application Partner Search Form Options
 *
 * Purpose: Fetch state form options for the Partner Search form on a Series Application
 * Source: "Series Application" page "Add Partner" search form load
 *
 * Request Payload: `none`
 * Response: `SeriesApplicationApi.PartnerSearchFormOptionsAPIResponse`
 */
$router->get('/api/series-registration/{series_id}/partner-search', function () {
    return json_encode([
        'states' => FormOptions::state_options(),
    ]);
});

/**
 * Run Series Application Partner Search
 *
 * Purpose: Run the series application partner search
 * Source: "Series Application" page "Add Partner" search form submit
 *
 * Request Payload: `MemberSearchAPIParameters`
 * Response: `SeriesApplicationApi.PartnerSearchAPIResponse`
 */
$router->post('/api/series-registration/{series_id}/partner-search/discipline/{discipline_id}', function () {
    session_start();
    $manager = SeriesRegistrationManager::getCurrent();

    return $manager->getPartnerSearchAPIResponse();

});
/**
 * Add Series Application Skate Test
 *
 * Purpose: Add a skate test to a user's skate test history from the Series Application Page.  Get updated application
 *          information
 * Source: Series Application Skate Tests Component Add Test Form submission
 *
 * Request Payload: `UserAddSkateTestAPIPayload`
 * Response: `SeriesApplicationApi.AddSkateTestAPIResponse`
 */
$router->post('/api/series-registration/{series_id}/skate-test-history', function () {
    session_start();
    $manager = SeriesRegistrationManager::getCurrent();

    return json_encode($manager->getAddSkateTestAPIResponse());
});

/**
 * Remove Series Application Skate Test
 * Purpose: Remove a skate test from a user's skate test history from the Series Application Page.  Get updated
 * application information
 * Source: Series Application Skate Tests Component Remove Test button click
 *
 * Request Payload: `UserRemoveSkateTestAPIPayload`
 * Response: `SeriesApplicationApi.RemoveSkateTestAPIResponse`
 */
$router->delete('/api/series-registration/{series_id}/skate-test-history', function () {
    session_start();
    $manager = SeriesRegistrationManager::getCurrent();

    return json_encode($manager->getRemoveSkateTestAPIResponse());
});

/**
 * Save Series Application
 *
 * Purpose: Save a series application for a user
 * Source: Series application save button click
 *
 * Request Payload: `SeriesApplicationApi.SaveApplicationAPIPayload`
 * Response: `SeriesApplicationApi.SaveApplicationAPIResponse`
 */
$router->post('/api/series-registration/{series_id}/application', function ($series_id) {
    $success = true;
    $error   = "";
    if (simulation_arg_present('fail_save')) {
        $success = false;
        $error   = "Server configurable error message";
    }

    $response = [
        'success' => $success,
        'error'   => $error,
    ];
    if ($success) {
        $response['cart_link'] = sprintf('/pages/series-registration/%s/cart', $series_id);
    }

    return json_encode($response);

});

/**
 * Save Series Application (Team)
 *
 * Purpose: Save a team series application
 * Source: eries application save button click (team context)
 *
 * Request Payload: `SeriesApplicationApi.SaveApplicationTeamAPIPayload`
 * Response: `SeriesApplicationApi.SaveApplicationAPIResponse`
 */
$router->post('/api/series-registration/{series_id}/teams/{team_id}/application', function ($series_id) {
    $success = true;
    $error   = "";
    if (simulation_arg_present('fail_save')) {
        $success = false;
        $error   = "Server configurable error message";
    }

    $response = [
        'success' => $success,
        'error'   => $error,
    ];
    if ($success) {
        $response['cart_link'] = sprintf('/pages/series-registration/%s/cart', $series_id);
    }

    return json_encode($response);

});

/**
 * Fetch Series Overview
 *
 * Purpose: Fetch information for the "Series Overview" page for a series
 * Source: "Series Overview" page load
 *
 * Request Payload: `none`
 * Response: `SeriesOverviewApi.FetchSeriesOverviewApiResponse`
 */
$router->get('/api/series-registration/{series_id}/overview', function ($series_id) {
    session_start();
    if (simulation_arg_present('error')) {
        http_response_code(500);

        return;
    }
    $manager = SeriesRegistrationManager::getCurrent();

    return $manager->getFetchSeriesOverviewApiResponse($series_id);
});
/**
 * Fetch Series Standings
 *
 * Purpose: Fetch information for the "Series Standings" page for a series
 * Source: "Series Standings" page load
 *
 * Request Payload: `none`
 * Response: `SeriesStandingsApi.FetchSeriesStandingsApiResponse`
 */
$router->get('/api/series-registration/{series_id}/standings', function ($series_id) {
    session_start();
    if (simulation_arg_present('error')) {
        http_response_code(500);

        return;
    }
    $manager = SeriesRegistrationManager::getCurrent();

    return $manager->getFetchSeriesStandingsApiResponse($series_id);
});

/**
 * Fetch Series Registration Select Team
 *
 * Purpose: Fetch data to power the Series Registration Select Team page
 * Source: Series Registration Select Team Page Load
 *
 * Request Payload: `none`
 * Response: `SeriesRegistrationApi.FetchTeamSelectApiResponse`
 */
$router->get('/api/series-registration/{series_id}/managed-teams', function ($series_id) {
    session_start();
    if (simulation_arg_present('error')) {
        http_response_code(500);

        return;
    }
    $manager = SeriesRegistrationManager::getCurrent();
    $manager->cache();

    return $manager->getFetchSeriesSelectTeamApiResponse($series_id);
});