<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/6/18
 * Time: 11:23 AM
 */

namespace App;

use Carbon\Carbon;
use Faker\Factory;

class CompetitionRegistrationCompetition implements \JsonSerializable
{

    /**
     * Competition constructor.
     */
    public function __construct($data, $compute = true)
    {


        foreach ($data as $key => $value) {
            if ($compute) {
                if (strpos($key, 'date') !== false) {
                    $value = \Carbon\Carbon::parse($value)->timezone('America/Denver')->timestamp;
                    $key   = $key . "_ts";
                }
            }
            $this->$key = $value;
        }

        $this->registration_links     = [
            "overview"               => "/pages/competition-registration/" . $this->id,
            "profile"                => "/pages/competition-registration/" . $this->id . "/profile",
            "skate_test"             => sprintf('/pages/competition-registration/%s/skate-test-history', $this->id),
            "partner_events"         => sprintf('/pages/competition-registration/%s/partner-events', $this->id),
            "partner_identification" => sprintf('/pages/competition-registration/%s/partner-identification', $this->id),
            "event_selection"        => sprintf('/pages/competition-registration/%s/event-selection', $this->id),
            "coach_information"      => sprintf('/pages/competition-registration/%s/coach-information', $this->id),
            "waivers"                => sprintf('/pages/competition-registration/%s/waivers', $this->id),
            "cart"                   => sprintf('/pages/competition-registration/%s/cart', $this->id),
        ];
        $this->user_registration_link = $this->registration_links['overview'];
        if ($this->user_registration_status === "registered") {
            $this->user_registration_link = $this->registration_links['event_selection'];
        }
    }


    /**
     * Specify data which should be serialized to JSON
     * @link  http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    public function jsonSerialize()
    {
        $vars = get_object_vars($this);

        return $vars;
    }


    static function getList()
    {
        $data  = json_decode(file_get_contents(__DIR__ . '/Data/RegistrationCompetitionsStatic.json'));
        $comps = [];
        foreach ($data as $datum) {
            $competitionRegistrationCompetition = new self($datum, false);

            $comps[] = $competitionRegistrationCompetition;
        }
        usort($comps, function ($a, $b) {
            return $a->start_date_ts - $b->start_date_ts;
        });

        return $comps;
    }


    static function getListDynamic()
    {
        $id     = 1;
        $faker  = Factory::create();
        $result = [];
        $data   = json_decode(file_get_contents(__DIR__ . '/Data/RegistrationCompetitions.json'), true);
        foreach ($data as $index => $item) {
            $date = Carbon::parse("next month");
            $date->addDays($index);
            $reg_deadline = $date->copy();
            if ($item['competition_registration_status'] === "late") {
                $reg_deadline = Carbon::parse("now");
            }
            $icon_index                    = $index % 4 ? ( $index % 4 ) + 1 : '';
            $item['icon']                  = "/images/competition-icon" . $icon_index . ".png";
            $item['id']                    = $id++;
            $item['start_date']            = $date->format('n/j/y');
            $item['end_date']              = $date->addDay()->format('n/j/y');
            $item['registration_deadline'] = $reg_deadline->subDays(3)->format("m/d, g:i a");
            $result[]                      = new self($item);
        }

        for ($i = 0; $i < 30; $i++) {
            $start_date = $faker->dateTimeBetween("+2 month", "next year");
            $end        = Carbon::createFromTimestamp($start_date->getTimestamp());
            $end->addDays($faker->numberBetween(1, 5));

            $is_qualifying    = $faker->boolean(50);
            $is_continue      = $faker->boolean(30);
            $is_late          = $faker->boolean(20);
            $is_registered    = $faker->boolean(40);
            $is_series        = $i % 3 === 0;
            $icon_index       = $i % 4 ? ( $i % 4 ) + 1 : '';
            $available_series = [
                [ 'name' => 'SDS' ],
                [ 'name' => 'NQS' ],
                [ 'name' => 'Exel' ]
            ];
            $result[]         = new self([
                'id'                                => $id++,
                'icon'                              => "/images/competition-icon" . $icon_index . ".png",
                'name'                              => $faker->catchphrase,
                'start_date'                        => $start_date->format('n/j/y'),
                'end_date'                          => $end->format('n/j/y'),
                'registration_deadline'             => $is_late ? Carbon::parse("now")->subDays(3)->format("m/d, g:i a") : $end->subDays(8)->format("m/d, g:i a"),
                'is_qualifying'                     => $is_qualifying,
                'series'                            => $is_series ? array_splice($available_series, rand(1, 2)) : null,
                'city'                              => $faker->city,
                'state'                             => $faker->stateAbbr,
                'club'                              => $faker->catchphrase,
                'user_registration_status'          => $is_registered ? "registered" : ( $is_continue ? "in_progress" : "new" ),
                'competition_registration_status'   => $is_late ? "late" : "open",
                'has_partner_events'                => true,
                'has_registration_deadline_warning' => $is_late ? true : ( $faker->boolean(20) ? true : false )
            ]);
        }

        usort($result, function ($a, $b) {
            return $a->start_date_ts - $b->start_date_ts;
        });

        return $result;
    }


    static function get($id)
    {
        $competition_data = null;
        /**
         * If search manager exists, competition request came from search. Use data from search manager
         */
        if ( CompetitionSearchManager::currentExists() ) {
            $manager          = CompetitionSearchManager::getCurrent();
            $competition_data = $manager->findCompetition( $id );
            if ( $competition_data ) {

                $competition_data->is_qualifying      = true;
                $competition_data->has_partner_events = true;
                unset( $competition_data->view_competition_link );
            }
        }
        if ( ! $competition_data ) {
            $data = json_decode( file_get_contents( __DIR__ . '/Data/RegistrationCompetitionsStatic.json' ) );
            foreach ( $data as $datum ) {
                if ( $datum->id == $id ) {
                    $competition_data = $datum;
                }
            }
        }

        $competition_core = new self($competition_data, false);

        $registration_deadline    = \Carbon\Carbon::parse($competition_core->registration_deadline)->format("n/j/Y");
        $available_partner_events = [];
        if ($competition_core->has_partner_events) {
            $available_partner_events = [
                [
                    "label" => "Dance",
                    "value" => "dance"
                ],
                [
                    "label" => "Duets",
                    "value" => "duets"
                ]
            ];
        }

        return [
            "competition"              => $competition_core,
            "information"              => [
                "overview" => [
                    sprintf("Online registration is the ONLY method of entry into the %s", $competition_core->name),
                    sprintf("The entry deadline is %s", $registration_deadline),
                    "All competitors are required to review the competition announcement and competition website prior to registering for the competition",
                    "To complete your registration, you will need the following: Your coach's U.S. Figure Skating membership number **This is for the coach that will be accompanying you to the event and will need the credential",
                ]
            ],
            "available_partner_events" => $available_partner_events
        ];


    }


    public static function getActiveId()
    {
        $competition_id = 1;
        if (array_key_exists("HTTP_REFERER", $_SERVER)) {
            $search = preg_match("/competition-registration\/([0-9]+)/", $_SERVER['HTTP_REFERER'], $r);
            if ($search && count($r) > 1) {
                $competition_id = $r[1];
            }
        }

        return $competition_id;
    }


    public static function getActive()
    {
        $competition_id = self::getActiveId();

        return \App\CompetitionRegistrationCompetition::get($competition_id);
    }
}