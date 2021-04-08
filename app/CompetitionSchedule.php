<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/6/18
 * Time: 11:23 AM
 */

namespace App;

use Carbon\Carbon;

class CompetitionSchedule implements \JsonSerializable
{

    /**
     * Competition constructor.
     */
    public function __construct($id)
    {
        $data          = ( json_decode(file_get_contents(__DIR__ . '/Data/CompetitionSchedules.json')) );
        $competition   = $this->getCompetition( $id );
        $competition_id = $competition->id;
        $schedule_data = $data->$competition_id;
        $timezone                = "America/Denver";

        $facilities              = [];
        $this->rinks             = [];
        $this->facilities        = [];
        $this->sessions          = [];
        $this->legend            = $this->getLegend();
        $this->links             = $this->getLinks($id);
        $session_id_index        = 1000 * ($id-1) + 1; //cheap way to differentiate between competition sessions for cart mock
        $start_date              = Carbon::createFromTimestamp( $competition->start_date, $timezone);
        $end_date                = Carbon::createFromTimestamp( $competition->end_date, $timezone );
        $current_date            = $start_date->copy()->subDay();
        $competition_information = new CompetitionInformation($competition_id);
        $event_id_map            =[
            "1"=>'IL',
            "2"=>'IP',
            "3"=>'AP'
        ];

        //timezone offset in minutes where timezones earlier than UTC are positive and those after are negative
        // to correspond with JavaScript quirks
        $timezone_offset = Carbon::now()->timezone( $timezone)->offset / 60 * -1;


        $competition_id_options = pc_array_power_set($competition_information->skating_event_ids);
        unset($competition_id_options[0]);


        $this->rinks    = [];
        $this->sessions = [];

        foreach ($schedule_data->rinks as $rink_id) {
            $rink = new Rink($rink_id);
            if ( ! array_key_exists($rink->facility_id, $facilities)) {
                $facility                       = new Facility($rink->facility_id);
                $facilities[$rink->facility_id] = $facility;
                $this->facilities[]             = $facility;
            }
            $rink->facility = $facilities[$rink->facility_id];
            $this->rinks[]  = $rink;
        }

        foreach ($this->rinks as $rink_index => $rink) {
         $session_date = $current_date->copy();
            for ($i = 0; $i < 3; $i++) {
                $hour_index = 1;
                $session_date->addDay();
                if ( $session_date > $end_date ) {
                    break;
                }
                if($i==2 && $rink_index == count($this->rinks) - 1){
                    $session_date->addDay();
                    if ( $session_date > $end_date ) {
                        break;
                    }
                }
                foreach (Session::allPermutations() as $index => $sessions) {
                    $competition_index = 0;
                    foreach ($competition_id_options as $index2 => $id_array) {
                        $id_array = array_reverse($id_array);// previous functions return id array in reverse order
                        $translated_id_array =[];
                        foreach ($id_array as $id) {
                            $translated_id_array[] = \App\SkatingEvent::ModifiedIDEventKey($id,$competition->id);
                        }
                        $session       = json_decode(json_encode($sessions));
                        $session->date = $session_date->timestamp;
                        $session->id   = $session_id_index++;

                        $session->time_start = $session_date->copy()->setTime(6, 0,
                            0)->addHours(0)->addMinutes($hour_index * 25 + $i + ( ( $rink_index ) * 10 ))->timestamp;
                        $session->time_end   = $session_date->copy()->setTime(6, 0,
                            0)->addHours(0)->addMinutes(25 + $hour_index * 25 + $i + ( ( $rink_index ) * 10 ))->timestamp;

                        $session->rink       = $rink;
                        $session->utc_timezone_offset = $timezone_offset;

                        $competition_index++;
                        $hour_index++;
                        if(in_array($session->type_key,['resurface'])){
                            $session->event_ids  = $id_array;
                            if($index2>1){
                                break;
                            }
                        }

                        if(in_array($session->type_key,['event'])){
                            $session->event_ids  = $id_array;
                            if($index2>1){
                                break;
                            }
                        }
                        else{
                            $session->event_ids  = $id_array;
                            $session->name       .= " (".implode(' + ', $translated_id_array).")";
                        }

                        $this->sessions[]    = $session;


                    }


                }
            }
        }
    }


    /**
     * Specify data which should be serialized to JSON
     * @link  http://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    public function jsonSerialize()
    {
        $vars = get_object_vars($this);

        return $vars;
    }

    /**
     * Get the competition object to build the schedule around
     *
     * {
     *     id: number - the ID for the competition
     *     start_date: number - Timestamp of 0:00:000 on the start date in America/Denver TZ
     *     end_date: number - Timestamp of 0:00:000 on the end date in America/Denver TZ
     * }
     */
    protected function getCompetition( $id ) {
        // If ID is 7 or less, use standard flow
        if ( $id < 8 ) {
            return new \App\Competition( $id );
        }
        // If search manager exists and competition can be found, transform and use it
        if ( CompetitionSearchManager::currentExists() ) {
            $manager     = CompetitionSearchManager::getCurrent();
            $competition = $manager->findCompetition( $id );
            if ( $competition ) {
                $competition->id         = 1;
                $formatted_start_date    = Carbon::createFromTimestamp( $competition->start_date_ts )
                                                 ->format( 'n/j/Y' );
                $formatted_end_date      = Carbon::createFromTimestamp( $competition->end_date_ts )
                                                 ->format( 'n/j/Y' );
                $competition->start_date = Carbon::parse( $formatted_start_date, "America/Denver" )->timestamp;
                $competition->end_date   = Carbon::parse( $formatted_end_date, "America/Denver" )->timestamp;

                return $competition;
            }
        }
        throw new \Exception('Unable to find schedule competition');
    }

    private function getLegend() {
        return json_decode( file_get_contents( __DIR__ . "/Data/CompetitionScheduleLegend.json" ) );
    }

    private function getLinks($id) {
        return [
            'download_schedule'  => "https://placehold.it/500x500&text=Download+Schedule",
            'competition_portal' => sprintf('/CompetitionProfile/Index?id=%s', $id),
            'admin_edit'  => "https://placehold.it/500x500&text=Admin+Schedule+Edit",
        ];
    }

}