<?php

namespace App\CompetitionPortal;

use App\Cart;
use App\CommonResponses;
use App\CompetitionPortal\Factories\CompetitionPortalFactory;
use App\CompetitionPortal\Factories\CompetitionPortalUserNavigationFactory;
use App\CompetitionSearchManager;
use App\factories\CompetitionDocumentFactory;
use App\factories\CompetitionFieldFactory;
use App\factories\FieldFactory;
use App\factories\ViewCompetitionFactory;
use App\SelfStartingAbstractSessionStore;
use App\Teams\Factories\ManagedTeamFactory;

class CompetitionPortalManager extends SelfStartingAbstractSessionStore
{

    /**
     * @var \stdClass[]
     */
    public $team_registered_competitions;

    /**
     * @var \stdClass[]
     */
    public $competition_registered_teams;

    public $active_competition_data;


    /**
     * CompetitionPortalManager constructor.
     *
     * @param $managed_team_competitions
     */
    public function __construct($properties = false)
    {
        parent::__construct($properties);
        if ( ! $this->team_registered_competitions || count($this->team_registered_competitions) === 0) {
            $this->team_registered_competitions = json_decode(json_encode(CompetitionPortalFactory::teamRegisteredCompetitions()));
        }
        if ( ! $this->competition_registered_teams || count($this->competition_registered_teams) === 0) {
            $this->competition_registered_teams = ManagedTeamFactory::managedTeams();
        }
    }


    /**
     * @inheritDoc
     */
    protected static function session_storage_key()
    {
        return 'competition_portal';
    }


    public function getFetchManagedTeamCompetitionsApiResponse()
    {
        $team_registered_competitions = [];
        if ( ! simulation_arg_present('no_team_competitions')) {
            $team_registered_competitions = $this->team_registered_competitions;
        }

        return [
            'competitions' => $team_registered_competitions,
            'links'        => [
                'competition_registration' => '/pages/competition-registration-teams/select-team'
            ],
            'back_link'    => [
                'url'   => '/pages/ems',
                'label' => 'Back to EMS Home'
            ]
        ];
    }


    public function getFetchCompetitionManagedTeamsApiResponse($competition_id)
    {
        $competition = $this->findCompetition($competition_id);
        if ($competition) {
            unset($competition->links);
        }

        return [
            'teams'               => array_map(function ($team) use ($competition_id) {
                $team->links = (object) [
                    'competition_portal' => sprintf('/CompetitionProfile/Index?id=%s&teamId=%s', $competition_id,
                        $team->id)
                ];

                return $team;
            }, array_values(array_filter($this->competition_registered_teams, function ($team) {
                return $team->selection_information->is_selectable;
            }))),
            'competition_summary' => CompetitionPortalFactory::mockCompetitionSummary((array) $competition),
            'back_link'           => [
                'url'   => '/pages/my-competitions-teams',
                'label' => 'Back to Main Page'
            ]
        ];
    }


    private function getFetchCompetitionPortalCoreApiResponse($competition_id, $team_id = null, $back_link = null)
    {
        $competition = $this->findCompetition($competition_id);
        if ($competition) {
            unset($competition->links);
        }

        $team            = $this->findTeam($team_id);
        $entity_override = [
            'is_team' => ! ! $team_id
        ];
        if ($team) {
            $entity_override['name'] = sprintf('%s - %s', $team->name, $team->level);
        }

        $result = CompetitionPortalFactory::mockCompetitionPortalCoreData([
            'competition' => (array) $competition,
            'entity'      => $entity_override,
            'back_link'   => $back_link
                ? (array) $back_link
                : null
        ]);

        if ( ! simulation_arg_present('compliance_header_multirole')) {
            if (array_key_exists('role_items', $result['entity_summary']['compliance'])) {
                $result['entity_summary']['compliance']['role_items'] = [ $result['entity_summary']['compliance']['role_items'][1] ];
            }
        }

        return $result;
    }


    public function getPortalSubpageCommonResponse($competition_id, $team_id)
    {
        $team_segment = $team_id
            ? '&teamId=' . $team_id
            : '';

        $competition_data = $this->getActiveCompetitionData($competition_id, $team_id);

        $foundation = [
            'competition_summary' => CompetitionPortalFactory::mockCompetitionSummary($competition_data),
            'back_link'           => [
                'url'   => sprintf('/CompetitionProfile/Index?id=%s%s', $competition_id, $team_segment),
                'label' => 'Back'
            ]
        ];
        $overrides  = [];
        $team       = $this->findTeam($team_id);
        if ($team) {
            $overrides = [
                'is_team' => true,
                'name'    => sprintf('%s - %s', $team->name, $team->level)
            ];
        }
        $mock_entity_summary = CompetitionPortalFactory::mockEntitySummary($overrides, [ $competition_id, $team_id ]);

        if ( ! simulation_arg_present('compliance_header_multirole')) {
            if (array_key_exists('role_items', $mock_entity_summary['compliance'])) {
                $mock_entity_summary['compliance']['role_items'] = [ $mock_entity_summary['compliance']['role_items'][1] ];
            }
        }

        $foundation['entity_summary'] = $mock_entity_summary;

        return $foundation;
    }


    public function getFetchCompetitionDocumentsResponse($competition_id, $team_id = null)
    {
        return array_merge($this->getPortalSubpageCommonResponse($competition_id, $team_id), [
            'competition_documents' => CompetitionDocumentFactory::documents(),
        ]);
    }


    private function findCompetition($competition_id)
    {
        foreach ($this->team_registered_competitions as $competition) {
            if ((int) $competition->id === (int) $competition_id) {
                return $competition;
            }
        }

        return null;
    }


    private function findTeam($active_team_id)
    {
        foreach ($this->competition_registered_teams as $team) {
            if ((int) $team->id === (int) $active_team_id) {
                return $team;
            }
        }

        return null;
    }


    public function getFetchViewCompetitionAPIResponse($competition_id, $team_id = null)
    {
        if ($team_id) {
            return $this->getViewCompetitionTeam($competition_id, $team_id);
        }
        $overrides = [ 'id' => $competition_id ];
        $back_link = $back_link = [
            'url'   => '/pages/search-competitions',
            'label' => 'Back'
        ];

        if ($competition_id < 8) {
            $competition                           = new \App\Competition($competition_id);
            $overrides                             = (array) $competition;
            $overrides['start_date']               = \Carbon\Carbon::createFromTimestamp($overrides['start_date']);
            $overrides['end_date']                 = \Carbon\Carbon::createFromTimestamp($overrides['end_date']);
            $overrides['user_registration_status'] = "registered";
            $back_link                             = [
                'url'   => '/pages/my-competitions',
                'label' => 'Back'
            ];
        } elseif ((int) $competition_id === 999111999) {
            if ($this->active_competition_data) {
                $overrides = (array) $this->active_competition_data;
            }
            $back_link = [
                'url'   => sprintf('/pages/competitions/select-competition-entity?id=%s', $competition_id),
                'label' => 'Back'
            ];
        } else {
            $manager = CompetitionSearchManager::getCurrent();
            $source  = $manager->findCompetition($competition_id);
            if ($source) {
                $overrides = (array) $source;
            }
        }

        if (simulation_arg_present('no_ems')) {
            $overrides['is_ems'] = false;
        }
        if (simulation_arg_present('no_schedule')) {
            $overrides['schedule_available'] = false;
        }
        $result = ViewCompetitionFactory::ViewCompetitionData($overrides);
        if (simulation_arg_present('registration_closed')) {
            $result['registration_cta_configuration']['competition_registration_status'] = 'closed';
            $result['registration_cta_configuration']['registration_deadline']           = \Carbon\Carbon::today()->subDay()->timezone('America/New_York')->format("m/d, g:i A T");
        }

        $response = $this->getFetchCompetitionPortalCoreApiResponse($competition_id, $team_id, $back_link);

        $response['competition']                             = $result;
        $response['user_manages_competition_eligible_teams'] = $this->getUserManagesCompetitionEligibleTeams();

        return $response;
    }


    private function getViewCompetitionTeam($competition_id, $team_id)
    {
        $back_link = [
            'url'   => sprintf('/pages/competitions/my-teams?id=%s', $competition_id),
            'label' => 'Back'
        ];

        if ((int) $competition_id === 999111999) {
            $back_link = [
                'url'   => sprintf('/pages/competitions/select-competition-entity?id=%s', $competition_id),
                'label' => 'Back'
            ];
        }
        $response = $this->getFetchCompetitionPortalCoreApiResponse($competition_id, $team_id, $back_link);

        $overrides = (array) $response['competition_summary'];
        if ($this->active_competition_data) {
            $overrides = (array) $this->active_competition_data;
        }
        $overrides['user_registration_status'] = "registered";
        if (simulation_arg_present('no_ems')) {
            $overrides['is_ems'] = false;
        }
        if (simulation_arg_present('no_schedule')) {
            $overrides['schedule_available'] = false;
        }
        $overrides['user_roles'] = [ 'team' ];
        $overrides['team_id']    = $team_id;
        $response['competition'] = ViewCompetitionFactory::ViewCompetitionData($overrides);
        unset($response['competition']['registration_cta_configuration']);
        unset($response['competition']['volunteer_cta_configuration']);

        unset($response['competition_summary']);
        $response['user_manages_competition_eligible_teams'] = $this->getUserManagesCompetitionEligibleTeams();

        return $response;
    }


    public function getFetchEntitySelectApiResponse($competition_id)
    {
        $manager = CompetitionSearchManager::getCurrent();
        $source  = $manager->findCompetition($competition_id);

        $competition_summary = CompetitionPortalFactory::mockCompetitionSummary((array) $source);

        $entities = $this->buildEntitySelectionEntities($competition_id);

        return [
            'entities'            => $entities,
            'competition_summary' => $competition_summary,
            'back_link'           => [
                'url'   => '/pages/search-competitions',
                'label' => 'Back'
            ]
        ];
    }


    public function buildEntitySelectionEntities($competition_id)
    {

        $current_user = array_merge((array) ManagedTeamFactory::managedTeams()[0], [
            'name'  => 'Bob McAdamsson (Myself)',
            'level' => '',
            'id'    => (string) FieldFactory::id(),
            'links' => [
                'competition_portal' => sprintf('/CompetitionProfile/Index?id=%s', $competition_id)
            ]
        ]);

        $entities = array_map(function ($team) use ($competition_id) {
            $team->links = (object) [
                'competition_portal' => sprintf('/CompetitionProfile/Index?id=%s&teamId=%s', $competition_id, $team->id)
            ];

            return $team;
        }, array_values(array_filter($this->competition_registered_teams, function ($team) {
            return $team->selection_information->is_selectable;
        })));
        array_unshift($entities, $current_user);

        return $entities;
    }


    public function getActiveCompetitionData($competition_id, $team_id = null)
    {
        if ($this->active_competition_data) {
            return (array) $this->active_competition_data;
        }
        $temp = $this->getFetchViewCompetitionAPIResponse($competition_id, $team_id);

        return $temp['competition'];
    }


    public function setActiveCompetitionData($competition)
    {
        unset($competition['team_registration_cta_configuration']);
        $this->active_competition_data = $competition;
    }


    public function getFetchCompetitionContactsApiResponse($competition_id, $team_id)
    {

        $contacts = json_decode(file_get_contents(__DIR__ . '/../Data/CompetitionContacts.json'));

        return array_merge($this->getPortalSubpageCommonResponse($competition_id, $team_id), [
            'contacts' => $contacts
        ]);
    }


    public function getFetchCompetitionInformationApiResponse($competition_id, $team_id)
    {
        return array_merge($this->getPortalSubpageCommonResponse($competition_id, $team_id), [
            'competition_information' => CompetitionPortalFactory::mockCompetitionInformation()
        ]);
    }


    public function getFetchMusicAndPpcApiResponse($competition_id, $team_id)
    {
        $id = $competition_id;
        if ($id > 7) {
            $id = 1;
        }
        $competition_information = new \App\CompetitionInformation($id);
        unset($competition_information->skating_event_ids);
        $competition_information->competition_id = (string) $competition_id;

        $event_segments = CommonResponses::skaterEventSegments($id);

        return array_merge($this->getPortalSubpageCommonResponse($competition_id, $team_id), [
            'competition_information' => $competition_information,
            'entity_event_segments'   => $event_segments

        ]);
    }


    public function getFetchPracticeIceScheduleAPIResponse($competition_id, $team_id)
    {
        $schedules = CompetitionPortalFactory::mockPracticeIceSchedulesData($competition_id, $team_id);
        if ($team_id) {
            $schedules['mapped_skater_schedule']['events']                 = [];
            $schedules['mapped_skater_schedule']['scheduled_session_maps'] = [];
        }
        $cart = $team_id
            ? Cart::blankCore()
            : Cart::defaultCore();

        $additional_response_data = [
            'cart'                    => $cart->getAPIData(),
            'competition_information' => CommonResponses::competitionInformationData($competition_id),
            'active_sales_window'     => CompetitionPortalFactory::mockSalesWindowKey($competition_id),
            'entity_credits'          => CommonResponses::skaterCredits($competition_id)
        ];

        return array_merge($this->getPortalSubpageCommonResponse($competition_id, $team_id), $schedules,
            $additional_response_data);
    }


    public function getFetchPracticeIcePrePurchaseAPIResponse($competition_id, $team_id)
    {
        $cart                     = $team_id
            ? Cart::blankCore()
            : Cart::defaultCore();
        $additional_response_data = [
            'cart'                    => $cart->getAPIData(),
            'competition_information' => CommonResponses::competitionInformationData($competition_id),
            'entity_credits'          => CommonResponses::skaterCredits($competition_id),
            'competition_schedule'    => new \App\CompetitionSchedule($competition_id < 8
                ? $competition_id
                : 1),
            'entity_schedule'         => CompetitionPortalFactory::mockSkaterCompetitionSchedule($competition_id),
            'active_sales_window'     => CompetitionPortalFactory::mockSalesWindowKey($competition_id),
        ];

        return array_merge($this->getPortalSubpageCommonResponse($competition_id, $team_id), $additional_response_data);
    }


    public function getFetchCompetitionScheduleAPIResponse($competition_id, $team_id)
    {
        $additional_response_data = [
            'competition_schedule' => new \App\CompetitionSchedule($competition_id < 8
                ? $competition_id
                : 1)
        ];
        if (simulation_arg_present('schedule_unavailable')) {

            $additional_response_data['competition_schedule'] = [
                'schedule_unavailable' => true
            ];
        }

        return array_merge($this->getPortalSubpageCommonResponse($competition_id, $team_id), $additional_response_data);
    }


    private function getUserManagesCompetitionEligibleTeams()
    {
        return ! simulation_arg_present('no_eligible_teams');
    }


    public function getFetchMySkatersAPIResponse($competition_id)
    {
        $skater_data = [];
        if ($competition_id != 4) {
            $skater_data = json_decode(file_get_contents(__DIR__ . '/../../app/Data/CoachSkaterData.json'));
        }
        $additional_response_data = [
            'skaters' => $skater_data
        ];

        return array_merge($this->getPortalSubpageCommonResponse($competition_id, null), $additional_response_data);
    }


    public function getFetchMyCoachesAPIResponse($competition_id)
    {
        $id = $competition_id < 8
            ? $competition_id
            : $competition_id % 7;

        $map                    = json_decode(file_get_contents(__DIR__ . '/../../app/Data/SkaterCoachCompetitionEventCategoryMap.json',
            true), true);
        $event_categories       = json_decode(file_get_contents(__DIR__ . '/../../app/Data/SkatingEventCategories.json'),
            true);
        $competition_map        = $map[$id];
        $event_category_results = [];
        $coaches                = \App\Coach::allKeyed();
        foreach ($competition_map as $category_id => $coach_ids) {
            $event_coaches = [];
            foreach ($coach_ids as $coach_id) {
                $event_coaches[] = $coaches->$coach_id;
            }
            $result                   = $event_categories[$category_id];
            $result['coaches']        = $event_coaches;
            $event_category_results[] = $result;
        }

        $additional_response_data = [
            'event_categories' => $event_category_results
        ];

        return array_merge($this->getPortalSubpageCommonResponse($competition_id, null), $additional_response_data);
    }


    public function getFetchMyScheduleCoachAPIResponse($competition_id, $schedule_available = true)
    {
        $additional_response_data = [
            'schedule_available' => $schedule_available
        ];

        if ($schedule_available) {
            $additional_response_data['coach_schedule'] = CommonResponses::coachedSkaterSchedule($competition_id);
        }

        return array_merge($this->getPortalSubpageCommonResponse($competition_id, null), $additional_response_data);
    }


    public function getFetchMyScheduleSkaterAPIResponse($competition_id, $schedule_available = true)
    {
        $id                           = $competition_id < 8
            ? $competition_id
            : $competition_id % 7;
        $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/../../app/Data/SkaterCompetitonEventMap.json'));
        $event_ids                    = $competition_skater_event_map->$id;
        $events                       = [];
        foreach ($event_ids as $event_id) {
            $event                 = new \App\SkatingEvent($event_id, $id);
            $event->competition_id = (int) $id;
            unset($event->credit_config);
            unset($event->credit_packages);
            $events[] = $event;

        }

        $competition_skater_event_map = json_decode(file_get_contents(__DIR__ . '/../../app/Data/SkaterCompetitionSchedule.json'),
            true);
        $competition_session_ids      = $competition_skater_event_map[$id];
        $sessions                     = [];
        $competition                  = new \App\CompetitionSchedule($id);
        foreach ($competition->sessions as $session) {
            if (array_key_exists($session->id, $competition_session_ids)) {
                $adl_config = $competition_session_ids[$session->id];
                $result     = [];
                foreach ($adl_config as $key => $value) {
                    $result[$key] = $value;
                }
                $result['session'] = $session;

                $sessions[] = $result;
            }
        }

        $additional_response_data = [
            'schedule_available' => $schedule_available
        ];

        if ($schedule_available) {
            $additional_response_data['skater_schedule'] = [
                'events'   => $events,
                'sessions' => $sessions
            ];
        }

        return array_merge($this->getPortalSubpageCommonResponse($competition_id, null), $additional_response_data);
    }


    public function getFetchCoachCompetitionScheduleAPIResponse($competition_id, $schedule_available = true)
    {


        $additional_response_data = [
            'competition_information' => CommonResponses::competitionInformationData($competition_id),
            'coached_skater_schedule' => CommonResponses::coachedSkaterSchedule($competition_id),
            'competition_schedule' => new \App\CompetitionSchedule($competition_id < 8
                ? $competition_id
                : 1)
        ];

        if (!$schedule_available) {
            $additional_response_data['competition_schedule'] = [
                'schedule_unavailable' => true
            ];
        }

        return array_merge($this->getPortalSubpageCommonResponse($competition_id, null), $additional_response_data);
    }


    /**
     * return `SubmitCompetitionVolunteerRequestAPIResponse`
     */
    public function submitCompetitionVolunteerRequest($competition_id,$data)
    {
        $success              = true;
        $error                = "";
        $scenario             = 'shift_selection';
        $confirmation_message = "Your request has been approved";

        if (strpos($data['volunteer_skillset'], 'pending') !== false) {
            $scenario             = 'request_pending_approval';
            $confirmation_message = 'Request submitted and pending approval';
        }
        $volunteer_cta_configuration = CompetitionFieldFactory::CompetitionVolunteerCtaConfigurationData([
            'scenario' => $scenario,
        ]);

        if (strpos($data['volunteer_skillset'], 'error') !== false) {
            $success                     = false;
            $error                       = "Configurable error message.";
            $volunteer_cta_configuration = null;
            $confirmation_message        = null;
        }

        $response = [
            'success'                     => $success,
            'error'                       => $error,
            'volunteer_cta_configuration' => $volunteer_cta_configuration,
            'confirmation_message'        => $confirmation_message,
        ];
        if (strpos($data['volunteer_skillset'], 'pending') === false) {
            $comp     = $this->getActiveCompetitionData($competition_id);
            $user_nav = $comp['user_navigation'];
            $volunteer_shift_selection = CompetitionPortalUserNavigationFactory::getVolunteerShiftSelection($competition_id,
                true);
            $volunteer_schedule = CompetitionPortalUserNavigationFactory::getVolunteerSchedule($competition_id, false);

            array_splice($user_nav, count($user_nav) -2, 0, [
                $volunteer_shift_selection['item'],
                $volunteer_schedule['item']
            ]);

            $response['competition_user_navigation'] = $user_nav;
        }
        return $response;
    }

}