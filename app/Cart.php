<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/26/19
 * Time: 2:16 PM
 */

namespace App;

class Cart
{

    public $is_json = false;

    public $sessions = [];

    public $credits = [];

    public $packages = [];

    public $additional_fees = [
        [
            'name'   => "Processing Fee",
            'amount' => 5
        ]
    ];

    public $registration_items = [];

    public $subtotal = 0;

    public $total = 0;

    private static $session_storage_key = "current_cart";


    public static function blankCore()
    {
        return new Cart(['additional_fees'=>[]]);
    }

    /**
     * Cart constructor.
     */
    public function __construct($values)
    {
        foreach ($values as $key => $value) {
            $this->$key = $value;
        }
        $this->total = $this->subtotal + $this->fees_cost();

    }


    private static function fromJSON($data)
    {
        $cart          = new self($data);
        $cart->is_json = true;

        return $cart;
    }


    public function costConfigs()
    {
        return [
            'additional_fees' => $this->additional_fees,
            'subtotal'        => $this->subtotal,
            'total'           => $this->total,
        ];
    }


    public function cache()
    {
        $_SESSION[self::$session_storage_key] = json_encode($this);
    }


    public static function getCurrent()
    {
        if (array_key_exists(self::$session_storage_key, $_SESSION)) {
            return self::fromJSON(json_decode($_SESSION[self::$session_storage_key], true));
        }

        return self::defaultCore();
    }


    public static function registrationCore()
    {
        $subtotal           = 0;
        $registration_items = json_decode(file_get_contents(__DIR__ . '/../app/Data/CartRegistrationItems.json'));
        foreach ($registration_items as $credit_item) {
            $subtotal += $credit_item->cost;
        }

        $data = (object) [
            'registration_items' => $registration_items,
            'subtotal'           => $subtotal
        ];

        return new self($data);
    }


    public static function seriesRegistrationCore()
    {
        $subtotal           = 0;
        $registration_items = json_decode(file_get_contents(__DIR__ . '/../app/SeriesRegistration/Data/SeriesRegistrationCart.json'));
        foreach ($registration_items as $credit_item) {
            $subtotal += $credit_item->cost;
        }

        $data = (object) [
            'registration_items' => $registration_items,
            'subtotal'           => $subtotal
        ];

        return new self($data);
    }


    public static function teamRegistrationCore()
    {
        $subtotal           = 0;
        $registration_items = json_decode(file_get_contents(__DIR__ . '/../app/SeriesRegistration/Data/TeamRegistrationCart.json'));
        foreach ($registration_items as $credit_item) {
            $subtotal += $credit_item->cost;
        }

        $data = (object) [
            'registration_items' => $registration_items,
            'subtotal'           => $subtotal
        ];

        return new self($data);
    }


    public static function defaultCore()
    {
        $cart_map = json_decode(file_get_contents(__DIR__ . '/../app/Data/CartSessions.json'), true);
        $sessions = [];
        $subtotal = 0;
        foreach ($cart_map as $competition_id => $cart_sessions) {
            $cart_session_ids = array_keys($cart_sessions);
            $competition      = new \App\CompetitionSchedule($competition_id);
            $comp_data        = new \App\Competition($competition_id);

            foreach ($competition->sessions as $session) {
                if ( ! in_array($session->id, $cart_session_ids)) {
                    continue;
                }

                $adl_config = $cart_sessions[$session->id];
                $result     = [];
                foreach ($adl_config as $key => $value) {
                    $result[$key] = $value;
                }
                $result['session']          = $session;
                $result['competition_id']   = $comp_data->id;
                $result['competition_name'] = $comp_data->name;

                $source_id = \App\SkatingEvent::reduceEventIdtoSource($result['scheduled_event_id'], $competition_id);

                $event                          = new \App\SkatingEvent($source_id, $competition_id);
                $result['scheduled_event_id']   = $event->id;
                $result['scheduled_event_name'] = $event->name;
                $sessions[]                     = $result;
                $subtotal                       += $result['cost'];
            }
        }

        $credits_map  = json_decode(file_get_contents(__DIR__ . '/../app/Data/CartCredits.json'));
        $packages_map = json_decode(file_get_contents(__DIR__ . '/../app/Data/CartPackages.json'));
        foreach ($credits_map as $credit_item) {
            $subtotal += $credit_item->cost;
        }
        foreach ($packages_map as $package_item) {
            $subtotal += $package_item->cost;
        }

        $data = (object) [
            'sessions' => $sessions,
            'credits'  => $credits_map,
            'packages' => $packages_map,
            'subtotal' => $subtotal
        ];

        return new self($data);
    }


    private function fees_cost()
    {
        return array_reduce($this->additional_fees, function ($carry, $item) {
            $carry += $item['amount'];

            return $carry;
        }, 0);

    }


    public function removeSession($data)
    {
        foreach ($this->sessions as $index => $session) {
            if ($session['session']['id'] === $data->session_id) {
                unset($this->sessions[$index]);
                $this->sessions = array_values($this->sessions);
                $this->total    -= $session['cost'];
                $this->subtotal -= $session['cost'];

                break;
            }
        }
        $this->normalizeCosts();
    }


    public function removeCreditPackage($data)
    {
        foreach ($this->packages as $index => $package) {

            if ($package['id'] === $data->id) {
                unset($this->packages[$index]);
                $this->packages = array_values($this->packages);
                $this->total    -= $package['cost'];
                $this->subtotal -= $package['cost'];

                break;
            }
        }

        $this->normalizeCosts();
    }


    public function removeCredit($data)
    {
        foreach ($this->credits as $index => $credit) {
            if ($credit['competition_id'] === $data->competition_id && $credit['event_id'] === $data->event_id && $credit['credit_type'] === $data->credit_type) {
                unset($this->credits[$index]);
                $this->credits  = array_values($this->credits);
                $this->total    -= $credit['cost'];
                $this->subtotal -= $credit['cost'];
                break;
            }
        }
        $this->normalizeCosts();
    }


    public function getAPIData()
    {
        return [
            'sessions'           => $this->sessions,
            'credits'            => $this->credits,
            'packages'           => $this->packages,
            'registration_items' => $this->registration_items,
            'additional_fees'    => $this->additional_fees,
            'subtotal'           => $this->subtotal,
            'total'              => $this->total,
            'is_json'            => $this->is_json
        ];
    }


    private function normalizeCosts()
    {
        if (count($this->sessions)) {
            return;
        }
        if (count($this->packages)) {
            return;
        }
        if (count($this->credits)) {
            return;
        }
        if (count($this->registration_items) > 1) {
            return;
        }
        $this->additional_fees = [];
        $this->subtotal        = 0;
        $this->total           = 0;
    }


    public function removeRegistration($data)
    {
        foreach ($this->registration_items as $index => $registration_item) {
            $match = $data->registration_item_id === $registration_item['id'];
            if ($match) {
                unset($this->registration_items[$index]);
                $this->registration_items = array_values($this->registration_items);
                $this->total              -= $registration_item['cost'];
                $this->subtotal           -= $registration_item['cost'];
                break;
            }
        }
        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'competition-registration') !== false) {
                if (count($this->registration_items) > 1) {
                    $this->registration_items[0]['cost'] = 500;
                    $this->total                         += 500;
                    $this->subtotal                      += 500;
                }
                if (count($this->registration_items) === 1) {
                    $this->registration_items = [];
                }
                $this->normalizeCosts();
            }
        }
    }
}