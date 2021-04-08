<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 12/26/19
 * Time: 5:29 PM
 */

namespace App\factories;

use Carbon\Carbon;
use Faker\Factory;

class FieldFactory {

	/**
	 * Get a mock unique ID
	 *
	 * @return float|int
	 */
	public static function id() {
		return abs( crc32( uniqid() ) );
	}

	/**
	 * Get a list of mock real-world Competition Names
	 */
	public static function competitionNames() {
		return array_map( function ( $item ) {
			return str_replace( '<CurrentYear>', Carbon::now()
			                                           ->format( 'Y' ), $item );
		}, [
			"<CurrentYear> Skate Austin Bluebonnet",
			"<CurrentYear> Test Competition",
			"<CurrentYear> U.S. Adult Figure Skating Championship",
			"Madison Open",
			"<CurrentYear> U.S. Synchronized Skating Championships",
			"Skate the Lake",
			"<CurrentYear> Northwest Regional Championships",
			"<CurrentYear> Southwest Open",
		] );
	}


    public static function clubName()
    {
        $clubs = json_decode( file_get_contents( __DIR__ . "/../Data/FormOptions.json" ), true )['clubs'];

        return preg_replace( '/\s\([0-9]*\)/', "", $clubs[ rand( 0, count( $clubs ) - 1 ) ]['label'] );
	}


    public static function teamLevel()
    {
        $levels = [
            'Synchro Skills',
            'Juniors',
            'Seniors'
        ];

        return $levels[rand(0, 2)];
    }


    public static function memberStatus()
    {
        $faker = Factory::create();
        $date  = Carbon::createFromTimestamp($faker->dateTimeBetween("today", "+1 years")->setTime(0, 0,
            0)->getTimestamp());

        return [
            'active'                  => true,
            'validity_date_formatted' => $date->format('n/j/Y'),
        ];
    }


    public static function memberSection()
    {
        return [ 'Midwestern', 'Eastern', 'Pacific' ][rand(0, 2)];
    }


    public static function memberNumber()
    {
        return rand(1000000, 9999999);
    }

}