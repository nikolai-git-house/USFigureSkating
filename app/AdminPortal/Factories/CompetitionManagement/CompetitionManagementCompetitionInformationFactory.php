<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 11/3/19
 * Time: 5:44 PM
 */

namespace App\AdminPortal\Factories\CompetitionManagement;

use Carbon\Carbon;
use Faker\Factory;

class CompetitionManagementCompetitionInformationFactory {
	private $competition;

	/**
	 * CompetitionManagementCompetitionInformationFactory constructor.
	 *
	 * @param array $competition
	 */
	public function __construct( $competition ) {
		$this->competition = $competition;
		$this->start_date  = Carbon::parse( $competition->start_date_pretty, 'America/Denver' );
		$this->end_date    = Carbon::parse( $competition->end_date_pretty, 'America/Denver' );
	}

	public function mock() {

		$practice_ice_windows = [
			'Pre-Purchase',
			'Selection',
			'Open Sales',
			'Onsite Sales',
		];
		$entities             = [
			'Skaters',
			'Dance Teams',
			'Singles',
			'Synchro Teams',
			'Pair Teams',
		];
		$registration_dates   = [
			'Registration Open',
			'Early Bird Deadline',
			'Registration Deadline',
			'Late Registration Deadline',
		];
		$volunteer_windows    = [
			'Volunteer Requests',
			'Shift Selection',
		];
		$registration_day_map = [ 30, 20, 14, 7 ];
		$faker                = Factory::create();

		return [
			'deadlines'    => [
				array_merge( $this->mockDeadlineDate(), [
					'name'            => 'Music',
					'show_in_summary' => true,
					'late_fee'        => '15',
					// 'status'            => 'default',
					// 'relative_deadline' => '2 days',
				] ),
				array_merge( $this->mockDeadlineDate(), [
					'name'            => 'PPC',
					'show_in_summary' => true,
					'late_fee'        => '15',
					// 'status'            => 'success',
					// 'relative_deadline' => '3 days',
				] ),
				array_merge( $this->mockDeadlineDate( 'subMonths', 2 ), [
					'name'            => 'Roster',
					'show_in_summary' => true,
					'late_fee'        => null,
					// 'status'            => 'error',
					// 'relative_deadline' => '12 hours',
				] ),
			],
			'practice_ice' => [
				'status'  => $this->practiceIceWindow(),
				'windows' => array_map( function ( $name, $index ) use ( $faker ) {
					return [
						'name'                      => $name,
						'begin_date_time_formatted' => $this->start_date->copy()
						                                                ->timezone( 'America/New_York' )
						                                                ->addDays( 2 * $index - ( 11 - $index ) )
						                                                ->format( 'm/d/Y h:i A T' ),
						'end_date_time_formatted'   => $this->start_date->copy()
						                                                ->timezone( 'America/New_York' )
						                                                ->addDays( 2 * ( $index + 1 ) - ( 11 - $index ) )
						                                                ->format( 'm/d/Y h:i A T' ),
					];
				}, $practice_ice_windows, array_keys( $practice_ice_windows ) ),

			],
			'registrants'  => [
				'registered'    => [
					'amount' => $faker->numberBetween( 100, 400 ),
					'status' => 'default',
				],
				'entries'       => [
					'amount' => $faker->numberBetween( 120, 450 ),
					'status' => 'default',
				],
				'entity_counts' => array_map( function ( $item ) use ( $faker ) {
					return [
						'name'  => $item,
						'count' => $faker->numberBetween( 50, 125 ),
					];
				}, $entities ),
			],
			'registration' => [
				'status'                => $this->registrationStatus(),
				'dates'                 => array_map( function ( $name, $index ) use ( $registration_day_map ) {
					$result = [
						'name'                => $name,
						'date_time_formatted' => $this->start_date->copy()
						                                          ->timezone( 'America/New_York' )
						                                          ->subDays( $registration_day_map[ $index ] )
						                                          ->format( 'm/d/Y h:i A T' ),
					];
                    if ($name === 'Early Bird Deadline') {
                        $result['cost'] = [
                            'label' => 'Early Bird Discount',
                            'value' => 47
                        ];
                    }
                    if ($name === 'Late Registration Deadline') {
                        $result['cost'] = [
                            'label' => 'Late Registration Fee',
                            'value' => 10
                        ];
                    }
                    return $result;

				}, $registration_dates, array_keys( $registration_dates ) ),
			],
			'volunteers'   => [
				'windows' => array_map( function ( $item, $index ) use ( $faker ) {
					return [
						'name'                      => $item,
						'begin_date_time_formatted' => $this->start_date->copy()
						                                                ->timezone( 'America/New_York' )
						                                                ->addDays( 1 * $index - ( 30 - $index ) )
						                                                ->format( 'm/d/Y h:i A T' ),
						'end_date_time_formatted'   => $this->start_date->copy()
						                                                ->timezone( 'America/New_York' )
						                                                ->addDays( 1 * ( $index + 1 ) - ( 30 - $index ) )
						                                                ->format( 'm/d/Y h:i A T' ),
					];
				}, $volunteer_windows, array_keys( $volunteer_windows ) ),
			],
		];
	}


	protected function practiceIceWindow() {
		$practice_ice_windows = [
			'Pre-Purchase',
			'Selection',
			'Open Sales',
			'Onsite Sales',
		];
		$now                  = Carbon::now()->timestamp;
		foreach ( $practice_ice_windows as $index => $value ) {

			$open_date = $this->start_date->copy()
			                              ->addDays( 2 * $index - ( 11 - $index ) )->timestamp;

			$close_date = $this->start_date->copy()
			                               ->addDays( 2 * ( $index + 1 ) - ( 11 - $index ) )->timestamp;

			if ( $now < $open_date ) {
				return [
					'description' => "Upcoming - " . $value,
					'status'      => 'default',
				];
			}

			if ( $now < $close_date ) {
				return [
					'description' => "Active - " . $value,
					'status'      => 'success',
				];
			}


		}

		return [
			'description' => "Closed",
			'status'      => 'error',
		];

	}

	/**
	 * @return array
	 */
	protected function registrationStatus() {
		$registration_dates   = [
			'Registration Open',
			'Early Bird Deadline',
			'Registration Deadline',
			'Late Registration Deadline',
		];
		$registration_day_map = [ 30, 20, 14, 7 ];
		$now                  = Carbon::now()->timestamp;
		foreach ( $registration_dates as $index => $value ) {

			$open_date = $this->start_date->copy()
			                              ->timezone( 'America/New_York' )
			                              ->subDays( $registration_day_map[ $index ] )->timestamp;

			if ( $now < $open_date ) {
				if ( $index === 0 ) {
					return [
						'description' => "Upcoming",
						'status'      => 'default',
					];
				}
				if ( $index === 3 ) {
					return [
						'description' => "Late",
						'status'      => 'warning',
					];
				}

				return [
					'description' => "Open",
					'status'      => 'success',
				];
			}
		}

		return [
			'description' => "Closed",
			'status'      => 'error',
		];
	}

	private function mockDeadlineDate( $method = "subDays", $amount = 2 ) {

		$faker    = Factory::create();
		$max_date = $this->start_date;

		$min_date = $max_date->copy()
		                     ->$method( $amount );

		$now = Carbon::now();
		if ( $this->start_date->timestamp < $now->timestamp && $this->end_date->timestamp > $now->timestamp ) {
			$max_date = $now->copy()
			                ->addHours( rand( 9, 14 ) );
			$min_date = $now->copy()
			                ->addHours( rand( 4, 8 ) );
		}

		$deadline            = Carbon::createFromTimestamp( $faker->dateTimeBetween( $min_date, $max_date )
		                                                          ->getTimestamp() );
		$deadline_diff       = $now->timestamp - $deadline->timestamp;
		$is_past             = $deadline_diff > 0;
		$status              = $is_past ? 'error' : ( ( $deadline_diff / 60 / 60 / - 24 < 2 ) ? 'warning' : 'success' );
		$relative_deadline   = $is_past ? "Past" : str_replace( 'from now', '', $deadline->diffForHumans() );
		$date_time_formatted = $deadline->timezone( 'America/New_York' )
		                                ->format( 'm/d/Y h:i A T' );

		return compact( 'date_time_formatted', 'status', 'relative_deadline' );
	}


}