<?php

namespace App\Teams\CompetitionRegistration\Registration;

use App\factories\CompetitionFieldFactory;
use App\factories\FieldFactory;
use Carbon\Carbon;
use Faker\Factory;

class TeamsCompetitionRegistrationRegistrationFactory
{

    public static function mockTeamRegistrationCompetitionSummary($overrides = [])
    {

        $dates      = CompetitionFieldFactory::CarbonStartEndDates();
        $start_date = $dates['start_date'];
        $end_date   = $dates['end_date'];
        if (array_key_exists('start_date_ts', $overrides)) {
            $start_date = Carbon::createFromTimestamp($overrides['start_date_ts']);
        }
        if (array_key_exists('end_date_ts', $overrides)) {
            $end_date = Carbon::createFromTimestamp($overrides['end_date_ts']);
        }
        $mock = array_merge([
            'start_date_pretty' => $start_date->format('n/j/Y'),
            'end_date_pretty'   => $end_date->format('n/j/Y'),
            'links'             => [
                'cart' => '/pages/cart'

            ],
        ], CompetitionFieldFactory::CompetitionIconData(), CompetitionFieldFactory::CompetitionFoundationData());

        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;

    }

    public static function mockTeamRegistrationTeamSummary($overrides = [])
    {
        $faker = Factory::create();
        $mock  = [
            'name'          => $faker->catchPhrase,
            'level'         => FieldFactory::teamLevel(),
            'has_prop_crew' => true,
            'initial_page'  => 'team_verification'
        ];
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }

    public static function MockTeamRegistrationTeamProfile($overrides = [])
    {
        $faker = Factory::create();
        $mock  = [
            'id'                => FieldFactory::id(),
            'club'              => FieldFactory::clubName(),
            'level'             => FieldFactory::teamLevel(),
            'member_number'     => FieldFactory::id(),
            'membership_status' => FieldFactory::memberStatus(),
            'name'              => $faker->catchPhrase,
            'section'           => FieldFactory::memberSection(),
        ];
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function mockRegistrationInformation($competition)
    {

        $reg_deadline = Carbon::parse($competition->registration_deadline);

        return [
            'All foreign skaters, coaches, and team personnel are required to have a U.S. Figure Skating account prior to being associated with a competition registration. To create an account, access the main log in page and choose “Non-Member – Create Account”.',
            sprintf('Online registration is the ONLY method of entry into %s', $competition->name),
            sprintf('The entry deadline is %s', $reg_deadline->format('n/j/Y, g:i a T')),
            'All competitors are required to review the <a href="https://placehold.it/300x300&text=Announcement">competition announcement</a> and <a href="https://placehold.it/300x300&text=Website">competition website</a> prior to registering for the competition.',
            'To complete your registration, you will need the following: valid credit card and a valid email address.'
        ];
    }


    public static function mockTeamRegistrationPriceInformation($use_qualifying = false)
    {
        if ($use_qualifying) {
            return json_decode(file_get_contents(__DIR__ . "/Data/PriceInformationQualifying.json"), true);
        }

        return json_decode(file_get_contents(__DIR__ . "/Data/PriceInformationNonqualifying.json"), true);
    }


    public static function mockEventSelectionEvents()
    {
        $result  = [];
        $default = [
            [
                'id'                => 1,
                'is_registered_for' => true,
                'is_selected'       => false,
                'judging_system'    => 'IJS',
                'music_required'    => true,
                'name'              => 'Senior Team SP',
                'ppc_required'      => false
            ],
            [
                'id'                => 2,
                'is_registered_for' => false,
                'is_selected'       => true,
                'judging_system'    => 'IJS',
                'music_required'    => true,
                'name'              => 'Open Juvenile Teams',
                'ppc_required'      => false
            ],
            [
                'id'                => 3,
                'is_registered_for' => false,
                'is_selected'       => false,
                'judging_system'    => '6.0',
                'music_required'    => true,
                'name'              => 'Senior Team FS',
                'ppc_required'      => false
            ],
        ];
        $current_id = 1;
        foreach ($default as $item) {
            $result[] = TeamsCompetitionRegistrationRegistrationFactory::mockEventSelectionEvent(array_merge($item, [
                'id'                => $current_id++
            ]));
        }
        for ($i = 0; $i < 50; $i++) {
            $result[] = TeamsCompetitionRegistrationRegistrationFactory::mockEventSelectionEvent([
                'id'                => $current_id++,
                'is_registered_for' => false,
                'is_selected'       => false,
            ]);
        }

        return $result;
    }


    public static function mockEventSelectionEvent($overrides = [])
    {
        $faker = Factory::create();
        $mock  = [
            'id'                => FieldFactory::id(),
            'is_registered_for' => $faker->boolean,
            'is_selected'       => $faker->boolean,
            'judging_system'    => [ 'IJS', '6.0' ][rand(0, 1)],
            'music_required'    => $faker->boolean,
            'name'              => $faker->catchPhrase,
            'ppc_required'      => $faker->boolean
        ];
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }
}