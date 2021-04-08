<?php

namespace App\Teams\CompetitionRegistration\Registration\Factories;

class TeamRosterFactory extends AbstractTeamEntityFactory
{

    static $invalid_reasons = [
        'Ineligible to participate',
        'Not a member',
        'Invalid age'
    ];


    public static function uniqueMemberMock()
    {
        return [
            'age' => rand(6, 25),
        ];
    }

}