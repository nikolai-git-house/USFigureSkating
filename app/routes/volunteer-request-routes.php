<?php
$router->get('volunteer/competitions', function () {
    session_start();
    $manager = new \App\VolunteerOpportunities();
    $result  = $manager->getOpportunities();
    $manager->cache();

    return json_encode($result);
});
$router->post('volunteer/competitions/search', function () {
    session_start();
    $manager = \App\VolunteerOpportunities::getCurrent();
    $data    = json_decode(file_get_contents('php://input'), true);
    if ($data['competition_name'] === "error") {
        http_response_code(500);

        return;
    }
    $result = $manager->search($data);
    $manager->cache();

    return json_encode([
        'opportunities' => $result
    ]);
});
$router->get('volunteer-request/{competition_id}/profile', function ($competition_id) {
    session_start();
    $manager = \App\VolunteerOpportunities::getCurrent();
    $result  = $manager->getCompetitionProfile($competition_id);

    return json_encode($result);
});
$router->post('volunteer-request/{competition_id}/profile', function () {
    session_start();
    $data    = json_decode(file_get_contents('php://input'), true);
    $success = true;
    $error   = "";
    if (strpos($data['profile']['email'], 'error') !== false) {
        $success = false;
        $error   = "Configurable error message.";
    }

    return json_encode([
        'success' => $success,
        'error'   => $error,
    ]);
});
$router->post('volunteer-request/{competition_id}', function ($competition_id) {
    session_start();
    $manager = \App\VolunteerOpportunities::getCurrent();
    $data    = json_decode(file_get_contents('php://input'), true);

    $success = true;
    $error   = "";
    if (strpos($data['volunteer_skillset'], 'error') !== false) {
        $success = false;
        $error   = "Configurable error message.";
    }

    $result = $manager->submit($competition_id, $data);

    return json_encode(array_merge([ 'success' => $success, 'error' => $error ], $result));
});
