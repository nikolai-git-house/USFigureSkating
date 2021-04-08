<?php

namespace App\Teams\CompetitionRegistration;

use App\factories\CompetitionSearchCompetitionFactory;
use App\factories\ViewCompetitionFactory;
use Carbon\Carbon;

class TeamCompetitionRegistrationCompetitionFactory
{

    public static function mockCompetitionListCompetitionData()
    {
        $now                            = Carbon::now()->getTimestamp();
        $open_registration_competitions = array_filter(CompetitionSearchCompetitionFactory::competitionList(),
            function ($item) use ($now) {
                $reg_deadline = Carbon::parse($item->registration_deadline)->getTimestamp();

                return $reg_deadline > $now;
            });

        $result = [];
        foreach (array_values($open_registration_competitions) as $index => $base_data) {
            $view_competition_data = (object) ViewCompetitionFactory::ViewCompetitionData((array) $base_data);
            $registration_info     = (object) $view_competition_data->registration_cta_configuration;

            $overrides     = [];
            $is_qualifying = rand(0, 1) === 1;
            if ($index < 5) {
                $overrides['is_qualifying'] = false;
                $is_qualifying              = false;
            }
            if ($index == 0) {
                $overrides['competition_registration_status']   = 'late';
                $overrides['has_registration_deadline_warning'] = true;
                $overrides['user_registration_status']          = 'new';
                $overrides['name']                              = "Late Registration Open";
            }
            if ($index == 1) {
                $overrides['competition_registration_status']   = 'open';
                $overrides['has_registration_deadline_warning'] = false;
                $overrides['user_registration_status']          = 'new';
                $overrides['name']                              = "Registration Open";
            }
            if ($index == 2) {
                $overrides['competition_registration_status']   = 'open';
                $overrides['has_registration_deadline_warning'] = false;
                $overrides['user_registration_status']          = 'in_progress';
                $overrides['name']                              = "Registration In Progress";
            }
            if ($index == 3) {
                $overrides['competition_registration_status']   = 'open';
                $overrides['has_registration_deadline_warning'] = false;
                $overrides['user_registration_status']          = 'registered';
                $overrides['name']                              = "Registered";
            }
            if ($index == 4) {
                $overrides['competition_registration_status']   = 'future';
                $overrides['has_registration_deadline_warning'] = false;
                $overrides['user_registration_status']          = 'new';
                $overrides['name']                              = "Coming Soon";
            }

            $result[] = (object) array_merge([
                'id'                                => $base_data->id,
                'name'                              => $base_data->name . ( $is_qualifying
                        ? " qual"
                        : ' nonqual' ),
                'icon'                              => $base_data->icon,
                'city'                              => $base_data->city,
                'state'                             => $base_data->state,
                'club'                              => $base_data->club,
                'start_date_ts'                     => $base_data->start_date_ts,
                'end_date_ts'                       => $base_data->end_date_ts,
                'competition_registration_status'   => $registration_info->competition_registration_status,
                'has_registration_deadline_warning' => $registration_info->has_registration_deadline_warning,
                'registration_deadline'             => $registration_info->registration_deadline,
                'user_registration_link'            => sprintf('/pages/competition-registration-teams/%s',
                    $base_data->id),
                'user_registration_status'          => $registration_info->user_registration_status,
                'is_qualifying'                     => $is_qualifying,
                // 'series'                            => $base_data->series,
            ], $overrides);
        }

        return $result;
    }
}