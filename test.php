<?php
// URL to Twilio's JSON error codes
$jsonUrl = 'https://www.twilio.com/docs/api/errors/twilio-error-codes.json';

// Fetch JSON
$jsonData = file_get_contents($jsonUrl);
if ($jsonData === false) {
    die('Failed to fetch Twilio error codes.');
}

// Decode JSON
$errorArray = json_decode($jsonData, true);
if ($errorArray === null) {
    die('Failed to decode JSON.');
}

// Build PHP array string
$arrayString = "<?php\n\n\$mapPrivate = [\n";

foreach ($errorArray as $error) {
    if (isset($error['code'], $error['message'])) {
        $code = $error['code'];
        $message = addslashes($error['message']); // escape quotes
        $arrayString .= "    '$code' => '$message',\n";
    }
}

$arrayString .= "];\n";

// Save to a new PHP file
$file = 'twilio_error_codes.php';
if (file_put_contents($file, $arrayString)) {
    echo "PHP file '$file' created successfully!";
} else {
    echo "Failed to create PHP file.";
}