<?php

function mix($asset)
{
    $directory = __DIR__ . '/../public';
    $manifest  = file_get_contents($directory . '/mix-manifest.json');
    $manifest  = json_decode($manifest, true);
    if (strpos($asset, '/') !== 0) {
        $asset = "/" . $asset;
    }
    if (array_key_exists($asset, $manifest)) {
        return $manifest[$asset];
    }
    throw new \Exception('Asset not in manifest');

}

//https://www.safaribooksonline.com/library/view/php-cookbook/1565926811/ch04s25.html
function pc_array_power_set($array)
{
    $results = [ [] ];
    foreach ($array as $element) {
        foreach ($results as $combination) {
            array_push($results, array_merge([ $element ], $combination));
        }
    }
    return $results;
}