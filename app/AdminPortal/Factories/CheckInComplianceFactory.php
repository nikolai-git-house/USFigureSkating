<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 10/26/19
 * Time: 9:10 AM
 */

namespace App\AdminPortal\Factories;

class CheckInComplianceFactory {

	public static function mock( $entity ) {
		$all = self::all( $entity->is_compliant );
		if ( $entity->entity_type_key === 'team_personnel' ) {
			return [
				$all[1],
				$all[6],
			];
		}

		return $all;
	}


	public static function all( $forceTrue ) {
		$faker = \Faker\Factory::create();

		return [
			(object) [
				'id'         => 1,
				'name'       => 'Coach Code of Ethics',
				'complete'   => $forceTrue,
				'overridden' => false,
			],
			(object) [
				'id'         => 2,
				'name'       => 'Background Check',
				'complete'   => $forceTrue ? true : $faker->boolean,
				'overridden' => false,
			],
			(object) [
				'id'         => 3,
				'name'       => 'Membership',
				'complete'   => $forceTrue ? true : $faker->boolean,
				'overridden' => false,
			],
			(object) [
				'id'         => 4,
				'name'       => 'CER',
				'complete'   => $forceTrue ? true : $faker->boolean,
				'overridden' => false,
			],
			(object) [
				'id'         => 5,
				'name'       => 'Liability Insurance',
				'complete'   => $forceTrue ? true : $faker->boolean,
				'overridden' => false,
			],
			(object) [
				'id'         => 6,
				'name'       => 'PSA',
				'complete'   => $forceTrue ? true : $faker->boolean,
				'overridden' => false,
			],
			(object) [
				'id'         => 7,
				'name'       => 'SafeSport',
				'complete'   => $forceTrue ? true : $faker->boolean,
				'overridden' => false,
			],
		];
	}
}