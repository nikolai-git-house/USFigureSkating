<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 10/30/19
 * Time: 3:58 PM
 */

namespace App\AdminPortal\Factories;

use Faker\Factory;

class CheckInEmailTargetFactory {
	public static function mock() {
		$cc         = [];
		$faker      = Factory::create();
		$categories = [
			[
				'name'  => 'All Competition Contacts',
				'roles' => [ 'Chair', 'Co Chair 2', 'Treasurer', 'Compliance Monitor', 'Music Chair' ],
			],
			[
				'name'  => 'All Key Officials',
				'roles' => [ 'Chief Referee', 'Chief Accountant', 'Technical Accountant' ],
			],
		];

		$cc = array_map( function ( $item ) use ( $faker ) {

			return [
				'label'   => $item['name'],
				'value'   => strtolower( str_replace( ' ', '_', $item['name'] ) ),
				'options' => array_map( function ( $role ) use ( $faker ) {
					return [
						'label' => $faker->name,
						'value' => (string) $faker->randomNumber(),
						'role'  => $role,
					];
				}, $item['roles'] ),
			];


		}, $categories );

		$bcc = [
			[
				'label'   => 'All Participants',
				'value'   => 'all_participants',
				'options' => [
					[
						'label' => 'Checked-In',
						'value' => 'checked_in',
					],
					[
						'label' => 'Not Checked-In',
						'value' => 'not_checked_in',
					],
					[
						'label' => 'Ineligible',
						'value' => 'ineligible',
					],
				],
			],
		];

		return compact( 'cc', 'bcc' );
	}
}