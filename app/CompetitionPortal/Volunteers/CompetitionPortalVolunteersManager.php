<?php

namespace App\CompetitionPortal\Volunteers;

use App\CompetitionPortal\CompetitionPortalManager;
use App\SelfStartingAbstractSessionStore;

class CompetitionPortalVolunteersManager extends SelfStartingAbstractSessionStore
{

    /**
     * @var CompetitionPortalManager
     */
    protected $parent;

    /**
     * @var array
     */
    public $shift_selection_schedule;

    public $volunteer_schedule;


    /**
     * CompetitionPortalTeamPersonnelManager constructor.
     */
    public function __construct($properties = false)
    {
        $this->parent = CompetitionPortalManager::getCurrent();

        parent::__construct($properties);

        if ( ! $this->shift_selection_schedule) {
            $mock_shift_selection_schedule  = CompetitionPortalVolunteersFactory::mockShiftSelectionSchedule();
            $this->shift_selection_schedule = (object) $mock_shift_selection_schedule;
        }

        if ( ! $this->volunteer_schedule) {
            $this->volunteer_schedule = CompetitionPortalVolunteersFactory::mockMyVolunteerSchedule();
        }
    }


    /**
     * @inheritDoc
     */
    protected static function session_storage_key()
    {
        return 'competition_portal_volunteers';
    }


    public function getFetchVolunteerShiftSelectionApiResponse($competition_id)
    {

        $additional_response_data = array_merge([
            'links'             => [
                'download_schedule' => 'https://placehold.it/320x240&text=download+full+schedule',
                'user_compliance'   => 'https://placehold.it/320x240&text=Manage+Compliance',
            ],
            'user_is_compliant' => simulation_arg_present('user_non_compliant')
                ? false
                : true,
            'selection_open'    => simulation_arg_present('ss_not_open')
                ? false
                : true,
        ], simulation_arg_present('ss_unavailable')
            ? []
            : (array) $this->shift_selection_schedule);

        return array_merge($this->getPortalCommonResponse($competition_id), $additional_response_data);
    }


    /**
     * @param $competition_id
     *
     * @return array
     */
    private function getPortalCommonResponse($competition_id)
    {
        $portal_subpage_common_response = $this->parent->getPortalSubpageCommonResponse($competition_id, false);

        $portal_subpage_common_response['back_link']['url'] .= '&registered_volunteer';

        return $portal_subpage_common_response;
    }


    public function getFetchMyVolunteerScheduleApiResponse($competition_id)
    {
        $additional_response_data = [
            'links'              => [
                'download_schedule'  => 'https://placehold.it/320x240&text=download_schedule',
                'product_support' => '/pages/ems-support',
                'user_compliance'    => 'https://placehold.it/320x240&text=compliance_management',
            ],
            'schedule'           => $this->volunteer_schedule,
            'user_is_compliant'  => simulation_arg_present('user_non_compliant')
                ? false
                : true,
            'volunteer_contacts' => CompetitionPortalVolunteersFactory::mockMyVolunteerScheduleContacts()
        ];

        return array_merge($this->getPortalCommonResponse($competition_id), $additional_response_data);
    }


    public function findShift($shift_id)
    {
        $shifts = $this->shift_selection_schedule->schedule->shifts;
        foreach ($shifts as $shift) {
            if ($shift->id === $shift_id) {
                return $shift;
            }
        }

        foreach ($this->volunteer_schedule as $day) {

            foreach ($day->shifts as $shift) {
                if ($shift->id === $shift_id) {
                    return $shift;
                }
            }
        }
        $mock = array_merge(CompetitionPortalVolunteersFactory::mockShiftSelectionShift([
            'id' => $shift_id
        ]), CompetitionPortalVolunteersFactory::mockMyVolunteerScheduleShift([
            'id' => $shift_id
        ]));
        foreach ($mock as $key => $value) {
            if (strpos($key, '_') === 0) {
                unset($mock[$key]);
            }
        }

        return (object) $mock;
    }


    public function getSelectVolunteerShiftApiResponse($competition_id, $shift_id)
    {
        $shift = $this->findShift($shift_id);

        return [
            'result'  => [
                'selection_result' => simulation_arg_present('shift_selection_pending')
                    ? 'pending'
                    : 'approved',
                'open_positions'   => --$shift->open_positions,
                'openings_status'  => $shift->open_positions
                    ? 'success'
                    : 'alert'
            ],
            'success' => true,
            'error'   => ''
        ];
    }


    public function getRemoveVolunteerShiftApiResponse($competition_id, $shift_id)
    {
        $shift = $this->findShift($shift_id);

        return [
            'result'  => [
                'open_positions'  => ++$shift->open_positions,
                'openings_status' => $shift->open_positions
                    ? 'success'
                    : 'alert'
            ],
            'success' => true,
            'error'   => ''
        ];
    }

}