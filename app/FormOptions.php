<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/6/18
 * Time: 11:23 AM
 */

namespace App;

class FormOptions
{

    static $categories = [
        'free_skating',
        'pair',
        'dance',
        'free_dance',
        'figure',
        'testable_discipline_6',
    ];


    public static function skate_test_disciplines()
    {
        $categories = self::$categories;
        $result     = [];
        foreach ($categories as $value) {
            $result[] = [
                'label' => ucwords(str_replace('_', ' ', $value)),
                'key'   => $value,
            ];
        }

        return $result;
    }


    public static function skate_test_options()
    {
        $categories = self::$categories;

        return array_reduce($categories, function ($carry, $item) {
            if ( ! array_key_exists($item, $carry)) {
                $carry[$item] = [];
            }
            for ($i = 1; $i < 7; $i++) {
                $carry[$item][] = [
                    'label'    => ucwords(str_replace('_', ' ', $item)) . ' Option ' . $i,
                    'value'    => $item . "_value_" . $i,
                    'level_id' => $i
                ];
            }

            return $carry;
        }, []);
    }


    public static function state_options()
    {
        $states = json_decode(file_get_contents(__DIR__ . '/../app/Data/States.json'), true);
        $result = [];
        foreach ($states as $key => $value) {
            $result[] = [
                'label' => $value,
                'value' => $key
            ];
        }

        return $result;
    }


    public static function country_options($restricted = false)
    {
        $result = [
            [
                'label'     => "United States",
                'value'     => "usa",
                'is_usa'    => true,
                'is_canada' => false,
            ],
            [
                'label'     => "Canada",
                'value'     => "canada",
                'is_usa'    => false,
                'is_canada' => true,
            ]

        ];
        if ($restricted) {
            return $result;
        }

        for ($i = 1; $i < 11; $i++) {
            $result[] = [
                'label'     => "Country " . $i,
                'value'     => "country" . $i,
                'is_usa'    => false,
                'is_canada' => false,
            ];
        }

        return $result;
    }


    public static function province_options()
    {
        $result = [];

        for ($i = 1; $i < 11; $i++) {
            $result[] = [
                'label' => "Province " . $i,
                'value' => "province" . $i,
            ];
        }

        return $result;
    }


    public static function federation_options()
    {
        $result = [];

        for ($i = 1; $i < 11; $i++) {
            $result[] = [
                'label' => "Federation " . $i,
                'value' => "federation" . $i,
            ];
        }

        return $result;
    }


    public static function create_account_options()
    {

        return [
            'states'                 => self::state_options(),
            'countries'              => self::country_options(),
            'federations'            => self::federation_options(),
            'provinces'              => self::province_options(),
            'skate_tests'            => self::skate_test_options(),
            "skate_test_disciplines" => self::skate_test_disciplines()
        ];
    }


    public static function edit_profile_options()
    {
        $data = json_decode(file_get_contents(__DIR__ . "/./Data/FormOptions.json"));

        return [
            'user_prefixes'   => $data->user_prefixes,
            'user_suffixes'   => $data->user_suffixes,
            'mobile_carriers' => $data->mobile_carriers,
        ];
    }


    public static function waiver_relationships()
    {
        $data = json_decode(file_get_contents(__DIR__ . "/./Data/FormOptions.json"));
        return $data->waiver_relationships;

    }


    public static function search_state_options()
    {
        $result  = [];
        $coaches = \App\Coach::allKeyed();
        $added   = [];
        foreach ($coaches as $coach) {
            $state_abbreviation = $coach['state_abbreviation'];
            if ( ! in_array($state_abbreviation, $added)) {
                $result[] = [
                    'value' => $state_abbreviation,
                    'label' => $state_abbreviation,
                ];
                $added[]  = $state_abbreviation;
            }
        }
        sort($result);
        return $result;
    }


    public static function clubs()
    {
        $data = json_decode(file_get_contents(__DIR__ . "/./Data/FormOptions.json"));

        return $data->clubs;
    }


    public static function billing_address_options()
    {
        return [
            'states'    => self::state_options(),
            'countries' => self::country_options(true),
            'provinces' => self::province_options(),
        ];
    }


    public static function coach_state_options()
    {
        $result  = [];
        $coaches = Coach::allKeyed();
        $added   = [];
        foreach ($coaches as $coach) {
            $state_abbreviation = $coach['state_abbreviation'];
            if ( ! in_array($state_abbreviation, $added)) {
                $result[] = [
                    'value' => $state_abbreviation,
                    'label' => $state_abbreviation,
                ];
                $added[]  = $state_abbreviation;
            }
        }
        sort($result);
        return $result;
    }


    public static function find(array $options_array, $option_value)
    {

        foreach ($options_array as $option) {
            if ($option['value'] === $option_value) {
                return $option;
            }
        }

        return null;
    }
}