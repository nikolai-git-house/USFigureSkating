<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/6/18
 * Time: 11:23 AM
 */

namespace App;

use Carbon\Carbon;

class CompetitionInformation implements \JsonSerializable
{

    /**
     * Competition constructor.
     */
    public function __construct($id)
    {

        $data = (json_decode(file_get_contents(__DIR__.'/Data/CompetitionInformation.json')));
        $faux_competition_data = new Competition($id);
        foreach($data->$id as $key=>$value){
            if($key=="sales_windows") {
                foreach ($value as $index=>$salesWindow) {
                    foreach($salesWindow as $swKey=>$swVal){
                        if (strpos($swKey, 'timestamp') !== false) {
                            $time_obj              = \Carbon\Carbon::parse($swVal, 'America/Denver');
                            $value[$index]->$swKey = $time_obj->timestamp;
                            $replaced_key = str_replace('timestamp','formatted',$swKey);

                            $value[$index]->$replaced_key = $time_obj->format("n/j/Y g:iA ")."MDT";
                        }
                    }
                }
            }
            if($key=="source_skating_events"){
                $this->skating_event_ids=[];
                $events = [];
                foreach ($value as $event_id){
                    $skating_event = new SkatingEvent($event_id,$faux_competition_data->id);
                    $skating_event->competition_id = $faux_competition_data->id;
                    $events[] = $skating_event;
                    $this->skating_event_ids[]=$skating_event->id;
                }
                $value=$events;
                $key="skating_events";
            }

            if(in_array($key,["ppc_deadline","music_deadline"]) && $value){
                $value->timestamp = Carbon::parse($value->formatted,'America/Denver')->timestamp;
                $value->formatted = Carbon::parse($value->formatted,'America/New_York')->format("n/j/y g:i A T");
            }

            $this->$key = $value;
            $this->competition_id=$id;

        }
        /**
         * @deprecated 2020-06-17
         */
        $this->competition_documents = \App\factories\CompetitionDocumentFactory::documents();
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
}