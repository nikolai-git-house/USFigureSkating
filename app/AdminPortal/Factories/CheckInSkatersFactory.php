<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 10/26/19
 * Time: 3:16 PM
 */

namespace App\AdminPortal\Factories;

use Faker\Factory;

class CheckInSkatersFactory {

	public static function mock( $entity ) {
		$faker  = Factory::create();
		$count  = $entity->skater_count;
		$result = [];
		if ( $count === 0 ) {
			return $result;
		}
		for ( $i = 0; $i < $count; $i ++ ) {
			$result[] = [
				'first_name' => $faker->firstName,
				'last_name'  => $faker->lastName,
				'checked_in' => $faker->boolean,
			];

		}
		usort( $result, function ( $item, $item2 ) {
			return strnatcmp( $item['last_name'], $item2['last_name'] );
		} );

		return $result;

	}
}