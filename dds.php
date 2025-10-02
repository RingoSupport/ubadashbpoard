<?php
// Database connection
function newCon4()
{
    $con = mysqli_connect("localhost", "zenith_user", "RingoVas1@#$", "sms");
    if (!$con) {
        die("Connection failed: " . mysqli_connect_error());
    }
    return $con;
}

$conn = newCon4();

// Set the day you want to analyze (format: YYYY-MM-DD)
$day = "2025-09-12";  // change this for each day

$sql = "
SELECT
    CASE
        WHEN TIMESTAMPDIFF(SECOND, created_at, updated_at) <= 10 THEN '0-10s'
        WHEN TIMESTAMPDIFF(SECOND, created_at, updated_at) <= 20 THEN '11-20s'
        WHEN TIMESTAMPDIFF(SECOND, created_at, updated_at) <= 30 THEN '21-30s'
        WHEN TIMESTAMPDIFF(SECOND, created_at, updated_at) <= 40 THEN '31-40s'
        ELSE '>=60s'
    END AS delivery_time_range,
    COUNT(*) AS message_count
FROM zenith_messages
WHERE dlr_status = 'DELIVRD'
  AND DATE(created_at) = '$day'
GROUP BY delivery_time_range
ORDER BY
    CASE
        WHEN delivery_time_range = '0-10s' THEN 1
        WHEN delivery_time_range = '11-20s' THEN 2
        WHEN delivery_time_range = '21-30s' THEN 3
        WHEN delivery_time_range = '31-40s' THEN 4
        ELSE 5
    END
";

$result = $conn->query($sql);
if (!$result) {
    die("Query failed: " . $conn->error);
}

// Name the CSV file with the date
$filename = "delivery_analysis_{$day}.csv";
$fp = fopen($filename, "w");

// Add header row
fputcsv($fp, ['Delivery Time Range', 'Message Count']);

// Add data rows
$timeBuckets = ['0-10s', '11-20s', '21-30s', '31-40s', '>=60s'];
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[$row['delivery_time_range']] = $row['message_count'];
}

// Fill missing buckets with 0
foreach ($timeBuckets as $bucket) {
    if (!isset($data[$bucket])) $data[$bucket] = 0;
}

// Write to CSV
foreach ($timeBuckets as $bucket) {
    fputcsv($fp, [$bucket, $data[$bucket]]);
}


fclose($fp);
echo "CSV file created: $filename";

$conn->close();
