<?php

use App\CommonResponses;
use App\EventSelection;
use App\FormOptions;
use App\PagesController;
use Phroute\Phroute\RouteCollector;

function simulation_arg_present($arg)
{
    if (array_key_exists('HTTP_REFERER', $_SERVER) && strpos($_SERVER['HTTP_REFERER'], $arg) !== false) {
        return true;
    }

    return false;
}

if (simulation_arg_present('delay_response')) {
    sleep(2);
}

$router = new RouteCollector();

$blank_layout_pages = [ 'pages/login', 'pages/reset-password', 'pages/create-account' ];
define('USER_TYPE_COOKIE_NAME', 'user_type');
define('USER_CAN_UPLOAD_COOKIE_NAME', 'user_can_upload');
define('TEAM_REGISTRATION_COMPETITION_COOKIE', 'team_competition_registration_competition_id');
$router->get('style-guide', function () {
    return PagesController::showStyleGuide();
});

$router->get('component-guide', function () {
    return PagesController::showComponents();
});

/* Batch 1 fake API/APP ROUTES */
$router->post("/Account/InitialLogOn", function () {
    header("Location: /Members/MemberHome");
    die();
});

$router->get("/Account/LogOff", function () {
    header("Location: /");
    die();
});

$router->post('/Account/CheckLogin', function () {
    $data                         = json_decode(file_get_contents('php://input'), true);
    $user_type_cookie_value       = "skater";
    $user_can_upload_cookie_value = "true";
    if ($data['username'] && strtolower($data['username']) === "coach") {
        $user_type_cookie_value = "coach";
    }
    if ($data['username'] && strtolower($data['username']) === "both") {
        $user_type_cookie_value = "both";
    }
    if ($data['username'] && strtolower($data['username']) === "noupload") {
        $user_can_upload_cookie_value = "false";
    }
    setcookie(USER_TYPE_COOKIE_NAME, $user_type_cookie_value, time() + ( 60 * 60 * 24 ), "/");//1 day
    setcookie(USER_CAN_UPLOAD_COOKIE_NAME, $user_can_upload_cookie_value, time() + ( 60 * 60 * 24 ), "/");//1 day

    if ( ! $data['username'] || ! $data['password'] || $data['username'] == 'invalid') {
        echo json_encode([
            'Message' => 'Login invalid',
            'Success' => false

        ]);
        exit();
    }
    echo json_encode([
        'Message' => 'Success',
        'Success' => true

    ]);
    exit();
});


$router->get("/EMS/UpcomingCompsSkater", function () {
    return "{\"Data\":[{\"CompetitionId\":26425,\"Competition\":\"2018 U.S. Adult Figure Skating Championships\",\"Dates\":\"4/10/2018 - 4/14/2018\",\"Associated\":null,\"MusicUpload\":null,\"PPCDone\":null,\"ResultsUploaded\":null,\"OfficialsPosition\":null},{\"CompetitionId\":26357,\"Competition\":\"2018 Test Competition\",\"Dates\":\"7/18/2018 - 7/22/2018\",\"Associated\":null,\"MusicUpload\":null,\"PPCDone\":null,\"ResultsUploaded\":null,\"OfficialsPosition\":null},{\"CompetitionId\":26439,\"Competition\":\"EMS Hawkeye Open - OPEN SALES\",\"Dates\":\"8/3/2018 - 8/6/2018\",\"Associated\":null,\"MusicUpload\":null,\"PPCDone\":null,\"ResultsUploaded\":null,\"OfficialsPosition\":null},{\"CompetitionId\":26441,\"Competition\":\"Test Competition\",\"Dates\":\"4/12/2018 - 4/19/2018\",\"Associated\":null,\"MusicUpload\":null,\"PPCDone\":null,\"ResultsUploaded\":null,\"OfficialsPosition\":null}],\"Total\":4,\"AggregateResults\":null,\"Errors\":null}";
    die();
});

function setPortalIds()
{
    $competition_id = $_REQUEST['id'];
    $team_id        = array_key_exists('teamId', $_REQUEST)
        ? $_REQUEST['teamId']
        : null;

    // this doesn't seem to be used, but preserving
    $_REQUEST['page_competition_id'] = $competition_id;

    setcookie(COMPETITION_PORTAL_COMPETITION_ID_COOKIE, $competition_id);
    if ($team_id) {
        setcookie(COMPETITION_PORTAL_TEAM_ID_COOKIE, $team_id);
    } else {
        setcookie(COMPETITION_PORTAL_TEAM_ID_COOKIE, '', time() - 3600);
    }
}


$router->get('/CompetitionProfile/Index?id={comp_id}', function ()  {
    setPortalIds();
    return PagesController::showPageWithParent('CompetitionProfile', 'Index');
});

$router->get('/pages/competition-information?id={comp_id}', function ()  {
    setPortalIds();
    return PagesController::showPageWithParent('pages', 'competition-information');
});

$router->get('/pages/{page_name}?id={comp_id}', function ($page_name, $comp_id)  {
    setPortalIds();
    return PagesController::showPageWithParent('pages', str_replace('?', '', $page_name));
});

/**
 * 2020-06-16 new competitions routes
 */
$router->get('/pages/competitions/{page_name}?id={comp_id}', function ($page_name, $comp_id) use ($blank_layout_pages) {
    setPortalIds();

    return PagesController::showPageWithParent('pages/competitions', str_replace('?', '', $page_name));
});


$router->get('pages/competition-registration/{comp_id}/{page_name}?/{user_params}?',
    function ($comp_id, $page_name = null) use ($blank_layout_pages) {
        if ( ! $page_name) {
            $page_name = "overview";
        }

        return PagesController::showPageWithParent('pages/competition-registration', str_replace('?', '', $page_name));
    });

$router->get( 'pages/competition-management/{comp_id}?/{page_name}?/{user_params}?', function ( $comp_id=null, $page_name = null ) use ( $blank_layout_pages ) {
	/**
	 * If comp id can't be cast to an int, show index page
	 */
	if ( !$comp_id || (int) $comp_id === 0 ) {
		return PagesController::showPageWithParent( 'pages', str_replace( '?', '', 'competition-management' ) );
	}
	setcookie('competition_management_active_competition_id',$comp_id);
	if ( ! $page_name ) {
		$page_name = "manage-competition";
	}

	return PagesController::showPageWithParent( 'pages/competition-management', str_replace( '?', '', $page_name ) );
} );


$router->get('pages/series-registration/{series_id}?/application?teamId={params}', function ($series_id = null) use ($blank_layout_pages) {
    $team_id = $_GET['teamId'];
    $page_name='application';
    /**
     * If series id can't be cast to an int, show index page
     */
    if ( ! $series_id || (int) $series_id === 0) {
        return PagesController::showPageWithParent('pages', str_replace('?', '', 'series-registration'));
    }
    setcookie('series_registration_series_id', $series_id);
    setcookie(SERIES_REGISTRATION_TEAM_ID_COOKIE, $team_id);


    return PagesController::showPageWithParent('pages/series-registration', str_replace('?', '', $page_name));
});

$router->get('pages/series-registration/{series_id}?/{page_name}?/{user_params}?', function ($series_id = null, $page_name = null) use ($blank_layout_pages) {
    setcookie(SERIES_REGISTRATION_TEAM_ID_COOKIE, '', time() - 3600);
    /**
     * If series id can't be cast to an int, show index page
     */
    if ( ! $series_id || (int) $series_id === 0) {
        return PagesController::showPageWithParent('pages', str_replace('?', '', 'series-registration'));
    }
    setcookie('series_registration_series_id', $series_id);
    if ( ! $page_name) {
        $page_name = "overview";
    }

    return PagesController::showPageWithParent('pages/series-registration', str_replace('?', '', $page_name));
});


$router->get('pages/competition-registration-teams/{id}/cart',
    function ($page_name = null) use ($blank_layout_pages) {
        return PagesController::showPageWithParent('pages/competition-registration-teams', str_replace('?', '', 'cart'));
    });
$router->get('pages/competition-registration-teams/{id}/checkout',
    function ($page_name = null) use ($blank_layout_pages) {
        return PagesController::showPageWithParent('pages/competition-registration-teams', str_replace('?', '', 'checkout'));
    });
$router->get('pages/competition-registration-teams/{page_name}?/{user_params}?',
    function ($page_name = null) use ($blank_layout_pages) {
        if ( ! $page_name) {
            $page_name = "competitions";
        }
        if(is_numeric($page_name)){
            setcookie(TEAM_REGISTRATION_COMPETITION_COOKIE, $page_name);
            $page_name = "registration";
        }

        return PagesController::showPageWithParent('pages/competition-registration-teams', str_replace('?', '', $page_name));
    });

/*
 * MOCK API ROUTES
*/

$router->get('/api/competitions', function () {
    $ids                       = json_decode(file_get_contents(__DIR__ . '/../app/Data/CompetitionData.json'));
    $available_competition_ids = array_keys(get_object_vars($ids));
    $competitions_data         = [];
    foreach ($available_competition_ids as $id) {
        $competitions_data[] = new \App\Competition($id);
    }

    return json_encode($competitions_data);
});

$router->get('/api/competitions/{id}', function ($id) {
    $competition = new \App\Competition($id);

    return json_encode($competition);
});

$router->get('/api/competitions/{id}/information', function ($id) {
    $competition = new \App\CompetitionInformation($id);
    unset($competition->skating_event_ids);

    return json_encode($competition);
});

$router->get('/api/competitions/{id}/schedule', function ($id) {
    session_start();
    $competition = new \App\CompetitionSchedule($id);
    if ( simulation_arg_present( 'schedule_unavailable' ) ) {
        return json_encode(
            [
                'schedule_unavailable' => true,
            ]
        );
    }
    if ( !simulation_arg_present( 'admin' ) ) {
        unset($competition->links['admin_edit']);
    }

    return json_encode($competition);
});

//@deprecated
$router->get('/api/competitions/{id}/skater-events', function ($id) {
    $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/../app/Data/SkaterCompetitonEventMap.json'));
    $event_ids                    = $competition_skater_event_map->$id;
    $result                       = [];
    foreach ($event_ids as $event_id) {
        $event = new \App\SkatingEvent($event_id);
        unset($event->credit_config);
        unset($event->credit_packages);
        $result[] = $event;

    }

    return json_encode($result);
});

$router->get('/api/competitions/{id}/skater-event-ids', function ($id) {
    $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/../app/Data/SkaterCompetitonEventMap.json'));
    $source                       = $competition_skater_event_map->$id;
    $result                       = [];
    foreach ($source as $base_id) {
        $result[] = \App\SkatingEvent::idFromSourceAndCompId($base_id, $id);
    }

    return json_encode($result);
});

$router->get('/api/competitions/{id}/skater-credits', function ($id) {
    return json_encode(CommonResponses::skaterCredits($id));
});

$router->get('/api/competitions/{id}/skater-schedule', function ($id) {
    $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/../app/Data/SkaterCompetitonEventMap.json'));
    $event_ids                    = $competition_skater_event_map->$id;
    $events                       = [];
    foreach ($event_ids as $event_id) {
        $event                 = new \App\SkatingEvent($event_id, $id);
        $event->competition_id = (int) $id;
        unset($event->credit_config);
        unset($event->credit_packages);
        $events[] = $event;

    }

    $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/../app/Data/SkaterCompetitionSchedule.json'),
        true);
    $competition_session_ids      = $competition_skater_event_map[$id];
    $sessions                     = [];
    $competition                  = new \App\CompetitionSchedule($id);
    foreach ($competition->sessions as $session) {
        if (array_key_exists($session->id, $competition_session_ids)) {
            $adl_config = $competition_session_ids[$session->id];
            $result     = [];
            foreach ($adl_config as $key => $value) {
                $result[$key] = $value;
            }
            $result['session'] = $session;

            $sessions[] = $result;
        }
    }

    return json_encode([
        'events'   => $events,
        'sessions' => $sessions
    ]);

});


$router->get('/api/competitions/{id}/coached-skater-schedule', function ($id) {
    $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/../app/Data/CoachedSkaterCompetitionSchedule.json'),
        true);
    $competition_session_ids      = array_keys($competition_skater_event_map[$id]);

    $sessions           = [];
    $skater_session_map = [];
    $competition        = new \App\CompetitionSchedule($id);
    foreach ($competition->sessions as $session) {
        if (in_array($session->id, $competition_session_ids)) {
            $sessions[]                       = $session;
            $skater_session_map[$session->id] = $competition_skater_event_map[$id][$session->id];
        }
    }

    return json_encode([
        'sessions'           => $sessions,
        'skater_session_map' => $skater_session_map
    ]);
});


$router->get( '/api/competitions/{id}/page-heading', function ( $id ) {
    session_start();
    $overrides = [];
    // Competition in Competition List
    if ( $id < 8 ) {
        $competition = new \App\Competition( $id );

        $overrides = [
            'icon'             => $competition->icon,
            'end_date'         => \Carbon\Carbon::createFromTimestamp( $competition->end_date ),
            'name'             => $competition->name,
            'directions'       => $competition->directions,
            'announcement_url' => $competition->announcement_url,
            'website_url'      => $competition->website_url,
            'start_date'       => \Carbon\Carbon::createFromTimestamp( $competition->start_date ),

        ];
    } // Competition from View Competition flow
    elseif ( \App\CompetitionSearchManager::currentExists() ) {
        $manager     = \App\CompetitionSearchManager::getCurrent();
        $competition = $manager->findCompetition( $id );
        $overrides   = [
            'icon'              => $competition->icon,
            'name'              => $competition->name,
            'start_date_pretty' => \Carbon\Carbon::createFromTimestamp( $competition->start_date_ts )
                                                 ->format( 'n/j/Y' ),
            'end_date_pretty'   => \Carbon\Carbon::createFromTimestamp( $competition->end_date_ts )
                                                 ->format( 'n/j/Y' ),
        ];
    }

    return json_encode(
        \App\factories\CompetitionFieldFactory::CompetitionHeadingData( $overrides )
    );
} );



$router->get('/api/competitions/{id}/skater-event-segments', function ($id) {


    $skater_event_segments = \App\CommonResponses::skaterEventSegments($id);

    return json_encode(compact('skater_event_segments'));
});

function elementOptons()
{
    $type_count        = 3;
    $element_count     = 5;
    $move_option_count = 6;
    $types             = [];//PPCType[]
    $moves             = [];//PPCMove[]
    $type_elements     = [];//PPCTypeElement[]
    $move_id           = 1;
    for ($type_id = 1; $type_id <= $type_count; $type_id++) {
        for ($element_index = 0; $element_index < $element_count; $element_index++) {
            $move_count  = $element_index;
            $starting_id = $type_id * $element_count - ( $element_count - 1 );
            $element_id  = $element_index + $starting_id;
            for ($move_index = 0; $move_index < $move_option_count; $move_index++) {
                $moves[] = [
                    'name'       => "T" . $type_id . " E" . $element_index . " Move " . ( $move_index + 1 ),
                    'code'       => "t" . $type_id . "e" . $element_index . "m" . ( $move_index + 1 ),
                    'id'         => $move_id++,
                    'element_id' => $element_id

                ];
            }
            $type_elements[] = [
                "type_id"    => $type_id,
                "move_count" => $move_count,
                'id'         => $element_id,
                'name'       => "T" . $type_id . " Element " . ( $element_index + 1 ),
                'code'       => "T" . $type_id . "E" . ( $element_index + 1 ),
            ];
        }
        $types[] = [
            'name' => "Type " . $type_id,
            'id'   => $type_id
        ];
    }

    return json_encode([ 'options' => compact('types', 'type_elements', 'moves') ]);
}


$router->get('/api/coach-state-options', function () {
    return json_encode([ 'state_options' => \App\FormOptions::coach_state_options() ]);
});

$router->post('/api/competitions/{id}/my-coaches/remove', function ($id) {
    return json_encode([ 'success' => true ]);
});

$router->post('/api/competitions/{id}/my-coaches/add', function ($id) {
    return json_encode([ 'success' => true ]);
});

$router->post('/api/competitions/{id}/my-coaches/replace', function ($id) {
    return json_encode([ 'success' => true ]);
});




$router->post('/api/upload-music', function () {
    if (array_key_exists('file', $_FILES) && array_key_exists('name', $_FILES['file'])) {
        $file_name = $_FILES['file']['name'];

        if (strpos($file_name, 'error') !== false) {
            return json_encode([
                "success"       => false,
                "error"         => true,
                "error_message" => "Customizable backend file error message."
            ]);
        }
    }
    $faker            = \Faker\Factory::create();
    $success_response = [
        "success"  => true,
        "error"    => false,
        "metadata" => [
            "name" => $faker->catchPhrase
        ],
        "file"     => [
            "id"  => rand(500, 750),
            "url" => "/example-music/MaidWithTheFlaxenHair.mp3",
        ]
    ];

    return json_encode($success_response);
});

$router->post('/api/delete-uploaded-music-file', function () {
    return json_encode([ "success" => true ]);
});





$router->get('/api/music-library', function () {
    $data      = json_decode(file_get_contents(__DIR__ . '/../app/Data/SkaterMusic.json'));
    $song_data = [];
    foreach ($data as $competition_id => $events) {
        foreach ($events as $event_id => $event_segments) {
            foreach ($event_segments as $event_segment_id => $music) {
                if ( ! $music) {
                    continue;
                }
                $music->is_assigned_to_program = true;
                $song_data[]                   = $music;
            }
        }
    }
    $song_data = array_merge($song_data,
        $data = json_decode(file_get_contents(__DIR__ . '/../app/Data/SkaterLibrary.json'), true));

    return json_encode([ "library" => $song_data ]);
});

$router->post('/api/music-library/remove', function () {
    return json_encode([ 'success' => true ]);
});

$router->post('/api/coaches/search', function () {
    $data   = json_decode(file_get_contents('php://input'), true);
    $search = new \App\Search($data);

    return json_encode([
        'coaches' => $search->results
    ]);
});
$router->post('/api/competition-registration/partner-search/', function () {
    $data   = json_decode(file_get_contents('php://input'), true);
    $search = new \App\Search($data, true);

    return json_encode([
        'results' => $search->results
    ]);
});

$router->post('/api/competition-registration/coach-search/', function () {
    $data   = json_decode(file_get_contents('php://input'), true);
    $search = new \App\Search($data, false);

    return json_encode([
        'results' => $search->results
    ]);
});

$router->post('/api/member-search/', function () {
    $data   = json_decode(file_get_contents('php://input'), true);
    $search = new \App\Search($data, false);

    return json_encode([
        'results' => $search->results
    ]);
});

$router->get('/api/skater-cart', function () {
    session_start();
    $cart = \App\Cart::defaultCore();
    if (array_key_exists('HTTP_REFERER', $_SERVER)) {
        if (strpos($_SERVER['HTTP_REFERER'], 'registration') !== false) {
            $cart = \App\Cart::registrationCore();
        }
    }
    if (array_key_exists('HTTP_REFERER', $_SERVER)) {
        if (strpos($_SERVER['HTTP_REFERER'], 'series') !== false) {
            $cart = \App\Cart::seriesRegistrationCore();
        }
    }
    if (array_key_exists('HTTP_REFERER', $_SERVER)) {
        if (strpos($_SERVER['HTTP_REFERER'], 'registration-teams') !== false) {
            $cart = \App\Cart::teamRegistrationCore();
        }
    }
    $cart->cache();

    return json_encode($cart->getAPIData());

});
$router->post('/api/skater-cart/remove-registration', function () {
    session_start();
    $data = json_decode(file_get_contents('php://input'));
    $cart = \App\Cart::getCurrent();
    $cart->removeRegistration($data);
    $cart->cache();

    return json_encode([
        'success' => true,
        'cart'    => $cart->getAPIData()
    ]);
});
$router->post('/api/skater-cart/remove-session', function () {
    session_start();
    $data = json_decode(file_get_contents('php://input'));
    $cart = \App\Cart::getCurrent();
    $cart->removeSession($data);
    $cart->cache();

    return json_encode([
        'success' => true,
        'cart'    => $cart->costConfigs()
    ]);
});
$router->post('/api/skater-cart/remove-credit-package', function () {
    session_start();
    $data = json_decode(file_get_contents('php://input'));
    $cart = \App\Cart::getCurrent();
    $cart->removeCreditPackage($data);
    $cart->cache();

    return json_encode([
        'success' => true,
        'cart'    => $cart->costConfigs()
    ]);
});
/**
 * @note: [2019-05-15] adding sessions to cart aren't getting updated responses.
 * The new updated response includes fees and total calculation.  However, there are no in-app cases where
 * this information displays when a user adds sessions to the cart, so this isn't being added to mock API responses at
 * this time
 */
$router->post('/api/skater-cart/add-session', function () {
    return json_encode([ 'success' => true ]);
});
/**
 * @note: [2019-05-15] adding credits to cart aren't getting updated responses.
 * The new updated response includes fees and total calculation.  However, there are no in-app cases where
 * this information displays when a user adds credits to the cart, so this isn't being added to mock API responses at
 * this time
 */
$router->post('/api/skater-cart/add-credits', function () {
    return json_encode([ 'success' => true ]);
});
/**
 * Add Credits to Team Cart
 *
 * Purpose: Add credits to a team cart
 * Source: "Practice Ice Pre-Purchase" page "add to cart" button click
 *
 * Request Payload: see `INTEGRATION_GUIDES/1_a__INTEGRATION-API.md:959`
 * Response: `ApiSubmissionResponse`
 */
$router->post('/api/cart/teams/{team_id}/credits', function () {
    return json_encode([ 'success' => true ]);
});


$router->post('/api/skater-cart/remove-credits', function () {
    session_start();
    $data = json_decode(file_get_contents('php://input'));
    $cart = \App\Cart::getCurrent();
    $cart->removeCredit($data);
    $cart->cache();

    return json_encode([
        'success' => true,
        'cart'    => $cart->costConfigs()
    ]);
});
$router->post('/api/skater/schedule/add-session', function () {
    return json_encode([ 'success' => true ]);
});
$router->post('/api/skater/schedule/remove-session', function () {
    return json_encode([ 'success' => true ]);
});

$router->get('/api/skater-addresses', function () {
    $address_data = json_decode(file_get_contents(__DIR__ . '/../app/Data/MockSkaterAddresses.json'));

    return json_encode($address_data);
});

$router->post('/api/skater-addresses/create', function () {
    $data = json_decode(file_get_contents('php://input'));

    $data->country  = FormOptions::find(FormOptions::country_options(), $data->country);
    $data->state    = FormOptions::find(FormOptions::state_options(), $data->state);
    $data->province = FormOptions::find(FormOptions::state_options(), $data->province);
    $data->id       = rand(100, 1000);
    $data->zip_code = $data->zip;
    unset($data->zip);

    return json_encode([
        'success' => true,
        'address' => $data
    ]);
});

$router->get('/api/skater/info', function () {
    $info_data = json_decode(file_get_contents(__DIR__ . '/../app/Data/MockSkaterInfo.json'));

    return json_encode($info_data);
});

$router->post('/api/user/info', function () {
    $user_roles        = [ "skater" ];
    $upload_cabability = [
        'can_upload'    => true,
        'error_message' => ''
    ];

    if (isset($_COOKIE[USER_TYPE_COOKIE_NAME])) {
        $user_roles = [ $_COOKIE[USER_TYPE_COOKIE_NAME] ];
        if ($user_roles === [ "both" ]) {
            $user_roles = [ "skater", "coach" ];
        }
    }
    if(!simulation_arg_present('non_team_manager')){
        $user_roles[] = 'team_manager';
    }
    if (isset($_COOKIE[USER_CAN_UPLOAD_COOKIE_NAME])) {
        $can_upload                      = $_COOKIE[USER_CAN_UPLOAD_COOKIE_NAME];
        $upload_cabability['can_upload'] = $can_upload;
        if ($can_upload == "false") {
            $upload_cabability['error_message'] = "API-provided error message related to device support.";
        }
    }

    return json_encode([
        'user' => [
            'roles'                  => $user_roles,
            "upload_file_capability" => $upload_cabability,
            "member_number"          => 123456,
            "email"                  => "test@test.com"
        ]
    ]);
});

$router->get('/api/user/profile', function () {

    $profile = \App\UserProfile::get();

    return json_encode([
        'profile' => $profile
    ]);
});

$router->post('/api/user/profile', function () {
    $data    = json_decode(file_get_contents('php://input'), true);
    $success = true;
    $error   = "";
    if (strpos($data['profile_data']['first_name'], 'error') !== false) {
        $success = false;
        $error   = "Configurable error message.";
    }

    return json_encode([
        'success' => $success,
        'error'   => $error,
        'profile' => $success ? \App\UserProfile::make($data['profile_data']) : null
    ]);
});
$router->post('/api/user/skate-test-history', function () {
    session_start();
    $data         = json_decode(file_get_contents('php://input'), true);
    $partner      = false;
    $test_history = false;
    if ($data && array_key_exists('partner_id', $data) && $data['partner_id']) {
        $partner = true;
        //If working with partner skate tests, load active test from session if present
        if (array_key_exists('current_test_history', $_SESSION)) {
            $test_history = \App\SkateTestHistory::fromJSON(json_decode($_SESSION['current_test_history']));
        }
    }
    if ( ! $test_history) {
        $test_history = \App\SkateTestHistory::clearOptionsFromKeys(\App\SkateTestHistory::core($partner));
    }
    $_SESSION['current_test_history'] = json_encode($test_history);

    return json_encode([
        'skate_test_history' => \App\SkateTestHistory::adaptResponse($test_history)
    ]);
});

$router->post('/api/user/skate-test-history/add', function () {
    session_start();

    return json_encode([
        'success'            => true,
        'error'              => "",
        'skate_test_history' => \App\SkateTestHistory::adaptResponse(\App\SkateTestHistory::handleAddSubmission())
    ]);
});

$router->post('/api/user/skate-test-history/remove', function () {
    session_start();

    return json_encode([
        'success'            => true,
        'error'              => "",
        'skate_test_history' => \App\SkateTestHistory::adaptResponse(\App\SkateTestHistory::handleRemoveSubmission())
    ]);
});

$router->post('/api/user/waivers', function () {

    $data    = json_decode(file_get_contents('php://input'), true);
    $success = true;
    $error   = "";
    foreach ($data['waivers_data'] as $waiver_data) {
        if (strpos(strtolower($waiver_data['name']), 'error') !== false) {
            $success = false;
            $error   = "Configurable error message.";
        }
    }

    return json_encode([
        'success' => $success,
        'error'   => $error,
    ]);
});

$router->post('/api/skater-addresses/{id}/update', function () {
    $data                   = json_decode(file_get_contents('php://input'));
    $address_data           = $data->data;
    $address_data->country  = FormOptions::find(FormOptions::country_options(), $address_data->country);
    $address_data->state    = FormOptions::find(FormOptions::state_options(), $address_data->state);
    $address_data->province = FormOptions::find(FormOptions::state_options(), $address_data->province);
    $address_data->id       = $data->source->id;
    $address_data->zip_code = $address_data->zip;
    unset($address_data->zip);

    return json_encode([
        'success' => true,
        'address' => $address_data
    ]);

    return json_encode([ 'success' => true ]);
});

$router->post('/api/complete-order', function () {
    $data = json_decode(file_get_contents('php://input'));

    if ($data->payment_info->card->expiration_month === 6) {
        return json_encode([
            'success' => false,
            'message' => "Unprocessable Credit Card."
        ]);
    }

    return json_encode([
        'success' => true,
        'message' => "Order placed"
    ]);
});

$router->get('/api/ems-support/issue-types', function () {
    $issue_types = json_decode(file_get_contents(__DIR__ . '/../app/Data/EMSSupportIssueTypeOptions.json'));

    return json_encode([
        "issue_types" => $issue_types
    ]);
});
$router->post('/api/ems-support/submit', function () {
    $data    = json_decode(file_get_contents('php://input'), true);
    $success = true;
    $error   = "";
    if (strpos($data['email'], 'error') !== false) {
        $success = false;
        $error   = "Server side configurable error message.";
    }

    return json_encode([
        "success" => $success,
        "error"   => $error
    ]);
});
$router->post('/api/create-account/personal-info', function () {
    $data                 = json_decode(file_get_contents('php://input'), true);
    $success              = true;
    $error                = "";
    $is_duplicate_account = false;
    if (strpos($data['personal_information_data']['email'], 'duplicate') !== false) {
        $success              = false;
        $error                = "Duplicate account - Server side configurable error message.";
        $is_duplicate_account = true;
    }
    if (strpos($data['personal_information_data']['email'], 'error') !== false) {
        $success = false;
        $error   = "Misc error - Server side configurable error message.";
    }

    return json_encode([
        "success"              => $success,
        "error"                => $error,
        "is_duplicate_account" => $is_duplicate_account,
        "data"                 => (object) [
            'member_number' => uniqid(),
            'account_id'    => uniqid(),
        ]
    ]);
});
$router->post('/api/create-account/address', function () {
    $data    = json_decode(file_get_contents('php://input'), true);
    $success = true;
    $error   = "";
    if (strpos($data['address_data']['street'], 'error') !== false) {
        $success = false;
        $error   = "Bad data - Server side configurable error message.";
    }

    return json_encode([
        "success" => $success,
        "error"   => $error,
    ]);
});
$router->post('/api/create-account/emergency-contact', function () {
    $data    = json_decode(file_get_contents('php://input'), true);
    $success = true;
    $error   = "";
    if (strpos($data['emergency_contact_data']['relationship'], 'error') !== false) {
        $success = false;
        $error   = "Bad data - Server side configurable error message.";
    }

    return json_encode([
        "success" => $success,
        "error"   => $error,
    ]);
});
$router->post('/api/create-account/password', function () {
    $data    = json_decode(file_get_contents('php://input'), true);
    $success = true;
    $error   = "";
    if (strpos($data['password_data']['password'], 'error') !== false) {
        $success = false;
        $error   = "Bad data - Server side configurable error message.";
    }

    return json_encode([
        "success"      => $success,
        "error"        => $error,
        "redirect_url" => '/Members/MemberHome'
    ]);
});
$router->post('/api/create-account/federation-information', function () {
    $data    = json_decode(file_get_contents('php://input'), true);
    $success = true;
    $error   = "";

    return json_encode([
        "success" => $success,
        "error"   => $error,
    ]);
});
$router->post('/api/skate-test-equivalency/save', function () {
    $data    = json_decode(file_get_contents('php://input'), true);
    $success = true;
    $error   = "";

    return json_encode([
        "success" => $success,
        "error"   => $error,
    ]);
});

$router->get('/api/form-options/skate-test-equivalency/tests/group-by/discipline', function () {
    return json_encode([
        "options" => FormOptions::skate_test_options()
    ]);
});

$router->get('/api/form-options/states', function () {
    return json_encode([
        "options" => FormOptions::state_options()
    ]);
});
$router->get('/api/form-options/countries', function () {
    return json_encode([
        "options" => FormOptions::country_options()
    ]);
});
$router->get('/api/form-options/provinces', function () {
    return json_encode([
        "options" => FormOptions::province_options()
    ]);
});
$router->get('/api/form-options/federations', function () {
    return json_encode([
        "options" => FormOptions::federation_options()
    ]);
});
$router->get('/api/form-options/clubs', function () {
    return json_encode([
        "options" => FormOptions::clubs()
    ]);
});
$router->get('/api/form-options/component/create-account', function () {
    return json_encode([
        "options" => FormOptions::create_account_options()
    ]);
});
$router->get('/api/form-options/component/edit-profile', function () {
    return json_encode([
        "options" => FormOptions::edit_profile_options()
    ]);
});

$router->get('/api/form-options/component/billing-address', function () {
    return json_encode([
        "options" => FormOptions::billing_address_options()
    ]);
});


$router->get('/api/support-documents', function () {
    return json_encode([
        "categorized_support_documents" => \App\SupportDocuments::getCategorizedListStatic()
    ]);
});



/**
 * COMP REG SCREEN DATA
 */

$router->group([ 'prefix' => '/api/competition-registration/screen' ], function ($router) {
    $router->get('competition-overview', function () {
        // Start session to reference competition search manager
        session_start();
        $competition_id = (int) \App\CompetitionRegistrationCompetition::getActiveId();
        $prices         = json_decode(file_get_contents(__DIR__ . '/../app/Data/CompetitionPrices.json'));
        if ($competition_id === 2) {
            $prices->ijs = [];
        }
        if ($competition_id === 3) {
            $prices->six_point_zero = [];
        }

        return json_encode([
            'competition' => \App\CompetitionRegistrationCompetition::getActive(),
            'prices'      => $prices,
        ]);
    });

    $router->get('profile', function () {
        // Start session to reference competition search manager
        session_start();
        $representation_required  = true;
        $representation_selection = null;

        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'preselected') !== false) {
                $representation_selection = [
                    'representation_type' => "lts_program",
                    'lts_program'         => 2,
                ];
            }
        }
        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'no_representation') !== false) {
                $representation_required = false;
            }
        }

        return json_encode([
            'competition'                       => \App\CompetitionRegistrationCompetition::getActive(),
            'user_profile'                      => \App\UserProfile::get(),
            'representation_selection_required' => $representation_required,
            'selected_representation'           => $representation_selection,

        ]);
    });

    $router->get('skate-tests', function () {
        session_start();
        $test_history                     = \App\SkateTestHistory::clearOptionsFromKeys(\App\SkateTestHistory::core(false));
        $_SESSION['current_test_history'] = json_encode($test_history);

        return json_encode([
            'competition'        => \App\CompetitionRegistrationCompetition::getActive(),
            'skate_test_history' => $test_history
        ]);
    });
    $router->get('partner-events', function () {
        // Start session to reference competition search manager
        session_start();
        $pre_selected = false;
        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'preselected') !== false) {
                $pre_selected = true;
            }
        }

        $selected_events = [];
        $competition     = \App\CompetitionRegistrationCompetition::getActive();
        if ($pre_selected && count($competition['available_partner_events'])) {
            $selected_events[] = $competition['available_partner_events'][count($competition['available_partner_events']) - 1]['value'];
        }

        return json_encode([
            'competition'     => $competition,
            'selected_events' => $selected_events,
        ]);
    });
    $router->get('partner-identification', function () {
        session_start();
        $competition_data      = (object) \App\CompetitionRegistrationCompetition::getActive();
        $partnerIdentification = false;
        if ($competition_data->competition->has_partner_events) {
            $partnerIdentification = new \App\PartnerIdentification();
            $partnerIdentification->cache();
        }

        return json_encode([
            'competition'        => \App\CompetitionRegistrationCompetition::getActive(),
            'state_options'      => FormOptions::search_state_options(),
            'partner_categories' => $partnerIdentification ? $partnerIdentification->categories : [],
            'user_profile'       => \App\UserProfile::get()
        ]);
    });
    $router->get('event-selection', function () {
        session_start();
        //Start the partner skate test history state afresh
        unset($_SESSION['current_test_history']);

        $manager = new EventSelection(false, false);
        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'raw') !== false) {
                $manager->setRaw();
            }
        }
        $manager->cache();

        $partner_events = [ 'duets', 'pairs' ];
        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'no_partner_events') !== false) {
                $partner_events = [];
            }
        }

        return json_encode([
            'competition'                => \App\CompetitionRegistrationCompetition::getActive(),
            "available_events"           => $manager->events,
            "partner_skate_test_summary" => $manager->partner_skate_tests,
            "selected_partner_events"    => $partner_events
        ]);
    });
    $router->get('coach-identification', function () {
        session_start();
        $coach_identification = \App\CoachIdentification::core();
        $coach_identification->cache();

        return json_encode([
            'competition'      => \App\CompetitionRegistrationCompetition::getActive(),
            'event_categories' => $coach_identification->event_categories,
            'state_options'    => FormOptions::search_state_options(),
        ]);
    });
    $router->get('waivers', function () {
        // Start session to reference competition search manager
        session_start();
        $waiver_data = json_decode(file_get_contents(__DIR__ . "/Data/UserWaivers.json"));

        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'complete') !== false) {
                foreach ($waiver_data as $waiver) {
                    $waiver->status->name         = "self";
                    $waiver->status->relationship = 1;
                }
            } elseif (strpos($_SERVER['HTTP_REFERER'], 'partial') !== false) {
                foreach ($waiver_data as $index => $waiver) {
                    if ($index !== 1) {
                        $waiver->status->relationship = 1;
                        $waiver->status->name         = "self";
                    }
                }
            }
        }

        return json_encode([
            'competition'  => \App\CompetitionRegistrationCompetition::getActive(),
            'form_options' => [
                'relationships' => FormOptions::waiver_relationships(),
            ],
            'user_waivers' => $waiver_data
        ]);
    });


});

/**
 * END COMP REG SCREEN DATA
 */

$router->get('/api/competition-registration/competition-list', function () {
    // Clear Competition Search Manager to ensure data from Registration Mocks is used
    session_start();
    \App\CompetitionSearchManager::clearSession();

    return json_encode([
        "competitions" => \App\CompetitionRegistrationCompetition::getList()
    ]);
});

$router->get('/api/competition-registration/active-competition', function () {
    $competition_data = \App\CompetitionRegistrationCompetition::getActive();

    return json_encode([
        "competition"              => $competition_data['competition'],
        "information"              => $competition_data['information'],
        "available_partner_events" => $competition_data['available_partner_events'],
    ]);
});

$router->post('/api/competition-registration/partner-identification/category-partner/add', function () {
    session_start();
    $success               = true;
    $error                 = "";
    $data                  = json_decode(file_get_contents('php://input'));
    $partnerIdentification = \App\PartnerIdentification::getCurrent();
    if ($data->member_id === 21) {
        $success = false;
        $error   = "Configurable Error message.";
    } else {
        $partnerIdentification->addPartner($data);
    }
    $partnerIdentification->cache();

    return json_encode([
        "success"            => $success,
        "error"              => $error,
        'partner_categories' => $success ? $partnerIdentification->categories : null
    ]);

});

$router->post('/api/competition-registration/partner-identification/category-partner/remove', function () {
    session_start();
    $success               = true;
    $error                 = "";
    $data                  = json_decode(file_get_contents('php://input'));
    $partnerIdentification = \App\PartnerIdentification::getCurrent();
    if ($data->member_id === 22) {
        $success = false;
        $error   = "Configurable Error message.";
    } else {
        $partnerIdentification->removePartner($data);
    }
    $partnerIdentification->cache();

    return json_encode([
        "success"            => $success,
        "error"              => $error,
        'partner_categories' => $success ? $partnerIdentification->categories : null
    ]);

});

$router->post('/api/competition-registration/partner-skate-test/remove', function () {
    session_start();
    $data = json_decode(file_get_contents('php://input'), true);

    $existing_history = false;
    if (array_key_exists('current_test_history', $_SESSION)) {
        $existing_history = \App\SkateTestHistory::fromJSON(json_decode($_SESSION['current_test_history']));
    }
    if ( ! $existing_history) {
        $existing_history = \App\SkateTestHistory::core();
    }
    $manager = EventSelection::getCurrent();

    $manager->updatePartnerSkateTestSummary((object) $data);
    $manager->cache();
    $test_id                          = $data['test']['id'];
    $discipline_key                   = $data['discipline_key'];
    $test_history                     = \App\SkateTestHistory::removeTest($existing_history, $discipline_key, $test_id);
    $_SESSION['current_test_history'] = json_encode($test_history);

    return json_encode([
        'success'                    => true,
        'error'                      => "",
        'skate_test_history'         => \App\SkateTestHistory::adaptResponse($test_history),
        "partner_skate_test_summary" => $manager->partner_skate_tests,
    ]);
});

$router->post('/api/competition-registration/partner-skate-test/add', function () {
    session_start();
    $data             = json_decode(file_get_contents('php://input'), true);
    $existing_history = false;
    if (array_key_exists('current_test_history', $_SESSION)) {
        $existing_history = \App\SkateTestHistory::fromJSON(json_decode($_SESSION['current_test_history']));

    }
    if ( ! $existing_history) {
        $existing_history = \App\SkateTestHistory::core();
    }
    $discipline = $data['discipline_key'];
    $test_data  = $data['test_data'];
    if (strpos(strtolower($test_data['club']), 'error') !== false) {
        return json_encode([
            'success' => false,
            'error'   => "Configurable error message.",
        ]);
    }
    $manager = EventSelection::getCurrent();

    $manager->updatePartnerSkateTestSummary((object) $data, true);
    $manager->cache();
    $test_history                     = \App\SkateTestHistory::addTest($existing_history, $discipline, $test_data);
    $_SESSION['current_test_history'] = json_encode($test_history);

    return json_encode([
        'success'                    => true,
        'error'                      => "",
        'skate_test_history'         => \App\SkateTestHistory::adaptResponse($test_history),
        "partner_skate_test_summary" => $manager->partner_skate_tests,
    ]);
});

$router->post('/api/competition-registration/event-selection/add', function () {
    $success  = true;
    $error    = "";
    $data     = json_decode(file_get_contents('php://input'), true);
    $event_id = $data['event_id'];

    session_start();
    $manager = EventSelection::getCurrent();
    $event   = \App\EventSelection::findMockEvent($event_id);

    if (strpos(strtolower($event->name), 'error') !== false) {
        $success = false;
        $error   = "Configurable error message.";
    } else {
        $manager->addEvent($event);
    }
    $manager->cache();

    return json_encode([
        'success'                    => $success,
        'error'                      => $error,
        "available_events"           => $manager->events,
        "partner_skate_test_summary" => $manager->partner_skate_tests,
    ]);

});

$router->post('/api/competition-registration/event-selection/remove', function () {
    $success = true;
    $error   = "";
    $data    = json_decode(file_get_contents('php://input'), true);

    session_start();

    $manager = EventSelection::getCurrent();
    $event   = \App\EventSelection::findMockEvent($data['event_id']);
    if (strpos(strtolower($event->name), 'error') !== false && $manager->selectedCount() !== 1) {
        $success = false;
        $error   = "[Mock] This event can't be removed when you have other events selected.";
    } else {
        $manager->removeEvent($event);
    }

    $manager->cache();

    return json_encode([
        'success'                    => $success,
        'error'                      => $error,
        "available_events"           => $manager->events,
        "partner_skate_test_summary" => $manager->partner_skate_tests,
    ]);

});

$router->post('/api/competition-registration/coach-identification/category-coach/add', function () {
    session_start();
    $success              = true;
    $error                = "";
    $data                 = json_decode(file_get_contents('php://input'));
    $coach_identification = \App\CoachIdentification::getCurrent();
    if ($data->coach_id === 21) {
        $success = false;
        $error   = "Configurable Error message.";
    } else {
        $coach_identification->addCoach($data);
    }
    $coach_identification->cache();

    return json_encode([
        "success"          => $success,
        "error"            => $error,
        'event_categories' => $success ? $coach_identification->event_categories : null
    ]);

});

$router->post('/api/competition-registration/coach-identification/category-coach/remove', function () {
    session_start();
    $success              = true;
    $error                = "";
    $data                 = json_decode(file_get_contents('php://input'));
    $coach_identification = \App\CoachIdentification::getCurrent();
    if ($data->coach_id === 22) {
        $success = false;
        $error   = "Configurable Error message.";
    } else {
        $coach_identification->removeCoach($data);
    }
    $coach_identification->cache();

    return json_encode([
        "success"          => $success,
        "error"            => $error,
        'event_categories' => $success ? $coach_identification->event_categories : null
    ]);

});

$router->post('/api/competition-registration/coach-identification/category-coach/change', function () {
    session_start();
    $success              = true;
    $error                = "";
    $data                 = json_decode(file_get_contents('php://input'));
    $coach_identification = \App\CoachIdentification::getCurrent();
    if ($data->coach_id === 21) {
        $success = false;
        $error   = "Configurable Error message.";
    } else {
        $coach_identification->replaceCoach($data);
    }
    $coach_identification->cache();

    return json_encode([
        "success"          => $success,
        "error"            => $error,
        'event_categories' => $success ? $coach_identification->event_categories : null
    ]);

});

/*Competition Registration Post Endpoints*/
$router->post('/api/competition-registration/representation', function () {
    return json_encode([
        'success' => true,
        'error'   => ""
    ]);
});
$router->post('/api/competition-registration/partner-events', function () {
    return json_encode([
        'success' => true,
        'error'   => ""
    ]);
});

/**
 * Volunteer Opportunities Routes
 */
$router->group([ 'prefix' => '/api' ], function ($router) {
    include __DIR__ . "/routes/volunteer-request-routes.php";

});
include __DIR__ . "/routes/admin-portal-routes.php";
include __DIR__ . "/routes/schedule-access-routes.php";
include __DIR__ . "/SeriesRegistration/routes/series-registration-routes.php";
include __DIR__ . "/Teams/teams-routes.php";
include __DIR__ . "/Teams/CompetitionRegistration/teams-competition-registration-routes.php";
include __DIR__ . "/CompetitionPortal/competition-portal-routes.php";
include __DIR__ . "/routes/downstream-reintegration-routes.php";
/*
 * END MOCK API ROUTES
*/

$router->get('{id}?', function ($id = "pages/login") use ($blank_layout_pages) {
    new \App\Competition(2);
    if (in_array($id, $blank_layout_pages)) {
        return PagesController::showBlankPage($id);
    }

    return PagesController::showPage($id);
});

$router->get('pages/ems', function () {
    return PagesController::showPageWithParent('pages', 'ems');
});

$router->get('{parent}/{id}?', function ($parent, $id) use ($blank_layout_pages) {

    if (in_array(implode('/', [ $parent, $id ]), $blank_layout_pages)) {
        return PagesController::showBlankPageWithParent($parent, $id);
    }

    return PagesController::showPageWithParent($parent, $id);
});

/**
 * Allows adding an extra URL segment to pass testing arguments
 */
$router->get('/pages/{page_name}/{test_params}?', function ($page_name, $comp_id) use ($blank_layout_pages) {
    return PagesController::showPageWithParent('pages', str_replace('?', '', $page_name));
});

$dispatcher = new Phroute\Phroute\Dispatcher($router->getData());
try {
    $response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

} catch (Phroute\Phroute\Exception\HttpRouteNotFoundException $e) {
    if ( ! empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        http_response_code(404);
        echo "Not Found";
        die();
    }
    $response = PagesController::showPage('404');

} catch (Phroute\Phroute\Exception\HttpMethodNotAllowedException $e) {
    if ( ! empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        http_response_code(404);
        echo "Not Found";
        die();
    }
    $response = PagesController::showPage('404');
}

// Print out the value returned from the dispatched function
echo $response;