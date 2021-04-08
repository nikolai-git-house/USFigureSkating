<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 11/2/19
 * Time: 11:09 AM
 */

namespace App\AdminPortal\Factories\CompetitionManagement;

use Carbon\Carbon;
use Faker\Factory;

class CompetitionManagementCompetitionFactory {
	public static function competition( $overrides = [] ) {
		$faker      = Factory::create();
		$id         = array_key_exists( 'id', $overrides ) ? $overrides['id'] : (int) uniqid();
		$name       = array_key_exists( 'name', $overrides ) ? $overrides['name'] : $faker->catchPhrase;
		$start_date = array_key_exists( 'start_date', $overrides ) ? $overrides['start_date'] : $faker->dateTimeBetween( "-1 years", "+1 years" );
		$end_date   = array_key_exists( 'end_date', $overrides ) ? $overrides['end_date'] : Carbon::createFromTimestamp( $start_date->getTimestamp() )
		                                                                                          ->addDays( rand( 1, 3 ) );

		$include_directions = array_key_exists( 'include_directions', $overrides ) ? $overrides['include_directions'] : $faker->boolean;

		$include_website = array_key_exists( 'include_website', $overrides ) ? $overrides['include_website'] : $faker->boolean;

		$include_announcement = array_key_exists( 'include_announcement', $overrides ) ? $overrides['include_announcement'] : $faker->boolean;

		unset( $overrides['start_date'] );
		unset( $overrides['end_date'] );
		unset( $overrides['include_directions'] );
		unset( $overrides['include_website'] );
		unset( $overrides['include_announcement'] );

		$icons = [
			"/images/2018-MW-Adult.png",
			"/images/competition-icon2.png",
			"/images/competition-icon.png",
			"/images/competition-icon2.png",
			"/images/competition-icon3.png",
			"/images/competition-icon4.png",
			"/images/competition-icon.png",
		];

		$directions = [];
		for ( $i = 0; $i < rand( 1, 3 ); $i ++ ) {
			$directions[] = [
				'location_name' => $faker->company,
				'link'          => sprintf( "https://placehold.it/720x480&text=%s+Directions+Link", urlencode( $name ) ),
			];
		}

		return (object) array_merge( [
			'end_date_pretty'           => $end_date->format( 'n/j/Y' ),
			'icon'                      => $icons[ rand( 0, count( $icons ) - 1 ) ],
			'id'                        => $id,
			'location'                  => [
				'city'  => $faker->city,
				'state' => $faker->stateAbbr,
			],
			'manage_link'               => sprintf( "/pages/competition-management/%s", $id ),
			'name'                      => $name,
			'start_date_pretty'         => $start_date->format( 'n/j/Y' ),
			'compliance_report_link'    => sprintf( "https://placehold.it/720x480&text=%s+Compliance+Report", urlencode( $name ) ),
			'check_in_report_url'       => sprintf( "https://placehold.it/720x480&text=%s+Check-In+Report", urlencode( $name ) ),
			'team_roster_can_be_edited' => true,
		], $include_directions ? [
			'directions' => $directions,
		] : [], $include_website ? [
			'website_url' => sprintf( "https://placehold.it/720x480&text=%s+Website", urlencode( $name ) ),
		] : [], $include_announcement ? [
			'announcement_url' => sprintf( "https://placehold.it/720x480&text=%s+Announcement", urlencode( $name ) ),
		] : [], $overrides );
	}

	public static function lists() {
		$faker           = Factory::create();
		$data            = json_decode( file_get_contents( __DIR__ . '/../../../Data/CompetitionManagementCompetitions.json' ), true );
		$id              = 1;
		$upcoming_amount = 20;
		$past_amount     = 20;
		if ( \simulation_arg_present( 'comp_list_over_50' ) ) {
			$upcoming_amount = 75;
			$past_amount     = 75;
		}
		foreach ( $data as $comp ) {
			$competitions_data_upcoming[] = CompetitionManagementCompetitionFactory::competition( array_merge( $comp, [
				'start_date' => $faker->dateTimeBetween( 'today', '+2 months' ),
				'id'         => $id ++,
				'name'       => str_replace( '<CurrentYear>', Carbon::now()
				                                                    ->format( 'Y' ), $comp['name'] ),
			] ) );
		}

		$competitions_data_upcoming[] = CompetitionManagementCompetitionFactory::competition( [
			'start_date' => $faker->dateTimeBetween( '-3 days', 'yesterday' ),
			'end_date'   => $faker->dateTimeBetween( '+2 days', '+3 days' ),
			'id'         => $id ++,
			'name'       => "Currently Happening",

		] );

		$competitions_data_upcoming[] = CompetitionManagementCompetitionFactory::competition( [
			'start_date' => $faker->dateTimeBetween( 'today', '+2 months' ),
			'id'         => $id ++,
			'name'       => "Multiple Directions",
			'directions' => [
				[
					'location_name' => $faker->company,
					'link'          => sprintf( "https://placehold.it/720x480&text=%s+Directions+Link", urlencode( 'Multiple Directions' ) ),
				],
				[
					'location_name' => $faker->company,
					'link'          => sprintf( "https://placehold.it/720x480&text=%s+Directions+Link", urlencode( 'Multiple Directions' ) ),
				],
			],
		] );

		$competitions_data_upcoming[] = CompetitionManagementCompetitionFactory::competition( [
			'start_date'           => $faker->dateTimeBetween( 'today', '+2 months' ),
			'id'                   => $id ++,
			'name'                 => "All Optional Information",
			'include_directions'   => true,
			'include_website'      => true,
			'include_announcement' => true,
		] );
		$competitions_data_upcoming[] = CompetitionManagementCompetitionFactory::competition( [
			'start_date'           => $faker->dateTimeBetween( 'today', '+2 months' ),
			'id'                   => $id ++,
			'name'                 => "No Optional Information",
			'include_directions'   => false,
			'include_website'      => false,
			'include_announcement' => false,
		] );

		$competitions_data_upcoming[] = CompetitionManagementCompetitionFactory::competition( [
			'start_date'                => $faker->dateTimeBetween( 'today', '+2 months' ),
			'id'                        => $id ++,
			'name'                      => "Roster Cannot Be Edited",
			'team_roster_can_be_edited' => false,
		] );

		for ( $i = 0; $i < $upcoming_amount; $i ++ ) {
			$competitions_data_upcoming[] = CompetitionManagementCompetitionFactory::competition( array_merge( [], [
				'start_date' => $faker->dateTimeBetween( '+3 months', '+1 year' ),
				'id'         => $id ++,
			] ) );
		}
		for ( $i = 0; $i < $past_amount; $i ++ ) {
			$competitions_data_past[] = CompetitionManagementCompetitionFactory::competition( array_merge( [], [
				'start_date' => $faker->dateTimeBetween( '-1 year', 'yesterday' ),
				'id'         => $id ++,
			] ) );
		}

		if ( array_key_exists( 'HTTP_REFERER', $_SERVER ) ) {
			if ( strpos( $_SERVER['HTTP_REFERER'], 'no-upcoming' ) !== false ) {
				$competitions_data_upcoming = [];
			}
			if ( strpos( $_SERVER['HTTP_REFERER'], 'no-past' ) !== false ) {
				$competitions_data_past = [];
			}
		}
		usort( $competitions_data_upcoming, function ( $item1, $item2 ) {
			$timestamp  = ( new Carbon( $item1->start_date_pretty ) )->timestamp;
			$timestamp2 = ( new Carbon( $item2->start_date_pretty ) )->timestamp;

			return $timestamp - $timestamp2;
		} );
		usort( $competitions_data_past, function ( $item1, $item2 ) {
			$timestamp  = ( new Carbon( $item1->start_date_pretty ) )->timestamp;
			$timestamp2 = ( new Carbon( $item2->start_date_pretty ) )->timestamp;

			return $timestamp2 - $timestamp;
		} );

		return [ $competitions_data_upcoming, $competitions_data_past ];
	}
}