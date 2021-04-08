<?php

namespace App\Teams;

use App\AbstractSessionStore;
use App\Teams\Factories\ManagedTeamFactory;

class TeamsManager extends AbstractSessionStore
{

    public $teams;


    /**
     * TeamsManager constructor.
     */
    public function __construct($properties = false)
    {
        parent::__construct($properties);
        if ( ! $this->teams || count($this->teams) === 0) {
            $this->teams = ManagedTeamFactory::managedTeams();
        }
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
     * @param $teams
     *
     * @return mixed
     */
    public function getTeamById($team_id)
    {
        foreach ($this->teams as $team) {

            if ($team->id == $team_id) {
                return $team;
            }
        }

        return null;
    }
    /**
     * @inheritDoc
     */
    protected static function session_storage_key()
    {
        return "teams";
    }


    public function getFetchManagedTeamsApiResponse()
    {
        return [
            'teams'           => $this->teams,
            'selection_links' => ManagedTeamFactory::selectionLinks()
        ];
    }
}