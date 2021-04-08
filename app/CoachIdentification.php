<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/24/19
 * Time: 7:30 PM
 */

namespace App;

class CoachIdentification
{

    public $event_categories;

    private static $session_storage_key = "current_coach_identification";


    /**
     * CoachIdentification constructor.
     */
    public function __construct($event_categories)
    {

        $this->event_categories = $event_categories;
    }


    public static function core()
    {
        $id                     = 1;
        $map                    = json_decode(file_get_contents(__DIR__ . '/../app/Data/SkaterCoachCompetitionEventCategoryMap.json',
            true), true);
        $event_categories       = json_decode(file_get_contents(__DIR__ . '/../app/Data/SkatingEventCategories.json'),
            true);
        $competition_map        = $map[$id];
        $event_category_results = [];
        $coaches                = \App\Coach::allKeyed();
        $add_coach_flag         = false;
        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'preselected') !== false) {
                $add_coach_flag = true;
            }
        }
        foreach ($competition_map as $category_id => $coach_ids) {
            $event_coaches = [];
            foreach ($coach_ids as $coach_id) {
                $event_coaches[] = $coaches->$coach_id;
            }
            $result                   = $event_categories[$category_id];
            $result['coaches']        = $add_coach_flag ? $event_coaches : [];
            $event_category_results[] = $result;
        }

        return new self($event_category_results);
    }


    private static function fromJSON($data)
    {
        return new self($data['event_categories']);
    }


    public function cache()
    {
        $_SESSION[self::$session_storage_key] = json_encode($this);
    }


    public static function getCurrent()
    {
        if (array_key_exists(self::$session_storage_key, $_SESSION)) {
            return self::fromJSON(json_decode($_SESSION[self::$session_storage_key], true));
        }

        return new self(false, false);
    }


    public function addCoach($data)
    {
        $coach = $this->getCoach($data->coach_id);
        foreach ($this->event_categories as &$category) {
            if ($category['id'] === $data->category_id) {
                $category['coaches'][] = $coach;
                break;
            }
        }
    }


    public function getCoach($coach_id)
    {
        $options = \App\Search::currentResults();
        $member  = null;
        foreach ($options as $option) {
            if ($option->id === $coach_id) {
                $member = $option;
            }
        }
        $faker = \Faker\Factory::create();
        if ( ! $member) {
            $member = [
                "id"                 => $coach_id,
                "first_name"         => $faker->firstName,
                "last_name"          => $faker->lastName,
                "ineligible"         => false,
                "state_abbreviation" => $faker->stateAbbr,
                "club_name"          => $faker->catchPhrase,
                "member_number"      => $faker->numberBetween(1000000, 9999999)
            ];
        }
        $member = [
            "first_name" => $member->first_name,
            "last_name"  => $member->last_name,
            "ineligible" => false,
            "id"         => $member->id,
        ];

        return $member;
    }


    public function removeCoach($data, $replacement = false)
    {
        foreach ($this->event_categories as &$category) {
            if ($category['id'] === $data->category_id) {
                foreach ($category['coaches'] as $index => $coach) {
                    if ($coach['id'] === $data->coach_id) {

                        array_splice($category['coaches'], $index, 1, $replacement ? [ $replacement ] : null);

                        return;
                    }

                }

                return;
            }
        }
    }


    public function replaceCoach($data)
    {
        $replacement = $this->getCoach($data->coach_id);
        $this->removeCoach((object) [
            "coach_id"    => $data->replace_coach_id,
            "category_id" => $data->category_id
        ], $replacement);
    }
}