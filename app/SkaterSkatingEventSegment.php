<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/6/18
 * Time: 11:23 AM
 */

namespace App;

class SkaterSkatingEventSegment implements \JsonSerializable
{

    /**
     * Competition constructor.
     */
    public function __construct($data)
    {
        foreach ($data as $key => $value) {
            if (strpos($key, "last_modified") !== false) {
                if ($value) {
                    $value = ( \Carbon\Carbon::parse($value, 'America/Denver') )->timestamp;
                }
                $key .= "_timestamp";
            }
            $this->$key = $value;
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
}