<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/20/19
 * Time: 6:20 PM
 */

namespace App;

/**
 * Class SkateTestHistory
 * @package App
 */
class SkateTestHistory
{

    /**
     * Categories available for STH
     * @var array
     */
    static $categories = [
        'moves',
        'free_skating',
        'pair',
        'dance',
        'free_dance',
        'figure',
        'testable_discipline_7',
    ];


    /**
     * Create the core mock skate test history
     * @return \stdClass
     */
    static function core($partner = false)
    {
        $result     = new \stdClass();
        $categories = self::$categories;
        $tests      = self::all_tests();

        $result->disciplines = [];
        foreach ($categories as $category) {
            $test_history = self::savedTestHistory($category, $tests[$category], $partner);

            $result->disciplines[] = (object) [
                "label"               => ucwords(str_replace('_', ' ', $category)),
                "key"                 => $category,
                "available_tests"     => $tests[$category],
                "key_test"            => self::defaultKeyTest($category, $test_history),
                "self_reported_tests" => array_filter($test_history, function ($item) {
                    return $item->is_self_reported;
                }),
                "test_history"        => $test_history
            ];
        }

        return $result;
    }


    /**
     * Get the user test data configs
     * @return mixed
     */
    static function user_test_data($partner = false)
    {
        $str = $partner ? "Partner" : "User";

        return json_decode(file_get_contents(__DIR__ . "/Data/{$str}SkateTests.json"), true);
    }


    /**
     * Get all the tests possible for STH
     * @return array
     */
    static function all_tests()
    {
        $translation_map = [
            'moves'        => [
                "1" => "Junior Moves in the Field",
                "2" => "Senior Moves in the Field"
            ],
            'free_skating' => [
                "1" => "Junior Free Skate",
                "2" => "Junior Free Skate"
            ],
            'dance'        => [
                "2" => "Foxtrot",
                "3" => "Fourteenstep"
            ]
        ];
        $result          = [];
        foreach (self::$categories as $category) {
            $result[$category] = [];
            for ($i = 1; $i < 11; $i++) {
                $name = ucwords(str_replace('_', ' ', $category)) . " Test " . $i;
                if (array_key_exists($category, $translation_map)) {
                    if (array_key_exists($i, $translation_map[$category])) {
                        $name = $translation_map[$category][(string) $i];
                    }
                }
                $result[$category][] = (object) [
                    "label"    => $name,
                    "value"    => $category . "_" . $i,
                    "level_id" => $i
                ];
            }
        }

        return $result;
    }


    /**
     * Get the default key test set for the STH
     *
     * @param $category
     * @param $test_history
     *
     * @return array
     */
    private static function defaultKeyTest($category, $test_history)
    {

        if ($category === "dance" && count($test_history) >= 2) {
            return [
                $test_history[0],
                $test_history[1]
            ];
        }

        if ( ! count($test_history)) {
            return [];
        }
        $test = $test_history[0];

        return [
            (object) [
                'id'               => $test->id,
                'name'             => $test->name,
                'is_self_reported' => $test->is_self_reported,
                'level_id'         => $test->level_id
            ]
        ];
    }


    /**
     * Filter test options and remove those below or at current level
     *
     * @param $test_history
     *
     * @return mixed
     */
    static function clearOptionsFromKeys($test_history)
    {
        foreach ($test_history->disciplines as $discipline) {
            if (is_array($discipline->key_test) && count($discipline->key_test) > 0) {
                $key_test                    = $discipline->key_test[0];
                $discipline->available_tests = array_values(array_filter($discipline->available_tests,
                    function ($item) use ($key_test) {
                        return $item->level_id > $key_test->level_id;
                    }));
            }
        }

        return $test_history;
    }


    public static function findTestByValue($test_value)
    {
        foreach (self::all_tests() as $category => $tests) {
            if (strpos($test_value, $category) === false) {
                continue;
            }
            foreach ($tests as $test) {
                if ($test->value === $test_value) {
                    return $test;
                }
            }

        }

        return null;
    }


    /**
     * Add a test to the history
     *
     * @param $core
     * @param $discipline_key
     * @param $test_data
     *
     * @return mixed
     */
    public static function addTest($core, $discipline_key, $test_data)
    {

        $full_test     = self::findTestByValue($test_data['test']);
        $test_name     = $full_test ? $full_test->label : "Mock";
        $test_value    = $full_test ? $full_test->value : "mock";
        $test_level_id = $full_test ? $full_test->level_id : 0;
        foreach ($core->disciplines as $discipline) {
            if ($discipline->key !== $discipline_key) {
                continue;
            }
            $test = (object) [
                "id"               => $test_value,
                "name"             => $test_name,
                "is_self_reported" => true,
                "level_id"         => $test_level_id
            ];

            array_unshift($discipline->self_reported_tests, $test);
            array_unshift($discipline->test_history, $test);
            $discipline->key_test = [
                $test
            ];
        }

        return self::clearOptionsFromKeys($core);
    }


    /**
     * Create a STH from JSON data
     *
     * @param $json_data
     *
     * @return mixed
     */
    static function fromJSON($json_data)
    {
        foreach ($json_data->disciplines as $discipline) {
            $discipline->available_tests = (array) $discipline->available_tests;

        }

        return $json_data;
    }


    /**
     * Remove a skate test from the history
     *
     * @param $existing_history
     * @param $discipline_key
     * @param $test_data
     *
     * @return mixed
     */
    public static function removeTest($existing_history, $discipline_key, $test_id)
    {

        foreach ($existing_history->disciplines as $discipline) {
            if ($discipline->key !== $discipline_key) {
                continue;
            }

            //update test history
            foreach ($discipline->test_history as $index => $test) {
                if ($test->id === $test_id) {
                    array_splice($discipline->test_history, $index, 1);
                }
            }
            //update key test
            if ($discipline->key_test) {
                $key_removed = false;
                //remove test from keys if it's in list
                foreach ($discipline->key_test as $index => $test) {
                    if ($test->id === $test_id) {
                        array_splice($discipline->key_test, $index, 1);
                        $key_removed = true;
                    }
                }
                //if a key test was removed, and there's more tests in the history, add next history test as key
                if ($key_removed && count($discipline->test_history) > 0) {
                    array_unshift($discipline->key_test, $discipline->test_history[0]);
                }
            }
            //repopulate self reported tests
            $discipline->self_reported_tests = array_filter($discipline->test_history, function ($item) {
                return $item->is_self_reported;
            });
            //update available tests
            $discipline->available_tests = self::all_tests()[$discipline->key];
        }

        return self::clearOptionsFromKeys($existing_history);
    }


    /**
     * Get the saved test history
     *
     * @param $category
     * @param $category_tests
     *
     * @return array
     */
    private static function savedTestHistory($category, $category_tests, $partner)
    {
        $result = [];
        $map    = self::user_test_data($partner)[$category];
        foreach ($map as $test_map) {
            $test     = $category_tests[$test_map['level'] - 1];
            $result[] = (object) [
                'id'               => $test->value,
                'name'             => $test->label,
                'is_self_reported' => $test_map['self_reported'],
                'level_id'         => $test->level_id
            ];
        }

        return $result;
    }


    /**
     * Adapt app-level data to match expected API response
     *
     * @param $history
     *
     * @return mixed
     */
    static function adaptResponse($history)
    {
        foreach ($history->disciplines as $discipline) {
            unset($discipline->test_history);
        }

        return $history;

    }

    static function handleAddSubmission(){
        $data             = json_decode(file_get_contents('php://input'), true);
        $existing_history = false;
        if (array_key_exists('current_test_history', $_SESSION)) {
            $existing_history = \App\SkateTestHistory::fromJSON(json_decode($_SESSION['current_test_history']));

        }
        if ( ! $existing_history) {
            $existing_history = \App\SkateTestHistory::core();
        }
        $discipline = $data['discipline_key'];
        $test_data  = $data['test_data'];
        if (strpos(strtolower($test_data['club']), 'error') !== false) {
            return json_encode([
                'success' => false,
                'error'   => "Configurable error message.",
            ]);
        }
        $test_history                     = \App\SkateTestHistory::addTest($existing_history, $discipline, $test_data);
        $_SESSION['current_test_history'] = json_encode($test_history);

        return $test_history;
    }


    public static function handleRemoveSubmission()
    {
        $data             = json_decode(file_get_contents('php://input'), true);
        $test_id          = $data['test_id'];
        $discipline_key   = $data['discipline_key'];
        $existing_history = false;
        if (array_key_exists('current_test_history', $_SESSION)) {
            $existing_history = \App\SkateTestHistory::fromJSON(json_decode($_SESSION['current_test_history']));
        }
        if ( ! $existing_history) {
            $existing_history = \App\SkateTestHistory::core();
        }
        $test_history                     = \App\SkateTestHistory::removeTest($existing_history, $discipline_key,
            $test_id);
        $_SESSION['current_test_history'] = json_encode($test_history);

        return $test_history;
    }
}