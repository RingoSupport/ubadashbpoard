<?php

function decryptEnc($encrypted)
{
    $encryptionMethod = "AES-256-CBC";
    $secretKey = "0TCJJ59QzctD8LXi+SUrhoHwxq+41t@1";
    $iv = "QzctD8LXi+SUrhoH";

    $decryptedText = openssl_decrypt($encrypted, $encryptionMethod, $secretKey, 0, $iv);
    return $decryptedText;
}

$phone  = '57deb330-b587-4667-b41e-5ca4dea4bb33';

$decrypt = decryptEnc($phone);

var_dump($decrypt);
