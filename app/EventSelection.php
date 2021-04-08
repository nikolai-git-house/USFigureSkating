<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/22/19
 * Time: 3:10 PM
 */

namespace App;

/**
 * Mock event selection
 *
 * Arbitrary rule  = only 2 singles events may be selected
 */
class EventSelection
{

    private static $session_storage_key = "current_event_selection";


    /**
     * EventSelection constructor.
     */
    public function __construct($events, $partner_skate_tests)
    {
        $data                      = json_decode(file_get_contents(__DIR__ . '/Data/EventSelection.json'));
        $this->data                = $data;
        $this->all_events          = $data->events;
        $this->all_partner_tests   = $data->partner_skate_tests;
        $this->events              = $events !== false ? $events : $data->events;
        $this->partner_skate_tests = $partner_skate_tests !== false ? $partner_skate_tests : $data->partner_skate_tests;
        $this->new_partner_id      = 2;
    }


    public static function getCurrent()
    {
        if (array_key_exists(self::$session_storage_key, $_SESSION)) {
            return self::fromJSON(json_decode($_SESSION[self::$session_storage_key]));
        }

        return new self(false, false);
    }


    public static function findMockEvent($event_id)
    {
        $data = json_decode(file_get_contents(__DIR__ . '/Data/EventSelection.json'));
        foreach ($data->events as $event) {
            if ($event->id === $event_id) {
                return $event;
            }
        }

        return (object) [
            "name"         => "Mock Event",
            "id"           => $event_id,
            "requirements" => [
                'minimum_skate_tests' => null,
                'maximum_skate_tests' => null,
                'minimum_age'         => null,
                'maximum_age'         => null,
            ]
        ];
    }


    public function cache()
    {
        $_SESSION[self::$session_storage_key] = json_encode($this);
    }


    public static function fromJSON($json_decode)
    {
        return new self($json_decode->events, $json_decode->partner_skate_tests);
    }


    /**
     * Whether an event is in current partner test history
     */
    public function partnerEventInTests($event)
    {
        foreach ($this->partner_skate_tests as $test) {
            if ($test->event->id === $event->id) {
                return true;
            }
        }

        return false;
    }


    /**
     * Whether an event is in configured data tests
     */
    public function partnerEventAllTest($event)
    {

        foreach ($this->all_partner_tests as $test) {
            if ($test->event->id === $event->id) {
                return $test;
            }
        }

        return false;
    }


    public function addEvent($event)
    {
        $event = (object) $event;
        foreach ($this->events as $oEvent) {

            if ($oEvent->id === $event->id) {
                $oEvent->is_selected = true;
            }
        }
        if ($event->category !== "Singles") {

            if ( ! $this->partnerEventInTests($event)) {
                $all_test = $this->partnerEventAllTest($event);
                if ($all_test === false) {
                    $name     = "Partner Name";
                    $all_test = (object) [
                        "event"   => [
                            "name"         => $event->name,
                            "id"           => $event->id,
                            "requirements" => $event->requirements
                        ],
                        "partner" => [
                            "name"               => $name,
                            "id"                 => $this->new_partner_id++,
                            "meets_requirements" => false
                        ],
                    ];
                }
            }
            $this->partner_skate_tests[] = $all_test;
        }

        $this->stripEvents();


    }


    public function selectedSinglesCount()
    {
        return array_reduce($this->events, function ($carry, $item) {
            if ($item->category === "Singles" && $item->is_selected) {
                $carry++;
            }

            return $carry;
        }, 0);
    }


    public function selectedCount()
    {
        return array_reduce($this->events, function ($carry, $item) {
            if ($item->is_selected) {
                $carry++;
            }

            return $carry;
        }, 0);
    }


    public function removeEvent($event)
    {
        foreach ($this->events as $oEvent) {

            if ($oEvent->id === $event->id) {
                $oEvent->is_selected = false;
            }
        }
        $filtered_partner          = array_filter($this->partner_skate_tests, function ($item) use ($event) {
            return ( $item->event->id === $event->id ) ? false : true;
        });
        $this->partner_skate_tests = array_values($filtered_partner);
        $this->restoreEvents();
    }


    public function selectedRegisteredEvents()
    {
        return array_values(array_filter($this->events, function ($event) {
            if ($event->is_registered_for) {
                return true;
            }
            if ($event->is_selected) {
                return true;
            }

            return false;
        }));
    }


    private function stripEvents()
    {
        if ($this->selectedSinglesCount() < 2) {
            return;
        }
        $filtered     = array_filter($this->events, function ($event) {
            if ($event->is_registered_for) {
                return true;
            }
            if ($event->is_selected) {
                return true;
            }

            return $event->category !== "Singles";
        });
        $this->events = array_values($filtered);
    }


    private function restoreEvents()
    {
        if ($this->selectedSinglesCount() >= 2) {
            return;
        }
        $result = [];
        foreach ($this->all_events as $event) {
            $event->is_registered_for = $this->isRegistered($event);
            $event->is_selected       = $this->isSelected($event);
            $result[]                 = $event;
        }
        $this->events = $result;

    }


    private function isSelected($event)
    {
        foreach ($this->events as $oEvent) {
            if ($oEvent->is_selected && $event->id === $oEvent->id) {
                return true;
            }
        }

        return false;
    }


    private function isRegistered($event)
    {
        foreach ($this->events as $oEvent) {
            if ($oEvent->is_registered_for && $event->id === $oEvent->id) {
                return true;
            }
        }

        return false;
    }


    public function updatePartnerSkateTestSummary($data, $meets_requirements = false)
    {
        foreach ($this->partner_skate_tests as $skate_test_summary) {
            if ($skate_test_summary->partner->id === $data->partner_id) {
                $skate_test_summary->partner->meets_requirements = $meets_requirements;
            }
        }
    }


    public function setRaw()
    {
        $this->partner_skate_tests = [];
        $this->new_partner_id      = 1;
        foreach ($this->events as $event) {
            $event->is_registered_for = false;
            $event->is_selected       = false;
        }
    }
}