<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/6/18
 * Time: 11:23 AM
 */

namespace App;

class SkatingEvent implements \JsonSerializable
{

    /**
     * Competition constructor.
     */
    public function __construct($id,$comp_id)
    {
        $data = (json_decode(file_get_contents(__DIR__.'/Data/SkatingEvents.json')));
        foreach($data->$id as $key=>$value){
            if($key=='id' && $comp_id){
                $value=\App\SkatingEvent::idFromSourceAndCompId($value,$comp_id);
            }
            $this->$key = $value;
        }
        foreach($this->credit_packages as $package){
            $package->event_id=$this->id;
            if($this->id>1){
                $package->id = 10 * $this->id + $package->id;
            }
        }

    }

    static function idFromSourceAndCompId($eid,$cid){
        $data = (json_decode(file_get_contents(__DIR__.'/Data/SkatingEvents.json')));
        $id_base = ($cid)*count(get_object_vars($data))-count(get_object_vars($data));
        return $eid+$id_base;
    }

    static function AllPackages(){
        $data = json_decode(file_get_contents(__DIR__.'/Data/SkatingEvents.json'),true);
        $result=[];
        foreach($data as $event_data){
            if(array_key_exists('credit_packages',$event_data)){
                $result=  array_merge($result,$event_data['credit_packages']);
            }
        }

        return $result;
    }

    static function reduceEventIdtoSource($eid,$cid){
        $data = (json_decode(file_get_contents(__DIR__.'/Data/SkatingEvents.json')));
        $id_base = ($cid)*count(get_object_vars($data))-count(get_object_vars($data));
        return $eid - $id_base;
    }

    static function ModifiedIDEventKey($eid,$comp_id){
        $event_id_map=[
            "1"=>'IL',
            "2"=>'IP',
            "3"=>'AP'
        ];
        $data = (json_decode(file_get_contents(__DIR__.'/Data/SkatingEvents.json')));
        $id_base = ($comp_id)*count(get_object_vars($data))-count(get_object_vars($data));
        $reduced_id = $eid - $id_base;
       return $event_id_map[$reduced_id];
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