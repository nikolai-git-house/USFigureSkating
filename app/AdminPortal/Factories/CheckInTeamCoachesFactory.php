<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 10/26/19
 * Time: 3:18 PM
 */

namespace App\AdminPortal\Factories;

class CheckInTeamCoachesFactory extends AbstractAssignableRosterFactory {

	public static function compliance( $overrides = [] ) {
		$instance = new self();

		return $instance->generateCompliance( $instance->getComplianceItems(), $overrides );
	}


	protected function getEntityAssignedCount( $entity ) {
		return $entity->coach_count;
	}


	protected function getComplianceItems() {
		return [
			'Background Check',
			'Membership',
			'Coach Code of Ethics',
			'PSA',
			'CER',
			'SafeSport',
			'Liability Insurance',
		];
	}


	protected function getResponseIdsKey() {
		return 'competition_coach_ids';
	}


	protected function getResponseRosterKey() {
		return 'team_coaches';
	}


	protected function getUniqueMockData( $overrides ) {
		return [
			'email_address' => $this->faker->email,
			'phone_number'  => $this->faker->phoneNumber,
		];
	}
}