<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 6/13/19
 * Time: 12:59 PM
 */

namespace App;

class SupportDocuments
{

    public static function buildDocuments($document_amount)
    {
        $result = [];
        for ($i = 0; $i < $document_amount; $i++) {
            $result[] = [
                'name' => "Document" . ( $i + 1 ),
                'link' => '#'
            ];

        }

        return $result;
    }


    public static function buildSubCategory($category_amount = 5, $document_amount = 5)
    {
        $result = [];

        for ($i = 0; $i < $category_amount; $i++) {
            $result[] = [
                'name'      => $category_amount === 1 ? null : "Subcategory " . ( $i + 1 ),
                'documents' => self::buildDocuments($document_amount)
            ];
        }

        return $result;
    }


    public static function getCategorizedList()
    {
        $categories = [
            "Admin/LOC Users",
            "Skaters and Coaches",
            "Volunteers",
            "Non-Members",
        ];

        $result = [];
        foreach ($categories as $index => $category) {
            $document_amount    = $index > 2 ? 1 : 5;
            $subcategory_amount = $index > 1 ? 1 : 5;
            $result[]           = [
                'name'          => $category,
                'subcategories' => self::buildSubCategory($subcategory_amount, $document_amount)
            ];
        }

        return $result;
    }


    public static function getCategorizedListStatic()
    {
        return json_decode(file_get_contents(__DIR__."/Data/SupportDocuments.json"));
    }
}