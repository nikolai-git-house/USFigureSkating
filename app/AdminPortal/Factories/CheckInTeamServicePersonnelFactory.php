<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 10/26/19
 * Time: 3:19 PM
 */

namespace App\AdminPortal\Factories;

/**
 * Factory to generate a mock FetchEntityTeamServicePersonnelInformationAPIResponse
 */
class CheckInTeamServicePersonnelFactory extends AbstractAssignableRosterFactory {

	protected function getEntityAssignedCount( $entity ) {
		return $entity->team_service_personnel_count;
	}


	protected function getComplianceItems() {
		return [
			'Background Check',
			'SafeSport',
		];
	}


	protected function getResponseIdsKey() {
		return 'competition_team_service_personnel_ids';
	}


	protected function getResponseRosterKey() {
		return 'team_service_personnel';
	}


	protected function getUniqueMockData( $overrides ) {
		return [
			'team_role'     => 'Team Physician',
			'email_address' => $this->faker->email,
			'phone_number'  => $this->faker->phoneNumber,
		];
	}
}