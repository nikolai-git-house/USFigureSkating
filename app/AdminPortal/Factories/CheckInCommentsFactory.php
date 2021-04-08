<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 10/25/19
 * Time: 5:22 PM
 */

namespace App\AdminPortal\Factories;

use Faker\Factory;

class CheckInCommentsFactory {

	public static function mock( $amount = 10 ) {
		$result = [];
		if ( $amount === 0 ) {
			return $result;
		}
		for ( $i = 0; $i < $amount; $i ++ ) {
			$result[] = CheckInCommentsFactory::generateComment();
		}

		usort( $result, function ( $a, $b ) {
			return strtotime( $b['datetime_formatted'] ) - strtotime( $a['datetime_formatted'] );
		} );

		return array_map( function ( $item ) {
			unset( $item['date'] );

			return (object) $item;
		}, $result );

	}


	public static function generateComment( $overrides = [] ) {
		$faker = Factory::create();
		$date  = $faker->dateTimeBetween( "-2 days", '-1 hour' )
		               ->setTimezone( new \DateTimeZone( 'MDT' ) );

		return array_merge( [
			'id'                 => $faker->randomNumber(),
			'author'             => $faker->firstName() . ' ' . $faker->lastName(),
			'datetime_formatted' => $date->format( 'n/j/y g:ia' ),
			'comment'            => $faker->paragraph(),
		], $overrides );
	}


	public static function generateCurrentComment( $overrides = [] ) {
		$date = \Carbon\Carbon::now()
		                      ->timezone( 'America/Denver' );

		return self::generateComment( array_merge( [
			'datetime_formatted' => $date->format( 'n/j/y g:i a' ),
		], $overrides ) );
	}
}