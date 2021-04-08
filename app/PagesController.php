<?php

namespace App;

class PagesController
{

    private static $view_directory = __DIR__ . '/../src/views/';

    private static function getMasterLayout()
    {
        return self::$view_directory .'layouts/main.php';
    }

    public static function showPage($page)
    {
        $viewFile = self::getViewFile($page);
        return self::renderPage($viewFile);
    }

    public static function showStyleGuide()
    {
        ob_start();
        include self::$view_directory ."/style-guide.php";

        return ob_get_clean();
    }

    public static function showComponents()
    {
        ob_start();
        include self::$view_directory ."/component-guide.php";

        return ob_get_clean();
    }

    public static function showPageWithParent($parent, $page)
    {
        $viewFile = self::getViewFile($page,$parent);
        if ( ! file_exists($viewFile)) {
            throw new \Phroute\Phroute\Exception\HttpRouteNotFoundException('View for page not found:\'' . $page . '\'');
        }
        return self::renderPage($viewFile);
    }


    public static function showBlankPageWithParent($parent,$page)
    {
        $viewFile = self::getViewFile($page,$parent);
        if ( ! file_exists($viewFile)) {
            throw new \Phroute\Phroute\Exception\HttpRouteNotFoundException('View for page not found:\'' . $page . '\'');
        }
        return self::renderBlankPage($viewFile);
    }


    /**
     * @param $viewFile
     *
     * @return string
     */
    protected static function renderPage($viewFile)
    {
        ob_start();
        include $viewFile;
        extract([ 'content' => ob_get_clean() ]);
        ob_start();
        include self::getMasterLayout();

        return ob_get_clean();
    }


    public static function showBlankPage($id)
    {
        $viewFile = self::getViewFile($id);
        return self::renderBlankPage($viewFile);
    }



    /**
     * @param $viewFile
     *
     * @return string
     */
    protected static function renderBlankPage($viewFile)
    {
        ob_start();
        include $viewFile;
        extract([ 'content' => ob_get_clean() ]);
        ob_start();
        $CREATE_ACCOUNT_FLAG = false;
        if (strpos($viewFile, 'create-account') !== false) {
            $CREATE_ACCOUNT_FLAG = true;
        }
        include self::getMasterBlankLayout();

        return ob_get_clean();
    }


    /**
     * @param $page
     *
     * @return string
     * @throws \Phroute\Phroute\Exception\HttpRouteNotFoundException
     */
    protected static function getViewFile($page,$parent=null)
    {
        $view_path = self::$view_directory;
        if($parent){
            $view_path.=$parent."/";
        }
        $view_path.=$page.".php";
        if ( ! file_exists($view_path)) {
            throw new \Phroute\Phroute\Exception\HttpRouteNotFoundException('View for page not found:\'' . $page . '\'');
        }

        return $view_path;
    }


    private static function getMasterBlankLayout()
    {
        return self::$view_directory .'layouts/blank.php';
    }

}