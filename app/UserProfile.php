<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 5/6/18
 * Time: 11:23 AM
 */

namespace App;

use Carbon\Carbon;

class UserProfile implements \JsonSerializable
{

    /**
     * Competition constructor.
     */
    public function __construct($data, $compute = true)
    {


        foreach ($data as $key => $value) {
            if ($compute) {
                if ($key === "birth_date") {
                    $carbon = Carbon::parse($value->formatted);
                    $carbon->timezone('UTC');
                    $value->timestamp = $carbon->timestamp;
                }
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


    static function make($source_data)
    {
        $data          = json_decode(file_get_contents(__DIR__ . '/Data/UserProfile.json'));
        $options       = FormOptions::edit_profile_options();
        $update_prefix = $source_data['prefix'];
        if ($update_prefix) {
            foreach ($options['user_prefixes'] as $prefix) {
                if ($prefix->value == $update_prefix) {
                    $update_prefix = $prefix;
                    break;
                }
            }
        }
        $update_suffix = $source_data['suffix'];
        if ($update_suffix) {
            foreach ($options['user_suffixes'] as $prefix) {
                if ($prefix->value == $update_suffix) {
                    $update_suffix = $prefix;
                    break;
                }
            }
        }
        $update_carrier = $source_data['primary_phone_carrier'];
        if ($update_carrier) {
            foreach ($options['mobile_carriers'] as $carrier) {
                if ($carrier->value == $update_carrier) {
                    $update_carrier = $carrier;
                    break;
                }
            }
        }

        $data->prefix                  = $update_prefix;
        $data->first_name              = $source_data['first_name'];
        $data->last_name               = $source_data['last_name'];
        $data->middle_name             = $source_data['middle_name'];
        $data->suffix                  = $update_suffix;
        $data->pronunciation_firstname = $source_data['pronunciation_firstname'];
        $data->pronunciation_lastname  = $source_data['pronunciation_lastname'];
        $data->full_name               = $data->first_name . " " . $data->last_name;
        $data->primary_email           = [
            'value'   => $source_data['primary_email'],
            'opt_out' => $source_data['opt_out_primary_email'],
            'publish' => $source_data['publish_primary_email']
        ];
        $data->secondary_email         = [
            'value'   => $source_data['secondary_email'],
            'opt_out' => $source_data['opt_out_secondary_email'],
            'publish' => $source_data['publish_secondary_email']
        ];
        $data->pronunciation_firstname = $source_data['pronunciation_firstname'];
        $data->pronunciation_lastname  = $source_data['pronunciation_lastname'];
        if ($source_data['primary_phone'] || $update_carrier) {
            $data->primary_phone = (object) [
                'value'   => $source_data['primary_phone'],
                'carrier' => $update_carrier ?: null
            ];
        }
        $data->birth_date->formatted = Carbon::parse($source_data['birth_date'])->format("n/j/Y");

        return new self($data);
    }


    static function get($id = null)
    {
        $data = json_decode(file_get_contents(__DIR__ . '/Data/UserProfile.json'));

        $result = new self($data);
        if (array_key_exists('HTTP_REFERER', $_SERVER)) {
            if (strpos($_SERVER['HTTP_REFERER'], 'no_club') !== false) {
                $result->home_club = null;
            }
            if (strpos($_SERVER['HTTP_REFERER'], 'no_lts') !== false) {
                $result->lts_programs = null;
            }
        }

        return $result;


    }
}