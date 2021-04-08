<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/6/18
 * Time: 11:23 AM
 */

namespace App;

class Session implements \JsonSerializable
{

    /**
     * Competition constructor.
     */
    public function __construct($id)
    {
        $data = (json_decode(file_get_contents(__DIR__.'/Data/SessionsData.json')));
        foreach($data->$id as $key=>$value){
            if(strpos($key,'date')!==false || strpos($key,'time')!==false){
                $value =\Carbon\Carbon::parse($value,'America/Denver')->timestamp;
            }
            $this->$key = $value;

        }

    }


    public static function allPermutations()
    {
        $data = (json_decode(file_get_contents(__DIR__.'/Data/SessionsData.json')));
        $sessions=[];
        foreach($data as $key=>$value){
          $sessions[] = new Session($key);
        }
        return $sessions;
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