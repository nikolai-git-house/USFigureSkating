<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 11/9/19
 * Time: 1:00 PM
 */

namespace App\AdminPortal\Factories\CompetitionManagement;

use Faker\Factory;

class CompetitionManagementContactFactory {

	public static $contact_roles = [
		[
			'label' => 'Chair',
			'key'   => 'cr1',
		],
		[
			'label' => 'Contact Role 2',
			'key'   => 'cr2',
		],
		[
			'label' => 'Contact Role 3',
			'key'   => 'cr3',
		],
		[
			'label' => 'Contact Role 4',
			'key'   => 'cr4',
		],
		[
			'label' => 'Contact Role 5',
			'key'   => 'cr5',
		],
	];

	public static $official_roles = [
		[
			'label' => 'Official Role 1',
			'key'   => 'off1',
		],
		[
			'label' => 'Official Role 2',
			'key'   => 'off2',
		],
		[
			'label' => 'Official Role 3',
			'key'   => 'off3',
		],
		[
			'label' => 'Official Role 4',
			'key'   => 'off4',
		],
	];


	public static function lists() {
		$contacts      = [];
		$source_index  = 0;
		$contact_count = 20;
		$official_count = 20;
		if ( \simulation_arg_present( 'contacts_list_over_50' ) ) {
			$contact_count = 75;
			$official_count = 75;
		}
		for ( $i = 0; $i < $contact_count; $i ++ ) {
			$source_index += 2;
			$contacts[]   = self::contact( [

			] );
		}
		$officials      = [];
		for ( $i = 0; $i < $official_count; $i ++ ) {
			$source_index += 2;
			$officials[]  = self::official( [

			] );
		}

        return (object) [
            'contacts'           => $contacts,
            'officials'          => $officials,
            'required_positions' => [
                'contacts'  => [ 'cr1' ],
                // 'officials' => [ 'off1' ]
            ]
        ];
	}

	public static function contact( $overrides = [] ) {
		$faker = Factory::create();

		return (object) array_merge( [
			'email_address' => $faker->email,
			'first_name'    => $faker->firstName,
			'id'            => abs( crc32( uniqid() ) ),
			'is_compliant'  => $faker->boolean,
			'is_display'    => $faker->boolean,
			'last_name'     => $faker->lastName,
			'member_number' => $faker->numberBetween( 100000, 999999 ),
			'phone_number'  => $faker->phoneNumber,
			'position'      => (object) self::$contact_roles[ rand( 0, count( self::$contact_roles ) - 1 ) ],
		], $overrides );
	}

	public static function official( $overrides = [] ) {
		$faker = Factory::create();

		return (object) array_merge( [
			'email_address' => $faker->email,
			'first_name'    => $faker->firstName,
			'id'            => abs( crc32( uniqid() ) ),
			'is_compliant'  => $faker->boolean,
			'is_display'    => $faker->boolean,
			'last_name'     => $faker->lastName,
			'member_number' => $faker->numberBetween( 100000, 999999 ),
			'phone_number'  => $faker->phoneNumber,
			'position'      => (object) self::$official_roles[ rand( 0, count( self::$official_roles ) - 1 ) ],
		], $overrides );
	}


	public static function mockAddSearch( $data, $result ) {
		$position = self::findPosition( $data->position, $data->type );
		$params   = [
			'first_name'    => $result->first_name,
			'last_name'     => $result->last_name,
			'member_number' => $result->member_number,
		];
		if ( $position ) {
			$params['position'] = $position;
		}
		$method = $data->type;

		return self::$method( $params );

	}

	private static function findPosition( $position_key, $type ) {
		$source = self::$contact_roles;
		if ( $type === 'official' ) {
			$source = self::$official_roles;
		}
		foreach ( $source as $item ) {
			if ( $item['key'] === $position_key ) {
				return $item;
			}
		}

		return null;
	}

}