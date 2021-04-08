<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 10/25/19
 * Time: 6:12 PM
 */

namespace App\AdminPortal;

use App\AdminPortal\Factories\CheckInCommentsFactory;
use App\AdminPortal\Factories\CheckInEmailTargetFactory;
use App\AdminPortal\Factories\CheckInEntityFactory;

class CheckIn {

	private static $session_storage_key = "check_in";

	public $comments = [];

	public $compliance = null;

	public $entities = null;

	public $roster = null;

	public $events = null;

	public $skater_coaches = null;

	public $skaters = null;

	public $team_service_personnel = null;

	public $team_coaches = null;

	public $search_results = null;


	/**
	 * CheckIn constructor.
	 */
	public function __construct( $properties = false ) {
		if ( $properties ) {
			foreach ( $properties as $property => $value ) {
				if ( property_exists( $this, $property ) ) {
					$this->$property = $value;
				}
			}

		}
		if ( ! $this->entities ) {
			$this->entities = CheckInEntityFactory::entity_list( 30 );

		}
	}


	public static function getCurrent() {
		if ( array_key_exists( self::$session_storage_key, $_SESSION ) ) {
			return self::fromJSON( json_decode( $_SESSION[ self::$session_storage_key ], true ) );
		}

		return new self( (object) [] );
	}


	private static function fromJSON( $json_decode ) {
		return new self( $json_decode );
	}


	public function cache() {
		$_SESSION[ self::$session_storage_key ] = json_encode( $this );
	}

	public function findEntity( $check_in_entity_id ) {

		foreach ( $this->entities as $entity ) {

			if ( $entity['id'] === $check_in_entity_id ) {
				return $entity;
			}
		}

		return [
			'comment_count'                => 4,
			'is_compliant'                 => false,
			'role_key'                     => 'skater',//'team_personnel',
			'roster_count'                 => 2,
			'events_complete'              => false,
			'skater_count'                 => 5,
			'coach_count'                  => 3,
			'team_service_personnel_count' => 3,
		];
	}


	public function updateCompliance( $data ) {
		// No Mock API action required
	}


	public function addSkaterCoach( $data ) {
		$coach = \App\AdminPortal\Factories\CheckInSkaterCoachesFactory::coach();
		foreach ( $this->search_results as $result ) {
			if ( $result['id'] === $data->coach_id ) {
				$coach = \App\AdminPortal\Factories\CheckInSkaterCoachesFactory::coach( (array) $result );
			}
		}

		return $coach;
	}


	public function removeSkaterCoach( $data ) {
		// Mock API action not needed
	}


	public function replaceSkaterCoach( $data ) {
		$coach = \App\AdminPortal\Factories\CheckInSkaterCoachesFactory::coach();
		foreach ( $this->search_results as $result ) {
			if ( $result['id'] === $data->coach_id ) {
				$coach = \App\AdminPortal\Factories\CheckInSkaterCoachesFactory::coach( (array) $result );
			}
		}

		return $coach;
	}


	public function updateEventMusic( $data ) {
		// Mock API action not needed
	}


	public function updateEventPPC( $data ) {
		// Mock API action not needed
	}


	public function updateRoster( $data ) {
		// Mock API action not needed
	}


	public function updateTeamServicePersonnel( $data ) {
		// Mock API action not needed
	}


	public function updateTeamCoaches( $data ) {
		// Mock API action not needed
	}


	public function addComment( $data ) {
		array_unshift( $this->comments, CheckInCommentsFactory::generateCurrentComment( [
			'comment' => $data->comment,
		] ) );

		return $this->comments[0];
	}


	public function coachSearch( $data ) {
		$search               = new \App\Search( $data, false );
		$this->search_results = $search->results;

		return $search->results;
	}


	public function checkEntityIn( $check_in_entity_id ) {
		return CheckInEntityFactory::check_in_status( [
			'checked_in'                     => true,
			'checked_in_date_time_formatted' => $date = \Carbon\Carbon::now()
			                                                          ->timezone( 'America/Denver' )
			                                                          ->format( 'n/j/Y g:ia' ),
		] );
	}


	public function undoCheckEntityIn( $check_in_entity_id ) {
		// Mock API action not needed
	}

	public function getEmailTargets() {
		return array_merge( CheckInEmailTargetFactory::mock(), [
			'attachment_rules' => \App\AdminPortal\Factories\AttachmentRulesFactory::mock(),
		] );
	}

	public function submitEmail( array $compact ) {
		// Mock API action not needed
	}
}