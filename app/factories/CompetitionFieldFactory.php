<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 1/2/20
 * Time: 11:46 AM
 */

namespace App\factories;

use App\CompetitionPortal\Factories\CompetitionPortalUserNavigationFactory;
use Carbon\Carbon;
use Faker\Factory;

class CompetitionFieldFactory {

    public static function CompetitionClubData() {
        $clubs = json_decode( file_get_contents( __DIR__ . "/../Data/FormOptions.json" ), true )['clubs'];

        $club_name = preg_replace( '/\s\([0-9]*\)/', "", $clubs[ rand( 0, count( $clubs ) - 1 ) ]['label'] );

        return [
            'club' => $club_name,
        ];
    }

    public static function CompetitionFoundationData( $overrides = [] ) {
        $faker = Factory::create();

        $mock = [
            'id'   => FieldFactory::id(),
            'name' => $faker->catchPhrase,
        ];

        foreach ( $mock as $field => $value ) {
            if ( array_key_exists( $field, $overrides ) ) {
                $mock[ $field ] = $overrides[ $field ];
            }
        }

        return $mock;
    }

    public static function CompetitionIconData() {
        $icons = [
            "/images/2018-MW-Adult.png",
            "/images/competition-icon2.png",
            "/images/competition-icon.png",
            "/images/competition-icon2.png",
            "/images/competition-icon3.png",
            "/images/competition-icon4.png",
            "/images/competition-icon.png",
        ];

        return [
            'icon' => $icons[ rand( 0, count( $icons ) - 1 ) ],
        ];
    }

    public static function CompetitionLocationData() {
        $faker = Factory::create();

        return [
            'city'  => $faker->city,
            'state' => $faker->stateAbbr,
        ];
    }

    public static function CompetitionRegistrationDeadlineData( $overrides = [] ) {
        $faker       = Factory::create();
        $source_date = array_key_exists( 'source_date', $overrides )
            ? $overrides['source_date']
            : Carbon::createFromTimestamp( $faker->dateTimeBetween( "-1 years", "+1 years" )
                                                 ->getTimestamp() );

        // Arbitrarily set deadline to somewhere between 5 and 30 days before source (start) date
        $deadline_date = $source_date->copy()->subDays( rand( 5, 30 ) );
        /**
         * Arbitrarily set when reg deadline is in the past or 5 days from now
         */
        $has_warning = $deadline_date < Carbon::now() || abs( Carbon::now()
                                                                    ->diffInDays( $deadline_date ) ) < 5;

        $mock = [
            'has_registration_deadline_warning' => $has_warning,
            'registration_deadline'             => $deadline_date->timezone( 'America/New_York' )
                                                                 ->format( "m/d, g:i A T" ),
        ];

        foreach ( $mock as $field => $value ) {
            if ( array_key_exists( $field, $overrides ) ) {
                $mock[ $field ] = $overrides[ $field ];
            }
        }

        return $mock;
    }

    public static function CompetitionSeriesData() {
        $faker            = Factory::create();
        $available_series = [
            [ 'name' => 'SDS' ],
            [ 'name' => 'NQS' ],
            [ 'name' => 'Exel' ],
        ];

        return [
            'series' => $faker->boolean ? array_splice( $available_series, rand( 1, 2 ) ) : null,
        ];
    }

    public static function CompetitionStartEndDateTimestampsData() {
        $dates = CompetitionFieldFactory::CarbonStartEndDates();

        return [
            'start_date_ts' => $dates['start_date']->getTimestamp(),
            'end_date_ts'   => $dates['end_date']->getTimestamp(),
        ];
    }

    public static function CompetitionUserRegistrationStatusData( $overrides = [] ) {
        $mock = [
            'user_registration_status' => [ "registered", "in_progress", "new" ][ rand( 0, 2 ) ],
        ];

        foreach ( $mock as $field => $value ) {
            if ( array_key_exists( $field, $overrides ) ) {
                $mock[ $field ] = $overrides[ $field ];
            }
        }

        return $mock;
    }

    public static function CompetitionCompetitionRegistrationStatusData( $overrides = [] ) {
        $available_registration_statuses = array_key_exists( 'available_registration_statuses', $overrides )
            ? $overrides['available_registration_statuses']
            : [
                "open",
                "future",
                "late",
            ];

        $mock = [
            'competition_registration_status' => $available_registration_statuses[ rand( 0, count( $available_registration_statuses ) - 1 ) ],
        ];

        foreach ( $mock as $field => $value ) {
            if ( array_key_exists( $field, $overrides ) ) {
                $mock[ $field ] = $overrides[ $field ];
            }
        }

        return $mock;
    }

    /**
     * @return Carbon[]
     */
    public static function CarbonStartEndDates($overrides = [])
    {
        $faker      = Factory::create();
        $start_date = null;
        $end_date   = null;
        if (array_key_exists('start_date_ts', $overrides)) {
            $start_date = Carbon::createFromTimestamp($overrides['start_date_ts']);
        }
        if (array_key_exists('end_date_ts', $overrides)) {
            $end_date = Carbon::createFromTimestamp($overrides['end_date_ts']);
        }
        if ( ! $start_date) {

            $start_date = Carbon::createFromTimestamp($faker->dateTimeBetween("today", "+1 years")->setTime(0, 0,
                0)->getTimestamp());
        }
        if ( ! $end_date) {

            $end_date = $start_date->copy()->addDays(rand(1, 3));
        }

        return compact( 'start_date', 'end_date' );
    }

    public static function CompetitionFormattedDatesData($overrides = [])
    {
        $dates      = CompetitionFieldFactory::CarbonStartEndDates($overrides);
        $start_date = $dates['start_date'];
        $end_date   = $dates['end_date'];

        return [
            'end_date_pretty'   => $end_date->format('n/j/Y'),
            'start_date_pretty' => $start_date->format('n/j/Y'),
        ];
    }

    public static function viewCompetitionLink( $competition_id ) {
        return sprintf( '/CompetitionProfile/Index?id=%s', $competition_id );
    }


    public static function CompetitionHeadingData( $overrides = [] ) {
        $faker      = Factory::create();
        $dates      = CompetitionFieldFactory::CarbonStartEndDates($overrides);
        $start_date = $dates['start_date'];
        $end_date   = $dates['end_date'];

        $name = array_key_exists( 'name', $overrides ) ? $overrides['name'] : $faker->catchPhrase;

        $directions = [];
        for ( $i = 0; $i < rand( 1, 3 ); $i ++ ) {
            $directions[] = [
                'location_name' => $faker->company,
                'link'          => sprintf( "https://placehold.it/720x480&text=%s+Directions+Link", urlencode( $name ) ),
            ];
        }

        $mock = array_merge(
            self::CompetitionIconData(),
            [
                'end_date_pretty'   => $end_date->format( 'n/j/Y' ),
                'name'              => $name,
                'directions'        => $directions,
                'announcement_url'  => sprintf( "https://placehold.it/720x480&text=%s+Announcement", urlencode( $name ) ),
                'website_url'       => sprintf( "https://placehold.it/720x480&text=%s+Website", urlencode( $name ) ),
                'start_date_pretty' => $start_date->format( 'n/j/Y' ),
            ] );

        foreach ( $mock as $field => $value ) {
            if ( array_key_exists( $field, $overrides ) ) {
                $mock[ $field ] = $overrides[ $field ];
            }
        }

        return $mock;
    }

    public static function CompetitionUserRegistrationLinkData( $overrides = [] ) {
        $faker              = Factory::create();
        $competition_id     = array_key_exists( 'id', $overrides ) ? $overrides['id'] : FieldFactory::id();
        $user_is_registered = array_key_exists( 'user_registration_status', $overrides ) ? $overrides['user_registration_status'] === 'registered' : $faker->boolean;

        $template               = $user_is_registered ? "/pages/competition-registration/%s/event-selection" : "/pages/competition-registration/%s";
        $user_registration_link = sprintf( $template, $competition_id );

        $mock = [
            'user_registration_link' => $user_registration_link,
        ];
        foreach ( $mock as $field => $value ) {
            if ( array_key_exists( $field, $overrides ) ) {
                $mock[ $field ] = $overrides[ $field ];
            }
        }

        return $mock;
    }

    public static function CompetitionTeamRegistrationLinkData($overrides = [])
    {
        $faker              = Factory::create();
        $competition_id     = array_key_exists('id', $overrides)
            ? $overrides['id']
            : FieldFactory::id();
        $user_is_registered = array_key_exists('user_registration_status', $overrides)
            ? $overrides['user_registration_status'] === 'registered'
            : $faker->boolean;

        $template               = $user_is_registered
            ? "/pages/competition-registration-teams/%s/initial_page=event_selection"
            : "/pages/competition-registration-teams/%s";
        $user_registration_link = sprintf($template, $competition_id);

        $mock = [
            'user_registration_link' => $user_registration_link,
        ];
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function CompetitionRegistrationCtaConfigurationData( $overrides = [] ) {
        $is_team = array_key_exists('is_team', $overrides) && $overrides['is_team'];
        $deadline_data            = CompetitionFieldFactory::CompetitionRegistrationDeadlineData( $overrides );
        $user_registration_status = CompetitionFieldFactory::CompetitionUserRegistrationStatusData( $overrides );
        $registration_link_overrides = array_merge($user_registration_status, $overrides);
        $user_registration_link      = $is_team
            ? CompetitionFieldFactory::CompetitionTeamRegistrationLinkData($registration_link_overrides)
            : CompetitionFieldFactory::CompetitionUserRegistrationLinkData($registration_link_overrides);

        $has_registration_warning = $deadline_data['has_registration_deadline_warning'];
        $user_began_registration  = $user_registration_status['user_registration_status'] !== 'new';
        if ( $user_began_registration ) {
            $comp_reg_statuses = [ "open" ];
        } elseif ( $has_registration_warning ) {
            $comp_reg_statuses = [ "late" ];
        } else {
            $comp_reg_statuses = [ "open", "future" ];
        }

        $mock = array_merge(
            $deadline_data,
            $user_registration_status,
            $user_registration_link,
            CompetitionFieldFactory::CompetitionCompetitionRegistrationStatusData(
                [
                    'available_registration_statuses' => $comp_reg_statuses,
                ]
            )
        );

        if (array_key_exists('scenario', $overrides)) {

            unset($overrides['user_registration_status']);
            if ($overrides['scenario'] === 'openlate') {
                $mock = array_merge($mock, [
                    'has_registration_deadline_warning' => true,
                    'registration_deadline'             => Carbon::now()->subDays(2)->timezone('America/New_York')->format("m/d, g:i A T"),
                    'user_registration_status'          => 'new',

                    'competition_registration_status' => 'open',
                ], CompetitionFieldFactory::CompetitionTeamRegistrationLinkData([
                    'user_registration_status' => 'new'
                ]));

            }
            if ($overrides['scenario'] === 'default') {
                $mock = array_merge($mock, [
                    'has_registration_deadline_warning' => false,
                    'registration_deadline'             => Carbon::now()->addMonths(2)->timezone('America/New_York')->format("m/d, g:i A T"),
                    'user_registration_status'          => 'registered',

                    'competition_registration_status' => 'open',
                ], CompetitionFieldFactory::CompetitionTeamRegistrationLinkData([
                    'user_registration_status' => 'registered'
                ]));

            }

            if ($overrides['scenario'] === 'closed') {
                $mock = array_merge($mock, [
                    'has_registration_deadline_warning' => true,
                    'registration_deadline'             => Carbon::now()->subMonth()->timezone('America/New_York')->format("m/d, g:i A T"),
                    'user_registration_status'          => 'registered',

                    'competition_registration_status' => 'closed',
                ], CompetitionFieldFactory::CompetitionTeamRegistrationLinkData([
                    'user_registration_status' => 'registered'
                ]));

            }

            if ($overrides['scenario'] === 'new') {
                $mock = array_merge($mock, [
                    'has_registration_deadline_warning' => false,
                    'registration_deadline'             => Carbon::now()->addMonths(2)->timezone('America/New_York')->format("m/d, g:i A T"),
                    'user_registration_status'          => 'new',

                    'competition_registration_status' => 'open',
                ], CompetitionFieldFactory::CompetitionTeamRegistrationLinkData([
                    'user_registration_status' => 'new'
                ]));

            }

            if ($overrides['scenario'] === 'ineligible') {
                $mock = array_merge($mock, [
                    'has_registration_deadline_warning' => false,
                    'registration_deadline'             => Carbon::now()->addMonths(2)->timezone('America/New_York')->format("m/d, g:i A T"),
                    'user_registration_status'          => 'new',
                    'action_blocked_message'            => 'This team is not eligible for any events at this competition.',
                    'competition_registration_status'   => 'open',
                ], CompetitionFieldFactory::CompetitionTeamRegistrationLinkData([
                    'user_registration_status' => 'new'
                ]));

            }

            if ($overrides['scenario'] === 'no_add') {
                $mock = array_merge($mock, [
                    'has_registration_deadline_warning' => false,
                    'registration_deadline'             => Carbon::now()->addMonths(2)->timezone('America/New_York')->format("m/d, g:i A T"),
                    'user_registration_status'          => 'registered',
                    'action_blocked_message'            => 'This team is not eligible for any additional events at this competition.',
                    'competition_registration_status'   => 'open',
                ], CompetitionFieldFactory::CompetitionTeamRegistrationLinkData([
                    'user_registration_status' => 'registered'
                ]));

            }

            return $mock;
        }

        foreach ( $mock as $field => $value ) {
            if ( array_key_exists( $field, $overrides ) ) {
                $mock[ $field ] = $overrides[ $field ];
            }
        }

        return $mock;

    }

    public static function CompetitionVolunteerCtaConfigurationData( $overrides = [] ) {
        $faker = Factory::create();

        $mock = [
            'actions' => [
                'request'       => [
                    'visible' => $faker->boolean,
                    'enabled' => $faker->boolean,
                ],
                'select_shifts' => [
                    'visible' => $faker->boolean,
                    'enabled' => $faker->boolean,
                    'url'     => 'https://placehold.it/500x500&text=Shift+Selection',
                ],
            ],
        ];
        if ( $faker->boolean ) {
            $mock['phase_message'] = [
                'text' => $faker->sentence,
                'type' => [ 'default', 'success', 'error' ][ rand( 0, 2 ) ],
            ];
        }
        if ( $faker->boolean ) {
            $mock['status_message'] = [
                'text'     => $faker->sentence,
                'type_key' => [ null, 'alert', 'success', 'warning' ][ rand( 0, 3 ) ],
            ];
        }

        if ( array_key_exists( 'scenario', $overrides ) ) {
            $scenarios = json_decode( file_get_contents( __DIR__ . "/../Data/CompetitionVolunteerScenarios.json" ), true );
            if ( $overrides['scenario'] === 'random' ) {
                $keys = array_keys( $scenarios );
                $mock = $scenarios[ $keys[ rand( 0, count( $keys ) - 1 ) ] ];
            }
            if ( array_key_exists( $overrides['scenario'], $scenarios ) ) {
                $mock = $scenarios[ $overrides['scenario'] ];
            }
        }

        foreach ( $mock as $field => $value ) {
            if ( array_key_exists( $field, $overrides ) ) {
                $mock[ $field ] = $overrides[ $field ];
            }
        }

        return $mock;
    }


    public static function CompetitionUserNavigationFieldData($overrides = [])
    {
        return [
            'user_navigation' => CompetitionPortalUserNavigationFactory::mockUserNavigation($overrides),
        ];
    }


    /**
     * Override a mock.
     *
     * If a field and its override are arrays, recurse and only override specified sub-fields
     */
    public static function overrideMock( $mock, $overrides ) {
        foreach ( $mock as $field => $value ) {
            if ( array_key_exists( $field, $overrides ) ) {
                // Base case - either mock or override field is not an array
                if ( ! is_array( $mock[ $field ] ) || ! is_array( $overrides[ $field ] ) ) {
                    $mock[ $field ] = $overrides[ $field ];
                    continue;
                }
                // Recursive case - override and mock fields are both arrays
                $mock[ $field ] = CompetitionFieldFactory::overrideMock( $mock[ $field ], $overrides[ $field ] );
            }
        }

        return $mock;
    }

}