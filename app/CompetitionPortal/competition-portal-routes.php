<?php

use App\CompetitionPortal\CompetitionPortalManager;

/**
 * Fetch My Competitions - Teams
 *
 * Purpose: Fetch the data needed for the My Competitions - Teams page:
 * Source: My Competitions - Teams page load
 *
 * Request Payload: `none`
 * Response: `TeamsApi.FetchManagedTeamCompetitionsApiResponse`
 */
$router->get('api/user/managed-teams/competitions', function () {
    if (simulation_arg_present('load_error')) {
        http_response_code(500);

        return;
    }

    $manager  = new CompetitionPortalManager();
    $response = $manager->getFetchManagedTeamCompetitionsApiResponse();
    $manager->cache();

    return json_encode($response);
});

/**
 * Fetch Competition Portal My Teams
 *
 * Purpose: Fetch information for the Competition Portal "My Teams" page
 * Source: Team Portal "My Teams" page load
 *
 * Request Payload: `none`
 * Response: `TeamsApi.FetchMyTeamsApiResponse`
 */
$router->get('api/user/managed-teams/competitions/{competition_id}/registered-teams', function ($competition_id) {
    if (simulation_arg_present('load_error')) {
        http_response_code(500);

        return;
    }

    $manager  = CompetitionPortalManager::getCurrent();
    $response = $manager->getFetchCompetitionManagedTeamsApiResponse($competition_id);
    $manager->setActiveCompetitionData($response['competition_summary']);
    $manager->cache();

    return json_encode($response);
});

/**
 *  Fetch Competition Selectable Entities
 *
 * Purpose: Fetch information to power the "Select Competition Entity" page, including summary information about the
 * competition and a list of entities the active user can choose to view the specified competition as
 *
 * Source: "Select Competition Entity" page load
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalApi.FetchEntitySelectApiResponse`
 */
$router->get('api/competitions/{competition_id}/entity-select', function ($competition_id) {
    if (simulation_arg_present('load_error')) {
        http_response_code(500);

        return;
    }

    $manager = CompetitionPortalManager::getCurrent();
    $manager->setActiveCompetitionData(false);
    $response = $manager->getFetchEntitySelectApiResponse($competition_id);
    $manager->setActiveCompetitionData($response['competition_summary']);
    $manager->cache();

    return json_encode($response);
});

$router->group([ 'prefix' => 'api/competitions/{competition_id}' ], function ($router) {
    include __DIR__ . '/competition-portal-shared-entity-routes.php';

    include __DIR__.'/Volunteers/competition-portal-volunteer-routes.php';
    /**
     * Fetch Competition Portal My Skaters
     *
     * Purpose: Load data necessary for the Competition Portal "My Skaters" page
     * Source: Competition Portal "My Skaters" page load
     *
     *
     * Request Payload: `none`
     * Response: `CompetitionPortalApi.FetchMySkatersApiResponse`
     */
    $router->get('coach-skaters', function ($competition_id) {

        if (simulation_arg_present('error')) {
            http_response_code(500);

            return false;
        }
        /** @var CompetitionPortalManager $manager */
        $manager = CompetitionPortalManager::getCurrent();
        $result  = $manager->getFetchMySkatersAPIResponse($competition_id);
        $manager->cache();

        return json_encode($result);
    });

    /**
     * Fetch Competition Portal My Coaches
     *
     * Purpose: Load data necessary for the Competition Portal "My Coaches" page
     * Source: Competition Portal "My Coaches" page load
     *
     * Request Payload: `none`
     * Response: `CompetitionPortalApi.FetchMyCoachesApiResponse`
     */
    $router->get('my-coaches', function ($competition_id) {
        if (simulation_arg_present('error')) {
            http_response_code(500);

            return false;
        }
        /** @var CompetitionPortalManager $manager */
        $manager = CompetitionPortalManager::getCurrent();
        $result  = $manager->getFetchMyCoachesAPIResponse($competition_id);
        $manager->cache();

        return json_encode($result);
    });

    /**
     * Fetch Competition Portal Coach Schedule
     *
     * Purpose: Fetch information necessary for the "Coach Schedule" page
     * Source: "Coach Schedule" page load
     *
     * Request Payload: `none`
     * Response: `CompetitionPortalApi.FetchMyScheduleCoachApiResponse`
     */
    $router->get('my-schedule/coach', function ($competition_id) {
        if (simulation_arg_present('error')) {
            http_response_code(500);

            return false;
        }
        /** @var CompetitionPortalManager $manager */
        $manager = CompetitionPortalManager::getCurrent();
        $result  = $manager->getFetchMyScheduleCoachAPIResponse($competition_id,
            ! simulation_arg_present('no_schedule'));
        $manager->cache();

        return json_encode($result);
    });

    /**
     * Fetch Competition Portal My Schedule
     *
     * Purpose: Fetch information necessary for the "My Schedule" page
     * Source: "My Schedule" page load
     *
     * Request Payload: `none`
     * Response: `CompetitionPortalApi.FetchMyScheduleSkaterApiResponse`
     */
    $router->get('my-schedule', function ($competition_id) {
        if (simulation_arg_present('error')) {
            http_response_code(500);

            return false;
        }
        /** @var CompetitionPortalManager $manager */
        $manager = CompetitionPortalManager::getCurrent();
        $result  = $manager->getFetchMyScheduleSkaterAPIResponse($competition_id,
            ! simulation_arg_present('no_schedule'));
        $manager->cache();

        return json_encode($result);
    });

    $router->get('coach-competition-schedule', function ($competition_id) {
        if (simulation_arg_present('error')) {
            http_response_code(500);

            return false;
        }
        /** @var CompetitionPortalManager $manager */
        $manager = CompetitionPortalManager::getCurrent();
        $result  = $manager->getFetchCoachCompetitionScheduleAPIResponse($competition_id,
            ! simulation_arg_present('no_schedule'));
        $manager->cache();

        return json_encode($result);
    });
});

$router->group([ 'prefix' => 'api/competitions/{competition_id}/teams/{team_id}' ], function ($router) {
    include __DIR__ . '/competition-portal-shared-entity-routes.php';
});