<?php

namespace App\CompetitionPortal\CompetitionRoster;

use App\CompetitionPortal\CompetitionPortalManager;
use App\SelfStartingAbstractSessionStore;

class CompetitionPortalRosterManager extends SelfStartingAbstractSessionStore
{

    public $roster;

    public $selected_ids = [];

    /**
     * @var CompetitionPortalManager
     */
    protected $parent;


    /**
     * CompetitionPortalTeamPersonnelManager constructor.
     */
    public function __construct($properties = false)
    {
        $this->parent = CompetitionPortalManager::getCurrent();

        parent::__construct($properties);

        if ( ! $this->roster) {
            $this->populateRoster();
        }
    }


    private function populateRoster()
    {
        $result             = CompetitionPortalRosterFactory::mockTeamRoster();
        $this->roster       = json_decode(json_encode($result['roster']));
        $this->selected_ids = $result['selected_ids'];
    }


    /**
     * @inheritDoc
     */
    protected static function session_storage_key()
    {
        return 'competition_portal_roster';
    }


    public function getFetchCompetitionRosterApiResponse($competition_id, $team_id)
    {
        $competition_roster = $this->getSelectedCompetitionRoster();

        $minimum              = 6;
        $maximum              = 12;
        $roster_edit_disabled = simulation_arg_present('cp_roster_disabled');

        return array_merge($this->parent->getPortalSubpageCommonResponse($competition_id, $team_id), [
            'competition_roster'   => $competition_roster,
            'download_link'        => 'https://placehold.it/320x240&text=Download+Roster',
            'roster_minimum'       => $minimum,
            'roster_edit_disabled' => $roster_edit_disabled,
            // 'roster_maximum'     => 4,
            'roster_rules'         => [
                sprintf('You must have a minimum of %s skaters.', $minimum),
                sprintf('You can not exceed %s skaters.', $maximum),
                'The majority of skaters must be 12 or under.'
            ],
            'page_introduction'    => 'Skaters listed below are those attending the competition and will be credentialed. Age of skaters listed is their age as of the preceding July 1st.'
        ]);
    }


    /**
     * @return array
     */
    private function getSelectedCompetitionRoster()
    {
        $selected_roster_ids = $this->selected_ids;

        return array_values(array_map(function ($item) {
            return CompetitionPortalRosterFactory::mockCompetitionRosterMember((array) $item);
        }, array_filter($this->roster, function ($item) use ($selected_roster_ids) {
            return in_array($item->id, $selected_roster_ids);
        })));
    }


    public function getFetchTeamRosterApiResponse($competition_id, $team_id)
    {
        $team_roster = array_values(array_map(function ($item) {
            return CompetitionPortalRosterFactory::mockTeamRosterMember((array) $item);
        }, $this->roster));

        return [
            'team_roster' => $team_roster
        ];
    }


    public function patchUpdateCompetitionRoster($data)
    {
        $this->selected_ids = $data;

        return [
            'success'           => true,
            'error'             => '',
            'competition_roster' => $this->getSelectedCompetitionRoster()
        ];
    }
}