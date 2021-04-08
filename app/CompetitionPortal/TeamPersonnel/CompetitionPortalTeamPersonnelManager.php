<?php

namespace App\CompetitionPortal\TeamPersonnel;

use App\CompetitionPortal\CompetitionPortalManager;
use App\SelfStartingAbstractSessionStore;
use App\Teams\CompetitionRegistration\Registration\Factories\AbstractTeamEntityFactory;

class CompetitionPortalTeamPersonnelManager extends SelfStartingAbstractSessionStore
{

    /**
     * @var \stdClass[]
     */
    public $coaches;

    /**
     * @var \stdClass[]
     */
    public $team_service_personnel;

    /**
     * @var \stdClass[]
     */
    public $prop_crew;

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
        $this->populateTeamEntities();
    }


    /**
     * Populate the data sources for team entities.
     *
     * Compiled structures of all those needed by page to be filtered for only necessary props during response
     */
    private function populateTeamEntities()
    {
        $keys = [ 'coaches', 'team_service_personnel', 'prop_crew' ];
        foreach ($keys as $key) {
            if ($this->$key) {
                continue;
            }
            $this->$key = json_decode(json_encode(CompetitionPortalTeamPersonnelFactory::mockEntities()));
        }
    }


    /**
     * @inheritDoc
     */
    protected static function session_storage_key()
    {
        return 'competition_portal_team_personnel';
    }


    public function getFetchCompetitionCompetitionPersonnelApiResponse($competition_id, $team_id)
    {
        $selected_team_personnel = $this->getSelectedTeamPersonnel();
        $has_prop_crew           = ! simulation_arg_present('no_prop_crew');
        if ( ! $has_prop_crew) {
            unset($selected_team_personnel['prop_crew']);
        }

        return array_merge($this->parent->getPortalSubpageCommonResponse($competition_id, $team_id), [
            'competition_team_personnel' => $selected_team_personnel,
            'has_prop_crew'              => $has_prop_crew
        ]);
    }


    private function setEntityIneligible(&$entity)
    {
        $entity->is_ineligible                    = true;
        $entity->can_be_added_to_roster           = false;
        $entity->cannot_be_added_to_roster_reason = 'Ineligible to participate';
        $entity->is_compliant                     = false;
    }


    public function getSelectedTeamPersonnel()
    {
        if (simulation_arg_present('ctp_unclean')) {
            $this->coaches[1]->is_compliant = false;

            $this->setEntityIneligible($this->coaches[2]);
            $this->setEntityIneligible($this->team_service_personnel[1]);
            $this->setEntityIneligible($this->prop_crew[1]);
        }

        $selected_coach_count = 4;
        $selected_tsp_count   = 2;
        $selected_pc_count    = 2;

        if (simulation_arg_present('ctp_none')) {
            $selected_coach_count = 0;
            $selected_tsp_count   = 0;
            $selected_pc_count    = 0;
        }

        return [
            'coaches'                => array_values(array_map(function ($item) {
                $overrides = (array) $item;
                unset($overrides['compliance_summary']);

                return CompetitionPortalTeamPersonnelFactory::mockTeamPerson($overrides);
            }, array_slice($this->coaches, 0, $selected_coach_count))),
            'team_service_personnel' => array_values(array_map(function ($item) {
                $overrides = (array) $item;
                unset($overrides['compliance_summary']);

                return CompetitionPortalTeamPersonnelFactory::mockTeamPerson($overrides);
            }, array_slice($this->team_service_personnel, 0, $selected_tsp_count))),
            'prop_crew'              => array_values(array_map(function ($item) {
                $overrides = (array) $item;
                unset($overrides['compliance_summary']);

                return CompetitionPortalTeamPersonnelFactory::mockTeamPerson($overrides);
            }, array_slice($this->prop_crew, 0, $selected_pc_count)))
        ];
    }


    public function getFetchAvailableCompetitionPersonnelApiResponse($type)
    {
        $key            = str_replace('-', '_', $type);
        $list           = $this->$key;
        $primary_keys   = [
            'coaches'                => 'team_coaches',
            'team_service_personnel' => 'team_service_personnel',
            'prop_crew'              => 'prop_crew'
        ];
        $secondary_keys = [
            'coaches'                => 'coach_maximum',
            'team_service_personnel' => 'team_service_personnel_maximum',
            'prop_crew'              => 'prop_crew_maximum'
        ];
        $amounts        = [
            'coaches'                => 4,
            'team_service_personnel' => 2,
            'prop_crew'              => 2,
        ];

        $response = [
            $primary_keys[$key]   => array_values(array_map(function ($item) {
                return AbstractTeamEntityFactory::mockAbstractTeamEntityData((array) $item);
            }, $list)),
            $secondary_keys[$key] => $amounts[$key]
        ];

        return $response;
    }


    public function patchUpdateCompetitionRosterType($type, $ids)
    {
        $key            = str_replace('-', '_', $type);
        $list           = $this->$key;
        $primary_keys   = [
            'coaches'                => 'competition_coaches',
            'team_service_personnel' => 'competition_team_service_personnel',
            'prop_crew'              => 'competition_prop_crew'
        ];
        $resultant_list = array_values(array_filter($list, function ($item) use ($ids) {
            return in_array($item->id, $ids);
        }));

        $response = [
            'success'           => true,
            'error'             => '',
            $primary_keys[$key] => array_values(array_map(function ($item) {
                return CompetitionPortalTeamPersonnelFactory::mockTeamPerson((array) $item);
            }, $resultant_list))
        ];

        return $response;

    }
}