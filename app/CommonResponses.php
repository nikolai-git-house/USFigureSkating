<?php

namespace App;

class CommonResponses
{

    /**
     * @param $id
     *
     * @return array
     */
    public static function skaterEventSegments($id)
    {
        $data                  = json_decode(file_get_contents(__DIR__ . '/../app/Data/SkaterSkatingEventSegments.json'));
        $competition_data      = $data->$id;
        $skater_event_segments = [];

        foreach ($competition_data as $skating_event_segment_data) {
            $skater_event_segments[] = new \App\SkaterSkatingEventSegment($skating_event_segment_data);
        }

        return $skater_event_segments;
    }

    public static function skaterCredits($competition_id)
    {
        $id                           = $competition_id < 8
            ? $competition_id
            : 1;
        $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/Data/SkaterCompetitonEventMap.json'));
        $purchased_package_ids        = json_decode(file_get_contents(__DIR__ . '/Data/SkaterPurchasedPackages.json'));
        $event_ids                    = $competition_skater_event_map->$id;
        $result                       = [];
        foreach ($event_ids as $event_id) {
            $result[] = new \App\SkaterCredits($id, $event_id);
        }

        return [
            'event_credits'         => $result,
            'purchased_package_ids' => $purchased_package_ids->$id
        ];
    }

    public static function competitionInformationData($competition_id)
    {
        $id                      = $competition_id < 8
            ? $competition_id
            : 1;
        $competition_information = new CompetitionInformation($id);
        unset($competition_information->skating_event_ids);
        $competition_information->competition_id = (string) $competition_id;

        return $competition_information;
    }


    public static function coachedSkaterSchedule($competition_id)
    {
        $id                           = $competition_id < 8
            ? $competition_id
            : $competition_id % 7;
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

        return [
            'sessions'           => $sessions,
            'skater_session_map' => $skater_session_map
        ];
    }
}