<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 10/26/19
 * Time: 10:24 AM
 */

namespace App\AdminPortal\Factories;

class CheckInRosterFactory extends AbstractAssignableRosterFactory {

	protected function getEntityAssignedCount( $entity ) {
		return $entity->roster_count;
	}


	protected function getComplianceItems() {
		return [
			'SafeSport Training',
			'Background Check',
		];
	}


	protected function getResponseIdsKey() {
		return 'competition_roster_skater_ids';
	}


	protected function getResponseRosterKey() {
		return 'team_roster';
	}


	protected function getUniqueMockData( $overrides ) {
		return [
			'age'                  => $this->faker->numberBetween( 6, 25 ),
			'requirements_summary' => $this->generateCompliance( [
				'Age Verified',
				'Waivers',
				'Medical',
			], $overrides ),
		];
	}

	protected function addComplianceDescriptions( array $mock ) {

		foreach ( $mock['compliance_summary'] as $index => &$compliance ) {
			if ( $index === 0 ) {
				$compliance['status_description'] = $compliance["complete"] ? "Yes" : "No";
			} else {
				$compliance['status_description'] = $compliance["complete"] ? "Complete" : "Incomplete";
			}

		}
		foreach ( $mock['requirements_summary'] as $index => &$compliance ) {
			if ( $index === 0 ) {
				$compliance['status_description'] = $compliance["complete"] ? "Yes" : "No";
			} else {
				$compliance['status_description'] = $compliance["complete"] ? "Complete" : "Incomplete";
			}
		}

		return $mock;
	}

}