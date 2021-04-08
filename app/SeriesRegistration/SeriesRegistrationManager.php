<?php

namespace App\SeriesRegistration;

use App\AbstractSessionStore;
use App\Search;
use App\SeriesRegistration\Factories\SeriesRegistrationFactory;
use App\SkateTestHistory;
use App\Teams\Factories\ManagedTeamFactory;

/**
 * Class for managing Mock API for Series Registration
 */
class SeriesRegistrationManager extends AbstractSessionStore
{

    public $series_list;

    public $teams;


    public function __construct($properties = false)
    {
        parent::__construct($properties);
        if ( ! $this->series_list) {
            $this->series_list = static::getSeriesList();
        }
    }


    /**
     * Get foundational series list for manager
     */
    private static function getSeriesList()
    {
        if (simulation_arg_present('no_series')) {
            return [];
        }

        return SeriesRegistrationFactory::managerSeriesData();

    }


    /**
     * Get the stored data from the session
     */
    protected static function getStoredData()
    {
        return json_decode($_SESSION[static::session_storage_key()], true);
    }


    protected static function session_storage_key()
    {
        return "skater_series";
    }


    public function getFetchSeriesRegistrationSeriesListApiResponse()
    {
        return json_encode([
            "series" => array_map(function ($item) {
                return SeriesRegistrationFactory::SeriesRegistrationIndexSeriesData($item);
            }, $this->series_list),
        ]);
    }


    public function getFetchSeriesRegistrationSeriesApplicationApiResponse($series_id)
    {
        $core_series = $this->findCore($series_id);

        $test_history                     = SkateTestHistory::clearOptionsFromKeys(SkateTestHistory::core(false));
        $_SESSION['current_test_history'] = json_encode($test_history);

        $series_registration_application_series_data = SeriesRegistrationFactory::SeriesRegistrationApplicationSeriesData($core_series);
        $citizenship_blocked                         = false;
        if (simulation_arg_present('noncitizen')) {
            $citizenship_blocked = true;
        }

        return json_encode([
            'series'                   => $series_registration_application_series_data,
            'user_application_profile' => array_merge([
                'skate_test_history'            => $test_history,
                'series_level_eligibility'      => SeriesRegistrationFactory::SeriesRegistrationUserSeriesEligibilityData($series_registration_application_series_data['application_configuration']),
                'is_series_citizenship_ineligible' => $citizenship_blocked
            ], SeriesRegistrationFactory::SeriesRegistrationUserApplicationProfileData()),
            'user_application'         => SeriesRegistrationFactory::SeriesRegistrationUserApplicationData($core_series),
        ]);
    }


    private function findCore($series_id)
    {
        if ($this->series_list) {
            foreach ($this->series_list as $item) {
                if ((int) $item['id'] === (int) $series_id) {
                    return $item;
                }
            }
        }
    }


    public function getPartnerSearchAPIResponse()
    {
        $data   = json_decode(file_get_contents('php://input'), true);
        $search = new Search($data, true);

        return json_encode(SeriesRegistrationFactory::PartnerSearchAPIResponse($search->results));
    }


    public function getAddSkateTestAPIResponse()
    {
        $response = [
            'success'            => true,
            'error'              => "",
            'skate_test_history' => SkateTestHistory::adaptResponse(SkateTestHistory::handleAddSubmission())
        ];

        $data = json_decode(file_get_contents('php://input'), true);
        $map  = [
            'dance'        => 2,
            'moves'        => 1,
            'free_skating' => 1,
            'pair'         => 3
        ];
        if (array_key_exists($data['discipline_key'], $map)) {
            $discipline_id    = $map[$data['discipline_key']];
            $id_map           = [
                1 => 'Singles',
                2 => 'Dance',
                3 => 'Pairs',
            ];
            $retained_levels  = [ SeriesRegistrationFactory::disciplineLevels($id_map[$discipline_id])[2] ];
            $new_levels       = SeriesRegistrationFactory::disciplineLevels('STA ' . ucwords($data['discipline_key']),
                200);
            $available_levels = array_merge($new_levels, $retained_levels);
            usort($available_levels, function ($a, $b) {
                return $a['level_id'] - $b['level_id'];
            });
            $response['user_discipline_eligibility_update'] = [
                [
                    'discipline_id'   => $discipline_id,
                    'eligible_levels' => $available_levels
                ]
            ];
        }

        return $response;
    }


    public function getRemoveSkateTestAPIResponse()
    {
        $response = [
            'success'            => true,
            'error'              => "",
            'skate_test_history' => SkateTestHistory::adaptResponse(SkateTestHistory::handleRemoveSubmission())
        ];

        $data = json_decode(file_get_contents('php://input'), true);
        $map  = [
            'dance'        => 2,
            'moves'        => 1,
            'free_skating' => 1,
            'pair'         => 3
        ];
        if (array_key_exists($data['discipline_key'], $map)) {
            $discipline_id    = $map[$data['discipline_key']];
            $id_map           = [
                1 => 'Singles',
                2 => 'Dance',
                3 => 'Pairs',
            ];
            $retained_levels  = [ SeriesRegistrationFactory::disciplineLevels($id_map[$discipline_id])[2] ];
            $new_levels       = SeriesRegistrationFactory::disciplineLevels('STR ' . ucwords($data['discipline_key']),
                100);
            $available_levels = array_merge($new_levels, $retained_levels);
            usort($available_levels, function ($a, $b) {
                return $a['level_id'] - $b['level_id'];
            });
            $response['user_discipline_eligibility_update'] = [
                [
                    'discipline_id'   => $discipline_id,
                    'eligible_levels' => $available_levels
                ]
            ];
        }

        return $response;
    }


    public function getFetchSeriesOverviewApiResponse($series_id)
    {
        $core_series = $this->findCore($series_id);

        $overview_series_data = SeriesRegistrationFactory::OverviewSeriesData($core_series);
        if (simulation_arg_present('no_admin')) {
            unset($overview_series_data['reports']);
        }

        $additional_args = [];
        if (array_key_exists('is_team_series', $core_series) && $core_series['is_team_series']) {
            $overview_series_data['links']['application'] = sprintf('/pages/series-registration/%s/select-team',
                $core_series['id']);
            if (array_key_exists('_team_series_no_teams', $core_series) && $core_series['_team_series_no_teams']) {
                $overview_series_data['status']['message']           = [
                    'type_key' => 'error',
                    'text'     => 'You do not manage any teams, so you are not able to apply for this series'
                ];
                $overview_series_data['status']['applications_open'] = false;
            } else {
                $additional_args['applied_teams'] = SeriesRegistrationFactory::SeriesRegistrationAppliedTeamsData($core_series,
                    $this->buildEntitySelectionEntities($series_id));
            }
        } else {
            $series_registration_user_application_data = SeriesRegistrationFactory::SeriesRegistrationUserApplicationData($core_series);
            if ($series_registration_user_application_data && simulation_arg_present('application_permutation')) {
                $series_registration_user_application_data['disciplines'][0]['coaches'] = [];
                $series_registration_user_application_data['disciplines'][1]['coaches'] = [];
                $series_registration_user_application_data['disciplines'][1]['levels']  = [];
                $series_registration_user_application_data['disciplines'][2]['coaches'] = [];
                $series_registration_user_application_data['disciplines'][2]['levels']  = [];
                $series_registration_user_application_data['disciplines'][2]['partner'] = null;
            }
            if ($series_registration_user_application_data && simulation_arg_present('ineligible_entities')) {
                $series_registration_user_application_data['disciplines'][0]['coaches'][0]['ineligible'] = true;
                $series_registration_user_application_data['disciplines'][2]['partner']['ineligible']    = true;
            }
            $additional_args['user_application'] = $series_registration_user_application_data;

        }

        return json_encode(array_merge([
            'series' => $overview_series_data,
        ], $additional_args));
    }


    public function getFetchSeriesStandingsApiResponse($series_id)
    {
        $core_series = $this->findCore($series_id);

        return json_encode([
            'series'    => SeriesRegistrationFactory::SeriesRegistrationStandingsSeriesData($core_series),
            'standings' => SeriesRegistrationFactory::SeriesRegistrationStandingsData()
        ]);
    }


    public function getFetchSeriesSelectTeamApiResponse($series_id)
    {
        $core_series = $this->findCore($series_id);
        $series      = SeriesRegistrationFactory::SupageSeriesSummaryData($core_series);

        $entities = $this->buildEntitySelectionEntities($series_id);

        $this->teams = $entities;

        return json_encode([
            'series' => $series,
            'teams'  => $entities
        ]);
    }


    private function buildEntitySelectionEntities($series_id)
    {
        $teams = ManagedTeamFactory::managedTeams();

        return array_map(function ($item, $index) use ($series_id) {
            $texts = [ 'Start', 'Update', 'Continue' ];

            if ($item->selection_information->is_selectable) {
                $item->selection_information->button = (object) [
                    'text' => $texts[$index % 3],
                    'url'  => sprintf('/pages/series-registration/%s/application?teamId=%s', $series_id, $item->id)
                ];
            }

            return $item;
        }, $teams, array_keys($teams));
    }

    public function getFetchSeriesRegistrationSeriesApplicationTeamApiResponse($series_id, $team_id)
    {
        $core_series = $this->findCore($series_id);
        $team        = $this->findTeam($series_id, $team_id);

        $series_registration_application_series_data = SeriesRegistrationFactory::SeriesRegistrationApplicationSeriesDataTeam($core_series);

        $series_registration_user_series_eligibility_data = SeriesRegistrationFactory::SeriesRegistrationUserSeriesEligibilityData($series_registration_application_series_data['application_configuration']);

        $series_registration_user_series_eligibility_data[1]['eligible_levels'] = [ $series_registration_user_series_eligibility_data[1]['eligible_levels'][0] ];

        $key = simulation_arg_present('alt_team_series')
            ? 1
            : 0;

        $series_registration_user_series_eligibility_data = [ $series_registration_user_series_eligibility_data[$key] ];

        return json_encode([
            'series'                   => $series_registration_application_series_data,
            'user_application_profile' => array_merge([
                'series_level_eligibility' => $series_registration_user_series_eligibility_data,
            ], SeriesRegistrationFactory::SeriesRegistrationTeamApplicationProfileData((array) $team)),
            'user_application'         => SeriesRegistrationFactory::SeriesRegistrationUserApplicationDataTeam($core_series,
                $team),
        ]);
    }


    private function findTeam($series_id, $team_id)
    {
        $teams = $this->buildEntitySelectionEntities($series_id);
        foreach ($teams as $team) {
            if ((int) $team_id === (int) $team->id) {
                return $team;
            }
        }

        return null;
    }
}