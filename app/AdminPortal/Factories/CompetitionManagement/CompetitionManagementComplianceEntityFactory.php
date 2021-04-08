<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 11/4/19
 * Time: 5:25 PM
 */

namespace App\AdminPortal\Factories\CompetitionManagement;

use App\AdminPortal\Factories\CheckInTeamCoachesFactory;
use Faker\Factory;

class CompetitionManagementComplianceEntityFactory {

	static $positions = [
		'coach_qualifying',
		'coach_nonqualifying',
		'coach_compete_usa',
		'coach_foreign',
		'team_service_personnel',
	];

	static $positions_labeled = [
		[
			'label' => 'Qualifying Coaches',
			'key'   => 'coach_qualifying',
		],
		[
			'label' => 'Nonqualifying Coaches',
			'key'   => 'coach_nonqualifying',
		],
		[
			'label' => 'Compete USA Coaches',
			'key'   => 'coach_compete_usa',
		],
		[
			'label' => 'Foreign Coaches',
			'key'   => 'coach_foreign',
		],
		[
			'label' => 'Team Service Personnel',
			'key'   => 'team_service_personnel',
		],
		[
			'label' => 'Optional Additional Position',
			'key'   => 'other',
		],
	];


	public static function mock( $overrides = [] ) {
		$faker     = Factory::create();
		$last_name = $faker->lastName;

		$first_name = $faker->firstName;

		$compliance = CheckInTeamCoachesFactory::compliance( $overrides );
		foreach ( $compliance as &$compliance_item ) {
			unset( $compliance_item['id'] );
			unset( $compliance_item['overridden'] );
		}
		unset( $overrides['force_compliance'] );

		$position = static::$positions_labeled[ rand( 0, count( static::$positions_labeled ) - 1 ) ];

		return array_merge( [

			'id'                 => abs( crc32( uniqid() ) ),
			'last_name'          => $last_name,
			'is_compliant'       => static::isCompliant( $compliance ),
			'first_name'         => $first_name,
			'full_name'          => sprintf( "%s %s", $first_name, $last_name ),
			'member_number'      => (string) $faker->numberBetween( 1000000, 9999999 ),
			'email_address'      => $faker->email,
			'phone_number'       => $faker->phoneNumber,
			'city'               => $faker->city,
			'state_abbreviation' => $faker->stateAbbr,
			'positions'          => [ $position ],
			'compliance_summary' => $compliance,

		], $overrides );
	}

	public static function mockList() {
		$mock[] = CompetitionManagementComplianceEntityFactory::mock( [
			'last_name'        => "Aaaronsen",
			'first_name'       => "Adam",
			'full_name'        => 'Adam Aaaronsen',
			'force_compliance' => true,
		] );
		$mock[] = CompetitionManagementComplianceEntityFactory::mock( [
			'last_name'        => "Aaaronson",
			'first_name'       => "Alina",
			'full_name'        => 'Alina Aaaronsen',
			'force_compliance' => false,
		] );
		foreach ( self::$positions as $position ) {
			$mock[] = CompetitionManagementComplianceEntityFactory::mock( [
				'position_keys' => [ $position ],
			] );
		}

		$amount = 20;
		if ( \simulation_arg_present( 'compliance_list_over_50' ) ) {
			$amount = 75;
		}

		for ( $i = 0; $i < $amount; $i ++ ) {
			$mock[] = CompetitionManagementComplianceEntityFactory::mock();
		}

		usort( $mock, function ( $item, $item2 ) {
			return strnatcmp( $item['last_name'], $item2['last_name'] );
		} );

		return $mock;
	}

	private static function isCompliant( array $compliance ) {
		foreach ( $compliance as $item ) {
			if ( ! $item['complete'] ) {
				return false;
			}
		}

		return true;
	}
}