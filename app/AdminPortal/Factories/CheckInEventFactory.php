<?php

namespace App\AdminPortal\Factories;

class CheckInEventFactory {

	/**
	 * Generate mock full list of event types with events
	 */
	public static function mock( $entity ) {
		$event_types = [ 'Intermediate Teams', 'Juvenile Teams', 'Music PPC Not Required' ];

		$result = [];

		for ( $i = 0; $i < count( $event_types ); $i ++ ) {
			$result[] = self::event( $entity, [
				'id'   => $i + 1,
				'name' => $event_types[ $i ],
			] );
		}

		return $result;
	}


	/**
	 * Generate mock CheckInEventData
	 */
	public static function event( $entity, $overrides ) {

		$faker         = \Faker\Factory::create();
		$segment_names = [ 'Free', 'Short' ];
		$segments      = [];
		$id            = array_key_exists( 'id', $overrides ) ? $overrides['id'] : $faker->randomNumber;

		for ( $i = 0; $i < count( $segment_names ); $i ++ ) {
			$segment_name    = $segment_names[ $i ];
			$event_overrides = [
				'event_id'       => $id,
				'id'             => $i + 1,
				'name'           => $segment_name,
				'music_required' => $overrides['name'] === 'Music PPC Not Required' ? false : true,
				'ppc_required'   => $overrides['name'] === 'Music PPC Not Required' ? false : true,
				'music_complete' => $overrides['name'] === 'Music PPC Not Required' ? false : $entity->events_complete === false ? $overrides['name'] !== 'Juvenile Teams' && $i == 1 : true,
				'ppc_complete'   => $overrides['name'] === 'Music PPC Not Required' ? false : $entity->events_complete === false ? $overrides['name'] !== 'Juvenile Teams' && $i == 0 : true,
			];
			$segments[]      = self::event_segment( $event_overrides );
		}

		return array_merge( [
			'id'       => $id,
			'name'     => $faker->catchPhrase,
			'segments' => $segments,

		], $overrides );
	}


	/**
	 * Generate a mock CheckInEventSegmentData
	 */
	public static function event_segment( $overrides ) {
		$faker = \Faker\Factory::create();

		$music_required  = in_array( 'music_required', $overrides ) ? $overrides['music_required'] : true;
		$ppc_required    = in_array( 'ppc_required', $overrides ) ? $overrides['ppc_required'] : true;
		$music_completed = ! $music_required ? false : in_array( 'music_complete', $overrides ) ? $overrides['music_complete'] : ( $music_required === true ? $faker->boolean : false );
		$ppc_completed   = ! $ppc_required ? false : in_array( 'ppc_complete', $overrides ) ? $overrides['ppc_complete'] : ( $ppc_required === true ? $faker->boolean : false );

		unset( $overrides['music_complete'] );
		unset( $overrides['ppc_complete'] );

		$music_status = [
			'completed'  => $music_completed,
			'overridden' => false,
		];

		$ppc_status = [
			'completed'  => $ppc_completed,
			'overridden' => false,
		];

		return array_merge( [
			'event_id'     => $faker->randomNumber,
			'id'           => $faker->randomNumber,
			'name'         => $faker->word,
			'music'        => $music_completed ? self::music() : null,
			'music_status' => $music_status,
			'ppc'          => $ppc_completed ? self::ppc() : [],
			'ppc_status'   => $ppc_status,
		], $overrides, compact( 'music_required', 'ppc_required', 'music_status', 'ppc_status' ) );

	}


	/**
	 * Generate mock saved music data
	 */
	public static function music() {
		$options = json_decode( file_get_contents( __DIR__ . '/../../Data/SavedMusic.json' ), true );
		$music   = $options[ rand( 0, count( $options ) - 1 ) ];

		return array_merge( [
			'copyrights' => null,

		], $music );
	}


	/**
	 * Generate mock PPC Summary Data
	 */
	public static function ppc() {
		$options = array_values( json_decode( file_get_contents( __DIR__ . '/../../Data/PPCOptions.json' ), true )['elements'] );

		return array_map( function () use ( $options ) {
			$code = null;
			while ( $code == null ) {
				$code = $options[ rand( 0, count( $options ) - 1 ) ]['code'];
			}

			return $code;
		}, array_fill( 0, rand( 5, 10 ), 1 ) );
	}
}