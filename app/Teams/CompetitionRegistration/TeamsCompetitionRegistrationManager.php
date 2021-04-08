<?php

namespace App\Teams\CompetitionRegistration;

use App\AbstractSessionStore;
use App\CompetitionSearchManager;
use App\Teams\TeamsManager;

class TeamsCompetitionRegistrationManager extends AbstractSessionStore
{

    /**
     * @var AbstractSessionStore
     */
    protected $parent;


    public function __construct($properties = false)
    {
        $this->parent       = TeamsManager::getCurrent();
        $this->competitions = TeamCompetitionRegistrationCompetitionFactory::mockCompetitionListCompetitionData();

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
        return "teams_competition_registration";
    }


    public function getFetchCompetitionListApiResponse($team_id)
    {
        // Clear Competition Search Manager to ensure data from Registration Mocks is used
        CompetitionSearchManager::clearSession();

        $team = $this->getTeamById($team_id);
        if ( ! $team) {
            http_response_code(400);
            exit();
        }

        $response = [
            "competitions" => array_values(array_filter($this->competitions, function ($item) {
                if (simulation_arg_present('no_qual') && $item->is_qualifying) {
                    return false;
                }
                if (simulation_arg_present('no_nonqual') && ! $item->is_qualifying) {
                    return false;
                }

                return true;
            })),
            'team'         => [
                'name'  => $team->name,
                'level' => $team->level
            ]
        ];

        return json_encode($response);
    }


    /**
     * @param $teams
     *
     * @return mixed
     */
    public function getCompetitionById($competition_id)
    {
        $competitions = $this->competitions;
        foreach ($competitions as $competition) {

            if ($competition->id == $competition_id) {
                return $competition;
            }
        }

        return null;
    }


    /**
     * @param $team_id
     *
     * @return mixed
     */
    public function getTeamById($team_id)
    {
        return $this->parent->getTeamById($team_id);
    }
}