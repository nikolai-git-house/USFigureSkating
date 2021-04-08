<?php

namespace App;

abstract class SelfStartingAbstractSessionStore extends AbstractSessionStore
{

    public static function getCurrent()
    {
        if (session_id() == '') {
            session_start();
        }

        return parent::getCurrent();
    }


    public function cache()
    {
        if (session_id() == '') {
            session_start();
        }
        parent::cache();
    }
}