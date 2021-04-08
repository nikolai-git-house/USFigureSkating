<?php

namespace App\Teams\CompetitionRegistration\Registration\Factories;

use App\factories\FieldFactory;
use Faker\Factory;

class AbstractTeamEntityFactory
{

    static $invalid_reasons = [
        'Ineligible to participate',
        'Not a member',
    ];


    public static function mockCoreRoster($size = 20)
    {
        $roster     = [];
        $current_id = 1;
        for ($i = 0; $i < $size; $i++) {
            $roster[] = TeamRosterFactory::mockMember([
                'can_be_added_to_roster' => true,
                'id'                     => (string) $current_id++
            ]);
        }
        foreach (static::$invalid_reasons as $reason) {
            $roster[] = TeamRosterFactory::mockMember([
                'can_be_added_to_roster'           => false,
                'id'                               => (string) $current_id++,
                'cannot_be_added_to_roster_reason' => $reason
            ]);
        }

        return $roster;
    }


    public static function mockMember($overrides = [])
    {
        $mock = array_merge(static::uniqueMemberMock(), static::mockAbstractTeamEntityData($overrides));
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function uniqueMemberMock()
    {
        return [

        ];
    }


    public static function mockAbstractTeamEntityData($overrides = [])
    {
        $reasons      = static::$invalid_reasons;
        $faker        = Factory::create();
        $can_be_added = array_key_exists('can_be_added_to_roster', $overrides)
            ? $overrides['can_be_added_to_roster']
            : rand(0, 5) !== 4;
        $mock         = [
            'id'                     => (string) FieldFactory::id(),
            'last_name'              => $faker->lastName,
            'first_name'             => $faker->firstName,
            'member_number'          => FieldFactory::memberNumber(),
            'can_be_added_to_roster' => $can_be_added,
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


    public static function sortRoster($roster)
    {
        usort($roster, function ($itema, $itemb) {
            $namea = $itema['last_name'] . $itema['first_name'];
            $nameb = $itemb['last_name'] . $itemb['first_name'];

            return strnatcmp($namea, $nameb);
        });

        return $roster;
    }


    public static function mockSelections(&$team_roster, $minimum, $maximum, $select_cases = [])
    {
        if (in_array('incomplete', $select_cases)) {
            $maximum = $minimum - 1;
            $minimum = 1;
        }
        if (in_array('invalid', $select_cases)) {
            $maximum--;
        }
        if (in_array('ineligible', $select_cases)) {
            $maximum--;
        }
        $amount = rand($minimum, $maximum);

        $current_id   = (int) $team_roster[count($team_roster) - 1]['id'];
        $selected_ids = [];
        for ($i = 0; $i < $amount; $i++) {
            $current_id++;
            $selected_ids[] = (string) $current_id;
            $team_roster[]  = TeamRosterFactory::mockMember([
                'can_be_added_to_roster' => true,
                'id'                     => (string) $current_id
            ]);
        }

        if (in_array('invalid', $select_cases)) {
            $current_id++;
            $selected_ids[] = (string) $current_id;
            $team_roster[]  = TeamRosterFactory::mockMember([
                'can_be_added_to_roster'           => false,
                'cannot_be_added_to_roster_reason' => static::$invalid_reasons[rand(1,
                    count(static::$invalid_reasons) - 1)],
                'id'                               => (string) $current_id
            ]);
        }
        if (in_array('ineligible', $select_cases)) {
            $current_id++;
            $selected_ids[] = (string) $current_id;
            $team_roster[]  = TeamRosterFactory::mockMember([
                'can_be_added_to_roster'           => false,
                'cannot_be_added_to_roster_reason' => static::$invalid_reasons[0],
                'id'                               => (string) $current_id
            ]);
        }

        return $selected_ids;
    }
}