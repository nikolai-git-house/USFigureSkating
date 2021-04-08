<?php

use App\CompetitionPortal\CompetitionPortalManager;
use App\CompetitionSearchManager;
use App\factories\CompetitionFieldFactory;

/**
 * Fetch Competition Search Competitions
 *
 * Purpose: Fetch list of competitions available for display on the Search Competitions page
 * Source: Search Competitions page load
 *
 * Request Payload: `none`
 * Response: `FetchSearchCompetitionListAPIResponse`
 */
$router->get( '/api/search-competitions', function () {
    session_start();
    if ( simulation_arg_present( 'error' ) ) {
        http_response_code( 500 );

        return;
    }
    $manager = new CompetitionSearchManager();

    $manager->cache();

    return $manager->getFetchSearchCompetitionListAPIResponse();


} );

/**
 *
 * Submit Competition Volunteer Request
 *
 * Purpose: Submit a volunteer request for a competition from the View Competition page
 * Source: Volunteer Request component submit from View Competition Page
 *
 *
 * Request Payload: `SubmitVolunteerRequestAPIPayload`
 * Response: `SubmitCompetitionVolunteerRequestAPIResponse`
 */
$router->post( '/api/competitions/{competition_id}/volunteer-request', function ( $competition_id ) {
    $data                 = json_decode(file_get_contents('php://input'), true);
    $manager  = CompetitionPortalManager::getCurrent();
    $response = $manager->submitCompetitionVolunteerRequest($competition_id,$data);

    return json_encode($response);
} );