<?php

namespace App\SeriesRegistration\Factories;

use App\factories\FieldFactory;
use Faker\Factory;

class SeriesStandingsFactory
{

    private static $disciplines=[
        'Dance',
        'Pairs',
        'Singles'
    ];

    private static $levels=[
        'Juvenile',
        'Intermediate',
        'Novice',
        'Junior',
        'Senior'
    ];

    private static $sections=[ 'midwestern', 'eastern', 'pacific' ];


    public static function SeriesRegistrationStandingsData()
    {
        return [
            'meta'   => self::StandingsMetadata(),
            'events' => self::StandingsEventsData()
        ];
    }


    /**
     * @return array
     */
    public static function StandingsMetadata()
    {
        return [
            'last_updated_datetime_formatted' => '4/9/2020 11:14 AM ET',
            'available_filters'               => [
                'section_keys'     => SeriesStandingsFactory::$sections,
                'discipline_names' => SeriesStandingsFactory::$disciplines,
                'level_names' => SeriesStandingsFactory::$levels,
            ]
        ];
    }


    /**
     * @return array
     */
    public static function StandingsEventsData()
    {

        if ( ! simulation_arg_present('standings_list_dynamic')) {
            if (simulation_arg_present('standings_list_long')) {
                return json_decode(file_get_contents(__DIR__ . '/../Data/SeriesRegistrationLongStandingsList.json'));
            }

            return json_decode(file_get_contents(__DIR__ . '/../Data/SeriesRegistrationShortStandingsList.json'));
        }

        $confs  = [
            [
                'name'            => 'Juvenile Combined Dance',
                'discipline_name' => 'Dance',
                'level_name'      => 'Juvenile'
            ],
            [
                'name'            => 'Juvenile Pairs FS',
                'discipline_name' => 'Pairs',
                'level_name'      => 'Juvenile'
            ],
            [
                'name'            => 'Juvenile Girls FS',
                'discipline_name' => 'Singles',
                'level_name'      => 'Juvenile'
            ]
        ];
        $result = [];
        foreach ($confs as $conf) {
            $result[] = self::StandingsEventData($conf);
        }
        // file_put_contents(__DIR__ . '/../Data/SeriesRegistrationShortStandingsList.json', json_encode($result));
        if (simulation_arg_present('standings_list_long')) {
            $confs = [
                [
                    'name'            => 'Juvenile Boys FS',
                    'discipline_name' => 'Singles',
                    'level_name'      => 'Juvenile'
                ],
                [
                    'name'            => 'Intermediate Combined Dance',
                    'discipline_name' => 'Dance',
                    'level_name'      => 'Intermediate'
                ],
                [
                    'name'            => 'Intermediate Pairs FS',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Intermediate'
                ],
                [
                    'name'            => 'Intermediate Ladies Combined',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Intermediate'
                ],
                [
                    'name'            => 'Intermediate Men Combined',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Intermediate'
                ],
                [
                    'name'            => 'Novice Combined Dance',
                    'discipline_name' => 'Dance',
                    'level_name'      => 'Novice'
                ],
                [
                    'name'            => 'Novice Pairs Combined',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Novice'
                ],
                [
                    'name'            => 'Novice Ladies Combined',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Novice'
                ],
                [
                    'name'            => 'Novice Men Combined',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Novice'
                ],
                [
                    'name'            => 'Junior Combined Dance',
                    'discipline_name' => 'Dance',
                    'level_name'      => 'Junior'
                ],
                [
                    'name'            => 'Junior Pairs Combined',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Junior'
                ],
                [
                    'name'            => 'Junior Ladies Combined',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Junior'
                ],
                [
                    'name'            => 'Junior Men Combined',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Junior'
                ],
                [
                    'name'            => 'Senior Combined Dance',
                    'discipline_name' => 'Dance',
                    'level_name'      => 'Senior'
                ],
                [
                    'name'            => 'Senior Pairs Combined',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Senior'
                ],
                [
                    'name'            => 'Senior Ladies Combined',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Senior'
                ],
                [
                    'name'            => 'Senior Men Combined',
                    'discipline_name' => 'Pairs',
                    'level_name'      => 'Senior'
                ],
            ];
            foreach ($confs as $conf) {
                $result[] = self::StandingsEventData($conf);
            }
            for ($i = 0; $i < 130; $i++) {
                $result[] = self::StandingsEventData();
            }
            // file_put_contents(__DIR__ . '/../Data/SeriesRegistrationLongStandingsList.json', json_encode($result));
        }

        return $result;
    }


    private static function StandingsEventData($overrides = [])
    {
        $faker       = Factory::create();
        $disciplines = self::$disciplines;
        $levels      =  self::$levels;
        $discipline  = $disciplines[rand(0, count($disciplines) - 1)];
        $level       = $levels[rand(0, count($levels) - 1)];
        $adjective = explode(' ',$faker->catchPhrase)[0];


        $name = sprintf('%s %s %s',$level,$adjective,$discipline);

        return array_merge([
            'name'            => $name,
            'discipline_name' => $discipline,
            'level_name'      => $level,
            'standings'       => self::EventStandingsList()
        ], $overrides);
    }


    private static function EventStandingsList()
    {
        $faker = Factory::create();

        $result          = [];
        $sections        = self::$sections;
        $sectional_ranks = [
            'midwestern' => 1,
            'eastern'    => 1,
            'pacific'    => 1,
        ];
        $current_score   = 101.20;
        $count           = rand(15, 80);
        $fnr_count       = 0;
        $null_count      = 0;
        for ($i = 0; $i < $count; $i++) {
            $section_key        = $sections[rand(0, 2)];
            $competition_earned = $faker->catchPhrase;
            $sectional_rank     = $sectional_ranks[$section_key]++;
            $national_rank      = $i + 1;

            /**
             * If score isn't already FNR, set it to FNR if highest score is less than 50 or if last 2 items in list
             */
            if ($current_score !== 'FNR' && $current_score !== null) {
                $current_score = $faker->randomFloat(2, $current_score - 3, $current_score - 0.5);
                if ($current_score < 30) {
                    $current_score = 'FNR';
                }
            }
            if ($current_score === 'FNR') {
                $fnr_count++;
                $competition_earned = null;
                $sectional_rank     = 'FNR';
                $national_rank      = 'FNR';
            }
            if ($count - $i <= 2 || $fnr_count > 5) {
                $competition_earned = null;
                $sectional_rank     = null;
                $national_rank      = null;
                $current_score      = null;
                $null_count++;
            }

            $result[] = [
                'id'                 => FieldFactory::id(),
                'participant_name'   => $faker->name,
                'home_club'          => sprintf('%s%s', FieldFactory::clubName(), $i > 0 && $i % 7 === 0
                    ? '**'
                    : ''),
                'competition_earned' => $competition_earned,
                'highest_score'      => $current_score !== null ? (string) $current_score : null,
                'section_key'        => $section_key,
                'sectional_rank'     => $sectional_rank !== null ? (string) $sectional_rank : null,
                'national_rank'      => $national_rank !== null ? (string) $national_rank : null,
            ];
            if ($null_count > 5) {
                break;
            }
        }

        return $result;
    }
}