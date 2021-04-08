<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 10/26/19
 * Time: 9:38 AM
 */

namespace App\AdminPortal\Factories;

class CheckInEntityFactory {

	static $roles = [
		'coach',
		'competition_contact',
		'official',
		'skater',
		'team',
		'team_coach',
		'team_personnel',
		'volunteer',
	];

	static $compliance_entities = [
		'coach',
		'competition_contact',
		'official',
		'team_coach',
		'team_personnel',
		'volunteer',
	];


	private $current_id = 1;

	/**
	 * CheckInEntityFactory constructor.
	 */
	public function __construct() {
		$this->faker = \Faker\Factory::create();
	}

	public static function entity_list( $count = 10 ) {
		$factory = new self();
		$result  = [];

		$result = self::roles( $factory, $result );
		if ( \simulation_arg_present( 'only_test_checkin_roles' ) ) {
			return self::sortResult( $result );
		}

		$result = self::eligibility( $factory, $result );
		$result = self::representation( $factory, $result );
		$result = self::membership( $factory, $result );
		$result = self::eventsAndFees( $factory, $result );
		$result = self::comments( $factory, $result );

		$result = self::random( $factory, $result );

		return self::sortResult( $result );
	}


	public static function check_in_status( $overrides ) {
		$faker      = \Faker\Factory::create();
		$checked_in = array_key_exists( 'checked_in', $overrides ) ? $overrides['checked_in'] : $faker->boolean;
		unset( $overrides['checked_in'] );

		$check_in_datetime = $faker->dateTimeBetween( "-3 days", "-5 minutes" )
		                           ->setTimezone( new \DateTimeZone( 'MDT' ) )
		                           ->format( 'n/j/Y g:ia' );

		return array_merge( [
			'checked_in'                     => $checked_in,
			'checked_in_by'                  => $checked_in ? $faker->name : null,
			'checked_in_date_time_formatted' => $checked_in ? $check_in_datetime : null,
			'credential_received'            => $checked_in,
			'unpaid_fees_received'           => $checked_in,
		], $overrides );
	}


	protected static function sortResult( $result ) {
		usort( $result, function ( $item, $item2 ) {
			$str1 = explode( ' ', $item['name'] )[1];
			$str2 = explode( ' ', $item2['name'] )[1];

			return strnatcmp( $str1, $str2 );
		} );

		return $result;
	}

	/**
	 * @param $factory
	 * @param $result
	 *
	 * @return array
	 */
	protected static function eligibility( $factory, $result ) {
		$result[] = $factory->base( [
			'name'       => 'Eligible TestCheckedIn',
			'checked_in' => true,
			'eligible'   => true,
		] );
		$result[] = $factory->base( [
			'name'       => 'Ineligible TestCheckedIn',
			'checked_in' => true,
			'eligible'   => false,
		] );
		$result[] = $factory->base( [
			'name'       => 'Ineligible Test',
			'checked_in' => false,
			'eligible'   => false,
		] );

		return $result;
	}

	/**
	 * @param $factory
	 * @param $result
	 *
	 * @return array
	 */
	protected static function representation( $factory, $result ) {
// not checked in club
		$result[] = $factory->base( [
			'name'       => 'Club TestRepresentation',
			'checked_in' => false,
			'eligible'   => true,
			'club'       => true,
		] );
		// not checked in LTS
		$result[] = $factory->base( [
			'name'       => 'Program TestRepresentation',
			'checked_in' => false,
			'eligible'   => true,
			'club'       => false,
		] );
		$result[] = $factory->base( [
			'name'       => 'No TestRepresentation',
			'checked_in' => false,
			'eligible'   => true,
			'club'       => false,
			'lts'        => false,
		] );

		return $result;
	}

	/**
	 * @param $factory
	 * @param $result
	 *
	 * @return array
	 */
	protected static function eventsAndFees( $factory, $result ) {
		$result[] = $factory->base( [
			'name'            => 'Events TestUnpaid',
			'checked_in'      => false,
			'eligible'        => true,
			'unpaid_events'   => true,
			'unpaid_fees'     => false,
			'entity_type_key' => 'skater',
		] );
		$result[] = $factory->base( [
			'name'            => 'Fees TestUnpaid',
			'checked_in'      => false,
			'eligible'        => true,
			'unpaid_fees'     => true,
			'unpaid_events'   => false,
			'entity_type_key' => 'skater',
		] );

		$result[] = $factory->base( [
			'name'            => 'FeesEvents TestUnpaid',
			'checked_in'      => false,
			'eligible'        => true,
			'unpaid_events'   => true,
			'unpaid_fees'     => true,
			'entity_type_key' => 'team',
		] );

		return $result;
	}

	/**
	 * @param $factory
	 * @param $result
	 *
	 * @return array
	 */
	protected static function comments( $factory, $result ) {
		$result[] = $factory->base( [
			'name'          => 'No TestComments',
			'checked_in'    => false,
			'eligible'      => true,
			'comment_count' => 0,
		] );
		$result[] = $factory->base( [
			'name'          => 'Has TestComments',
			'checked_in'    => false,
			'eligible'      => true,
			'comment_count' => rand( 10, 20 ),
		] );

		return $result;
	}

	/**
	 * @param $factory
	 * @param $result
	 *
	 * @return array
	 */
	protected static function membership( $factory, $result ) {
		$result[] = $factory->base( [
			'name'       => 'Expired TestTest',
			'checked_in' => false,
			'eligible'   => true,
			'active'     => false,
		] );

		return $result;
	}

	/**
	 * @param $factory
	 * @param $result
	 *
	 * @return array
	 */
	protected static function roles( $factory, $result ) {
		foreach ( self::$roles as $i => $role ) {
			$base_entity_mock_args = [
				'checked_in'      => false,
				'eligible'        => true,
				'unpaid_fees'     => false,
				'unpaid_events'   => false,
				'active'          => true,
				'entity_type_key' => $role,
			];

			if ( \simulation_arg_present( 'only_test_checkin_roles' ) ) {
				$name = "Test " . str_replace( ' ', '', ucwords( str_replace( '_', ' ', $role ) ) );

				$result[] = $factory->base( array_merge( $base_entity_mock_args, [
					'name' => $name,
				] ) );

				continue;
			}

			if ( in_array( $role, self::$compliance_entities ) ) {
				$name     = str_replace( ' ', '', ucwords( str_replace( '_', ' ', $role ) ) );
				$result[] = $factory->base( array_merge( $base_entity_mock_args, [
					'name'         => 'Complete Test' . $name,
					'is_compliant' => true,
					'skater_count' => rand( 3, 12 ),

				] ) );
				$result[] = $factory->base( array_merge( $base_entity_mock_args, [
					'name'         => 'Incomplete Test' . $name,
					'is_compliant' => false,
				] ) );
			}

			if ( $role === 'coach' ) {

				$result[] = $factory->base( array_merge( $base_entity_mock_args, [
					'name'         => 'NoSkaters TestCoach',
					'is_compliant' => true,
					'skater_count' => 0,
				] ) );
			}

			if ( $role === 'skater' ) {

				$result[] = $factory->base( array_merge( $base_entity_mock_args, [
					'name'            => 'Complete TestSkater',
					'events_complete' => true,

				] ) );
				$result[] = $factory->base( array_merge( $base_entity_mock_args, [
					'name'            => 'Incomplete TestSkater',
					'events_complete' => false,
				] ) );

			}
			if ( $role === 'team' ) {
				$result[] = $factory->base( array_merge( $base_entity_mock_args, [
					'name'            => 'Complete TestTeam',
					'events_complete' => true,

				] ) );
				$result[] = $factory->base( array_merge( $base_entity_mock_args, [
					'name'            => 'Incomplete TestTeam',
					'events_complete' => false,
				] ) );
			}


		}

		return $result;
	}

	/**
	 * @param $factory
	 * @param $result
	 *
	 * @return array
	 */
	protected static function random( $factory, $result ) {
		if ( ! \simulation_arg_present( 'only_test_checkin_entities' ) ) {

			for ( $i = 0; $i < 50; $i ++ ) {
				$result[] = $factory->base();
			}
		}

		return $result;
	}

	public function base( $override = [] ) {
		$faker  = \Faker\Factory::create();
		$clubs  = json_decode( file_get_contents( __DIR__ . "/../../Data/FormOptions.json" ), true )['clubs'];
		$events = [
			"PrePreliminary Girls Free Skate",
			"PrePreliminary Light Entertainment",
			"Championship Masters Junior-Senior Ladies",
			"Adult Silver Duets Pattern Dance",
			"Masters Junior-Senior Ladies II",
			"Masters Dramatic Entertainment II",
			'Juvenile Girls SP',
		];
		$roles  = self::$roles;
		for ( $i = 0; $i < rand( 1, 3 ); $i ++ ) {
			$unpaid_events_value[] = $events[ rand( 0, count( $events ) - 1 ) ];
		}
		array_unique( $unpaid_events_value );

		$member_active = array_key_exists( 'active', $override ) ? $override['active'] : $faker->numberBetween( 1, 10 ) !== 4;
		$include_club  = array_key_exists( 'club', $override ) ? $override['club'] : $faker->boolean;
		$unpaid_fees   = array_key_exists( 'unpaid_fees', $override ) ? $override['unpaid_fees'] : $faker->numberBetween( 1, 10 ) === 4;
		$unpaid_events = array_key_exists( 'unpaid_events', $override ) ? $override['unpaid_events'] : $faker->numberBetween( 1, 10 ) === 4;
		$name          = array_key_exists( 'name', $override ) ? $override['name'] : sprintf( "%s %s", $faker->firstName, $faker->lastName );
		$include_lts   = array_key_exists( 'lts', $override ) ? $override['lts'] : ! $include_club;
		unset( $override['club'] );
		unset( $override['active'] );
		unset( $override['unpaid_fees'] );
		unset( $override['unpaid_events'] );
		unset( $override['lts'] );


		$role      = $roles[ rand( 0, count( $roles ) - 1 ) ];
		$club_name = preg_replace( '/\s\([0-9]*\)/', "", $clubs[ $faker->numberBetween( 0, count( $clubs ) - 1 ) ]['label'] );

		$check_in_status = self::check_in_status( $override );


		return $this->cleanUpEntity( array_merge( [
			/**
			 * BASE
			 */
			'check_in_status'              => $check_in_status,
			'club'                         => $include_club ? $club_name : null,
			'comment_count'                => $faker->numberBetween( 0, 10 ),
			'eligible'                     => $faker->numberBetween( 1, 10 ) !== 4,
			'id'                           => (string) $this->current_id ++,
			'lts_program'                  => $include_lts ? $faker->catchPhrase : null,
			'member_number'                => (string) $faker->numberBetween( 1000000, 9999999 ),
			'name'                         => $name,
			'membership_status'            => [
				'active'                  => $member_active,
				'validity_date_formatted' => $member_active ? $this->futureDate()
				                                                   ->format( 'n/j/y' ) : null,
			],
			'entity_type_key'              => $role,
			/**
			 * NON-BASE
			 */
			'email'                        => $faker->email,
			'personal_schedule_url'        => "https://placehold.it/500x500&text=Schedule+For+" . $name,
			'phone'                        => $faker->phoneNumber,
			"is_compliant"                 => $check_in_status['checked_in']?:$faker->boolean,
			'roster_count'                 => $faker->numberBetween( 4, 10 ),
			'events_complete'              => $check_in_status['checked_in']?:$faker->boolean,
			'skater_count'                 => $faker->numberBetween( 4, 10 ),
			'coach_count'                  => $faker->numberBetween( 1, 3 ),
			'team_service_personnel_count' => $faker->numberBetween( 1, 3 ),
			'outstanding_fees'             => $check_in_status['checked_in']?[]:($unpaid_fees ? $this->outstanding_fees() : []),
			'unpaid_events'                => $check_in_status['checked_in']?[]:($unpaid_events ? $unpaid_events_value : []),
			// 'roster_valid'                 => true, //$faker->boolean,
			'team_level'                   => sprintf( "Level %s", rand( 1, 4 ) ),
		], $override ) );

	}

	/**
	 * @return string
	 */
	private function futureDate() {
		return $this->faker->dateTimeBetween( 'now', '+1 year' )
		                   ->setTimezone( new \DateTimeZone( 'MDT' ) );
	}

	private function outstanding_fees() {
		return [
			[
				'name'   => 'PPC Late Fee',
				'amount' => '10.00',
			],
			[
				'name'   => 'Music Late Fee',
				'amount' => '10.00',
			],
		];
	}

	private function cleanUpEntity( array $entity_def ) {
		$contact_entities      = [
			'coach',
			'competition_contact',
			'official',
			'team_coach',
			'team_personnel',
			'volunteer',
		];
		$schedule_entities     = [ 'coach', 'skater', 'team_coach', 'volunteer' ];
		$compliance_entities   = self::$compliance_entities;
		$roster_entities       = [ 'team' ];
		$events_entities       = [ 'team', 'skater' ];
		$skater_entities       = [ 'coach' ];
		$coache_entities       = [ 'team', 'skater' ];
		$tsp_entities          = [ 'team' ];
		$fee_entities          = [ 'team', 'skater' ];
		$unpaid_event_entities = [ 'team', 'skater' ];

		if ( ! in_array( $entity_def['entity_type_key'], $contact_entities ) ) {
			unset( $entity_def['email'] );
			unset( $entity_def['phone'] );
		}

		if ( ! in_array( $entity_def['entity_type_key'], $schedule_entities ) ) {
			unset( $entity_def['personal_schedule_url'] );
		}

		if ( ! in_array( $entity_def['entity_type_key'], $compliance_entities ) ) {
			unset( $entity_def['is_compliant'] );
		}

		if ( ! in_array( $entity_def['entity_type_key'], $roster_entities ) ) {
			unset( $entity_def['roster_count'] );
			// unset( $entity_def['roster_valid'] );
		}

		if ( ! in_array( $entity_def['entity_type_key'], $events_entities ) ) {
			unset( $entity_def['events_complete'] );
		}

		if ( ! in_array( $entity_def['entity_type_key'], $skater_entities ) ) {
			unset( $entity_def['skater_count'] );
		}

		if ( ! in_array( $entity_def['entity_type_key'], $coache_entities ) ) {
			unset( $entity_def['coach_count'] );
		}

		if ( ! in_array( $entity_def['entity_type_key'], $tsp_entities ) ) {
			unset( $entity_def['team_service_personnel_count'] );
		}

		if ( ! in_array( $entity_def['entity_type_key'], $fee_entities ) ) {
			unset( $entity_def['outstanding_fees'] );
		}

		if ( ! in_array( $entity_def['entity_type_key'], $unpaid_event_entities ) ) {
			unset( $entity_def['unpaid_events'] );
		}

		if ( ! in_array( $entity_def['entity_type_key'], [ 'team' ] ) ) {
			unset( $entity_def['team_level'] );
		}

		return $entity_def;
	}
}