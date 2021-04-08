<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/23/19
 * Time: 4:24 PM
 */

namespace App;

class Search
{

    /**
     * Search constructor.
     */
	public function __construct( $data, $include_gender = false, $potential_results = [] ) {
		if ( session_id() == "" ) {
			session_start();
		}
		$search_params = [
			"first_name"         => array_key_exists( 'first_name', $data ) ? $data['first_name'] : false,
			"last_name"          => array_key_exists( 'last_name', $data ) ? $data['last_name'] : false,
			"member_number"      => array_key_exists( 'member_number', $data ) ? $data['member_number'] : false,
			"state_abbreviation" => array_key_exists( 'state', $data ) ? $data['state'] : false,
		];

        $gender_search_config = [];

        preg_match('/(male|female)/', $search_params['first_name'], $gender_search_config);

        $gender_search = count($gender_search_config) > 1
            ? $gender_search_config[1]
            : false;

		if ( ! $potential_results ) {
			$potential_results = $this->getStaticPotentialResults();
			//$potential_results = $this->getDynamicPotentialResults();
		}
        $results           = [];

        foreach ($potential_results as $index => $potential_result) {
            if ($gender_search && $gender_search !== $potential_result['gender']) {
                unset($potential_results[$index]);
                continue;
            }
            if ( ! $include_gender) {
                unset ($potential_result['gender']);
            }
            if ($search_params['member_number'] && $search_params['member_number'] === "any") {
                $results[] = $potential_result;
                continue;
            }
            foreach ($search_params as $key => $value) {
                if ( ! $value) {
                    continue;
                }
                if ($value === $potential_result[$key]) {
                    $results[] = $potential_result;
                    continue 2;
                }

            }
            unset($potential_results[$index]);
        }
        $_SESSION['current_search_results'] = json_encode($results);

        $this->results = $results;
    }


    /**
     * @return array|mixed
     */
    protected function getDynamicPotentialResults()
    {
        $faker             = \Faker\Factory::create();
        $potential_results = json_decode(file_get_contents(__DIR__ . '/../app/Data/Coaches.json'), true);

        for ($i = 0; $i < 100; $i++) {
            $gender              = rand(0, 1) == 1 ? "male" : "female";
            $potential_results[] = [
                "id"                 => $i + 5,
                "first_name"         => $faker->firstName($gender),
                "last_name"          => $faker->lastName,
                "gender"             => $gender,
                "ineligible"         => rand(0, 5) == 1 ? true : false,
                "state_abbreviation" => $faker->stateAbbr,
                "city"               => $faker->city,
                "club_name"          => $faker->catchPhrase,
                "member_number"      => $faker->numberBetween(1000000, 9999999),
            ];
        }

        return $potential_results;
    }


    private function getStaticPotentialResults()
    {
        return json_decode(file_get_contents(__DIR__ . '/../app/Data/MemberSearchResults.json'), true);
    }


    public static function currentResults()
    {
        if (session_id() == "") {
            session_start();
        }

        return json_decode($_SESSION['current_search_results']);
    }
}