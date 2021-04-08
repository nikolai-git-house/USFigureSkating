<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 9/20/19
 * Time: 1:52 PM
 */

namespace App\AdminPortal\CompetitionManagement;

use App\AdminPortal\Factories\CheckInEmailTargetFactory;
use App\AdminPortal\Factories\CompetitionManagement\CompetitionManagementCompetitionFactory;
use App\AdminPortal\Factories\CompetitionManagement\CompetitionManagementCompetitionInformationFactory;
use App\AdminPortal\Factories\CompetitionManagement\CompetitionManagementComplianceEntityFactory;

class CompetitionManagement {
	private static $session_storage_key = "competition_management";
	public $competition_lists;
	protected $compliance;

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

		if ( ! $this->competition_lists ) {
			$this->competition_lists = self::getCompetitionsLists();
		}
		if ( ! $this->compliance ) {
			$this->compliance = CompetitionManagementComplianceEntityFactory::mockList();
		}
	}

	public static function getCurrent() {
		if ( array_key_exists( self::$session_storage_key, $_SESSION ) ) {
			return self::fromJSON( json_decode( $_SESSION[ self::$session_storage_key ] ) );
		}

		return new self( (object) [] );

	}

	/**
	 * Get competitions lists (past and upcoming) for Competition Management Home Page
	 */
	public static function getCompetitionsLists() {
		list( $competitions_data_upcoming, $competitions_data_past ) = CompetitionManagementCompetitionFactory::lists();

		return (object) [
			'upcoming' => $competitions_data_upcoming,
			'past'     => $competitions_data_past,
		];
	}

	private static function fromJSON( $json_decode ) {
		return new self( $json_decode );
	}

	public function cache() {
		$_SESSION[ self::$session_storage_key ] = json_encode( $this );
	}

	public function findCompetition( $id ) {
		foreach ( $this->competition_lists as $list ) {
			foreach ( $list as $comp ) {
				if ( (int) $comp->id === (int) $id ) {
					return $comp;
				}
			}
		}

		return null;
	}

	public function getActive() {
		try {
			$url   = array_key_exists( 'HTTP_REFERER', $_SERVER ) ? $_SERVER['HTTP_REFERER'] : '';
			$match = [];
			preg_match( '/competition-management\/([0-9]+)/', $url, $match );
			if ( count( $match ) < 2 ) {
				$id = 1;
			} else {
				$id = $match[1];
			}
			$competition = $this->findCompetition( $id );
			if ( ! $competition ) {
				throw new \Exception( 'couldn\'t find competition by id' );
			}

			return $this->appendCompetitionIndexLinks( $competition );

		} catch ( \Exception $e ) {

		}
		http_response_code( 500 );

		return null;

	}

	public function getIndexLists() {
		return [
			'upcoming' => array_map( function ( $item ) {
				unset( $item->directions );
				unset( $item->website_url );
				unset( $item->announcement_url );
				unset( $item->check_in_report_url );
				unset( $item->team_roster_can_be_edited );
				unset( $item->team_roster_rules );

				return $item;
			}, $this->competition_lists->upcoming ),
			'past'     => array_map( function ( $item ) {
				unset( $item->directions );
				unset( $item->website_url );
				unset( $item->announcement_url );
				unset( $item->check_in_report_url );
				unset( $item->team_roster_can_be_edited );
				unset( $item->team_roster_rules );

				return $item;
			}, $this->competition_lists->past ),
		];
	}

	public function getInformation( $id ) {
		$active = $this->findCompetition( $id );

		$factory = new CompetitionManagementCompetitionInformationFactory( $active );

		$mock = $factory->mock();
		if ( simulation_arg_present( 'no_volunteer_timeline' ) ) {
			$mock['volunteers']['windows'] = [];
		}

		return $mock;
	}

	public function getCompliance() {
		return $this->compliance;
	}

	public function getComplianceEmailOptions() {
		$result = CheckInEmailTargetFactory::mock();

		return [
			'cc'               => $result['cc'],
			'attachment_rules' => \App\AdminPortal\Factories\AttachmentRulesFactory::mock(),
		];
	}

	private function appendCompetitionIndexLinks( $competition ) {
		$competition->index_links = [
			[
				'label'          => 'Competition Information',
				'url'            => sprintf( '/pages/competition-management/%s/competition-information', $competition->id ),
				'component_link' => 'competition-information',
			],
			[
				'label' => 'Schedule',
				'url'   => sprintf( 'http://placehold.it/1000x1000&text=%s', urlencode( 'Schedule' ) ),
			],
			[
				'label'          => 'Check-In',
				'url'            => sprintf( '/pages/competition-management/%s/check-in', $competition->id ),
				'component_link' => 'check-in',
			],
			[
				'label'          => 'Compliance',
				'url'            => sprintf( '/pages/competition-management/%s/compliance', $competition->id ),
				'component_link' => 'compliance',
			],
			[
				'label'          => 'Competition Contacts',
				'url'            => sprintf( '/pages/competition-management/%s/competition-contacts', $competition->id ),
				'component_link' => 'competition-contacts',
			],
			[
				'label' => 'Volunteer Opportunities',
				'url'   => sprintf( 'http://placehold.it/1000x1000&text=%s', urlencode( 'Volunteer Opportunities' ) ),
			],
			[
				'label'       => 'Online Ice Monitor',
				'url'         => sprintf( 'http://placehold.it/1000x1000&text=%s', urlencode( 'Online Ice Monitor' ) ),
				'is_external' => true,
				'is_new_tab'  => true,
			],
			[
				'label' => 'Notifications',
				'url'   => sprintf( 'http://placehold.it/1000x1000&text=%s', urlencode( 'Notifications' ) ),
			],
			[
				'label' => 'Support Documents',
				'url'   => sprintf( 'http://placehold.it/1000x1000&text=%s', urlencode( 'Support Documents' ) ),
			],
			[
				'label' => 'Additional Admin Items',
				'url'   => sprintf( 'http://placehold.it/1000x1000&text=%s', urlencode( 'Additional Admin Items' ) ),
			],
		];

		return $competition;
	}
}