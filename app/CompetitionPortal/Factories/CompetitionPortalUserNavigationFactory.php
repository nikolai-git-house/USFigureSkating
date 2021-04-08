<?php

namespace App\CompetitionPortal\Factories;

use App\factories\FieldFactory;

class CompetitionPortalUserNavigationFactory
{

    public static function mockUserNavigation($overrides = [])
    {

        if (simulation_arg_present('no_schedule')) {
            $overrides['schedule_available'] = false;
        }
        if (simulation_arg_present('cd_action')) {
            $overrides['cd_action'] = true;
        }
        if (simulation_arg_present('pi_perm_raw')) {
            $overrides['pi_perm'] = 'raw';
        }
        if (simulation_arg_present('pi_perm_closing')) {
            $overrides['pi_perm'] = 'closing';
        }
        if (simulation_arg_present('music_ppc_incomplete')) {
            $overrides['music_ppc_incomplete'] = true;
        }
        if (simulation_arg_present('roster_incomplete')) {
            $overrides['roster_incomplete'] = true;
        }
        $secondary_segment = array_key_exists('team_id', $overrides)
            ? sprintf('&teamId=%s', $overrides['team_id'])
            : '';

        $competition_id = array_key_exists('id', $overrides)
            ? $overrides['id']
            : FieldFactory::id();
        $user_roles     = array_key_exists('user_roles', $overrides)
            ? $overrides['user_roles']
            : [];
        $schedule_ready = array_key_exists('schedule_available', $overrides)
            ? $overrides['schedule_available']
            : true;

        $is_ems = array_key_exists('is_ems', $overrides)
            ? $overrides['is_ems']
            : true;

        $cd_action = array_key_exists('cd_action', $overrides)
            ? $overrides['cd_action']
            : false;

        $pi_perm = array_key_exists('pi_perm', $overrides)
            ? $overrides['pi_perm']
            : false;

        $music_ppc_incomplete = array_key_exists('music_ppc_incomplete', $overrides)
            ? $overrides['music_ppc_incomplete']
            : false;
        $roster_incomplete    = array_key_exists('roster_incomplete', $overrides)
            ? $overrides['roster_incomplete']
            : false;

        if ( ! $is_ems) {
            return [
                [
                    'label' => 'Competition Contacts',
                    'url'   => sprintf('/pages/competition-contacts?id=%s%s', $competition_id, $secondary_segment),
                ],
            ];
        }
        $links = [
            self::getMySchedule($competition_id, $schedule_ready),
            self::getCoachCompetitionSchedule($competition_id, $schedule_ready),
            self::getCoachSchedule($competition_id, $schedule_ready),
            self::getCompetitionInformation($competition_id, $secondary_segment),
            self::getCompetitionDocuments($competition_id, $secondary_segment, [ $cd_action ]),
            self::getPracticeIceSchedule($competition_id, $secondary_segment, $schedule_ready, $pi_perm),
            self::getCompetitionRoster($competition_id, $secondary_segment, $roster_incomplete),
            self::getCompetitionTeamPersonnel($competition_id, $secondary_segment),
            self::getMusicAndPpc($competition_id, $secondary_segment, $music_ppc_incomplete),
            self::getMyCoaches($competition_id),
            self::getMySkaters($competition_id),
            self::getVolunteerShiftSelection($competition_id, $schedule_ready),
            self::getVolunteerSchedule($competition_id, $schedule_ready),
            self::getCompetitionContacts($competition_id, $secondary_segment),
            self::getCompetitionSchedule($competition_id, $secondary_segment, $schedule_ready),
        ];

        return array_reduce($links, function ($carry, $item) use ($user_roles) {
            $item_roles = $item['valid_roles'];
            $item_value = $item['item'];

            if ($item_roles === null || count(array_intersect($item_roles, $user_roles)) > 0) {
                $carry[] = $item_value;
            }

            return $carry;
        }, []);
    }


    /**
     * @param $competition_id
     * @param $schedule_ready
     *
     * @return array
     */
    private static function getMySchedule($competition_id, $schedule_ready)
    {


        return [
            'valid_roles' => [ 'skater' ],
            'item'        => array_merge([
                'label' => 'My Schedule',
                'url'   => sprintf('/pages/my-schedule?id=%s', $competition_id),
            ], $schedule_ready
                ? []
                : [
                    'is_disabled' => true,
                    'data'        => [
                        [
                            'content' => 'The schedule has not been posted. Try again later.'
                        ]
                    ]
                ])
        ];

    }


    /**
     * @param $competition_id
     * @param $schedule_ready
     *
     * @return array
     */
    private static function getCoachCompetitionSchedule($competition_id, $schedule_ready)
    {
        return [
            'valid_roles' => [ 'coach' ],
            'item'        => array_merge([
                'label' => 'Competition Schedule (Coach)',
                'url'   => sprintf('/pages/coach-competition-schedule?id=%s', $competition_id),
            ], $schedule_ready
                ? []
                : [
                    'is_disabled' => true,
                    'data'        => [
                        [
                            'content' => 'The schedule has not been posted. Try again later.'
                        ]
                    ]
                ])
        ];
    }


    /**
     * @param $competition_id
     * @param $schedule_ready
     *
     * @return array
     */
    private static function getCoachSchedule($competition_id, $schedule_ready)
    {
        return [
            'valid_roles' => [ 'coach' ],
            'item'        => array_merge([
                'label' => 'Coach Schedule',
                'url'   => sprintf('/pages/coach-schedule?id=%s', $competition_id),
            ], $schedule_ready
                ? []
                : [
                    'is_disabled' => true,
                    'data'        => [
                        [
                            'content' => 'The schedule has not been posted. Try again later.'
                        ]
                    ]
                ])
        ];
    }


    /**
     * @param $competition_id
     * @param $secondary_segment
     *
     * @return array
     */
    private static function getCompetitionInformation($competition_id, $secondary_segment)
    {
        return [
            'valid_roles' => [ 'coach', 'skater', 'team' ],
            'item'        => [
                'label' => 'Competition Information',
                'url'   => sprintf('/pages/competition-information?id=%s%s', $competition_id, $secondary_segment),
                'data'  => [
                    [
                        'content' => '2 Registered Events.'
                    ]
                ]
            ],
        ];
    }


    /**
     * @param $competition_id
     * @param $secondary_segment
     *
     * @return array
     */
    private static function getCompetitionDocuments($competition_id, $secondary_segment, $overrides)
    {
        return [
            'valid_roles' => [ 'coach', 'skater', 'team' ],
            'item'        => [
                'label' => 'Competition Documents',
                'url'   => sprintf('/pages/competitions/competition-documents?id=%s%s', $competition_id,
                    $secondary_segment),
                'data'  => [
                    [
                        'content' => $overrides[0]
                            ? 'Need to Check an action document'
                            : 'Reference Document Added (5 days ago).',
                        'icon'    => $overrides[0]
                            ? 'warning'
                            : 'new'
                    ]
                ]
            ],
        ];
    }


    /**
     * @param $competition_id
     * @param $secondary_segment
     * @param $schedule_ready
     *
     * @return array
     */
    private static function getPracticeIceSchedule($competition_id, $secondary_segment, $schedule_ready, $permutation)
    {
        $data = [
            [
                'content' => 'Pre-Purchase Begins: 6 days'
            ]
        ];
        if ($permutation === 'raw') {
            $data = [
                [
                    'content' => 'Pre-Purchase Begins: 6 days'
                ],
                [
                    'content' => 'No Credits Purchased',
                    'icon'    => 'warning'
                ]
            ];
        }
        if ($permutation === 'closing') {
            $data = [
                [
                    'content'     => 'Pre-Purchase Closes: 12 hours',
                    'status_type' => 'alert'
                ],
                [
                    'content' => 'Purchased: UPI: 4 / OPI: 3 / WU: 5',
                ],
                [
                    'content' => 'Unscheduled: UPI: 4 / OPI: 3 / WU: 5',
                ]
            ];
        }

        return [
            'valid_roles' => [ 'skater', 'team' ],
            'item'        => array_merge([
                'label' => 'Practice Ice / Schedule',
                'url'   => sprintf('/pages/practice-ice-schedule?id=%s%s', $competition_id, $secondary_segment),
            ], $schedule_ready
                ? [
                    'data' => $data
                ]
                : [
                    'is_disabled' => true,
                    'data'        => [
                        [
                            'content' => 'Practice Ice sales have not started yet. Try again later.'
                        ]
                    ]
                ])
        ];
    }


    /**
     * @param $competition_id
     * @param $secondary_segment
     *
     * @return array
     */
    private static function getCompetitionRoster($competition_id, $secondary_segment, $roster_incomplete)
    {
        $data = [
            [
                'content' => [
                    [
                        'text'     => 'Skaters: 12',
                        'type_key' => $roster_incomplete
                            ? 'alert'
                            : 'success'
                    ],
                    [
                        'text'     => $roster_incomplete
                            ? 'Deadline:12 hours'
                            : 'Deadline: 12/8/2020 11:59 PM ET',
                        'type_key' => $roster_incomplete
                            ? 'alert'
                            : 'success'
                    ]
                ]
            ]
        ];

        return [
            'valid_roles' => [ 'team' ],
            'item'        => [
                'label'       => 'Competition Roster',
                'url'         => sprintf('/pages/competitions/competition-roster?id=%s%s', $competition_id,
                    $secondary_segment),
                'data'        => $data,
                'is_complete' => ! ! ! $roster_incomplete,
            ],
        ];
    }


    /**
     * @param $competition_id
     * @param $secondary_segment
     *
     * @return array
     */
    private static function getCompetitionTeamPersonnel($competition_id, $secondary_segment)
    {
        return [
            'valid_roles' => [ 'team' ],
            'item'        => [
                'label'       => 'Competition Team Personnel',
                'url'         => sprintf('/pages/competitions/competition-team-personnel?id=%s%s', $competition_id,
                    $secondary_segment),
                'is_complete' => true,
                'data'        => [
                    [
                        'content' => 'Coaches:2'
                    ],
                    [
                        'content' => 'Team Service Personnel: 4'
                    ],
                    [
                        'content' => 'Prop Crew: 3'
                    ]
                ]

            ],
        ];
    }


    /**
     * @param $competition_id
     * @param $secondary_segment
     *
     * @return array
     */
    private static function getMusicAndPpc($competition_id, $secondary_segment, $incomplete)
    {
        return [
            'valid_roles' => [ 'skater', 'team' ],
            'item'        => [
                'label'       => 'Music & PPC',
                'url'         => sprintf('/pages/music-and-ppc?id=%s%s', $competition_id, $secondary_segment),
                'is_complete' => ! $incomplete,
                'data'        => $incomplete
                    ? [
                        [
                            'content' => 'Music Deadline: 5 days',
                            'icon'    => 'incomplete'
                        ],
                        [
                            'content' => 'PPC Deadline: 5 days',
                            'icon'    => 'incomplete'
                        ]
                    ]
                    : [
                        [
                            'content' => 'Music Deadline: 20 days',
                            'icon'    => 'complete'
                        ],
                        [
                            'content' => 'PPC Deadline: 20 days',
                            'icon'    => 'complete'
                        ]
                    ]
            ],
        ];
    }


    /**
     * @param $competition_id
     *
     * @return array
     */
    private static function getMyCoaches($competition_id)
    {
        return [
            'valid_roles' => [ 'skater' ],
            'item'        => [
                'label' => 'My Coaches',
                'url'   => sprintf('/pages/my-coaches?id=%s', $competition_id),

            ],
        ];
    }


    /**
     * @param $competition_id
     *
     * @return array
     */
    private static function getMySkaters($competition_id)
    {
        return [
            'valid_roles' => [ 'coach' ],
            'item'        => [
                'label' => 'My Skaters',
                'url'   => sprintf('/pages/my-skaters?id=%s', $competition_id),

            ],
        ];
    }


    /**
     * @param $competition_id
     * @param $secondary_segment
     *
     * @return array
     */
    private static function getCompetitionContacts($competition_id, $secondary_segment)
    {
        return [
            'valid_roles' => null,
            'item'        => [
                'label' => 'Competition Contacts',
                'url'   => sprintf('/pages/competition-contacts?id=%s%s', $competition_id, $secondary_segment),

            ],
        ];
    }


    /**
     * @param $competition_id
     * @param $secondary_segment
     * @param $schedule_ready
     *
     * @return array
     */
    private static function getCompetitionSchedule($competition_id, $secondary_segment, $schedule_ready)
    {
        return [
            'valid_roles' => null,
            'item'        => array_merge([
                'label' => 'Competition Schedule',
                'url'   => sprintf('/pages/competition-schedule?id=%s%s', $competition_id, $secondary_segment),
            ], $schedule_ready
                ? []
                : [
                    'is_disabled' => true,
                    'data'        => [
                        [
                            'content' => 'The schedule has not been posted. Try again later.'
                        ]
                    ]
                ])
        ];
    }


    public static function getVolunteerShiftSelection($competition_id, $schedule_ready)
    {
        return [
            'valid_roles' => [ 'volunteer' ],
            'item'        => array_merge([
                'label' => 'Volunteer Shift Selection',
                'url'   => sprintf('/pages/competitions/shift-selection?id=%s', $competition_id),
            ], $schedule_ready
                ? [
                    'data' => [
                        [
                            'status_type' => 'alert',
                            'content'     => 'Selection Closes: 12 hours'
                        ]
                    ]
                ]
                : [
                    'is_disabled' => true,
                    'data'        => [
                        [
                            'content' => 'Schedule Coming Soon. Try again later.'
                        ]
                    ]
                ])
        ];
    }


    public static function getVolunteerSchedule($competition_id, $schedule_ready)
    {
        return [
            'valid_roles' => [ 'volunteer' ],
            'item'        => array_merge([
                'label' => 'My Volunteer Schedule',
                'url'   => sprintf('/pages/competitions/volunteer-schedule?id=%s', $competition_id),
            ], $schedule_ready
                ? [
                    'data' => [
                        [
                            'icon'    => 'scheduled',
                            'content' => '4 Approved'
                        ],
                        [
                            'icon'    => 'pending',
                            'content' => '4 Pending'
                        ]
                    ]
                ]
                : [
                    'is_disabled' => true,
                    'data'        => [
                        [
                            'content' => 'No shifts selected yet.'
                        ]
                    ]
                ])
        ];
    }
}