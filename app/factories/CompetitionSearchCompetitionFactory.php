<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 12/26/19
 * Time: 4:44 PM
 */

namespace App\factories;

use Carbon\Carbon;

class CompetitionSearchCompetitionFactory {
    /**
     * Mock a Competition
     */
    public static function SearchCompetitionsCompetitionData( $overrides = [] ) {
        $core  = CompetitionFieldFactory::CompetitionFoundationData( $overrides );
        $dates = CompetitionFieldFactory::CompetitionStartEndDateTimestampsData();

        return array_merge(
            $core,
            $dates,
            CompetitionFieldFactory::CompetitionLocationData(),
            CompetitionFieldFactory::CompetitionClubData(),
            CompetitionFieldFactory::CompetitionIconData(),
            CompetitionFieldFactory::CompetitionUserRegistrationStatusData(),
            CompetitionFieldFactory::CompetitionRegistrationDeadlineData(
                [
                    'source_date' => Carbon::createFromTimestamp( $dates['start_date_ts'] ),
                ]
            ),
            CompetitionFieldFactory::CompetitionSeriesData(),
            [
                'view_competition_link' => CompetitionFieldFactory::viewCompetitionLink( $core['id'] ),
            ], $overrides );
    }

    /**
     * Create a mock competition list
     */
    public static function competitionList($amount = false) {

        $competitions  = [];
        $default_names = FieldFactory::competitionNames();
        $count         = 200;
        if ($amount) {
            $count = $amount;
        }
        if ( simulation_arg_present( 'competition_count' ) ) {
            preg_match( '/competition_count=([0-9]*)/', $_SERVER['HTTP_REFERER'], $matches );
            if ( count( $matches ) > 1 ) {
                $count = $matches[1];
            }
        }
        for ( $i = 0; $i < $count; $i ++ ) {
            $competitions[] = CompetitionSearchCompetitionFactory::SearchCompetitionsCompetitionData(
                // incrementing by 8 prevents collisions with My Competitions in navigation
                [
                    'id' => $i + 8,
                ]
            );
        }
        // sort competitions by start date
        usort( $competitions, function ( $compa, $compb ) {
            return $compa['start_date_ts'] - $compb['start_date_ts'];
        } );

        // Rename set of competitions with real-world competition names
        foreach ( $default_names as $index => $name ) {
            if ( array_key_exists( $index, $competitions ) ) {
                $competitions[ $index ]['name'] = $name;
            }
        }

        $competitions = self::appendMultiEntityCompetition($competitions);

        return array_map(function ($competition) {
            return (object) $competition;
        }, $competitions );
    }


    /**
     * @param array $competitions
     *
     * @return array
     */
    private static function appendMultiEntityCompetition(array $competitions)
    {
        $id   = 999111999;
        $temp = self::SearchCompetitionsCompetitionData(array_merge($competitions[0], [
            'id'                       => $id,
            'view_competition_link'    => sprintf('/pages/competitions/select-competition-entity?id=%s', $id),
            'name'                     => 'Multi-Entity Registered Competition',
            'user_registration_status' => 'registered'
        ]));
        array_unshift($competitions, $temp);

        return $competitions;
}
}