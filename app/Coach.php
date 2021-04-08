<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/6/18
 * Time: 11:23 AM
 */

namespace App;

class Coach implements \JsonSerializable
{




    /**
     * Competition constructor.
     */
    public function __construct($id)
    {
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

    static function all(){
        $coaches = json_decode(file_get_contents(__DIR__ . '/../app/Data/Coaches.json'),true);
        foreach($coaches as $coach){
            unset($coach['gender']);
        }
        return $coaches;
    }

    static function allKeyed(){
        $raw = json_decode(file_get_contents(__DIR__ . '/../app/Data/Coaches.json'),true);
        $coaches = new \stdClass();
        foreach($raw as $coach){
            unset($coach['gender']);
            $coach_id=$coach['id'];
            $coaches->$coach_id = $coach;
        }
        return $coaches;
    }
}