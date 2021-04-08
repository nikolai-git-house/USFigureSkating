<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 12/30/19
 * Time: 5:04 PM
 */

namespace App\factories;

use Carbon\Carbon;

class ViewCompetitionFactory {

    public static function ViewCompetitionData( $overrides = [] ) {
        unset($overrides['user_navigation']);
        $dates      = CompetitionFieldFactory::CarbonStartEndDates();
        $start_date = $dates['start_date'];
        $end_date   = $dates['end_date'];
        if ( array_key_exists( 'start_date_ts', $overrides ) ) {
            $start_date = Carbon::createFromTimestamp( $overrides['start_date_ts'] );
        }
        if ( array_key_exists( 'end_date_ts', $overrides ) ) {
            $end_date = Carbon::createFromTimestamp( $overrides['end_date_ts'] );
        }
        $is_team = array_key_exists('team_id',$overrides);

        $volunteer_scenario = 'default';
        if ( simulation_arg_present( 'volunteer_scenario' ) ) {
            $matches = [];
            preg_match( '/volunteer_scenario=([a-z_]*)/', $_SERVER['HTTP_REFERER'], $matches );
            if ( count( $matches ) > 1 ) {
                $volunteer_scenario = $matches[1];
            }
        }
        $team_registration_scenario = 'default';
        if (simulation_arg_present('team_registration_scenario')) {
            $matches = [];
            preg_match('/team_registration_scenario=([a-z_]*)/', $_SERVER['HTTP_REFERER'], $matches);
            if (count($matches) > 1) {
                $team_registration_scenario = $matches[1];
            }
        }

        $registered_volunteer = simulation_arg_present('registered_volunteer');

        $competition_foundation_data                     = CompetitionFieldFactory::CompetitionFoundationData( $overrides );
        $competition_heading_data                        = CompetitionFieldFactory::CompetitionHeadingData(
            array_merge($overrides, [
                    'start_date_pretty' => $start_date->format('n/j/Y'),
                    'end_date_pretty'   => $end_date->format('n/j/Y'),
                ]));
        $competition_registration_cta_configuration_data = CompetitionFieldFactory::CompetitionRegistrationCtaConfigurationData(array_merge($overrides,
                [

                ]));
        $team_registration_cta_configuration_data = CompetitionFieldFactory::CompetitionRegistrationCtaConfigurationData(array_merge($overrides,
                [
                    'is_team'  => true,
                    'scenario' => $team_registration_scenario
                ]
            )
        );
        $competition_volunteer_cta_configuration_data    = CompetitionFieldFactory::CompetitionVolunteerCtaConfigurationData(array_merge($overrides,
                [
                    'scenario' => $volunteer_scenario,
                ]
            )
        );
        $user_roles                                      = [];

        /**
         * Set user role if they're registered for the competition.
         *
         * In USFS production environment, this check isn't entirely accurate.  A coach relative to a competition won't be registered for it,
         * but this criteria works as a sufficient flag for the demo environment.
         */
        if ( $competition_registration_cta_configuration_data['user_registration_status'] === 'registered' ) {
            $user_roles = [ 'skater' ];
            if ( isset( $_COOKIE[ USER_TYPE_COOKIE_NAME ] ) ) {
                $user_roles = [ $_COOKIE[ USER_TYPE_COOKIE_NAME ] ];
                if ( $user_roles === [ "both" ] ) {
                    $user_roles = [ "skater", "coach" ];
                }
            }
        }
        if(array_key_exists('user_roles',$overrides)){
            $user_roles = $overrides['user_roles'];
        }
        if ($registered_volunteer) {
            $user_roles[] = 'volunteer';
        }
        $competition_user_navigation_field_data = CompetitionFieldFactory::CompetitionUserNavigationFieldData(
            array_merge(
                $overrides,
                [
                    'user_roles' => $user_roles,
                ]
            )
        );
        $mock                                            = array_merge(
            $competition_foundation_data,
            $competition_user_navigation_field_data,
            $competition_heading_data, array_merge([
                'is_ems'                              => true,
                'links'                          => [
                    'select_competition_entity' => sprintf('/pages/competitions/select-competition-entity?id=%s',
                        $competition_foundation_data['id'])
                ]
            ],$is_team?[
                'team_registration_cta_configuration' => $team_registration_cta_configuration_data,
            ]:[
                'registration_cta_configuration' => $competition_registration_cta_configuration_data,
                'volunteer_cta_configuration'    => $competition_volunteer_cta_configuration_data,
            ])
        );

        if ($registered_volunteer) {
            unset($mock['volunteer_cta_configuration']);
        }

        unset($overrides['links']);

        foreach ( $mock as $field => $value ) {
            if ( array_key_exists( $field, $overrides ) ) {
                $mock[ $field ] = $overrides[ $field ];
            }
        }

        return $mock;

    }


}