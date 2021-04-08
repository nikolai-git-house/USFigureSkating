<?php

namespace App\SeriesRegistration\Factories;

use App\factories\FieldFactory;
use App\UserProfile;
use Carbon\Carbon;
use Faker\Factory;

class SeriesRegistrationFactory
{

    public static function managerSeriesData()
    {

        $source      = json_decode(file_get_contents(__DIR__ . './../Data/SeriesRegistrationSeries.json'), true);
        $faker       = Factory::create();
        $result      = [];
        $id          = 1;
        $date_index  = 1;
        $date_index2 = -1;

        if ( ! simulation_arg_present('no_indiv_series')) {
            foreach ($source as $index => $source_item) {
                $base = $source_item;
                if (strpos('Not Possible', $base['name']) !== false) {
                    continue;
                }

                $source_date = $source_item['_applications_open']
                    ? $faker->dateTimeBetween("+{$date_index} months", "+{$date_index} months")->getTimestamp()
                    : $faker->dateTimeBetween("-{$date_index2} days", "-{$date_index2} days")->getTimestamp();
                $date_index++;
                $date_index2--;
                $result[] = array_merge($source_item,
                    SeriesRegistrationFactory::SeriesRegistrationSeriesCoreData($base), [
                        'id'                              => $id++,
                        'name'                            => str_replace('%year%', Carbon::now()->format('Y'),
                            $base['name']),
                        '_application_deadline_timestamp' => $source_date
                    ]);
            }
        }

        if ( ! simulation_arg_present('no_team_series')) {
            $source = json_decode(file_get_contents(__DIR__ . './../Data/SeriesRegistrationTeamSeries.json'), true);

            foreach ($source as $index => $source_item) {
                $base = $source_item;

                $source_date = $source_item['_applications_open']
                    ? $faker->dateTimeBetween("+{$date_index} months", "+{$date_index} months")->getTimestamp()
                    : $faker->dateTimeBetween("-{$date_index2} days", "-{$date_index2} days")->getTimestamp();
                $date_index++;
                $date_index2--;
                $result[] = array_merge($source_item,
                    SeriesRegistrationFactory::SeriesRegistrationSeriesCoreData($base), [
                        'id'   => $id++,
                        'name' => str_replace('%year%', Carbon::now()->format('Y'), "Team {$base['name']}"),

                        '_application_deadline_timestamp' => $source_date
                    ]);
            }
        }


        usort($result, function ($a, $b) {
            return ( $a['_application_deadline_timestamp'] ) - ( $b['_application_deadline_timestamp'] );
        });

        return $result;
    }


    public static function SeriesRegistrationIndexSeriesData($overrides = [])
    {
        $deadline_data = self::deadlineData($overrides);

        $links = self::SeriesLinksData($overrides);

        $data = array_merge(self::SeriesRegistrationSeriesCoreData(), [
            'application_deadline_date_formatted' => $deadline_data['application_deadline_date_formatted'],
            'links'                               => $links
        ], $overrides);

        return self::stripApiOnlyData($data);
    }


    /**
     * @param Carbon $application_deadline_date
     *
     * @return array
     */
    protected static function deadlineData($overrides = [])
    {
        $faker                          = Factory::create();
        $application_deadline_timestamp = array_key_exists('_application_deadline_timestamp', $overrides)
            ? $overrides['_application_deadline_timestamp']
            : $faker->dateTimeBetween('+1 month', "+1 years")->getTimestamp();
        $application_deadline_date      = Carbon::createFromTimestamp($application_deadline_timestamp);

        return [
            'application_deadline_date_formatted' => $application_deadline_date->format('n/j/Y'),
            'application_deadline_time_formatted' => "11:59 ET",
        ];
    }


    /**
     * @param $overrides
     *
     * @return array
     */
    private static function SeriesLinksData($overrides)
    {
        $id    = array_key_exists('id', $overrides)
            ? $overrides['id']
            : FieldFactory::id();
        $links = [
            'overview'    => sprintf('/pages/series-registration/%s', $id)
        ];

        if (array_key_exists('is_team_series', $overrides) && $overrides['is_team_series']) {
            $links['select_team'] = sprintf('/pages/series-registration/%s/select-team', $id);
        }

        return $links;
    }


    public static function SeriesRegistrationSeriesCoreData($overrides = [])
    {
        $faker = Factory::create();
        $id    = FieldFactory::id();

        return array_merge([
            'icon' => rand(0, 1) == 0
                ? '/images/series-icon.png'
                : '/images/series-icon-1.png',
            'id'   => $id,
            'name' => $faker->catchPhrase,
        ], $overrides);
    }


    /**
     * @param array $data
     *
     * @return array
     */
    private static function stripApiOnlyData(array $data)
    {
        return array_filter($data, function ($key) {
            if (strpos($key, '_') === 0) {
                return false;
            }

            return true;
        }, ARRAY_FILTER_USE_KEY);
    }


    public static function SeriesRegistrationStandingsSeriesData($overrides = [])
    {
        $deadline_data = self::deadlineData($overrides);
        $data          = array_merge([
            'application_deadline_formatted' => [
                'date' => $deadline_data['application_deadline_date_formatted'],
                'time' => $deadline_data['application_deadline_time_formatted']
            ],
            'links'                          => self::SeriesLinksData($overrides),
            'resource_documents'             => [
                [
                    'name' => 'Dance',
                    'link' => 'https://placehold.it/500x500&text=Dance'
                ],
                [
                    'name' => 'Singles',
                    'link' => 'https://placehold.it/500x500&text=Singles'
                ],
                [
                    'name' => 'Pairs',
                    'link' => 'https://placehold.it/500x500&text=Pairs'
                ]
            ]
        ], SeriesRegistrationFactory::SeriesRegistrationSeriesCoreData($overrides), $overrides);

        return self::stripApiOnlyData($data);
    }


    public static function SeriesRegistrationApplicationSeriesData($overrides = [])
    {
        $deadline_data = self::deadlineData($overrides);
        $data          = array_merge([
            'application_deadline_formatted' => [
                'date' => $deadline_data['application_deadline_date_formatted'],
                'time' => $deadline_data['application_deadline_time_formatted']
            ],
            'links'                          => self::SeriesLinksData($overrides),
            'application_configuration'      => self::ApplicationConfigurationData(),
            'refund_email_address'           => 'productsupport@usfigureskating.org'
        ], SeriesRegistrationFactory::SeriesRegistrationSeriesCoreData($overrides), $overrides);

        return self::stripApiOnlyData($data);
    }


    public static function SeriesRegistrationApplicationSeriesDataTeam($overrides = [])
    {
        $deadline_data = self::deadlineData($overrides);
        $data          = array_merge([
            'application_deadline_formatted' => [
                'date' => $deadline_data['application_deadline_date_formatted'],
                'time' => $deadline_data['application_deadline_time_formatted']
            ],
            'links'                          => self::SeriesLinksData($overrides),
            'application_configuration'      => self::ApplicationConfigurationDataTeam(),
            'refund_email_address'           => 'productsupport@usfigureskating.org'
        ], SeriesRegistrationFactory::SeriesRegistrationSeriesCoreData($overrides), $overrides);

        return self::stripApiOnlyData($data);
    }


    public static function SeriesRegistrationUserApplicationProfileData()
    {
        $base = UserProfile::get();

        return [
            'full_name'     => $base->full_name,
            'email'         => $base->primary_email->value,
            'member_number' => $base->member_number,
            'birth_date'    => $base->birth_date,
            'home_club'     => $base->home_club,
            'region_name'   => $base->region_name,
            'section_name'  => $base->section_name,
            'gender'        => $base->gender
        ];
    }


    public static function SeriesRegistrationTeamApplicationProfileData(array $overrides = [])
    {
        $levels    = [
            'Juvenile',
            'Intermediate',
            'Novice',
            'Junior',
            'Senior'
        ];
        $faker     = Factory::create();
        $date_time = $faker->dateTimeBetween('+1 month', '+1 year')->format('n/j/Y');
        $mock      = [
            'name'          => $faker->catchPhrase,
            'level'         => $levels[rand(0, count($levels) - 1)],
            'member_number' => FieldFactory::memberNumber(),
            'home_club'     => [
                'name'                          => 'Individual Member',
                'membership_validity_formatted' => $date_time
            ],
        ];
        if (!simulation_arg_present('team_profile_incomplete')) {
           $mock = array_merge($mock,[
               'home_club'     => [
                   'name'                          => FieldFactory::clubName(),
                   'membership_validity_formatted' => $date_time
               ],
               'region_name'   => $faker->catchPhrase,
               'section_name'  => FieldFactory::memberSection(),
           ]);
        }

        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function SeriesRegistrationUserApplicationData($core_series_data)
    {
        $application_started = array_key_exists('_application_started',
                $core_series_data) && $core_series_data['_application_started'];
        $saved_application   = json_decode(file_get_contents(__DIR__ . "/../Data/SeriesRegistrationSavedApplicationData.json"),
            true);

        $application = $application_started
            ? $saved_application
            : null;

        if ($application && array_key_exists('_application_paid', $core_series_data)) {
            $force_paid = $core_series_data['_application_paid'];
            foreach ($application['disciplines'] as &$discipline) {
                foreach ($discipline['levels'] as &$level) {
                    $level['is_paid'] = $force_paid;
                }
            }
        }

        return $application;
    }


    public static function SeriesRegistrationUserApplicationDataTeam($core_series_data, $team)
    {
        $button_text         = $team->selection_information->button->text;
        $application_started = $button_text !== 'Start';
        $application_paid    = $button_text === 'Update';

        $saved_application = json_decode(file_get_contents(__DIR__ . "/../Data/SeriesRegistrationSavedApplicationDataTeam.json"),
            true);

        $application = $application_started
            ? $saved_application
            : null;

        if ($application) {
            $force_paid = $application_paid;
            foreach ($application['disciplines'] as &$discipline) {
                foreach ($discipline['levels'] as &$level) {
                    $level['is_paid'] = $force_paid;
                }
            }
        }

        return $application;
    }


    public static function disciplineLevels($discipline_name, $initial_id = 1)
    {
        $id     = $initial_id;
        $result = [];
        for ($i = 0; $i < 5; $i++) {
            $result[] = [
                'name'     => sprintf("%s Level %s", $discipline_name, $i + 1),
                'level_id' => $i + 1,
                'id'       => $id++,
                'price'    => 30 + $i
            ];
        }

        return $result;
    }


    public static function PartnerSearchAPIResponse(array $results)
    {
        $values                         = array_values($results);
        $citizenship_eligibility_active = simulation_arg_present('partner_cea');
        $ineligible_created = false;

        return [
            'results' => array_map(function ($item, $index) use (
                $citizenship_eligibility_active,
                &$ineligible_created
            ) {
                $item['eligible_levels'] = [];
                $discipline_levels       = SeriesRegistrationFactory::disciplineLevels('Partner Compatible');
                $item['eligible_levels'] = [

                ];

                $partner_compatible = false;
                if ($index && $index % 3 !== 0) {
                    $item['eligible_levels'] = [
                        $discipline_levels[0],
                        $discipline_levels[2],
                        $discipline_levels[4],
                    ];
                    $partner_compatible      = true;
                }
                if ($index && $index % 5 === 0) {
                    $item['eligible_levels'] = [
                        $discipline_levels[1],
                        $discipline_levels[3],
                    ];
                    $partner_compatible      = true;
                }
                if ($index && $index % 7 === 0) {
                    $item['eligible_levels'] = [
                        SeriesRegistrationFactory::disciplineLevels('Partner Incompatible', 300)[0]
                    ];
                }

                if ($citizenship_eligibility_active && $partner_compatible) {
                    $is_c_ineligible = ! $ineligible_created
                        ?: ! ! rand(0, 1);
                    if ($is_c_ineligible) {
                        $item['is_citizenship_ineligible'] = $is_c_ineligible;
                        $item['last_name']                 = $item['last_name'] . " (IC)";
                        $ineligible_created                = true;
                    }
                }

                return $item;
            }, $values, array_keys($values))
        ];
    }


    public static function SeriesRegistrationUserSeriesEligibilityData(
        array $series_data
    ) {
        $ineligible = simulation_arg_present('no_eligibility');

        return array_map(function ($item) use ($ineligible) {
            return [
                'discipline_id'   => $item['id'],
                'eligible_levels' => $ineligible
                    ? []
                    : SeriesRegistrationFactory::disciplineLevels($item['name'])
            ];
        }, $series_data['disciplines']);
    }


    private static function ApplicationConfigurationData()
    {
        return [
            'disciplines'           => [
                [
                    'id'                    => 1,
                    'coach_limit'           => 2,
                    'partner_configuration' => [
                        'is_partnered'  => false,
                        'partner_rules' => []
                    ],
                    'name'                  => 'Singles',
                ],
                [
                    'id'                    => 2,
                    'coach_limit'           => 3,
                    'partner_configuration' => [
                        'is_partnered'  => true,
                        'partner_rules' => [
                            'opposite_gender',
                            'compatible_levels'
                        ]
                    ],
                    'name'                  => 'Dance',
                ],
                [
                    'id'                    => 3,
                    'coach_limit'           => 3,
                    'partner_configuration' => [
                        'is_partnered'  => true,
                        'partner_rules' => [
                            'compatible_levels',
                            'opposite_gender',
                        ]
                    ],
                    'name'                  => 'Pairs',
                ]
            ],
            'levels_information'    => 'Series participants may skate at their current test level, and/or "skate up" one level for the series. Note: if athletes register for two levels within the NQS Series (i.e. current test level and "skate up"), they can only compete in one level at a time at each series competition.',
            'level_maximum'         => simulation_arg_present('single_level')
                ? 1
                : 2,
            'eligibility_documents' => [
                [
                    'name' => 'Singles Eligibility (PDF)',
                    'link' => 'https://placehold.it/500x500&text=Singles+Eligibility+(PDF)'
                ],
                [
                    'name' => 'Dance Eligibility (PDF)',
                    'link' => 'https://placehold.it/500x500&text=Dance+Eligibility+(PDF)'
                ],
                [
                    'name' => 'Pairs Eligibility (PDF)',
                    'link' => 'https://placehold.it/500x500&text=Pairs+Eligibility+(PDF)'
                ]
            ],
        ];
    }


    private static function ApplicationConfigurationDataTeam()
    {
        $mock = [
            'disciplines'           => [
                [
                    'id'                    => 1,
                    'coach_limit'           => 0,
                    'partner_configuration' => [
                        'is_partnered'  => false,
                        'partner_rules' => []
                    ],
                    'name'                  => 'Synchro',
                ],
                [
                    'id'                    => 2,
                    'coach_limit'           => 0,
                    'partner_configuration' => [
                        'is_partnered'  => false,
                        'partner_rules' => []
                    ],
                    'name'                  => 'Compete USA/Teams',
                ]
            ],
            'levels_information'    => 'Team series specific levels information',
            'level_maximum'         => 1,
            'eligibility_documents' => [
                [
                    'name' => 'Eligibility (PDF)',
                    'link' => 'https://placehold.it/500x500&text=Eligibility+(PDF)'
                ]
            ],
        ];

        if (simulation_arg_present('no_ts_docs')) {
            $mock['eligibility_documents'] = [];
        }

        return $mock;
    }


    public static function OverviewSeriesData($overrides = [])
    {
        $faker         = Factory::create();
        $deadline_data = self::deadlineData($overrides);
        $core_data     = SeriesRegistrationFactory::SeriesRegistrationSeriesCoreData($overrides);
        $id            = $core_data['id'];
        $data          = array_merge([
            'application_deadline_formatted' => [
                'date' => $deadline_data['application_deadline_date_formatted'],
                'time' => $deadline_data['application_deadline_time_formatted']
            ],
            'links'                          => [
                'application' => sprintf('/pages/series-registration/%s/application', $id),
                'checkout'    => sprintf('/pages/series-registration/%s/cart', $id),
                'standings'   => sprintf('/pages/series-registration/%s/standings', $id),
                'series_list' => '/pages/series-registration'
            ],
            'application_configuration'      => self::ApplicationConfigurationData(),
            'status'                         => [
                'message'             => self::statusMessage($overrides),
                'applications_open'   => array_key_exists('_applications_open', $overrides)
                    ? $overrides['_applications_open']
                    : $faker->boolean,
                'standings_available' => array_key_exists('_standings_available', $overrides)
                    ? $overrides['_standings_available']
                    : $faker->boolean,
            ],
            'contact_email_address'          => 'NQS@usfigureskating.org',
            'refund_email_address'           => 'productsupport@usfigureskating.org',
            'statement'                      => 'The National Qualifying Series (NQS) is a series of official U.S. Figure Skating approved
                            competitions hosted individually by member clubs nationwide that are held in a standard
                            format and in which athletes earn official scores towards a sectional and national rank. The
                            competitions are held between June 1 - September 15 and serve juvenile - senior competitors
                            in singles, dance and pairs. Athletes must register to participate in the series no later
                            than May 28th and then must register for each series competition separately through EMS.',
            'reports'                        => [
                [
                    'name' => 'Series Results Report',
                    'link' => 'https://placehold.it/500x500&text=Series+Results+Report'
                ],
                [
                    'name' => 'Series Application Report',
                    'link' => 'https://placehold.it/500x500&text=Series+Application+Report'
                ]
            ],
            'resource_documents'             => [
                [
                    'name'          => 'Resources (PDF)',
                    'link'          => 'https://placehold.it/500x500&text=Singles+Resources',
                    'discipline_id' => 1
                ],
                [
                    'name'          => 'Resources (PDF)',
                    'link'          => 'https://placehold.it/500x500&text=Dance+Resources',
                    'discipline_id' => 2
                ],
                [
                    'name'          => 'Resources (PDF)',
                    'link'          => 'https://placehold.it/500x500&text=Pairs+Resources',
                    'discipline_id' => 3
                ]
            ]
        ], $core_data);

        return self::stripApiOnlyData($data);
    }


    private static function statusMessage(array $overrides)
    {
        $application_paid = array_key_exists('_application_paid', $overrides)
            ? $overrides['_application_paid']
            : true;
        $map              = [
            //applications are closed
            false => [
                // application not started
                false => [
                    // Standings not available
                    false => [
                        'type_key' => 'info',
                        'text'     => "This series has started. You are not \n a participant. Standings are coming soon."
                    ],
                    // Standings available
                    true  => [
                        'type_key' => 'info',
                        'text'     => "This series has started. You are not \n a participant. Tap standings to view results."
                    ]
                ],
                // application started
                true  => [
                    // Standings not available
                    false => [
                        'type_key' => 'info',
                        'text'     => sprintf("Application deadline has%s passed.%s  Standings are coming soon.",
                            $application_paid
                                ? "\n"
                                : '',
                            $application_paid
                                ? ''
                                : ' You are not a participant.')
                    ],
                    // Standings available
                    true  => [
                        'type_key' => 'info',
                        'text'     => "Your series has started,\n tap \"Standings\" to view results."
                    ]
                ]
            ],
            // applications are open
            true  => [
                // application not started
                false => [
                    // Standings not available
                    false => [
                        'type_key' => 'success',
                        'text'     => "Application period\n is currently open. Don't delay!"
                    ],
                    // Standings available
                    true  => [
                        'type_key' => 'success',
                        'text'     => "Application period\n is currently open. Don't delay!"
                    ]
                ],
                // application started
                true  => [
                    // Standings not available
                    false => [
                        'type_key' => 'info',
                        'text'     => "You have already applied. Tap\n \"Update My Application\" to make changes."
                    ],
                    // Standings available
                    true  => [
                        'type_key' => 'info',
                        'text'     => "You have already applied. Tap\n \"Update My Application\" to make changes."
                    ]
                ]
            ]
        ];

        return $map[$overrides['_applications_open']][$overrides['_application_started']][$overrides['_standings_available']];
    }


    public static function SeriesRegistrationStandingsData()
    {
        return SeriesStandingsFactory::SeriesRegistrationStandingsData();
    }


    public static function SeriesRegistrationAppliedTeam($overrides = [])
    {
        $faker = Factory::create();
        $mock  = [
            'handbook' => [
                'name' => 'Handbook',
                'url'  => 'https://placehold.it/720x480&text=Handbook'
            ],
            'id'       => FieldFactory::id(),
            'name'     => $faker->catchPhrase,
            'level'    => FieldFactory::teamLevel(),
            'levels'   => []
        ];
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function SeriesRegistrationAppliedTeamsData($core_series_data, $teams)
    {
        $application_started = array_key_exists('_application_started',
                $core_series_data) && $core_series_data['_application_started'];
        if ( ! $application_started) {
            return null;
        }

        $result   = [];
        $level_id = 1;
        foreach ($teams as $team) {
            if ( ! $team->selection_information->is_selectable) {
                continue;
            }
            $button_text         = $team->selection_information->button->text;
            $application_started = $button_text !== 'Start';
            if ( ! $application_started) {
                continue;
            }
            $application_paid = $button_text === 'Update';
            $mock_team        = self::SeriesRegistrationAppliedTeam(array_merge((array) $team, [
                'levels' => [
                    [
                        "name"     => "Synchro Level 1",
                        "level_id" => 1,
                        "id"       => 1,
                        "price"    => 30,
                        "is_paid"  => $application_paid
                    ]
                ]
            ]));
            if ($level_id === 3) {
                unset($mock_team['handbook']);
            }
            $result[] = $mock_team;
        }

        return [
            'teams' => $result
        ];
    }


    public static function SupageSeriesSummaryData($overrides = [])
    {
        $faker = Factory::create();
        $id    = FieldFactory::id();

        $deadline_data      = self::deadlineData($overrides);
        $deadline_formatted = implode(' ', $deadline_data);

        $mock = [
            'application_deadline_formatted' => $deadline_formatted,
            'icon'                           => rand(0, 1) == 0
                ? '/images/series-icon.png'
                : '/images/series-icon-1.png',
            'id'                             => $id,
            'name'                           => $faker->catchPhrase,
            'is_team_series'                 => array_key_exists('is_team_series',
                    $overrides) && $overrides['is_team_series'],
            'links'                          => SeriesRegistrationFactory::SeriesLinksData($overrides)
        ];

        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }
}