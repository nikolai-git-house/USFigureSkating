<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/24/19
 * Time: 10:18 AM
 */

namespace App;

class PartnerIdentification
{

    private static $session_storage_key = "current_partner_identification";


    /**
     * PartnerIdentification constructor.
     */
    public function __construct($data = null)
    {
        $categories = $data;
        if ( ! $categories) {
            $categories = $this->getDefault();
        }
        $this->categories = $categories;
    }


    private static function fromJSON($data)
    {
        return new self($data['categories']);
    }


    public function addPartner($data)
    {

        $options = \App\Search::currentResults();
        $member  = null;
        foreach ($options as $option) {
            if ($option->id === $data->member_id) {
                $member = $option;
            }
        }
        $faker = \Faker\Factory::create();
        if ( ! $member) {
            $member = [
                "id"                 => $data->member_id,
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
        foreach ($this->categories as &$category) {
            if ($category['id'] === $data->category_id) {
                $category['partner'] = $member;
                break;
            }
        }
    }


    public function removePartner($data)
    {
        foreach ($this->categories as &$category) {
            if ($category['id'] === $data->category_id) {
                $category['partner'] = null;
                break;
            }
        }
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


    /**
     * @return array
     */
    protected function getDefault()
    {
        $members         = json_decode(file_get_contents(__DIR__ . '/../app/Data/Coaches.json'), true);
        $selected_member = null;
        foreach ($members as $member) {
            if ($member['id'] === 20) {
                $result = $member;
                break;
            }
        }
        if ( ! $member) {
            $member = [
                'first_name' => "Peter",
                'last_name'  => "Eurich",
                'ineligible' => false,
                'id'         => 20,
            ];
        }
        $member['name'] = $member['first_name'] . " " . $member['last_name'];
        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'ineligible') !== false) {
                $member['ineligible'] = true;
            }
            if (strpos($_SERVER['HTTP_REFERER'], 'preselected') !== false) {
                $selected_member = $member;
            }
        }
        $categories = [
            [
                'id'      => 1,
                'name'    => 'Dance',
                'partner' => $selected_member
            ],
            [
                'id'      => 2,
                'name'    => 'Duets',
                'partner' => null
            ]
        ];

        return $categories;
    }
}