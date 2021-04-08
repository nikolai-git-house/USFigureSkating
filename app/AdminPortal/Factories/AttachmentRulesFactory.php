<?php
/**
 * Created by PhpStorm.
 * User: matemric
 * Date: 11/13/19
 * Time: 8:33 AM
 */

namespace App\AdminPortal\Factories;

class AttachmentRulesFactory {
	public static function mock() {
		return [
			'valid_types'         => [
				'image/png',
				'image/jpg',
				"audio/mp3",
				"audio/mpeg",
				"audio/x-mpeg",
				"video/mpeg",
				"video/x-mpeg",
				"audio/mpeg3",
				"audio/x-mpeg-3",
				"audio/mpg",
			],
			'max_individual_size' => 2 * 1000 * 1000,
			'max_total_size'      => 15 * 1000 * 1000,
		];
	}
}