<?php

use App\CompetitionPortal\Volunteers\CompetitionPortalVolunteersManager;

/**
 * Fetch Competition Portal My Volunteer Schedule
 *
 * Purpose: Fetch information for the Competition Portal "My Volunteer Schedule" page
 * Source: "My Volunteer Schedule" page load
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalApi.FetchMyVolunteerScheduleApiResponse`
 */
$router->get('volunteer-schedule', function ($competition_id) {
    if (simulation_arg_present('load_error')) {
        http_response_code(500);

        return;
    }

    /** @var CompetitionPortalVolunteersManager $manager */
    $manager  = new CompetitionPortalVolunteersManager();
    $response = $manager->getFetchMyVolunteerScheduleApiResponse($competition_id);
    $manager->cache();

    return json_encode($response);
});

/**
 * Fetch Competition Portal Shift Selection
 *
 * Purpose: Fetch information for the Competition Portal "Shift Selection" page
 * Source: "Shift Selection" page load
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalVolunteerApi.FetchShiftSelectionApiResponse`
 */
$router->get('volunteer-shift-selection', function ($competition_id) {
    if (simulation_arg_present('load_error')) {
        http_response_code(500);

        return;
    }

    /** @var CompetitionPortalVolunteersManager $manager */
    $manager  = new CompetitionPortalVolunteersManager();
    $response = $manager->getFetchVolunteerShiftSelectionApiResponse($competition_id);
    $manager->cache();

    return json_encode($response);
});

/**
 * Remove Volunteer Shift
 *
 * Purpose: Report user intent to remove a volunteer shift
 * Source: "Shift Selection" page shift card "remove" button click
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalVolunteerApi.RemoveVolunteerShiftApiResponse`
 */
$router->delete('volunteer-schedule/shifts/{shift_id}', function ($competition_id, $shift_id) {
    if (simulation_arg_present('shift_remove_error')) {
        return json_encode([
            'success' => false,
            'error'   => 'API Configurable Message.'
        ]);
    }

    /** @var CompetitionPortalVolunteersManager $manager */
    $manager  = CompetitionPortalVolunteersManager::getCurrent();
    $response = $manager->getRemoveVolunteerShiftApiResponse($competition_id, $shift_id);
    $manager->cache();

    return json_encode($response);
});

/**
 * Select Volunteer Shift
 *
 * Purpose: Report user intent to select a volunteer shift
 * Source: "Shift Selection" page shift card "select" button click
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalVolunteerApi.SelectVolunteerShiftApiResponse`
 */
$router->post('volunteer-schedule/shifts/{shift_id}', function ($competition_id, $shift_id) {
    if (simulation_arg_present('shift_selection_error')) {
        return json_encode([
            'success' => false,
            'error'   => 'API Configurable Message.'
        ]);
    }

    /** @var CompetitionPortalVolunteersManager $manager */
    $manager  = CompetitionPortalVolunteersManager::getCurrent();
    $response = $manager->getSelectVolunteerShiftApiResponse($competition_id, $shift_id);
    $manager->cache();

    return json_encode($response);
});