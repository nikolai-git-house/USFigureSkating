<?php

namespace App\Teams\CompetitionRegistration\Registration;

use App\AbstractSessionStore;
use App\Teams\CompetitionRegistration\Registration\Factories\AbstractTeamEntityFactory;
use App\Teams\CompetitionRegistration\Registration\Factories\TeamCoachesFactory;
use App\Teams\CompetitionRegistration\Registration\Factories\TeamRosterFactory;
use App\Teams\CompetitionRegistration\TeamsCompetitionRegistrationManager;
use Carbon\Carbon;

class TeamsCompetitionRegistrationRegistrationManager extends AbstractSessionStore
{

    public $event_selection_events;

    public $roster = [];

    public $selected_roster = [];

    public $coaches = [];

    public $selected_coaches = [];

    public $team_service_personnel = [];

    public $selected_team_service_personnel = [];

    public $prop_crew = [];

    public $selected_prop_crew = [];

    /**
     * @var TeamsCompetitionRegistrationManager
     */
    protected $parent;


    public function __construct($properties = false)
    {
        $this->parent = TeamsCompetitionRegistrationManager::getCurrent();

        parent::__construct($properties);

    }


    public static function getCurrent()
    {
        if (session_id() == '') {
            session_start();
        }

        return parent::getCurrent();
    }


    public function cache()
    {
        if (session_id() == '') {
            session_start();
        }
        parent::cache();
    }


    /**
     * @inheritDoc
     */
    protected static function session_storage_key()
    {
        return 'teams_competition_registration_registration';
    }


    public function getFetchShellApiResponse($competition_id, $team_id)
    {
        $competition = TeamsCompetitionRegistrationRegistrationFactory::mockTeamRegistrationCompetitionSummary(array_merge((array) $this->getCompetitionById($competition_id),
            [
                'links' => [
                    'cart' => sprintf('/pages/competition-registration-teams/%s/cart', $competition_id)
                ]
            ]));
        $team        = TeamsCompetitionRegistrationRegistrationFactory::mockTeamRegistrationTeamSummary((array) $this->getTeamById($team_id));
        if (simulation_arg_present('no_prop_crew')) {
            $team['has_prop_crew'] = false;
        }
        if (simulation_arg_present('initial_page')) {
            $matches = [];
            preg_match("/initial_page=([a-z_]*)/", $_SERVER['HTTP_REFERER'], $matches);
            if (count($matches) >= 2) {
                $team['initial_page'] = $matches[1];
            }
        }

        return compact('competition', 'team');
    }


    public function getFetchTeamVerificationApiResponse($competition_id, $team_id)
    {
        $team_profile = TeamsCompetitionRegistrationRegistrationFactory::MockTeamRegistrationTeamProfile((array) $this->getTeamById($team_id));
        if (simulation_arg_present('expired_membership')) {
            $team_profile['membership_status'] = [
                'active'                  => false,
                'validity_date_formatted' => Carbon::now()->subDays(rand(1, 30))->format('n/j/Y')
            ];
        }

        return [
            'team_profile' => $team_profile
        ];
    }


    public function getChangeTeamNameApiResponse($team_id, $team_name)
    {
        $team       = $this->getTeamById($team_id);
        $team->name = $team_name;

        return [
            'success' => true,
            'error'   => ''
        ];
    }

    public function getFetchRegistrationOverviewApiResponse($competition_id, $team_id)
    {
        $competition      = $this->getCompetitionById($competition_id);
        $now              = Carbon::now();
        $use_qual_pricing = simulation_arg_present('qual_pricing');

        return [
            'registration_information' => TeamsCompetitionRegistrationRegistrationFactory::mockRegistrationInformation($competition),
            'rulebook_year'            => sprintf('%s - %s', $now->format('Y'), $now->addYear()->format('Y')),
            'price_information'        => TeamsCompetitionRegistrationRegistrationFactory::mockTeamRegistrationPriceInformation($use_qual_pricing),
        ];
    }

    public function getFetchEventSelectionApiResponse($competition_id, $team_id)
    {
        $this->event_selection_events = json_decode(json_encode(TeamsCompetitionRegistrationRegistrationFactory::mockEventSelectionEvents()));
        if (!simulation_arg_present('es_selected')) {
            foreach ($this->event_selection_events as $event) {
                $event->is_selected       = false;
                $event->is_registered_for = false;
            }
        }
        if (!simulation_arg_present('es_many')) {
            $this->event_selection_events = array_slice($this->event_selection_events, 0, 3);
        }

        return [
            'events' => $this->event_selection_events
        ];
    }

    private function getCompetitionById($competition_id)
    {
        return $this->parent->getCompetitionById($competition_id);
    }


    private function getTeamById($team_id)
    {
        return $this->parent->getTeamById($team_id);
    }


    public function removeEvent($event_id)
    {
        $event = $this->findEvent($event_id);

        $event->is_selected = false;

        return [
            'events' => $this->event_selection_events
        ];
    }


    public function addEvent($event_id)
    {
        $event = $this->findEvent($event_id);

        $event->is_selected = true;

        return [
            'events' => array_values(array_filter($this->event_selection_events, function ($event) {
                return $event->is_selected || $event->is_registered_for || $event->id % 5 === 0;
            }))
        ];
    }


    private function findEvent($event_id)
    {
        foreach ($this->event_selection_events as $event) {
            if ($event->id === (int) $event_id) {
                return $event;
            }
        }

        return null;
    }


    public function getFetchCompetitionRosterApiResponse()
    {
        $maximum = 20;
        $minimum = 2;

        if ( ! $this->roster) {
            $team_roster     = TeamRosterFactory::mockCoreRoster();
            $selected_roster = [];
            if (simulation_arg_present('prepopulate_roster')) {
                preg_match('/prepopulate_roster=([ineligible|invalid|incomplete|,]*)/', $_SERVER['HTTP_REFERER'],
                    $matches);
                $select_cases = [];
                if (count($matches) > 1) {
                    $match = $matches[1];
                    if (strpos($match, 'invalid') !== false) {
                        $select_cases[] = 'invalid';
                    }
                    if (strpos($match, 'incomplete') !== false) {
                        $select_cases[] = 'incomplete';
                    }
                    if (strpos($match, 'ineligible') !== false) {
                        $select_cases[] = 'ineligible';
                    }
                }

                $selected_roster = TeamRosterFactory::mockSelections($team_roster, $minimum, $maximum - 5,
                    $select_cases);
            }

            $this->roster          = TeamRosterFactory::sortRoster($team_roster);
            $this->selected_roster = $selected_roster;
        }

        $per_skater_fee = simulation_arg_present('decimal_skater_fee')
            ? 1.15
            : 10;
        $response       = [
            'team_roster'         => $this->roster,
            'selected_roster_ids' => $this->selected_roster,
            'roster_rules'        => [
                sprintf('You must have a minimum of %s skaters.', $minimum),
                sprintf('You can not exceed %s skaters.', $maximum),
                'The majority of skaters must be 12 or under.'
            ],
            'roster_minimum'      => $minimum,
            'per_skater_fee'      => $per_skater_fee
        ];
        if (simulation_arg_present('roster_enforce_max')) {
            $response['roster_maximum'] = $maximum;
        }
        if (simulation_arg_present('no_skater_fee')) {
            unset($response['per_skater_fee']);
        }

        return $response;
    }


    public function updateCompetitionRoster($ids)
    {
        $this->selected_roster = $ids;
    }


    public function FetchCoachesApiResponse()
    {
        $maximum = 4;
        if ( ! $this->coaches) {
            $team_roster     = TeamCoachesFactory::mockCoreRoster();
            $selected_roster = [];
            if (simulation_arg_present('prepopulate_coaches')) {
                preg_match('/prepopulate_coaches=([ineligible|invalid|,]*)/', $_SERVER['HTTP_REFERER'], $matches);
                $select_cases = [];
                if (count($matches) > 1) {
                    $match = $matches[1];
                    if (strpos($match, 'invalid') !== false) {
                        $select_cases[] = 'invalid';
                    }
                    if (strpos($match, 'ineligible') !== false) {
                        $select_cases[] = 'ineligible';
                    }
                }

                $selected_roster = TeamCoachesFactory::mockSelections($team_roster, 1, $maximum, $select_cases);
            }

            $this->coaches          = TeamCoachesFactory::sortRoster($team_roster);
            $this->selected_coaches = $selected_roster;
        }

        $response = [
            'team_coaches'       => $this->coaches,
            'selected_coach_ids' => $this->selected_coaches,
            'coach_maximum'      => $maximum
        ];

        return $response;
    }


    public function updateCompetitionCoaches($ids)
    {
        $this->selected_coaches = $ids;
    }


    public function getFetchTeamServicePersonnelApiResponse()
    {
        $maximum = 2;
        if ( ! $this->team_service_personnel) {
            $team_roster     = TeamCoachesFactory::mockCoreRoster(5);
            $selected_roster = [];
            if (simulation_arg_present('prepopulate_team_service_personnel')) {
                preg_match('/prepopulate_team_service_personnel=([ineligible|invalid|,]*)/', $_SERVER['HTTP_REFERER'],
                    $matches);
                $select_cases = [];
                if (count($matches) > 1) {
                    $match = $matches[1];
                    if (strpos($match, 'invalid') !== false) {
                        $select_cases[] = 'invalid';
                    }
                    if (strpos($match, 'ineligible') !== false) {
                        $select_cases[] = 'ineligible';
                    }
                }

                $selected_roster = TeamCoachesFactory::mockSelections($team_roster, 1, $maximum, $select_cases);
            }

            $this->team_service_personnel          = TeamCoachesFactory::sortRoster($team_roster);
            $this->selected_team_service_personnel = $selected_roster;
        }

        $response = [
            'team_service_personnel'              => $this->team_service_personnel,
            'selected_team_service_personnel_ids' => $this->selected_team_service_personnel,
            'team_service_personnel_maximum'      => $maximum
        ];

        return $response;

    }


    public function updateCompetitionTeamServicePersonnel($ids)
    {
        $this->selected_team_service_personnel = $ids;
    }


    public function getFetchPropCrewApiResponse()
    {
        $maximum = 2;
        if ( ! $this->prop_crew) {
            $team_roster     = AbstractTeamEntityFactory::mockCoreRoster(5);
            $selected_roster = [];
            if (simulation_arg_present('prepopulate_prop_crew')) {
                preg_match('/prepopulate_prop_crew=([ineligible|invalid|,]*)/', $_SERVER['HTTP_REFERER'], $matches);
                $select_cases = [];
                if (count($matches) > 1) {
                    $match = $matches[1];
                    if (strpos($match, 'invalid') !== false) {
                        $select_cases[] = 'invalid';
                    }
                    if (strpos($match, 'ineligible') !== false) {
                        $select_cases[] = 'ineligible';
                    }
                }

                $selected_roster = AbstractTeamEntityFactory::mockSelections($team_roster, 1, $maximum, $select_cases);
            }

            $this->prop_crew          = AbstractTeamEntityFactory::sortRoster($team_roster);
            $this->selected_prop_crew = $selected_roster;
        }

        $response = [
            'prop_crew'              => $this->prop_crew,
            'selected_prop_crew_ids' => $this->selected_prop_crew,
            'prop_crew_maximum'      => $maximum
        ];

        return $response;

    }


    public function updateCompetitionPropCrew($ids)
    {
        $this->selected_prop_crew = $ids;
    }
}