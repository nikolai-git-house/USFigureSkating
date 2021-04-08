<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 11/24/19
 * Time: 5:46 PM
 */

namespace App\factories;

use Carbon\Carbon;
use Faker\Factory;

class CompetitionDocumentFactory {
	private static $action_documents = [
		'Merchandise Order Form',
		'Practice Ice Preference Form',
		'Mandatory Form',
		'Program Information Form',
		'Meal Orders',
	];

	private static $reference_documents = [
		'Practice Ice Schedule',
		'Where to eat around town',
		'Local Hotels',
		'Team Information Book',
		'Announcement',

	];

	public static function documents() {
		$reference_documents = [];
		$action_documents    = [];
		foreach ( static::$reference_documents as $name ) {
			$reference_documents[] = self::document( [
				'name' => $name,
			] );
		}
		foreach ( static::$action_documents as $name ) {
			$action_documents[] = self::actionDocument( [
				'name' => $name,
			] );
		}
		unset( $action_documents[ rand( 0, count( $action_documents ) - 1 ) ]['deadline_formatted'] );

		if ( simulation_arg_present( 'no-action-documents' ) ) {
			$action_documents = [];
		}
		if ( simulation_arg_present( 'no-reference-documents' ) ) {
			$reference_documents = [];
		}

		return [
			'reference_documents' => $reference_documents,
			'action_documents'    => $action_documents,
		];
	}

	public static function actionDocument( $overrides = [] ) {
		$faker = Factory::create();

		return array_merge( [
			'is_complete'        => $faker->boolean,
			'deadline_formatted' =>

				Carbon::createFromTimestamp( $faker->dateTimeBetween( '+2 days', '+1 month' )
				                                   ->getTimestamp() )
				      ->timezone( 'America/New_York' )
				      ->format( 'm/d/Y g:i A T' ),

		], self::document( $overrides ), $overrides );
	}

	public static function document( $overrides = [] ) {
		$faker = Factory::create();
		$name  = array_key_exists( 'name', $overrides ) ? $overrides['name'] : $faker->catchPhrase;

		return array_merge( [
			'id'   => abs( crc32( uniqid() ) ),
			'name' => $name,
			'url'  => sprintf( "https://placehold.it/720x480&text=%s+Document", urlencode( $name ) ),
		], $overrides );
	}
}