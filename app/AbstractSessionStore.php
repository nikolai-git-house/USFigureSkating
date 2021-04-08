<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 1/6/20
 * Time: 9:01 AM
 */

namespace App;

abstract class AbstractSessionStore {

    public function __construct( $properties ) {
        if ( $properties ) {
            foreach ( $properties as $property => $value ) {
                if ( property_exists( $this, $property ) ) {
                    $this->$property = $value;
                }
            }
        }
    }

    /**
     * Clear the stored instance in session
     */
    public static function clearSession() {
        if ( static::currentExists() ) {
            unset( $_SESSION[ static::session_storage_key() ] );
        }
    }

    /**
     * Determine whether a stored instance in session exists
     */
    public static function currentExists() {
        return array_key_exists( static::session_storage_key(), $_SESSION );
    }

    /**
     * Get the current stored instance, or a new blank instance if one doesn't exist
     */
    public static function getCurrent() {
        if ( static::currentExists() ) {
            $stored_data = static::getStoredData();

            return static::fromStoredData( $stored_data );
        }

        return new static( (object) [] );

    }

    /**
     * Get the key used by the session for storing the instance
     */
    abstract protected static function session_storage_key();

    /**
     * Create an instance from stored data
     */
    protected static function fromStoredData( $json_decode ) {
        return new static( $json_decode );
    }

    /**
     * Get the stored data from the session
     */
    protected static function getStoredData() {
        return json_decode( $_SESSION[ static::session_storage_key() ] );
    }

    /**
     * Cache the current instance in session
     */
    public function cache() {
        $_SESSION[ static::session_storage_key() ] = json_encode( $this );
        if (property_exists($this, 'parent') && $this->parent && $this->parent instanceof AbstractSessionStore) {
            $this->parent->cache();
        }
    }
}