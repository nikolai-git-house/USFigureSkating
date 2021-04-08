<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 7/25/19
 * Time: 2:54 PM
 */

namespace App;

class VolunteerOpportunities
{

    private static $session_storage_key = "volunteer_opportunities";

    public $active_id = 1;

    public $active_search_results = [];


    /**
     * VolunteerOpportunities constructor.
     */
    public function __construct(
        $upcoming_local = null,
        $upcoming_usfs = null,
        $requested = null,
        $active_search_results = []
    ) {
        $faker                   = \Faker\Factory::create();
        $this->active_start_date = \Carbon\Carbon::createFromTimestamp($faker->dateTimeBetween("now",
            "+3 months")->getTimestamp());
        $this->reference         = json_decode(file_get_contents(__DIR__ . "/Data/RegistrationCompetitionsStatic.json"));
        $this->upcoming_local    = $upcoming_local ?: $this->generateOpportunityList("upcoming", 6, true);

        $this->upcoming_usfs         = $upcoming_usfs ?: $this->generateOpportunityList();
        $this->requested             = $requested ?: $this->generateOpportunityList("requested", 6, true);
        $this->upcoming_competitions = array_merge($this->upcoming_usfs, $this->upcoming_local);
        $this->active_search_results = $active_search_results;
    }


    protected function generateOpportunityList($type = "upcoming", $amount = 5, $permutations = false)
    {
        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'no-opps') !== false) {
                return [];
            }
        }
        $result                  = [];
        $this->active_list_index = 1;
        for ($i = 0; $i < $amount; $i++) {
            $result[] = $this->generateOpportunity($type, $permutations);
            $this->active_list_index++;
        }

        return $result;
    }


    private function generateOpportunity($type, $permutations = true)
    {
        $competition_names   = array_map(function ($item) {
            return $item->name;
        }, $this->reference);
        $faker               = \Faker\Factory::create();
        $start_date          = $this->active_start_date->copy()->addDays($this->active_list_index);
        $is_open             = false;
        $shift_selection_url = "http://placehold.it/720x480&text=Shift+Selection";
        $print_schedule_url  = "http://placehold.it/720x480&text=Print+Schedule";
        $status_message      = null;
        $status_type         = "alert";
        $competition_name    = count($competition_names) - 1 >= $this->active_id - 1 ? $competition_names[$this->active_id - 1] : $faker->catchPhrase;
        if ($type == "upcoming") {
            if ($permutations) {
                $print_schedule_url  = null;
                $shift_selection_url = null;
                $is_open             = true;
                if ($this->active_list_index % 6 === 0) {
                    $status_message      = "Shift Pending Approval";
                    $status_type         = "warning";
                    $print_schedule_url  = "http://placehold.it/720x480&text=Print+Schedule";
                    $shift_selection_url = "http://placehold.it/720x480&text=Shift+Selection";
                    $is_open             = false;
                } elseif ($this->active_list_index % 5 === 0) {
                    $status_message = "Awaiting Approval";
                    $status_type    = "alert";
                    $is_open        = false;
                } elseif ($this->active_list_index % 4 === 0) {
                    $status_message = "Coming Soon";
                    $status_type    = "success";
                    $is_open        = false;
                } elseif ($this->active_list_index % 3 === 0) {
                    $print_schedule_url  = "http://placehold.it/720x480&text=Print+Schedule";
                    $shift_selection_url = "http://placehold.it/720x480&text=Shift+Selection";
                    $is_open             = false;
                } elseif ($this->active_list_index % 2 === 0) {
                    $shift_selection_url = "http://placehold.it/720x480&text=Shift+Selection";
                    $is_open             = false;
                }
            } else {
                $is_open             = true;
                $shift_selection_url = null;
                $print_schedule_url  = null;
                $status_message      = null;
                $status_type         = "alert";
            }
        } elseif ($type == "requested") {
            $shift_selection_url = null;
            $print_schedule_url  = null;
            $status_message      = null;
            $is_open             = false;
            if ($permutations) {
                if ($this->active_list_index % 6 === 0) {
                    $status_message = "Awaiting Approval";
                    $status_type    = "alert";

                } elseif ($this->active_list_index % 5 === 0) {
                    $shift_selection_url = "http://placehold.it/720x480&text=Shift+Selection";
                } elseif ($this->active_list_index % 4 === 0) {
                    $shift_selection_url = "http://placehold.it/720x480&text=Shift+Selection";
                    $print_schedule_url  = "http://placehold.it/720x480&text=Print+Schedule";
                } elseif ($this->active_list_index % 3 === 0) {
                    $print_schedule_url = "http://placehold.it/720x480&text=Print+Schedule";
                } elseif ($this->active_list_index % 2 === 0) {
                    $shift_selection_url = "http://placehold.it/720x480&text=Shift+Selection";
                    $print_schedule_url  = "http://placehold.it/720x480&text=Print+Schedule";
                    $status_message      = "Shift Awaiting Approval";
                    $status_type         = "warning";
                } else {
                    $shift_selection_url = "http://placehold.it/720x480&text=Shift+Selection";
                }
            } else {
                $is_open             = true;
                $shift_selection_url = null;
                $print_schedule_url  = null;
                $status_message      = null;
                $status_type         = "alert";
            }
        }

        return (object) [
            "competition_id"       => $this->active_id++,
            "start_date_formatted" => $start_date->format('n/j/Y'),
            "end_date_formatted"   => $start_date->addDays(2)->format('n/j/Y'),
            "name"                 => $competition_name,
            "city"                 => $faker->city,
            "state"                => $faker->stateAbbr,
            "location_name" => $this->active_id % 3 === 0 ? null : $faker->catchPhrase,
            "status"               => (object) [
                "text"     => $status_message,
                "type_key" => $status_type,
                "is_open"  => $is_open,
            ],
            "print_schedule_url"   => $print_schedule_url,
            "shift_selection_url"  => $shift_selection_url,
        ];
    }


    public static function getCurrent()
    {
        if (array_key_exists(self::$session_storage_key, $_SESSION)) {
            return self::fromJSON(json_decode($_SESSION[self::$session_storage_key]));
        }

        return new self();
    }


    private static function fromJSON($json_decode)
    {
        $active_search_results = [];
        if (property_exists($json_decode, 'active_search_results')) {
            $active_search_results = $json_decode->active_search_results;
        }

        return new self($json_decode->upcoming_local, $json_decode->upcoming_usfs, $json_decode->requested,
            $active_search_results);
    }


    public function search($data)
    {
        $this->active_search_results = [];
        $this->active_id             = 500;
        if (strpos($data['competition_name'], "none") !== false) {
            return [];
        }
        $start_date = null;
        $end_date   = null;
        if ($data['start_date']) {
            $start_date = \Carbon\Carbon::parse($data['start_date']);
        }
        if ($data['end_date']) {
            $end_date = \Carbon\Carbon::parse($data['end_date']);

        }
        if ($start_date && $end_date) {
            if ($end_date < $start_date) {
                return [];
            }
        }
        if ( ! $start_date && $end_date) {
            $start_date = $end_date->subDays(rand(1, 3));
        }
        if ($start_date && ! $end_date) {
            $end_date = $start_date->addDays(rand(1, 3));
        }
        $amount        = $data['competition_name'] !== null ? rand(1, 3) : rand(10, 100);
        $opportunities = $this->generateOpportunityList(null, $amount);

        foreach ($opportunities as $opportunity) {
            foreach ($data as $key => $value) {
                if ($key === 'state' && $value) {
                    $opportunity->state = $value;
                }
                if ($key === 'competition_name' && $value) {
                    $opportunity->name = $value;
                }
                if ($start_date) {
                    $opportunity->start_date_formatted = $start_date->format('n/j/Y');
                }
                if ($end_date) {
                    $opportunity->end_date_formatted = $end_date->format('n/j/Y');
                }
            }
            $opportunity->status->is_open     = true;
            $opportunity->shift_selection_url = null;
            $opportunity->print_schedule_url  = null;

        }
        $opportunities[2]->status->is_open=false;
        $opportunities[2]->status->text="Coming Soon";
        $opportunities[2]->status->type_key="success";
        $this->active_search_results = $opportunities;

        return $opportunities;
    }


    public function getCompetitionProfile($competition_id)
    {

        $complete_waiver = [
            'name'         => 'Bob Adamson',
            'relationship' => 3
        ];

        $waivers_complete = simulation_arg_present('vol_waivers_complete');
        $waivers_mixed    = simulation_arg_present('vol_waivers_mixed');

        $waivers_data  = [
            'form_options' => [
                'relationships' => FormOptions::waiver_relationships()
            ],
            'user_waivers' => [
                [
                    'id'       => 1,
                    'name'     => 'Assumption of Risk',
                    'file_url' => '#',
                    'status'   => $waivers_complete
                        ? $complete_waiver
                        : [
                            'name'         => null,
                            'relationship' => null
                        ]
                ],
                [
                    'id'       => 2,
                    'name'     => 'Name and Likeness Release',
                    'file_url' => '#',
                    'status'   => $waivers_complete || $waivers_mixed
                        ? $complete_waiver
                        : [
                            'name'         => null,
                            'relationship' => null
                        ]
                ],
                [
                    'id'       => 3,
                    'name'     => 'Emergency Medical Care',
                    'file_url' => '#',
                    'status'   => $waivers_complete
                        ? $complete_waiver
                        : [
                            'name'         => null,
                            'relationship' => null
                        ]
                ]
            ],
            'introduction' => 'All skaters are required to review and sign each of the three standard U.S. Figure Skating waivers below each membership year.'
        ];
        $base = (object) [
            "user_profile_form_options"        => (object) [
                "states"    => \App\FormOptions::state_options(),
                "countries" => \App\FormOptions::country_options(),
                "provinces" => \App\FormOptions::province_options()
            ],
            "user_profile"                     => UserProfile::get(),
            "user_emergency_contact"           => [
                "name"         => "Aaron Matthews",
                "relationship" => "Father",
                "phone"        => "555-555-5555"
            ],
            "opportunity_request_form_options" => self::experience_form_options(),
            "links"                            => [
                'criminal_history_check' => 'https://placehold.it/320x240&text=Criminal+Check',
                'terms_and_conditions'   => 'https://placehold.it/320x240&text=Terms+Conditions',
            ],
        ];
        if(!simulation_arg_present('vol_waivers_none')){
            $base->waivers = $waivers_data;
        }
        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'nullify') !== false) {
                $base->user_emergency_contact        = [
                    "name"         => "",
                    "relationship" => "",
                    "phone"        => ""
                ];
                $base->user_profile->primary_email   = null;
                $base->user_profile->secondary_email = null;
                $base->user_profile->primary_phone   = null;
            }
        }

        return $base;
    }


    public static function experience_form_options()
    {
        $source = [
            "Figure Skating",
            "Special Events",
            "Business Events",
            "Other",
            "None"
        ];

        return array_map(function ($item) {
            return [
                "label" => $item,
                "value" => str_replace(' ', '_', strtolower($item))
            ];
        }, $source);
    }


    public function updateProfile($data)
    {
        return true;
    }


    public function submit($competition_id, $data)
    {
        $redirect_url = null;
        if (strpos($data['volunteer_skillset'], 'redirect') !== false) {
            $redirect_url = "https://placehold.it/500x500&text=Self-Selection";
        }
        if ($redirect_url) {
            return [
                'opportunities' => null,
                'redirect_url'  => $redirect_url
            ];
        }
        $this->addCompetitionToRequested($this->extractExistingCompetition($competition_id));

        $base_data = $this->getOpportunities();

        return [
            'opportunities' => $base_data['opportunities'],
            'redirect_url'  => null
        ];
    }


    /**
     * Add a competition to requested list and sort the list by start date
     */
    protected function addCompetitionToRequested($existing_competition)
    {
        if ( ! $existing_competition) {
            return;
        }
        $existing_competition->status->is_open = false;
        $existing_competition->status->type_key = "alert";
        $existing_competition->status->text = "Awaiting Approval";
        array_unshift($this->requested, $existing_competition);

        usort($this->requested, function ($itema, $itemb) {
            $adate = \Carbon\Carbon::parse($itema->start_date_formatted);
            $bdate = \Carbon\Carbon::parse($itemb->start_date_formatted);

            return $adate > $bdate;
        });
    }


    /**
     * Given an ID, get an existing competition and remove it from its parent list
     */
    private function extractExistingCompetition($competition_id)
    {
        $existing_competition = null;

        foreach ($this->upcoming_local as $index => $competition) {
            if ($competition->competition_id == $competition_id) {
                array_splice($this->upcoming_local, $index, 1);
                return $competition;
            }
        }
        foreach ($this->upcoming_usfs as $index => $competition) {
            if ($competition->competition_id == $competition_id) {
                array_splice($this->upcoming_usfs, $index, 1);
                return $competition;
            }
        }
        foreach ($this->requested as $index => $competition) {
            if ($competition->competition_id == $competition_id) {
                array_splice($this->requested, $index, 1);
                return $competition;
            }
        }

        foreach ($this->active_search_results as $index => $competition) {
            if ($competition->competition_id == $competition_id) {
                return $competition;
            }
        }
        return null;
    }


    public function getOpportunities()
    {
        $result = [
            'opportunities'       => [
                'upcoming'  => [
                    'local' => $this->upcoming_local,
                    'usfs'  => $this->upcoming_usfs
                ],
                'requested' => $this->requested,
            ],
            "search_form_options" => [
                "states" => $this->getSearchFormStates(),
                "clubs"  => $this->getSearchFormClubs()
            ]
        ];

        return $result;
    }


    private function getSearchFormStates()
    {
        $result = [];

        $all_competitions = $this->upcoming_competitions;

        foreach ($all_competitions as $competition) {
            if (array_search($competition->state, $result)) {
                continue;
            }
            $result[] = $competition->state;
        }
        sort($result);

        return array_map(function ($item) {
            return (object) [
                'label' => $item,
                'value' => $item
            ];
        }, $result);

    }


    private function getSearchFormClubs()
    {
        $result = [];
        foreach ($this->upcoming_competitions as $comp) {
            $reference = $this->findReference($comp->competition_id);
            if ( ! array_search($reference->club, $result)) {
                $result[] = $reference->club;
            }
        }
        $result = array_slice(\App\FormOptions::clubs(),0,10);



        return $result;
    }


    private function findReference($id)
    {
        foreach ($this->reference as $ref) {
            if ($ref->id == $id) {
                return $ref;
            }
        }

        return null;
    }


    public function cache()
    {
        $_SESSION[self::$session_storage_key] = json_encode($this);
    }

}