<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 10/26/19
 * Time: 3:15 PM
 */

namespace App\AdminPortal\Factories;

class CheckInSkaterCoachesFactory {

	public static function mock( $entity ) {

		$result    = [];
		$to_assign = $entity->coach_count;
		$config    = [
			[
				'id'          => 1,
				'name'        => 'Singles',
				'coach_limit' => 2,
			],
			[
				'id'          => 2,
				'name'        => 'Dance',
				'coach_limit' => 3,
			],
			[
				'id'          => 3,
				'name'        => 'Other',
				'coach_limit' => 4,
			],
		];
		for ( $i = 0; $i < count( $config ); $i ++ ) {
			$configElement = $config[ $i ];

			$local_assign = $to_assign;
			if ( $configElement['coach_limit'] < $to_assign ) {
				$local_assign = $configElement['coach_limit'];
			}
			$to_assign      -= $local_assign;
			$event_category = self::event_category( $local_assign, $configElement );
			$result []      = $event_category;
		}

		return $result;
	}


	public static function event_category( $coach_amount, $overrides ) {
		$faker       = \Faker\Factory::create();
		$coach_limit = array_key_exists( 'coach_limit', $overrides ) ? $overrides['coach_limit'] : $faker->numberBetween( 1, 3 );

		return array_merge( [
			'coach_limit' => $coach_limit,
			'coaches'     => self::coach_list( $coach_amount ),
			'id'          => uniqid(),
			'name'        => $faker->catchPhrase,
		], $overrides );
	}


	public static function coach_list( $amount ) {
		$result = [];
		for ( $i = 0; $i < $amount; $i ++ ) {
			$result[] = self::coach();
		}

		return $result;
	}


	public static function coach( $overrides = [] ) {

		$faker = \Faker\Factory::create();

		return array_merge( [
			'first_name'         => $faker->firstName,
			'id'                 => uniqid(),
			'last_name'          => $faker->lastName,
			'compliance_summary' => [
				[
					'complete'   => $faker->boolean,
					'id'         => 1,
					'name'       => 'U.S. Figure Skating or LTS Membership',
					'overridden' => false,
				],
				[
					'complete'   => $faker->boolean,
					'id'         => 2,
					'name'       => 'Background Check',
					'overridden' => false,
				],
				[
					'complete'   => $faker->boolean,
					'id'         => 3,
					'name'       => 'SafeSport',
					'overridden' => false,
				],
			],
			'ineligible'         => $faker->numberBetween( 0, 3 ) === 1,
		], $overrides );
	}
}