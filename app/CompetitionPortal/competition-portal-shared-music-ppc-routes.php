<?php

$router->post('ppc-element-options', function () {
    $data = json_decode(file_get_contents(__DIR__ . '/../Data/PPCOptions.json'));

    return json_encode($data);
});

$router->post('ppc/save', function ($id) {
    try {
        $is_complete   = true;
        $success       = true;
        $last_modified = \Carbon\Carbon::now("America/Denver")->timestamp;
        /* Simulate submission resulting in incomplete PPC
        */
        $ppc_save_data = $data = json_decode(file_get_contents('php://input'), true);
        $element_count = count($ppc_save_data['ppc']['elements']);
        if ($element_count < 4 || $element_count > 7) {
            $is_complete = false;
        }
    } catch (Exception $e) {
        $success = false;
    }

    return json_encode([
        "success"       => $success,
        "is_complete"   => $is_complete,
        "last_modified" => $last_modified
    ]);
});

$router->get('ppc{params}', function ($competition_id, $params) {

    $competition_id   = $_GET['competition_id'];
    $event_id         = $_GET['event_id'];
    $event_segment_id = $_GET['event_segment_id'];
    $data             = json_decode(file_get_contents(__DIR__ . '/../Data/SkaterPPC.json'), true);
    $ppc              = [ "elements" => [] ];
    if (( array_key_exists($competition_id, $data) && array_key_exists($event_id,
            $data[$competition_id]) && array_key_exists($event_segment_id, $data[$competition_id][$event_id]) )) {
        $ppc = $data[$competition_id][$event_id][$event_segment_id];
    }
    //teamId segment active
    if (is_numeric($params)) {

        $ppc['elements'][] = [
            'type'                   => [
                "id"          => 5,
                "description" => "Jumps",
            ],
            'moves'                  => [],
            'element'                => [
                "id"                  => 2,
                "category_id"         => 2,
                "type_id"             => 5,
                "description"         => "Transition",
                "code"                => "T",
                "is_combo"            => false,
                "is_transition"       => true,
                "number_of_combos"    => 0,
                "exclude_from_combos" => false
            ],
            'transition_description' => 'Lorem ipsum dolor sit amet, consectetur'
        ];
    }

    return json_encode([
        'ppc' => [
            "elements"                    => $ppc['elements'],
            "event_id"                    => $event_id,
            "event_segment_id"            => $event_segment_id,
            "competition_id"              => $competition_id,
            "competition_skated_event_id" => rand(1, 5) //this data point isn't being used on the frontend
        ]
    ]);
});

$router->get('music?{params}', function ($id, $params) {
    $competition_id              = $_GET['competition_id'];
    $event_id                    = $_GET['event_id'];
    $event_segment_id            = $_GET['event_segment_id'];
    $competition_skated_event_id = $_GET['competition_skated_event_id'];
    $data                        = json_decode(file_get_contents(__DIR__ . '/../Data/SkaterMusic.json'), true);
    $music                       = [];
    if (( array_key_exists($competition_id, $data) && array_key_exists($event_id,
            $data[$competition_id]) && array_key_exists($event_segment_id, $data[$competition_id][$event_id]) )) {
        $music = $data[$competition_id][$event_id][$event_segment_id];
        if ($music) {
            $music['is_assigned_to_program'] = true;
        }
    }

    return json_encode(compact('competition_skated_event_id', 'competition_id', 'event_id', 'event_segment_id',
        'music'));
    /*return json_encode([
        'ppc' => [
            "elements"                    => $ppc['elements'],
            "event_id"                    => $event_id,
            "event_segment_id"            => $event_segment_id,
            "competition_id"              => $competition_id,
            "competition_skated_event_id" => rand(1, 5) //this data point isn't being used on the frontend
        ]
    ]);*/
});

$router->post('music/save', function ($id) {
    try {
        $is_complete   = true;
        $success       = true;
        $last_modified = \Carbon\Carbon::now("America/Denver")->timestamp;

        $music_save_data = $data = json_decode(file_get_contents('php://input'), true);
        $response_id     = rand(300, 500);
        if (array_key_exists('music', $music_save_data) && array_key_exists('id', $music_save_data['music'])) {
            $response_id = $music_save_data['music']['id'];
        }
        /* Simulate submission resulting in incomplete music
                */
        $arbitrary_logic = 1 == 2;
        if ($arbitrary_logic) {
            $is_complete = false;
        }
    } catch (Exception $e) {
        $success = false;
    }

    return json_encode([
        "success"       => $success,
        "is_complete"   => $is_complete,
        "last_modified" => $last_modified,
        "music_item_id" => $response_id
    ]);
});

/* ===========================================================================================================
*                                       Music/PPC Rhythms/Themes
* ===========================================================================================================*/
/**
 * Get rhythms
 */
$router->get('rhythms{params}', function () {
    return json_encode([
        'rhythms' => [
            'Rhythm 1',
            // 'Rhythm 2',
            // 'Rhythm 3'
        ]
    ]);
});
/**
 * Save rhythms
 */
$router->post('rhythms/save', function () {
    return json_encode([
        'success'     => true,
        'is_complete' => true,
        'rhythms'     => [
            'Saved Rhythm 1',
            'Saved Rhythm 2',
            // 'Rhythm 3'
        ]
    ]);
});
/**
 * Get Themes
 */
$router->get('theme{params}', function () {
    return json_encode([
        'theme' => "Theme"
    ]);
});
/**
 * Save themes
 */
$router->post('theme/save', function () {
    return json_encode([
        'success'     => true,
        'is_complete' => true,
        'theme'       => "Saved Theme"
    ]);
});

