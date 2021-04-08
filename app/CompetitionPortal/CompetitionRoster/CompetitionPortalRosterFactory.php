<?php

namespace App\CompetitionPortal\CompetitionRoster;

use App\factories\FieldFactory;
use App\Teams\CompetitionRegistration\Registration\Factories\TeamRosterFactory;
use Faker\Factory;

class CompetitionPortalRosterFactory
{

    public static function mockTeamRoster()
    {
        $result       = [];
        $selected_ids = [];
        for ($i = 0; $i < 20; $i++) {
            $result[] = CompetitionPortalRosterFactory::mockTrackingRosterMember();
        }
        $result[] = CompetitionPortalRosterFactory::mockTrackingRosterMember([
            'is_ineligible'                    => false,
            'can_be_added_to_roster'           => false,
            'cannot_be_added_to_roster_reason' => 'Invalid Age',
            'age'                              => 1,
        ]);
        $result[] = CompetitionPortalRosterFactory::mockTrackingRosterMember([
            'is_ineligible'                    => false,
            'can_be_added_to_roster'           => false,
            'cannot_be_added_to_roster_reason' => 'Not a member',
        ]);
        $amount   = 4;
        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            $matches = [];
            preg_match('/cp_roster_length=([0-9]*)/', $_SERVER['HTTP_REFERER'], $matches);
            if (count($matches) > 1) {
                $amount = $matches[1];
            }
        }

        for ($i = 0; $i < $amount; $i++) {
            $id = (string) ( $i + 1 );

            $is_compliant  = true;
            $is_ineligible = false;
            if (simulation_arg_present('cp_roster_ineligible') && $i == 1) {
                $is_ineligible = true;
            }
            if (simulation_arg_present('cp_roster_noncompliant') && $i == 2) {
                $is_compliant = false;
            }
            $result[]       = CompetitionPortalRosterFactory::mockTrackingRosterMember([
                'id'                     => $id,
                'is_compliant'           => $is_compliant,
                'is_ineligible'          => $is_ineligible,
                'can_be_added_to_roster' => ! $is_ineligible
            ]);
            $selected_ids[] = $id;
        }

        return [
            'roster'       => TeamRosterFactory::sortRoster($result),
            'selected_ids' => $selected_ids
        ];
    }


    public static function mockTrackingRosterMember($overrides = [])
    {
        $competition_roster_member = CompetitionPortalRosterFactory::mockCompetitionRosterMember($overrides);
        if ($competition_roster_member['is_ineligible']) {
            $overrides['can_be_added_to_roster']           = false;
            $overrides['cannot_be_added_to_roster_reason'] = "Ineligible to participate";
        }
        $team_roster_member = CompetitionPortalRosterFactory::mockTeamRosterMember($overrides);
        $mock               = array_merge($competition_roster_member, $team_roster_member);

        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function mockCompetitionRosterMember($overrides = [])
    {
        $faker        = Factory::create();
        $is_compliant = array_key_exists('is_compliant', $overrides)
            ? $overrides['is_compliant']
            : true;

        $mock = [
            'id'                              => (string) FieldFactory::id(),
            'first_name'                      => $faker->firstName,
            'last_name'                       => $faker->lastName,
            'is_compliant'                    => $is_compliant,
            'is_ineligible'                   => rand(0, 5) === 3,
            'member_number'                   => FieldFactory::memberNumber(),
            'age'                             => $faker->numberBetween(8, 21),
            'compliance_requirements_summary' => self::mockComplianceRequirementsSummary($is_compliant)
        ];

        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function mockTeamRosterMember($overrides=[])
    {
        $faker        = Factory::create();
        $reasons      = [
            // 'Ineligible to participate', // This should not be part of the randomized options since it's defined from competition roster member mock
            'Not a member',
            'Invalid age'
        ];
        $can_be_added = array_key_exists('can_be_added_to_roster', $overrides)
            ? $overrides['can_be_added_to_roster']
            : rand(0, 5) !== 4;
        $mock         = [
            'id'                     => (string) FieldFactory::id(),
            'first_name'             => $faker->firstName,
            'last_name'              => $faker->lastName,
            'member_number'          => FieldFactory::memberNumber(),
            'can_be_added_to_roster' => $can_be_added,
            'age'                    => $faker->numberBetween(8, 21),

        ];
        if ( ! $mock['can_be_added_to_roster']) {
            $mock  ['cannot_be_added_to_roster_reason'] = $reasons[rand(0, count($reasons) - 1)];
        }

        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    private static function mockComplianceRequirementsSummary($is_compliant)
    {

        return [
            [
                'name'        => 'Requirements',
                'is_complete' => $is_compliant,
                'items'       => [
                    [
                        'name'                                 => 'Membership',
                        'complete'                             => $is_compliant,
                        'is_membership'                        => true,
                        'membership_expiration_date_formatted' => \Carbon\Carbon::tomorrow()->format('n/j/Y')
                    ],
                    [
                        'name'                => 'Age Verified',
                        'complete'            => $is_compliant,
                        'is_age_verification' => true,
                    ],
                    [
                        'name'     => 'Liability Waivers',
                        'complete' => $is_compliant
                            ? true
                            : ! $is_compliant,
                    ],
                    [
                        'name'     => 'Medical Registry',
                        'complete' => $is_compliant,
                    ]
                ]
            ],
            [
                'name'        => 'Compliance',
                'is_complete' => $is_compliant,
                'items'       => [
                    [
                        'name'     => 'SafeSport Training',
                        'complete' => $is_compliant,
                    ]
                ]
            ]
        ];
    }
}