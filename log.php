<?php

/**
 * Logging function - logs to the same directory as this script
 */
function log_action($msg, $logFile = null)
{
    if (!$logFile) {
        $logFile = __DIR__ . '/queues_process.log';
    }
    $time = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$time] $msg\n", FILE_APPEND);
}

/**
 * Database connection
 */
function newCon4()
{
    $con = mysqli_connect("localhost", "phpuser", "RingoVas1@#$", "test");
    if (!$con) {
        die("Connection failed: " . mysqli_connect_error());
    }
    return $con;
}

/**
 * Determine network from Nigerian phone number
 */
function getNetwork($number)
{
    $number = preg_replace('/^234/', '0', $number);
    $prefix = substr($number, 0, 5);
    if (!in_array($prefix, ['07025', '07026', '07027', '07028', '07029'])) {
        $prefix = substr($number, 0, 4);
    }

    switch ($prefix) {
        case '0701':
        case '0708':
        case '0802':
        case '0804':
        case '0808':
        case '0812':
        case '0901':
        case '0904':
        case '0907':
        case '0911':
        case '0912':
            return 'Airtel';
        case '0703':
        case '0704':
        case '0706':
        case '0707':
        case '0709':
        case '0803':
        case '0806':
        case '0810':
        case '0813':
        case '0814':
        case '0816':
        case '0819':
        case '0902':
        case '0903':
        case '0906':
        case '0913':
        case '0916':
            return 'MTN';
        case '0805':
        case '0807':
        case '0811':
        case '0815':
        case '0905':
        case '0915':
            return 'Glo';
        case '0809':
        case '0817':
        case '0818':
        case '0908':
        case '0909':
        case '0918':
            return '9mobile';
        default:
            return 'MTN';
    }
}

/**
 * Count SMS pages based on message length
 */
function msgCount($msg)
{
    $msg = trim($msg);
    $strLn = mb_strlen($msg, 'utf-8') + preg_match_all('/[\\^{}\\\~€|\\[\\]]/mu', $msg, $m);

    if ($strLn <= 160) $len = 1;
    elseif ($strLn <= 306) $len = 2;
    elseif ($strLn <= 459) $len = 3;
    elseif ($strLn <= 612) $len = 4;
    elseif ($strLn <= 765) $len = 5;
    elseif ($strLn <= 918) $len = 6;
    elseif ($strLn <= 1071) $len = 7;
    elseif ($strLn <= 1224) $len = 8;
    else $len = 0;

    return [$len, $strLn];
}

/**
 * Bulk process queues
 */
function processQueues($conn)
{
    log_action("Starting queue processing...");

    $sql = "SELECT id, msisdn, text FROM queues ORDER BY created_at ASC LIMIT 1000";
    $result = $conn->query($sql);
    if (!$result) {
        log_action("SELECT failed: " . $conn->error);
        return;
    }
    if ($result->num_rows == 0) {
        log_action("No rows to process.");
        return;
    }

    $tmpFile = __DIR__ . '/queues_bulk.csv';
    $fp = fopen($tmpFile, 'w');
    if (!$fp) {
        log_action("Failed to create temporary CSV file.");
        return;
    }

    fputcsv($fp, ['id', 'msisdn', 'pages', 'text', 'created_at', 'updated_at', 'network']);
    $idsToDelete = [];

    while ($row = $result->fetch_assoc()) {
        $id = $row['id'];
        $msisdn = preg_replace('/[^0-9]/', '', $row['msisdn']);
        $text = $conn->real_escape_string($row['text']);
        $pages = msgCount($text)[0];
        $network = getNetwork($msisdn);
        $now = date('Y-m-d H:i:s');

        fputcsv($fp, [$id, $msisdn, $pages, $text, $now, $now, $network]);
        $idsToDelete[] = $id;

        log_action("Prepared row for ID $id with network $network and $pages pages.");
    }

    fclose($fp);
    log_action("CSV file prepared at $tmpFile.");

    $fieldList = 'id,msisdn,pages,text,created_at,updated_at,network';
    $loadQuery = "
        LOAD DATA LOCAL INFILE '" . addslashes($tmpFile) . "'
        INTO TABLE messages
        FIELDS TERMINATED BY ',' 
        ENCLOSED BY '\"'
        LINES TERMINATED BY '\\n'
        IGNORE 1 LINES
        ($fieldList)
    ";

    if (!$conn->query($loadQuery)) {
        log_action("LOAD DATA failed: " . $conn->error);
        return;
    }
    log_action("LOAD DATA succeeded.");

    $idsToDeleteStr = "'" . implode("','", $idsToDelete) . "'";
    $delSql = "DELETE FROM queues WHERE id IN ($idsToDeleteStr)";
    if (!$conn->query($delSql)) {
        log_action("Delete from queues failed: " . $conn->error);
        return;
    }

    log_action("Deleted " . count($idsToDelete) . " rows from queues successfully.");
    unlink($tmpFile);
    log_action("Temporary CSV file removed. Queue processing finished.");
}

// Execute
$conn = newCon4();
processQueues($conn);
$conn->close();
