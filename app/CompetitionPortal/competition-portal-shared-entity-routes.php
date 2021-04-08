<?php

use App\CompetitionPortal\CompetitionPortalManager;
use App\CompetitionPortal\CompetitionRoster\CompetitionPortalRosterManager;
use App\CompetitionPortal\TeamPersonnel\CompetitionPortalTeamPersonnelManager;

/**
 * Fetch Competition Portal Main (fka "Fetch View Competition Competition")
 *
 * Purpose: Fetch information to power the Competition Portal Main page
 * Source: Competition Portal Main page load
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalApi.FetchCompetitionMainApiResponse`
 */
$router->get('main', function ($competition_id, $team_id = null) {

    if (simulation_arg_present('error')) {
        http_response_code(500);

        return false;
    }
    $manager = CompetitionPortalManager::getCurrent();
    $result  = $manager->getFetchViewCompetitionAPIResponse($competition_id, $team_id);
    $manager->setActiveCompetitionData($result['competition']);
    $manager->cache();

    return json_encode($result);
});

/**
 * Fetch Competition Portal Competition Documents
 *
 * Purpose: Fetch information for the Competition Portal Competition Documents page
 * Source: Competition Portal Competition Documents page load
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalApi.FetchCompetitionDocumentsApiResponse`
 */
$router->get('documents', function ($competition_id, $team_id = null) {
    if (simulation_arg_present('load_error')) {
        http_response_code(500);

        return;
    }
    $manager = CompetitionPortalManager::getCurrent();

    $response = $manager->getFetchCompetitionDocumentsResponse($competition_id, $team_id);

    return json_encode($response);
});

/**
 * Update Competition Document Completion Status
 *
 * Purpose: Update the completion status of an Action Competition Document
 * Source: Action document "complete" checkbox click
 *
 * Request Payload: `CompetitionPortalApi.ChangeActionCompetitionDocumentCompletionAPIPayload`
 * Response: `APISubmissionResponse`
 */
$router->put('documents/{document_id}', function () {
    $success = true;
    $error   = "";
    if (simulation_arg_present('comp_doc_change_error')) {
        $success = false;
        $error   = "Error updating document status.";
    }

    return json_encode([
        "success" => $success,
        "error"   => $error,
    ]);
});

$router->get('contacts', function ($competition_id, $team_id = null) {
    if (simulation_arg_present('error')) {
        http_response_code(500);

        return false;
    }
    /** @var CompetitionPortalManager $manager */
    $manager = CompetitionPortalManager::getCurrent();
    $result  = $manager->getFetchCompetitionContactsApiResponse($competition_id, $team_id);

    return json_encode($result);
});

/**
 * Fetch Competition Portal Competition Information
 *
 * Purpose: Fetch information to power the Competition Portal "Competition Information" page
 * Source: Competition Portal "Competition Information" page load
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalApi.FetchCompetitionInformationApiResponse`
 */
$router->get('competition-information', function ($competition_id, $team_id = null) {

    if (simulation_arg_present('error')) {
        http_response_code(500);

        return false;
    }

    $manager = CompetitionPortalManager::getCurrent();
    $result  = $manager->getFetchCompetitionInformationApiResponse($competition_id, $team_id);

    return json_encode($result);
});

/**
 * Fetch Music and PPC
 *
 * Purpose: Load data necessary for the "Music and PPC" page
 * Source: "Music and PPC" page load

 * Request Payload: `none`
 * Response: `CompetitionPortalApi.FetchMusicAndPpcApiResponse`
 */
$router->get('music-and-ppc', function ($competition_id, $team_id = null) {
    if (simulation_arg_present('error')) {
        http_response_code(500);

        return false;
    }
    /** @var CompetitionPortalManager $manager */
    $manager = CompetitionPortalManager::getCurrent();
    $result  = $manager->getFetchMusicAndPpcApiResponse($competition_id, $team_id);

    return json_encode($result);
});
/**
 * Fetch Competition Team Personnel
 *
 * Purpose: Fetch information about a team's Competition Personnel for a Competition
 * Source: "Competition Team Personnel" page load
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalApi.FetchCompetitionPersonnelApiResponse`
 */
$router->get('competition-personnel', function ($competition_id, $team_id) {
    if (simulation_arg_present('load_error')) {
        http_response_code(500);

        return;
    }

    $manager  = new CompetitionPortalTeamPersonnelManager();
    $response = $manager->getFetchCompetitionCompetitionPersonnelApiResponse($competition_id, $team_id);
    $manager->cache();

    return json_encode($response);

});

/**
 * Fetch Available Competition Coaches
 * Fetch Available Competition Team Service Personnel
 * Fetch Available Competition Prop Crew
 *
 * Purpose: Fetch information necessary to power the "Edit Competition {type}" component on the "Competition Team
 * Personnel" page Source: "Competition Team Personnel" page "Edit"/"Add" {type} button click
 *
 * Request Payload: `none`
 *
 * Response: `CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailableCoachesApiResponse`
 * Response: `CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailableTeamServicePersonnelApiResponse`
 * Response: `CompetitionTeamPersonnelApi.FetchTeamPersonnelAvailablePropCrewApiResponse`
 */
$router->get('available-competition-personnel/{type}', function (
    $competition_id,
    $team_id,
    $type
) {
    $manager  = CompetitionPortalTeamPersonnelManager::getCurrent();
    $response = $manager->getFetchAvailableCompetitionPersonnelApiResponse($type);
    $manager->cache();

    return json_encode($response);
});

/**
 * Update Competition Coaches
 * Update Competition Team Service Personnel
 * Update Competition Prop Crew
 *
 * Purpose: Update the list of {type} a team manager has identified as attending a competition with their team
 * Source: "Competition Team Personnel" page "Edit {type}" component "Confirm" button click.
 *
 * Request Payload: `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelCoachesApiPayload`
 * Response: `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelCoachesApiResponse`
 *
 * Request Payload: `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelTeamServicePersonnelApiPayload`
 * Response: `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelTeamServicePersonnelApiResponse`
 *
 * Request Payload: `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelPropCrewApiPayload`
 * Response: `CompetitionTeamPersonnelApi.UpdateCompetitionTeamPersonnelPropCrewApiResponse`
 */
$router->patch('competition-personnel/{type}', function (
    $competition_id,
    $team_id,
    $type
) {
    $response = [
        'success' => false,
        'error'   => 'API failure message.'
    ];
    if ( ! simulation_arg_present('ctp_submit_fail')) {


        $data     = json_decode(file_get_contents('php://input'), true);
        $manager  = CompetitionPortalTeamPersonnelManager::getCurrent();
        $response = $manager->patchUpdateCompetitionRosterType($type, $data);
        $manager->cache();

    }

    return json_encode($response);
});

include __DIR__ . '/competition-portal-shared-music-ppc-routes.php';
/**
 * Get Practice Ice Schedules
 *
 * Purpose: Get information necessary to display the Competition Portal "Practice Ice" page
 * Source: Competition Portal "Practice Ice" page load
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalApi.FetchPracticeIceScheduleApiResponse`
 */
$router->get('practice-ice-schedules', function ($competition_id, $team_id = null) {

    if (simulation_arg_present('error')) {
        http_response_code(500);

        return false;
    }
    /** @var CompetitionPortalManager $manager */
    $manager = CompetitionPortalManager::getCurrent();
    $result  = $manager->getFetchPracticeIceScheduleAPIResponse($competition_id, $team_id);
    $manager->cache();

    return json_encode($result);
});


/**
 * Get Practice Ice Pre-Purchase
 *
 * Purpose: Get information necessary to display the Competition Portal "Practice Ice Pre-Purchase" page
 * Source: Competition Portal "Practice Ice Pre-Purchase" page load
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalApi.FetchPracticeIcePrePurchaseApiResponse`
 */
$router->get('practice-ice-prepurchase', function ($competition_id, $team_id = null) {

    if (simulation_arg_present('error')) {
        http_response_code(500);

        return false;
    }
    /** @var CompetitionPortalManager $manager */
    $manager = CompetitionPortalManager::getCurrent();
    $result  = $manager->getFetchPracticeIcePrePurchaseAPIResponse($competition_id, $team_id);
    $manager->cache();

    return json_encode($result);
});
/**
 * Fetch Competition Portal Competition Roster
 *
 * Purpose: Fetch information for the Competition Portal "Competition Roster" page
 * Source: "Competition Roster" page load
 *
 * Request Payload: `none`
 * Response: `CompetitionRosterApi.FetchCompetitionRosterApiResponse`
 */
$router->get('competition-roster', function ($competition_id, $team_id) {
    if (simulation_arg_present('load_error')) {
        http_response_code(500);

        return;
    }

    $manager  = new CompetitionPortalRosterManager();
    $response = $manager->getFetchCompetitionRosterApiResponse($competition_id, $team_id);
    $manager->cache();

    return json_encode($response);
});
/**
 * Fetch Competition Portal Team Roster
 *
 * Purpose: Fetch the full team roster to enable editing the competition roster for a team
 * Source: Competition Portal "Competition Roster" page "Edit Roster" button click
 *
 * Request Payload: `none`
 * Response: `CompetitionRosterApi.FetchTeamRosterApiResponse`
 */
$router->get('team-roster', function ($competition_id, $team_id) {
    if (simulation_arg_present('load_error')) {
        http_response_code(500);

        return;
    }

    $manager  = CompetitionPortalRosterManager::getCurrent();
    $response = $manager->getFetchTeamRosterApiResponse($competition_id, $team_id);
    $manager->cache();

    return json_encode($response);
});

/**
 *  Update Competition Portal Competition Roster
 *
 * Purpose: Save a user's modifications to their team competition roster
 * Source: Competition Portal "Competition Rostwer" page "Edit Roster" screen
 *
 * Request Payload: `CompetitionRosterApi.UpdateCompetitionRosterApiPayload`
 * Response: `CompetitionRosterApi.UpdateCompetitionRosterApiResponse`
 */
$router->patch('competition-roster', function ($competition_id, $team_id) {
    $response = [
        'success' => false,
        'error'   => 'API failure message.'
    ];
    if ( ! simulation_arg_present('cp_roster_submit_fail')) {
        $data = json_decode(file_get_contents('php://input'), true);
        /** @var CompetitionPortalRosterManager $manager */
        $manager  = CompetitionPortalRosterManager::getCurrent();
        $response = $manager->patchUpdateCompetitionRoster($data);
        $manager->cache();
    }

    return json_encode($response);
});

/**
 * Get Competition Portal Competition Schedule
 *
 * Purpose: Get information needed by the Competition Portal "CompetitionSchedule" page
 * Source: Competition Portal "CompetitionSchedule" page load
 *
 * Request Payload: `none`
 * Response: `CompetitionPortalApi.FetchCompetitionScheduleApiResponse`
 */
$router->get('competition-schedule', function ($competition_id, $team_id = null) {

    if (simulation_arg_present('error')) {
        http_response_code(500);

        return false;
    }
    /** @var CompetitionPortalManager $manager */
    $manager = CompetitionPortalManager::getCurrent();
    $result  = $manager->getFetchCompetitionScheduleAPIResponse($competition_id, $team_id);
    $manager->cache();

    return json_encode($result);
});