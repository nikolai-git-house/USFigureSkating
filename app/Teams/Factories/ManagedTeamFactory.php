<?php

namespace App\Teams\Factories;

use App\factories\FieldFactory;

class ManagedTeamFactory
{

    public static function managedTeams()
    {
        $data = json_decode(file_get_contents(__DIR__ . './../Data/Teams.json'));
        foreach ($data as $index => $team) {
            $team->club    = FieldFactory::clubName();
            $team->section = FieldFactory::memberSection();
        }

        return $data;
    }


    public static function selectionLinks()
    {
        return [
            'competition_registration' => '/pages/competition-registration-teams/competitions'
        ];
    }
}