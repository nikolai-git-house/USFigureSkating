<?php

use App\AdminPortal\CheckIn;
use App\AdminPortal\CompetitionManagement\CompetitionManagement;
use App\AdminPortal\CompetitionManagement\CompetitionManagementContacts;
use App\AdminPortal\Factories\CheckInCommentsFactory;
use App\AdminPortal\Factories\CheckInComplianceFactory;
use App\AdminPortal\Factories\CheckInEventFactory;
use App\AdminPortal\Factories\CheckInRosterFactory;
use App\AdminPortal\Factories\CheckInSkaterCoachesFactory;
use App\AdminPortal\Factories\CheckInSkatersFactory;
use App\AdminPortal\Factories\CheckInTeamCoachesFactory;
use App\AdminPortal\Factories\CheckInTeamServicePersonnelFactory;

/**
 * Competition Management Fetch Competition Lists
 *
 * Purpose: Fetch admin list of upcoming and past competitions.
 * Source: “Competition Management” page load (contains “Upcoming” and “Past” competition lists)
 *
 * Request Payload: `none`
 * Response: `CompetitionManagementFetchCompetitionListAPIResponse`
 */
$router->GET( '/api/competition-management/competitions', function () {
	session_start();
	$competition_management = new CompetitionManagement();
	if ( simulation_arg_present( 'comp_man_load_error' ) ) {
		http_response_code( 500 );
	}
	$competition_management->cache();

	$result = $competition_management->getIndexLists();

	if ( simulation_arg_present( 'comp_man_no_upcoming' ) ) {
		$result['upcoming'] = [];
	}
	if ( simulation_arg_present( 'comp_man_no_past' ) ) {
		$result['past'] = [];
	}

	return json_encode( $result );
} );
/**
 * Competition Management Fetch Competition Information
 *
 * Purpose: Fetch Admin information about a competition, including information about registrant counts, registration
 * timelines, deadlines, practice ice windows and volunteer timelines. Source: Admin Portal “Competition Information”
 * page load.
 * Request Payload: `none`
 * Response: `FetchCompetitionManagementCompetitionInformationAPIResponse`
 */
$router->GET( '/api/competition-management/competitions/{competition_id}/information', function ( $competition_id ) {
	session_start();
	$competition_management = CompetitionManagement::getCurrent();
	$result                 = $competition_management->getInformation( $competition_id );
	if ( simulation_arg_present( 'comp_man_load_error' ) ) {
		http_response_code( 500 );
	}
	$competition_management->cache();

	return json_encode( $result );
} );
/**
 * Competition Management Compliance Fetch Entities
 *
 * Purpose: Fetch the entities for display on the Competition Management “Compliance” page
 * Source: Competition Management “Compliance” page load
 *
 * Request Payload: `none`
 * Response: `CompetitionManagementFetchCompetitionComplianceEntitiesAPIResponse`
 */
$router->GET( '/api/competitions/{competition_id}/compliance', function ( $competition_id ) {
	session_start();

	$competition_management = CompetitionManagement::getCurrent();
	$result                 = $competition_management->getCompliance();
	if ( simulation_arg_present( 'comp_man_load_error' ) ) {
		http_response_code( 500 );
	}
	$competition_management->cache();

	return json_encode( $result );
} );
/**
 * Competition Management Compliance Fetch Email Configuration
 *
 * Purpose: Fetch the email CC options for the Compliance Page Email Component
 * Source: Competition Management “Compliance” email component load
 *
 * Request Payload: `none`
 * Response: `FetchComplianceEmailRecipientOptionsAPIResponse`
 */
$router->GET( '/api/competitions/{competition_id}/compliance/email', function ( $competition_id ) {
	session_start();
	if ( simulation_arg_present( 'comp_man_load_error' ) ) {
		http_response_code( 500 );
	}
	$competition_management = CompetitionManagement::getCurrent();
	$result                 = $competition_management->getComplianceEmailOptions();
	if ( simulation_arg_present( 'no_email_cc' ) ) {
		$result['cc'] = false;
	}

	return json_encode( $result );
} );
/**
 * Competition Management Compliance Email Submit
 *
 * Purpose: Submit a compliance email
 * Source: Competition Management “Compliance” email component submit
 *
 * Request Payload: `none`
 * Response: `SubmitComplianceEmailAPIPayload`
 */
$router->POST( '/api/competitions/{competition_id}/compliance/email', function ( $competition_id ) {
	session_start();

	$success = true;
	$error   = "";

	if ( simulation_arg_present( 'comp_man_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.[Email Send]";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );
/**
 * Check-In Fetch Entities
 *
 * Purpose: Get the entities list for the check-in page.
 * Source: Check-in page load
 *
 * Request Payload: `none`
 * Response: FetchCheckInEntitiesAPIResponse
 */
$router->GET( '/api/competitions/{competition_id}/check-in', function ( $competition_id ) {
    session_start();
    $check_in = new CheckIn();
    if (simulation_arg_present('checkin_load_error')) {
        http_response_code(500);
    }
    $check_in->cache();

    return json_encode(array_map(function ($entity) {
        unset($entity['is_compliant']);

        return $entity;
    }, $check_in->entities));
});
/**
 * Check-In Fetch Email Configuration
 *
 * Purpose: Fetch the options for BCC and CC email recipients, as well as any attachment validation rules, for the
 * Check-In email form Source: Check-in Email component load
 * Request Payload: `none`
 * Response: FetchCheckInEmailConfigurationAPIResponse
 */
$router->GET( '/api/competitions/{competition_id}/check-in/email', function ( $competition_id ) {
    session_start();
    $check_in = CheckIn::getCurrent();
    if ( simulation_arg_present( 'checkin_email_load_error' ) ) {
        http_response_code( 500 );
    }
    $result = $check_in->getEmailTargets();

    $check_in->cache();
    if ( simulation_arg_present( 'no_email_cc' ) ) {
        unset( $result['cc'] );
    }

    return json_encode( $result );
} );
/**
 * Fetch Entity Check-In
 *
 * Purpose: Fetch data necessary to initiate the entity check-in process
 * Source: Check-In page Entity Card "Check-In" button click
 *
 * Request Payload: `none`
 * Response: `FetchCheckInEntityApiResponse`
 */
$router->GET('/api/competitions/{competition_id}/check-in/{entity_id}', function ($competition_id, $entity_id) {
    session_start();
    $check_in = CheckIn::getCurrent();
    $entity   = (object) $check_in->findEntity($entity_id);

    return json_encode([
        'is_compliant' => $entity->is_compliant
    ]);
});


/**
 * Check-In Email Submit
 *
 * Purpose: Submit a Check-in email
 * Source: Check-in Email component “send” email click
 *
 * Request Payload: `SubmitCheckInEmailAPIPayload`
 * Response: APISubmissionResponse
 */
$router->POST( '/api/competitions/{competition_id}/check-in/email', function ( $competition_id ) {
	session_start();
	$check_in = CheckIn::getCurrent();
	$check_in->submitEmail( compact( 'form_data', 'attachments' ) );
	$check_in->cache();
	$success = true;
	$error   = "";

	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.[Email Send]";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );
/**
 * Check-In Check in Entity
 *
 * Purpose: Check an Entity in
 * Source: Check-in Entity Index “Check-in” button click for an entity
 *
 * Request Payload: `CheckEntityInAPIPayload`
 * Response: CheckEntityInAPIResponse
 */
$router->POST( '/api/competitions/{competition_id}/check-in/{entity_id}/check-in', function ( $competition_id, $entity_id ) {
	session_start();

	$check_in = CheckIn::getCurrent();
	$result   = $check_in->checkEntityIn( $entity_id );

	$success = true;
	$error   = "";
	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
		'status'  => $result,
	] );
} );
/**
 * Check-In Undo Check in Entity
 *
 * Purpose: Undo the check-in for an Entity
 * Source: Check-in Index “Undo Check-in” button click
 *
 * Request Payload: `none`
 * Response: APISubmissionResponse
 */
$router->POST( '/api/competitions/{competition_id}/check-in/{entity_id}/undo-check-in', function ( $competition_id, $entity_id ) {
	session_start();
	$check_in = CheckIn::getCurrent();
	$check_in->undoCheckEntityIn( $entity_id );

	$success = true;
	$error   = "";

	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );
/**
 * Entity Check-In Fetch Comments
 *
 * Purpose: Fetch comments data for a check-in entity
 * Source: Check-in Comments subpage load
 *
 * Request Payload: `none`
 * Response: FetchEntityCommentsAPIResponse
 */
$router->GET( '/api/competitions/{competition_id}/check-in/{entity_id}/comments', function ( $competition_id, $entity_id ) {
	if ( simulation_arg_present( 'check_in_entity_fetch_error' ) ) {
		http_response_code( 500 );

		return;
	}
	session_start();
	$check_in = CheckIn::getCurrent();
	$entity   = $check_in->findEntity( $entity_id );

	$check_in->comments = CheckInCommentsFactory::mock( $entity['comment_count'] );
	$check_in->cache();

	return json_encode( $check_in->comments );
} );
/**
 * Entity Check-In Submit Comment
 *
 * Purpose: Add a check-in comment for an entity
 * Source: Valid Check-in Comments subpage “add” button click
 *
 * Request Payload: `SubmitEntityCommentAPIPayload`
 * Response: EntityCommentAPISubmissionResponse
 */
$router->POST( '/api/competitions/{competition_id}/check-in/{entity_id}/comments', function ( $competition_id, $entity_id ) {
	session_start();
	$success     = true;
	$error       = "";
	$check_in    = CheckIn::getCurrent();
	$data        = json_decode( file_get_contents( 'php://input' ) );
	$new_comment = $check_in->addComment( $data );
	$check_in->cache();

	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
		'comment' => $new_comment,
	] );
} );
/**
 * Entity Check-In Fetch Compliance
 *
 * Purpose: Fetch compliance information for an entity being checked in
 * Source: Check-in Compliance Subpage
 *
 * Request Payload: `none`
 * Response: FetchEntityComplianceAPIResponse
 */
$router->GET( '/api/competitions/{competition_id}/compliance/{entity_id}', function ( $competition_id, $entity_id ) {
	if ( simulation_arg_present( 'check_in_entity_fetch_error' ) ) {
		http_response_code( 500 );

		return;
	}

	session_start();
	$check_in = CheckIn::getCurrent();
	$entity   = $check_in->findEntity( $entity_id );

	$check_in->compliance = CheckInComplianceFactory::mock( (object) $entity );
	$check_in->cache();

	return json_encode( $check_in->compliance );
} );
/**
 * Entity Check-In Override Compliance Item
 *
 * Purpose: Override the compliance of an item for an entity
 * Source: Check-in Compliance Sub-page "Viewed" checkbox click
 *
 * Request Payload: `OverrideComplianceItemAPIPayload`
 * Response: APISubmissionResponse
 */
$router->POST( '/api/competitions/{competition_id}/compliance/{entity_id}/override', function ( $competition_id, $entity_id ) {
	session_start();

	$check_in = CheckIn::getCurrent();
	$data     = json_decode( file_get_contents( 'php://input' ) );
	$check_in->updateCompliance( $data );

	$success = true;
	$error   = "";

	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );
/**
 * Entity Check-In Fetch Events
 *
 * Purpose: Fetch the events list for a check-in entity
 * Source: Check-in Events Subpage load
 *
 * Request Payload: `none`
 * Response: FetchEntityEventsAPIResponse
 */
$router->GET( '/api/competitions/{competition_id}/check-in/{entity_id}/events', function ( $competition_id, $entity_id ) {
	session_start();
	if ( simulation_arg_present( 'check_in_entity_fetch_error' ) ) {
		http_response_code( 500 );

		return;
	}
	$check_in = CheckIn::getCurrent();
	$entity   = $check_in->findEntity( $entity_id );

	$check_in->events = CheckInEventFactory::mock( (object) $entity );
	$check_in->cache();

	return json_encode( $check_in->events );
} );
/**
 * Entity Check-In Override Event Segment Music Status
 *
 * Purpose: Mark an event’s incomplete Music requirement as “viewed”
 * Source: Check-in Events Sub-page Event Segment Music "Viewed" checkbox click
 *
 * Request Payload: `OverrideCheckInEventSegmentMusicPpcItemAPIPayload`
 * Response: APISubmissionResponse
 */
$router->POST( '/api/competitions/{competition_id}/check-in/{entity_id}/override-music', function ( $competition_id, $entity_id ) {
	session_start();

	$check_in = CheckIn::getCurrent();
	$data     = json_decode( file_get_contents( 'php://input' ) );
	$check_in->updateEventMusic( $data );

	$success = true;
	$error   = "";

	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );
/**
 * Entity Check-In Override Event Segment PPC Status
 *
 * Purpose: Mark an event’s incomplete PPC requirement as “viewed”
 * Source: Check-in Events Sub-page Event PPC "Viewed" checkbox click
 *
 * Request Payload: `OverrideCheckInEventSegmentMusicPpcItemAPIPayload`
 * Response: APISubmissionResponse
 */
$router->POST( '/api/competitions/{competition_id}/check-in/{entity_id}/override-ppc', function ( $competition_id, $entity_id ) {
	session_start();

	$check_in = CheckIn::getCurrent();
	$data     = json_decode( file_get_contents( 'php://input' ) );
	$check_in->updateEventPPC( $data );

	$success = true;
	$error   = "";

	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );
/**
 * Entity Check-In Fetch Roster
 *
 * Purpose: Fetch information required to power the roster subpages of check-in
 * Source: Check-in Roster subpage load
 *
 * Request Payload: `none`
 * Response: FetchEntityRosterInformationAPIResponse
 */
$router->GET( '/api/competitions/{competition_id}/check-in/{entity_id}/roster', function ( $competition_id, $entity_id ) {
	session_start();
    if (simulation_arg_present('check_in_entity_fetch_error')) {
        http_response_code(500);

        return;
    }
    $check_in = CheckIn::getCurrent();
    $entity   = $check_in->findEntity($entity_id);

    $roster                      = CheckInRosterFactory::mock((object) $entity);
    $check_in->roster            = $roster;
    $roster['team_roster_rules'] = [
        'You must have a minimum of 8 skaters.',
        'You can not exceed 20 skaters.',
        'The majority of skaters must be 12 or under.',
    ];
    $check_in->cache();

    return json_encode($roster);
} );
/**
 * Entity Check-In Roster Update
 *
 * Purpose: Update an entity’s competition roster
 * Source: Check-in Edit Roster subpage “Confirm Roster” button click
 *
 * Request Payload: `UpdateEntityCompetitionRosterAPIPayload`
 * Response: APISubmissionResponse
 */
$router->POST( '/api/competitions/{competition_id}/check-in/{entity_id}/roster', function ( $competition_id, $entity_id ) {
	session_start();

	$check_in = CheckIn::getCurrent();
	$data     = json_decode( file_get_contents( 'php://input' ) );

	$check_in->updateRoster( $data );

	$success = true;
	$error   = "";

	if ( count( $data ) < 8 ) {
		$success = false;
		$error   = "[Server Message] - Roster is too small.";
	}
	if ( count( $data ) > 20 ) {
		$success = false;
		$error   = "[Server Message] - Roster is too big.";
	}

	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );
/**
 * Entity Check-In Fetch Coached Skaters
 *
 * Purpose: Fetch information about the skaters for an entity being checked in
 * Source: Check-in Skaters subpage
 *
 * Request Payload: `none`
 * Response: FetchEntityCoachedSkatersAPIResponse
 */
$router->GET( '/api/competitions/{competition_id}/check-in/{entity_id}/skaters', function ( $competition_id, $entity_id ) {
	session_start();
	if ( simulation_arg_present( 'check_in_entity_fetch_error' ) ) {
		http_response_code( 500 );

		return;
	}
	$check_in          = CheckIn::getCurrent();
	$entity            = $check_in->findEntity( $entity_id );
	$check_in->skaters = CheckInSkatersFactory::mock( (object) $entity );
	$check_in->cache();

	return json_encode( $check_in->skaters );
} );
/**
 * Entity Check-In Fetch Skater Coaches
 *
 * Purpose: Fetch the information related to the check-in entity’s current coach-event assignment.
 * Source: Check-in Skater-Coaches Subpage
 *
 * Request Payload: `none`
 * Response: FetchEntitySkaterCoachInformationAPIResponse
 */
$router->GET( '/api/competitions/{competition_id}/check-in/{entity_id}/skater-coaches', function ( $competition_id, $entity_id ) {
	session_start();
	if ( simulation_arg_present( 'check_in_entity_fetch_error' ) ) {
		http_response_code( 500 );

		return;
	}
	$check_in                 = CheckIn::getCurrent();
	$entity                   = $check_in->findEntity( $entity_id );
	$check_in->skater_coaches = CheckInSkaterCoachesFactory::mock( (object) $entity );
	$check_in->cache();

	return json_encode( $check_in->skater_coaches );
} );
/**
 * Entity Check-In Fetch Skater Coach Search Form Options
 *
 * Purpose: Load form options for search when modifying a check-in entity’s coaches
 * Source: Check-in Skater Coaches Subpage - add/replace coach search form load.
 *
 * Request Payload: `none`
 * Response: FetchEntitySkaterCoachSearchFormOptionsAPIResponse
 */
$router->GET( '/api/form-options/coaches', function () {
	return json_encode( [ 'states' => \App\FormOptions::coach_state_options() ] );
} );
/**
 * Entity Check-In Skater Coach Search
 *
 * Purpose: Search for coaches to select for a check-in entity
 * Source: Check-in Skater Coaches Subpage Search form submission.
 *
 * Request Payload: `MemberSearchAPIParameters`
 * Response: MemberSearchResultAPIResponse
 */
$router->POST( '/api/competitions/{competition_id}/check-in/{entity_id}/skater-coaches/search', function ( $competition_id, $entity_id ) {
	session_start();
	$data = json_decode( file_get_contents( 'php://input' ), true );

	$check_in = CheckIn::getCurrent();
	$results  = $check_in->coachSearch( $data );
	$check_in->cache();

	return json_encode( [
		'results' => $results,
	] );
} );
/**
 * Entity Check-In Skater Coach Add
 *
 * Purpose: Add a coach to an event category for a check-in entity.
 * Source: Check-in Skater Coaches search results “add” button following a search to add a new coach.
 *
 * Request Payload: `AddEntitySkaterCategoryCoachAPIPayload`
 * Response: AddEntitySkaterCategoryCoachAPIResponse
 */
$router->POST( '/api/competitions/{competition_id}/check-in/{entity_id}/skater-coaches', function ( $competition_id, $entity_id ) {
	session_start();

	$check_in = CheckIn::getCurrent();
	$data     = json_decode( file_get_contents( 'php://input' ) );
	$result   = $check_in->addSkaterCoach( $data );

	$success = true;
	$error   = "";
	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
		'coach'   => $result,
	] );
} );
/**
 * Entity Check-In Skater Coach Remove
 *
 * Purpose: Remove a coach from an event category for a check-in entity.
 * Source: Check-in Skater Coaches Subpage “remove” button click
 *
 * Request Payload: `RemoveEntitySkaterCategoryCoachAPIPayload>`
 * Response: APISubmissionResponse
 */
$router->DELETE( '/api/competitions/{competition_id}/check-in/{entity_id}/skater-coaches', function ( $competition_id, $entity_id ) {
	session_start();

	$check_in = CheckIn::getCurrent();
	$data     = json_decode( file_get_contents( 'php://input' ) );
	$check_in->removeSkaterCoach( $data );

	$success = true;
	$error   = "";
	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );
/**
 * Entity Check-In Skater Coach Replace
 *
 * Purpose: Replace a coach for an event category for a check-in entity.
 * Source: Check-in Skater Coaches search results “add” button following a search to replace a coach.
 *
 * Request Payload: `ReplaceEntitySkaterCategoryCoachAPIPayload`
 * Response: ReplaceEntitySkaterCategoryCoachAPIResponse
 */
$router->PUT( '/api/competitions/{competition_id}/check-in/{entity_id}/skater-coaches', function ( $competition_id, $entity_id ) {
	session_start();

	$check_in = CheckIn::getCurrent();
	$data     = json_decode( file_get_contents( 'php://input' ) );
	$result   = $check_in->replaceSkaterCoach( $data );

	$success = true;
	$error   = "";
	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
		'coach'   => $result,
	] );
} );
/**
 * Entity Check-In Fetch Team Coaches
 *
 * Purpose: Fetch information required to power the Team Coaches subpages of check-in
 * Source: Check-in Team Coaches subpage load
 *
 * Request Payload: `none`
 * Response: FetchEntityTeamCoachInformationAPIResponse
 */
$router->GET( '/api/competitions/{competition_id}/check-in/{entity_id}/team-coaches', function ( $competition_id, $entity_id ) {
	session_start();
	if ( simulation_arg_present( 'check_in_entity_fetch_error' ) ) {
		http_response_code( 500 );

		return;
	}
	$check_in               = CheckIn::getCurrent();
	$entity                 = $check_in->findEntity( $entity_id );
	$check_in->team_coaches = CheckInTeamCoachesFactory::mock( (object) $entity );
	$check_in->cache();

	return json_encode( $check_in->team_coaches );
} );
/**
 * Entity Check-In Team Coach Update
 *
 * Purpose: Update the list of Coaches selected for a check-in entity for a competition
 * Source: Check-in Edit Team Coaches subpage “Confirm Roster” button click
 *
 * Request Payload: `UpdateEntityCompetitionTeamCoachesAPIPayload`
 * Response: APISubmissionResponse
 */
$router->POST( '/api/competitions/{competition_id}/check-in/{entity_id}/team-coaches', function ( $competition_id, $entity_id ) {
	session_start();

	$check_in = CheckIn::getCurrent();
	$data     = json_decode( file_get_contents( 'php://input' ) );
	$check_in->updateTeamCoaches( $data );

	$success = true;
	$error   = "";
	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );
/**
 * Entity Check-In Fetch Team Service Personnel
 *
 * Purpose: Fetch information required to power the Team Service Personnel subpages of check-in
 * Source: Check-in Team Service Personnel subpage load
 *
 * Request Payload: `none`
 * Response: FetchEntityTeamServicePersonnelInformationAPIResponse
 */
$router->GET( '/api/competitions/{competition_id}/check-in/{entity_id}/team-service-personnel', function ( $competition_id, $entity_id ) {
	session_start();
	if ( simulation_arg_present( 'check_in_entity_fetch_error' ) ) {
		http_response_code( 500 );

		return;
	}
	$check_in                         = CheckIn::getCurrent();
	$entity                           = $check_in->findEntity( $entity_id );
	$check_in->team_service_personnel = CheckInTeamServicePersonnelFactory::mock( (object) $entity );
	$check_in->cache();

	return json_encode( $check_in->team_service_personnel );
} );
/**
 * Entity Check-In Team Service Personnel Update
 *
 * Purpose: Update the list of TSP selected for a check-in entity for a competition
 * Source: Check-in Edit Team Service Personnel subpage “Confirm Roster” button click
 *
 * Request Payload: `UpdateEntityCompetitionTeamServicePersonnelAPIPayload`
 * Response: APISubmissionResponse
 */
$router->POST( '/api/competitions/{competition_id}/check-in/{entity_id}/team-service-personnel', function ( $competition_id, $entity_id ) {
	session_start();

	$check_in = CheckIn::getCurrent();
	$data     = json_decode( file_get_contents( 'php://input' ) );
	$check_in->updateTeamServicePersonnel( $data );

	$success = true;
	$error   = "";
	if ( simulation_arg_present( 'check_in_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );

/**
 * Competition Management Contacts Fetch Entities
 *
 * Purpose: Fetch the entities for display on the Competition Management “Contacts” page
 * Source: Competition Management “Contacts” page load
 *
 * Request Payload: `none`
 * Response: `CompetitionManagementContactsFetchAPIResponse`
 */
$router->GET( '/api/competition-management/competitions/{competition_id}/contacts', function ( $competition_id ) {
	session_start();
	$contacts = new CompetitionManagementContacts();
	$contacts->cache();

	return json_encode( $contacts->lists );
} );
/**
 * Competition Management Contacts Fetch Add Form Options
 *
 * Purpose: Fetch the form options for the “Add Contact/Official” form
 * Source: Competition Management “Contacts” “add” component load
 *
 * Request Payload: `none`
 * Response: `CompetitionManagementContactsFetchAddFormOptionsAPIResponse`
 */
$router->GET( '/api/form-options/competition-contact-add', function () {
	session_start();
	$contacts = CompetitionManagementContacts::getCurrent();
	$contacts->cache();

	return json_encode( $contacts->getSearchFormOptions() );
} );
/**
 * Competition Management Contacts Add
 *
 * Purpose: Add a contact
 * Source: Competition Management “Contacts” “add” component search form submit
 *
 * Request Payload: `<CompetitionManagementContactsAddAPIPayload>`
 * Response: `CompetitionManagementContactsAddAPIResponse`
 */
$router->POST( '/api/competition-management/competitions/{competition_id}/contacts', function ( $competition_id ) {
	session_start();
	$contacts = CompetitionManagementContacts::getCurrent();
	$data     = json_decode( file_get_contents( 'php://input' ) );
	$result   = $contacts->addFromSearch( $data );
	$contacts->cache();
	$success = true;
	$error   = "";

	if ( simulation_arg_present( 'comp_man_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
		'contact' => $result,
	] );
} );
/**
 * Competition Management Contacts Add Search
 *
 * Purpose: Search for a contact or official to add as a contact
 * Source: Competition Management “Contacts” “add” component search form submit
 *
 * Request Payload: `<CompetitionManagementContactsSearchAPIParameters>`
 * Response: `MemberSearchResultAPIResponse`
 */
$router->POST( '/api/competition-management/competitions/{competition_id}/contact-search', function ( $competition_id ) {
	session_start();
	$data     = json_decode( file_get_contents( 'php://input' ), true );
	$contacts = CompetitionManagementContacts::getCurrent();
	$results  = $contacts->search( $data );
	$contacts->cache();

	return json_encode( compact( 'results' ) );
} );
/**
 * Competition Management Contacts Remove
 *
 * Purpose: Remove a contact from the list for a competition
 * Source: Competition Management “Contacts” Contact remove button click
 *
 * Request Payload: `<CompetitionManagementContactsRemoveAPIPayload>`
 * Response: `APISubmissionResponse`
 */
$router->DELETE( '/api/competition-management/competitions/{competition_id}/contacts', function ( $competition_id ) {
	$success = true;
	$error   = "";

	if ( simulation_arg_present( 'comp_man_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );
/**
 * Competition Management Contacts Change Display
 *
 * Purpose: Change whether a contact should display in the Competitor/Coach portal as a contact
 * Source: Competition Management “Contacts” Card “Display as Contact?” option change
 *
 * Request Payload: `<CompetitionManagementContactsChangeDisplayAPIPayload>`
 * Response: `APISubmissionResponse`
 */
$router->PUT( '/api/competition-management/competitions/{competition_id}/contact-display', function ( $competition_id ) {
	$success = true;
	$error   = "";
	if ( simulation_arg_present( 'comp_man_submit_error' ) ) {
		$success = false;
		$error   = "Server error message.";
	}

	return json_encode( [
		'success' => $success,
		'error'   => $error,
	] );
} );

/**
 * Competition Management Fetch Active Competition
 *
 * Purpose: Fetch the active competition data to power the competition management experience.
 *
 * Source:
 * 1. Competition Management Competition Index Page Load (when acting as an SPA)
 * 1. Competition Management Information, Compliance, Contacts, or Check-In page load (when acting as an MPA)
 *
 * Request Payload: `none`
 * Response: `FetchActiveCompetitionManagementCompetitionAPIResponse`
 */
$router->get( '/api/competition-management/active-competition', function () {
	session_start();
	$competition_management = CompetitionManagement::getCurrent();
	$result                 = $competition_management->getActive();
	if ( simulation_arg_present( 'comp_man_load_error' ) ) {
		http_response_code( 500 );
	}
	$competition_management->cache();

	return json_encode( $result );
} );

$router->get( '/api/competition-management/competitions/{competition_id}', function () {
	session_start();
	$competition_management = CompetitionManagement::getCurrent();
	$result                 = $competition_management->getActive();
	if ( simulation_arg_present( 'comp_man_load_error' ) ) {
		http_response_code( 500 );
	}
	$competition_management->cache();

	return json_encode( $result );
} );