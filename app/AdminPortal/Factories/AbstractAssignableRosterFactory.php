<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 10/27/19
 * Time: 9:46 AM
 */

namespace App\AdminPortal\Factories;

use Faker\Factory;

abstract class AbstractAssignableRosterFactory {

	protected $roster_ids = [];

	protected $roster = [];

	protected $current_id = 1;

	protected $faker;


	/**
	 * CheckInTeamServicePersonnelFactory constructor.
	 */
	public function __construct() {
		$this->faker = Factory::create();
	}


	public static function mock( $entity ) {
		$instance = new static();

		return $instance->generate( $instance->getEntityAssignedCount( $entity ) );

	}


	public function generateEntity( $overrides ) {
		$faker      = $this->faker;
		$first_name = $faker->firstName;
		$last_name  = $faker->lastName;
		$mock       = array_merge( [
			'can_be_added_to_roster'           => rand( 1, 4 ) !== 1,
			'cannot_be_added_to_roster_reason' => "Not a Member",
			'compliance_summary'               => $this->generateCompliance( $this->getComplianceItems(), $overrides ),
			'first_name'                       => $first_name,
			'full_name'                        => sprintf( "%s %s", $first_name, $last_name ),
			'id'                               => $this->current_id ++,
			'last_name'                        => $last_name,
			'member_number'                    => (string) $faker->numberBetween( 1000000, 9999999 ),
		], $this->getUniqueMockData( $overrides ), $overrides );

		$mock = $this->addComplianceDescriptions( $mock );

		$mock = $this->removeConstructionProperties( $mock );

		return $mock;
	}


	protected function generate( $roster_count ) {

		$to_be_added = $this->createAndAssignRequiredMembers( $roster_count );
		/**
		 * Ensure roster is filled out with entities that can be added
		 */
		while ( $to_be_added > 0 ) {
			$entity             = $this->generateEntity( [
				'can_be_added_to_roster' => true,
			] );
			$this->roster[]     = $entity;
			$this->roster_ids[] = $entity['id'];
			$to_be_added --;
		}

		$additional_members = rand( 10, 40 );
		/**
		 * Full out the full roster
		 */
		for ( $i = 0; $i < $additional_members; $i ++ ) {
			$entity         = $this->generateEntity( [] );
			$this->roster[] = $entity;
		}

		usort( $this->roster, function ( $item, $item2 ) {
			return strnatcmp( $item['last_name'], $item2['last_name'] );
		} );

		$arr = [
			$this->getResponseIdsKey()    => $this->roster_ids,
			$this->getResponseRosterKey() => $this->roster,
		];

		return $arr;
	}


	/**
	 * Add required members to roster and selected roster.
	 *
	 * Add a compliance and non-compliant member that can be assigned to the roster
	 */
	protected function createAndAssignRequiredMembers( $to_be_added ) {
		/**
		 * Ensure a compliant entity that can be added to the roster is added to roster and comp roster
		 */
		if ( $to_be_added > 0 ) {
			$entity             = $this->generateEntity( [
				'force_compliance'       => true,
				'can_be_added_to_roster' => true,
			] );
			$this->roster[]     = $entity;
			$this->roster_ids[] = $entity['id'];
			$to_be_added --;
		}
		/**
		 * Ensure a non-compliant entity that can be added to the roster is added to roster and comp roster
		 */
		if ( $to_be_added > 0 ) {
			$entity             = $this->generateEntity( [
				'force_compliance'       => false,
				'can_be_added_to_roster' => true,
			] );
			$this->roster[]     = $entity;
			$this->roster_ids[] = $entity['id'];
			$to_be_added --;
		}

		return $to_be_added;
	}


	/**
	 * @param $overrides
	 *
	 * @return array
	 */
	protected function generateCompliance( $items, $overrides ) {
		$force_compliance = array_key_exists( 'force_compliance', $overrides ) ? $overrides['force_compliance'] : null;

		$compliance_summary = [];

		foreach ( $items as $index => $item ) {
			$item_complete = $force_compliance !== null ? $force_compliance : $this->faker->boolean;
			if ( $index > 0 ) {
				$item_complete = $force_compliance === true ? true : $this->faker->boolean;
			}
			$compliance_summary[] = [
				'id'         => $index + 1,
				'name'       => $item,
				'complete'   => $item_complete,
				'overridden' => false,
			];
		}

		return $compliance_summary;
	}


	protected function removeConstructionProperties( $mock ) {
		unset( $mock['force_compliance'] );

		return $mock;
	}


	abstract protected function getUniqueMockData( $overrides );


	abstract protected function getComplianceItems();


	abstract protected function getResponseIdsKey();


	abstract protected function getResponseRosterKey();


	abstract protected function getEntityAssignedCount( $entity );

	protected function addComplianceDescriptions( array $mock ) {
		return $mock;
	}


}