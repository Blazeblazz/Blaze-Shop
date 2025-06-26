<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the order data
$json = file_get_contents('php://input');
$order = json_decode($json, true);

// Log the order to a simple text file
$logFile = 'orders.txt';
$logEntry = date('Y-m-d H:i:s') . " | " . 
            $order['name'] . " | " . 
            $order['phone'] . " | " . 
            $order['city'] . " | " . 
            $order['product'] . " | " . 
            $order['variant'] . "\n";

// Append to the log file
file_put_contents($logFile, $logEntry, FILE_APPEND);

// Return success
echo "Order saved";
?>