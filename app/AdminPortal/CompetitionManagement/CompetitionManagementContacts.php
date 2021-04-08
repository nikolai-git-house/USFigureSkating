<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 11/9/19
 * Time: 12:57 PM
 */

namespace App\AdminPortal\CompetitionManagement;

use App\AdminPortal\Factories\CompetitionManagement\CompetitionManagementContactFactory;
use App\FormOptions;
use Faker\Factory;

class CompetitionManagementContacts {
	private static $session_storage_key = "competition_management";
	public $lists;
	public $search_results = null;

	/**
	 * CheckIn constructor.
	 */
	public function __construct( $properties = [] ) {
		if ( $properties ) {
			foreach ( $properties as $property => $value ) {
				if ( property_exists( $this, $property ) ) {
					$this->$property = $value;
				}
			}

		}
		if ( ! $this->lists ) {
			$this->lists = CompetitionManagementContactFactory::lists();
		}
	}

	public static function getCurrent() {
		if ( array_key_exists( self::$session_storage_key, $_SESSION ) ) {
			return self::fromJSON( json_decode( $_SESSION[ self::$session_storage_key ] ) );
		}

		return new self( (object) [] );

	}

	private static function fromJSON( $json_decode ) {
		return new self( $json_decode );
	}

	public function cache() {
		$_SESSION[ self::$session_storage_key ] = json_encode( $this );
	}

	public function getSearchFormOptions() {
		return [
			'position_form_options' => [
				'contact'  => array_map( function ( $item ) {
					return [
						'label' => $item['label'],
						'value' => $item['key'],
					];
				}, CompetitionManagementContactFactory::$contact_roles ),
				'official' => array_map( function ( $item ) {
					return [
						'label' => $item['label'],
						'value' => $item['key'],
					];
				}, CompetitionManagementContactFactory::$official_roles ),
			],
			'state_form_options'    => [
				'contact'  => FormOptions::search_state_options(),
				'official' => FormOptions::search_state_options(),
			],
		];
	}

	public function find( $id ) {
		foreach ( $this->lists->contacts as $item ) {
			if ( $item->id === $id ) {
				return $item;
			}
		}
		foreach ( $this->lists->officials as $item ) {
			if ( $item->id === $id ) {
				return $item;
			}
		}

		return null;
	}

	public function search( $data ) {
		$faker                 = Factory::create();
		$potential_results_raw = json_decode( file_get_contents( __DIR__ . '/../../Data/MemberSearchResults.json' ), true );
		$clubs                 = json_decode( file_get_contents( __DIR__ . "/../../Data/FormOptions.json" ), true )['clubs'];
		foreach ( $this->lists as $list ) {
			foreach ( $list as $item ) {
				/**
				 * If item is too large to be in list, add it to list
				 */
				if ( $item->id > count( $potential_results_raw ) - 1 ) {
					$club_name               = preg_replace( '/\s\([0-9]*\)/', "", $clubs[ $faker->numberBetween( 0, count( $clubs ) - 1 ) ]['label'] );
					$potential_results_raw[] = array_merge( (array) $item, [
						'ineligible'         => rand( 0, 1 ) == 1,
						'state_abbreviation' => $faker->stateAbbr,
						'city'               => $faker->city,
						'club_name'          => $club_name,
					] );
					continue;
				}
				// If item matches id in list, overwrite the info to appear as the right result
				$potential_results_raw[ $item->id - 1 ] = array_merge( (array) $potential_results_raw[ $item->id - 1 ], [
					'first_name'    => $item->first_name,
					'last_name'     => $item->last_name,
					'member_number' => $item->member_number,
				] );
			}
		}

		$search = new \App\Search( $data, false, $potential_results_raw );

		$this->search_results = $search->results;

		return $search->results;
	}

	public function addFromSearch( $data ) {
		$result = $this->findInSearchResults( $data->id );
		if ( ! $result ) {
			throw new \Exception( 'Result not found' );
		}

		return CompetitionManagementContactFactory::mockAddSearch( $data, $result );
	}

	private function findInSearchResults( $id ) {
		foreach ( $this->search_results as $result ) {
			if ( $result->id === $id ) {
				return $result;
			}
		}

		return null;
	}
}