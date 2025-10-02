<?php

require 'vendor/autoload.php';

use libphonenumber\PhoneNumberUtil;
use libphonenumber\NumberParseException;

function getCountryByPhone($phone)
{
	$phoneUtil = PhoneNumberUtil::getInstance();

	try {
		// Parse number (default region can be "US" or any ISO2 country code)
		$numberProto = $phoneUtil->parse($phone, null);

		if ($phoneUtil->isValidNumber($numberProto)) {
			// Get the region code (ISO 3166-1 alpha-2, e.g. "US", "NG", "GB")
			$regionCode = $phoneUtil->getRegionCodeForNumber($numberProto);

			// Optional: Get country calling code (e.g. 1, 44, 234)
			$countryCode = $numberProto->getCountryCode();

			return [
				'region'       => $regionCode,
				'country_code' => $countryCode,
				'valid'        => true
			];
		} else {
			return [
				'region'       => null,
				'country_code' => null,
				'valid'        => false
			];
		}
	} catch (NumberParseException $e) {
		return [
			'region'       => null,
			'country_code' => null,
			'valid'        => false,
			'error'        => $e->getMessage()
		];
	}
}

var_dump(getCountryByPhone('+81'));
var_dump(getCountryByPhone('+2348031234567'));
var_dump(getCountryByPhone('+12025550123'));