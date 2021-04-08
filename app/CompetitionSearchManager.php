<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 12/30/19
 * Time: 4:50 PM
 */

namespace App;

use App\factories\CompetitionSearchCompetitionFactory;

/**
 * Class to provide list of competition search competitions, and maintain state of list for future reference
 */
class CompetitionSearchManager extends AbstractSessionStore {


    public $competition_list;

    public function __construct( $properties = false ) {
        parent::__construct( $properties );
        if ( ! $this->competition_list ) {
            $this->competition_list = CompetitionSearchManager::getCompetitionsLists();
        }
    }

    protected static function session_storage_key() {
        return "competition_search";
    }

    /**
     * Get competitions list for property population
     */
    private static function getCompetitionsLists() {
        if ( simulation_arg_present( 'no_competitions' ) ) {
            return [];
        }

        return CompetitionSearchCompetitionFactory::competitionList();
    }

    /**
     * Find a competition within the competition list property
     */
    public function findCompetition( $id ) {
        foreach ( $this->competition_list as $comp ) {
            if ( (int) $comp->id === (int) $id ) {
                return $comp;
            }
        }

        return null;
    }

    /**
     * Get a FetchSearchCompetitionListAPIResponse
     */
    public function getFetchSearchCompetitionListAPIResponse() {
        return json_encode(
            [
                "competitions" => array_map(
                    function ( $item ) {
                        // unset properties that shouldn't be in data set for
                        return $item;
                    }, $this->competition_list
                ),
            ]
        );
    }
}