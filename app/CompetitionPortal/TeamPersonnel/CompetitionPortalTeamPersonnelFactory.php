<?php

namespace App\CompetitionPortal\TeamPersonnel;

use App\factories\FieldFactory;
use App\Teams\CompetitionRegistration\Registration\Factories\AbstractTeamEntityFactory;
use App\Teams\CompetitionRegistration\Registration\Factories\TeamRosterFactory;
use Faker\Factory;

class CompetitionPortalTeamPersonnelFactory
{

    public static function mockEntities()
    {

        $result = [];
        foreach (AbstractTeamEntityFactory::mockCoreRoster() as $index => $entity) {
            $overrides = [];
            if ( ! $entity['can_be_added_to_roster'] && strpos($entity['cannot_be_added_to_roster_reason'],
                    'Ineligible')) {
                $overrides['is_ineligible'] = true;
            }
            $result[] = array_merge($entity, CompetitionPortalTeamPersonnelFactory::mockTeamPerson($overrides));
        }

        return TeamRosterFactory::sortRoster($result);
    }


    public static function mockTeamPerson($overrides = [])
    {
        $faker        = Factory::create();
        $is_compliant = array_key_exists('is_compliant', $overrides)
            ? $overrides['is_compliant']
            : true;

        $mock         = [
            'id'                 => (string) FieldFactory::id(),
            'first_name'         => $faker->firstName,
            'last_name'          => $faker->lastName,
            'is_compliant'       => $is_compliant,
            'is_ineligible'      => false,
            'member_number'      => FieldFactory::memberNumber(),
            'compliance_summary' => self::mockComplianceSummary((boolean)$is_compliant),
        ];

        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    private static function mockComplianceSummary($is_compliant)
    {
        return [
            [
                'complete' => true,
                'name'     => 'Coach Code of Ethics'
            ],
            [
                'complete' => $is_compliant,
                'name'     => 'Background Check'
            ],
            [
                'complete' => true,
                'name'     => 'Membership'
            ],
            [
                'complete' => true,
                'name'     => 'CER'
            ],
            [
                'complete' => $is_compliant,
                'name'     => 'Liability Insurance'
            ],
            [
                'complete' => $is_compliant,
                'name'     => 'PSA'
            ],
            [
                'complete' => $is_compliant,
                'name'     => 'SafeSport'
            ]
        ];
    }
}