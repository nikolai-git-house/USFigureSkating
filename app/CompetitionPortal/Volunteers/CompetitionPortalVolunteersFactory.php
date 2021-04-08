<?php

namespace App\CompetitionPortal\Volunteers;

use App\factories\FieldFactory;
use Carbon\Carbon;
use Faker\Factory;

class CompetitionPortalVolunteersFactory
{

    private static function mockShiftSelectionScheduleLocation()
    {
        $faker = Factory::create();

        return [
            'name' => "{$faker->company} {$faker->companySuffix}",
            'id'   => (string) FieldFactory::id(),
        ];
    }


    private static function mockLocationShifts(array $overrides = [])
    {
        $shifts         = [];
        $start_datetime = Carbon::now()->timezone('UTC')->setTime(0, 0, 0, 0);
        if (simulation_arg_present('shift_selection_past')) {
            $start_datetime->subMonth();
        }
        if (simulation_arg_present('shift_selection_in_progress')) {
            $start_datetime->subDays(2);
        }
        if (simulation_arg_present('shift_selection_today')) {
            $start_datetime->subDays(1);
        }
        for ($j = 0; $j < 4; $j++) {
            $start_datetime->addDay()->setTime(0, 0, 0, 0);
            for ($i = 0; $i < 16; $i++) {
                $shifts[] = self::mockShiftSelectionShift(array_merge([
                    '_start_time' => $start_datetime->addMinutes(30),
                    '_status'     => 'new'
                ], $overrides));
            }
        }

        return $shifts;
    }


    public static function mockShiftSelectionSchedule()
    {
        $locations = [];
        for ($i = 0; $i < 10; $i++) {
            $locations[] = self::mockShiftSelectionScheduleLocation();
        }
        $shifts = [];
        foreach ($locations as $location) {
            $shifts = array_merge($shifts, self::mockLocationShifts([
                'location_id'   => $location['id'],
                'location_name' => $location['name']
            ]));
        }
        $shifts[0]['_status']         = 'approved';
        $shifts[6]['_status']         = 'pending';
        $shifts[10]['open_positions'] = 0;
        $shifts[10]['openings_status'] = 'alert';
        $shifts[11]['_status']        = 'denied';
        usort($shifts, function ($shift, $shiftb) {
            return $shift['start_datetime_ts'] - $shiftb['start_datetime_ts'];
        });

        $selected_shifts = array_values(array_filter($shifts, function ($shift) {
            if (in_array($shift['_status'], [ 'denied', 'pending', 'approved' ])) {
                return true;
            }

            return false;
        }));

        foreach ($shifts as $index => $shift) {
            foreach ($shift as $key => $value) {
                if (strpos($key, '_') === 0) {
                    unset($shifts[$index][$key]);
                }
            }
        }

        $result = [
            'schedule' => compact('locations', 'shifts'),

        ];
        if ( ! simulation_arg_present('no_shift_selections')) {
            $result['selected_shifts'] = array_map(function ($shift) {
                return [
                    'status'   => $shift['_status'],
                    'shift_id' => $shift['id']
                ];
            }, $selected_shifts);
        }

        return $result;
    }


    public static function mockMyVolunteerSchedule($competition_id = null)
    {
        return [
            self::mockMyVolunteerScheduleDay([
                'date_formatted' => 'Mon 7/22'
            ]),
            self::mockMyVolunteerScheduleDay([
                'date_formatted' => 'Mon 8/15'
            ])
        ];
    }


    public static function mockMyVolunteerScheduleShift(array $overrides = [])
    {
        $faker    = Factory::create();
        $approved = $faker->boolean;
        $mock     = array_merge([
            'is_approved' => $approved,
            'is_pending'  => ! $approved,
        ], self::mockVolunteerShiftBase($overrides));
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    private static function mockVolunteerShiftBase($overrides = [])
    {
        $faker = Factory::create();

        $start_hour = array_key_exists('start_hour', $overrides)
            ? $overrides['start_hour']
            : rand(1, 11);

        $open_positions = $faker->numberBetween(0, 5);
        $mock           = [
            'id'                   => (string) FieldFactory::id(),
            'start_time_formatted' => sprintf('%s:00 AM', $start_hour),
            'end_time_formatted'   => sprintf('%s:00 AM', $start_hour + 2),
            'position_title'       => $faker->catchPhrase,
            'location_name'        => $faker->company,
            'requires_compliance'  => $faker->boolean,
            'total_positions'      => $faker->numberBetween(10, 15),
            'open_positions'       => $open_positions,
            'openings_status'      => $open_positions === 0
                ? 'alert'
                : 'success',
            'description'          => $faker->text
        ];
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    private static function mockMyVolunteerScheduleDay(array $overrides = [])
    {
        $faker = Factory::create();
        $days  = [
            'Mon',
            'Tues',
            'Weds',
            'Thurs',
            'Fri',
            'Sat',
            'Sun'
        ];
        $date  = $faker->dateTime();
        $mock  = [
            'date_formatted' => sprintf('%s %s', $days[$date->format('w')], $date->format('n/j')),
            'shifts'         => [
                self::mockMyVolunteerScheduleShift([
                    'start_hour'          => 6,
                    'requires_compliance' => false,
                    'is_approved'         => true,
                    'is_pending'          => false
                ]),
                self::mockMyVolunteerScheduleShift([
                    'start_hour'          => 7,
                    'requires_compliance' => false,
                    'is_approved'         => false,
                    'is_pending'          => true
                ]),
                self::mockMyVolunteerScheduleShift([
                    'start_hour'          => 9,
                    'requires_compliance' => true,
                    'is_approved'         => true,
                    'is_pending'          => false
                ]),
                self::mockMyVolunteerScheduleShift([
                    'start_hour'          => 11,
                    'requires_compliance' => true,
                    'is_approved'         => false,
                    'is_pending'          => true
                ]),
            ]
        ];
        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;
    }


    public static function mockShiftSelectionShift($overrides = [])
    {
        $statuses = [ 'new', 'approved', 'pending', 'conflict', 'denied', 'no_availability' ];
        $status   = array_key_exists('_status', $overrides)
            ? $overrides['_status']
            : $statuses[rand(0, count($statuses) - 1)];
        $date     = Carbon::now()->addDays(rand(0, 4))->timezone('UTC')->setTime(0, 0, 0, 0);
        if (array_key_exists('_start_time', $overrides)) {
            $date = $overrides['_start_time']->copy();
        }
        $map = [
            'conflict'        => 'Conflicts with another one of your shifts.',
            'denied'          => 'Your shift request is not approved.',
            'no_availability' => 'No availability.'
        ];
        if ($status === 'no_availability') {
            $overrides['open_positions']  = 0;
            $overrides['openings_status'] = 'alert';
        }
        $description = null;
        if (array_key_exists($status, $map)) {
            $description = $map[$status];
        }
        $base       = self::mockVolunteerShiftBase(array_merge([
            'start_time_formatted' => $date->format('g:i A'),
            'end_time_formatted'   => $date->addMinutes(60)->format('g:i A')
        ], $overrides));
        $start_date = Carbon::parse($date->toDateString() . ' ' . $base['start_time_formatted']);
        $end_date   = Carbon::parse($date->toDateString() . ' ' . $base['end_time_formatted']);
        $mock       = array_merge([
            '_status'            => $status,
            'status_description' => $description,
            'date_ts'            => $date->timezone('UTC')->setTime(0, 0, 0, 0)->timestamp,
            'date_formatted'     => $date->format('l, F j, Y'),
            'location_id'        => (string) FieldFactory::id(),
            'start_datetime_ts'  => $start_date->timezone('UTC')->timestamp,
            'end_datetime_ts'    => $end_date->timezone('UTC')->timestamp,
        ], $base);

        if ($mock['status_description'] === null) {
            unset($mock['status_description']);
        }

        foreach ($mock as $field => $value) {
            if (array_key_exists($field, $overrides)) {
                $mock[$field] = $overrides[$field];
            }
        }

        return $mock;

    }


    public static function mockMyVolunteerScheduleContacts()
    {
        $faker  = Factory::create();
        $result = [];
        for ($i = 0; $i < rand(4, 8); $i++) {
            $result[] = [
                'name'  => $faker->name,
                'role'  => $faker->jobTitle,
                'email' => $faker->email
            ];
        }

        usort($result, function ($a, $b) {
            return strnatcmp($a['role'], $b['role']);
        });

        array_unshift($result, [
            'name'  => $faker->name,
            'role'  => 'Volunteer Chair',
            'email' => $faker->email
        ]);

        return $result;
    }
}