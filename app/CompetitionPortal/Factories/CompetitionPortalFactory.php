<?php

namespace App\CompetitionPortal\Factories;

use App\factories\CompetitionFieldFactory;
use App\factories\CompetitionSearchCompetitionFactory;
use App\factories\FieldFactory;
use Carbon\Carbon;
use Faker\Factory;

class CompetitionPortalFactory
{

    public static function mockCompetitionSummary($overrides = [])
    {
        $competition_heading_data = CompetitionFieldFactory::CompetitionHeadingData($overrides);
        $id                       = array_key_exists('id', $overrides)
            ? $overrides['id']
            : FieldFactory::id();
        $mock                     = array_merge([
            'id'    => $id,
            'links' => CompetitionPortalFactory::mockCompetitionSummaryLinks([
                'id' => $id
            ]),
        ], $competition_heading_data);
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function mockCompetitionSummaryLinks($overrides = [])
    {
        $id   = array_key_exists('id', $overrides)
            ? $overrides['id']
            : FieldFactory::id();
        $mock = [
            'competition_portal' => CompetitionFieldFactory::viewCompetitionLink($id)
        ];
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function teamRegisteredCompetitions()
    {
        $list   = CompetitionSearchCompetitionFactory::competitionList(10);
        $result = [];
        foreach ($list as $item) {
            $result[] = self::teamRegisteredCompetition((array) $item);
        }

        return $result;
    }


    public static function teamRegisteredCompetition($overrides = [])
    {
        $foundation_data = CompetitionFieldFactory::CompetitionFoundationData($overrides);
        $mock            = array_merge($foundation_data, CompetitionFieldFactory::CompetitionIconData(),
            CompetitionFieldFactory::CompetitionFormattedDatesData($overrides), [
                'links' => [
                    'select_team' => sprintf('/pages/competitions/my-teams?id=%s', $foundation_data['id'])
                ]
            ]);
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function mockEntitySummary($overrides = [], $ids = null)
    {
        $faker        = Factory::create();
        $is_compliant = $faker->boolean;
        $is_team      = array_key_exists('is_team', $overrides) && $overrides['is_team'];
        $role_items   = json_decode(file_get_contents(__DIR__ . '/../Data/ComplianceHeaderRoleItems.json'));
        $mock         = [
            'name'       => $faker->catchphrase,
            'compliance' => [
                'status'                 => [
                    'type_key' => $is_compliant
                        ? 'success'
                        : 'alert',
                    'text'     => $is_compliant
                        ? 'Complete'
                        : 'Not Complete'
                ],
                'link'                   => [
                    'url'        => $ids
                        ? sprintf('/pages/competitions/competition-roster?id=%s&teamId=%s', $ids[0], $ids[1])
                        : sprintf('/pages/competitions/competition-roster?id=%s&teamId=%s', $faker->randomNumber(),
                            $faker->randomNumber()),
                    'is_new_tab' => true
                ],
                'supporting_description' => [
                    'text'     => $is_compliant
                        ? sprintf("Valid Through: %s", Carbon::now()->addMonth()->format('n/j/Y'))
                        : sprintf("Expired: %s", Carbon::now()->subMonth()->format('n/j/Y')),
                    'type_key' => $is_compliant
                        ? 'success'
                        : 'alert'
                ],
                'role_items'             => array_map(function ($role) use ($is_compliant) {
                    $role->items = array_map(function ($item) use ($is_compliant) {
                            $item->complete = $is_compliant;
                            return $item;
                    }, $role->items);

                    return $role;
                }, $role_items)
            ]

        ];

        if ($is_team) {
            unset($mock['compliance']['supporting_description']);
            unset($mock['compliance']['role_items']);
        }
        if ( ! $is_team) {
            unset($mock['name']);
        }

        if ($is_compliant) {
            unset($mock['compliance']['link']);
        }
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function mockCompetitionPortalCoreData($overrides = [])
    {
        $competition_override = array_key_exists('competition', $overrides)
            ? $overrides['competition']
            : [];
        $entity_override      = array_key_exists('entity', $overrides)
            ? $overrides['entity']
            : [];
        $mock                 = [
            'competition_summary' => self::mockCompetitionSummary($competition_override),
            'back_link'           => null
        ];

        if ($entity_override !== null) {
            $mock['entity_summary'] = self::mockEntitySummary($entity_override);
        }

        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;

    }


    public static function mockCompetitionInformation()
    {
        $faker             = Factory::create();
        $registered_events = [
            [
                'id'   => 1,
                'name' => "Intermediate Ladies",
            ],
            [
                'id'   => 2,
                'name' => "Intermediate Pairs",
            ],
            [
                'id'   => 3,
                'name' => "Advanced Pairs",
            ],
        ];
        $exclude_packages  = simulation_arg_present('no_packages');
        $result            = [
            'registered_events' => $registered_events,
            'practice_ice'      => [
                'terminology'   => $faker->text,
                'instructions'  => $faker->text,
                'not_offered'   => simulation_arg_present('no_pi'),
                'event_pricing' => array_values(array_map(function ($item) use ($exclude_packages) {
                    $result = [
                        'event_name'        => $item['name'],
                        'available_credits' => [
                            [
                                'name' => 'OPI',
                                'cost' => 10
                            ],
                            [
                                'name' => 'UPI',
                                'cost' => 11
                            ],
                            [
                                'name' => 'WU',
                                'cost' => 12
                            ]
                        ],
                    ];

                    if ( ! $exclude_packages) {
                        $result['available_credit_packages'] = [
                            [
                                'summary' => 'OPI:1, UPI:2',
                                'cost'    => 45
                            ],
                            [
                                'summary' => 'OPI:4, UPI:1',
                                'cost'    => 450
                            ]
                        ];
                    }

                    return $result;
                }, $registered_events)),
                'sales_windows' => call_user_func(function () {
                    $start = Carbon::now()->subDay()->timezone('America/New_York');

                    return [
                        // [
                        //     'name'                     => 'Pre-Purchase Sales',
                        //     'start_datetime_formatted' => $start->copy()->subDays(30)->format('m/d/Y h:iA T'),
                        //     'end_datetime_formatted'   => $start->format('m/d/Y h:iA T'),
                        //     'is_active'                => false
                        // ],
                        [
                            'name'                     => 'Pre-Purchase Selection',
                            'start_datetime_formatted' => $start->format('m/d/Y h:iA T'),
                            'end_datetime_formatted'   => $start->addDays(10)->format('m/d/Y h:iA T'),
                            'is_active'                => true
                        ],
                        [
                            'name'                     => 'Open Sales',
                            'start_datetime_formatted' => $start->format('m/d/Y h:iA T'),
                            'end_datetime_formatted'   => $start->addDays(10)->format('m/d/Y h:iA T'),
                            'is_active'                => false
                        ],
                        [
                            'name'                     => 'On-Site Sales',
                            'start_datetime_formatted' => $start->format('m/d/Y h:iA T'),
                            'end_datetime_formatted'   => $start->addDays(10)->format('m/d/Y h:iA T'),
                            'is_active'                => false
                        ]
                    ];
                })
            ]
        ];
        if (simulation_arg_present('pi_message')) {
            $result['practice_ice']['pricing_message'] = 'Pricing message lorem ipsum';
        }

        return $result;
    }


    public static function mockPracticeIceSchedulesData($competition_id, $team_id = null)
    {
        $id                           = $competition_id < 8
            ? $competition_id
            : 1;
        $competition_schedule         = new \App\CompetitionSchedule($id);
        $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/../../Data/SkaterCompetitonEventMap.json'));
        $event_ids                    = $competition_skater_event_map->$id;
        $events                       = [];
        foreach ($event_ids as $event_id) {
            $event                 = new \App\SkatingEvent($event_id, $id);
            $event->competition_id = (int) $id;
            unset($event->credit_config);
            unset($event->credit_packages);
            $events[] = $event;

        }

        $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/../../Data/SkaterCompetitionSchedule.json'),
            true);

        $competition_session_ids = $competition_skater_event_map[$id];
        $sessions                = [];
        $competition             = $competition_schedule;
        foreach ($competition->sessions as $session) {
            if (array_key_exists($session->id, $competition_session_ids)) {
                $adl_config = $competition_session_ids[$session->id];

                // if ($team_id && array_key_exists('scheduled_as', $adl_config)) {
                //     continue;
                // }
                $adl_config['session_id'] = $session->id;

                $result = [];
                foreach ($adl_config as $key => $value) {
                    $result[$key] = $value;
                }
                $result['session_id'] = $session->id;

                $sessions[] = $adl_config;
            }
        }
        $mapped_skater_schedule = [
            'events'                 => $events,
            'scheduled_session_maps' => $sessions
        ];

        return [
            'competition_schedule'   => $competition_schedule,
            'mapped_skater_schedule' => $mapped_skater_schedule,
        ];
    }


    public static function mockSkaterCompetitionSchedule($competition_id)
    {
        $id                           = $competition_id < 8
            ? $competition_id
            : 1;
        $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/../../Data/SkaterCompetitonEventMap.json'));
        $event_ids                    = $competition_skater_event_map->$id;
        $events                       = [];
        foreach ($event_ids as $event_id) {
            $event                 = new \App\SkatingEvent($event_id, $id);
            $event->competition_id = (int) $id;
            unset($event->credit_config);
            unset($event->credit_packages);
            $events[] = $event;

        }

        $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/../../Data/SkaterCompetitionSchedule.json'),
            true);
        $competition_session_ids      = $competition_skater_event_map[$id];
        $sessions                     = [];
        $competition                  = new \App\CompetitionSchedule($id);
        foreach ($competition->sessions as $session) {
            if (array_key_exists($session->id, $competition_session_ids)) {
                $adl_config = $competition_session_ids[$session->id];
                $result     = [];
                foreach ($adl_config as $key => $value) {
                    $result[$key] = $value;
                }
                $result['session'] = $session;

                $sessions[] = $result;
            }
        }

        return [
            'events'   => $events,
            'sessions' => $sessions
        ];
    }


    public static function mockSalesWindowKey($competition_id)
    {
        $id           = $competition_id < 8
            ? $competition_id
            : 1;
        $competitions = json_decode(file_get_contents(__DIR__ . '/../../Data/CompetitionData.json'));

        return $competitions->$id->active_sales_window;
    }
}