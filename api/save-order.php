<?php
// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Only POST requests are allowed']);
    exit;
}

// Get the raw POST data
$json = file_get_contents('php://input');

// Log all incoming requests for debugging
file_put_contents('../data/order_requests.log', date('Y-m-d H:i:s') . ' - ' . $json . "\n", FILE_APPEND);

$data = json_decode($json, true);

// Validate the data minimally
if (!$data) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Use existing order number if provided, otherwise generate a new one
if (isset($data['orderNumber'])) {
    $orderId = $data['orderNumber'];
} else {
    $orderId = 'BLZ-' . date('Ymd') . '-' . substr(uniqid(), -5);
}

// Add order ID and timestamp to the data if not present
if (!isset($data['orderId'])) {
    $data['orderId'] = $orderId;
}

if (!isset($data['timestamp'])) {
    $data['timestamp'] = date('Y-m-d H:i:s');
}

if (!isset($data['status'])) {
    $data['status'] = 'pending';
}

// Create data directory if it doesn't exist
if (!file_exists('../data')) {
    mkdir('../data', 0777, true);
}

// Create orders directory if it doesn't exist
$ordersDir = '../data/orders';
if (!file_exists($ordersDir)) {
    mkdir($ordersDir, 0777, true);
}

// Save the order to a JSON file
$filename = $ordersDir . '/' . $orderId . '.json';

try {
    if (file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT))) {
        // Success
        echo json_encode([
            'success' => true,
            'orderId' => $orderId,
            'message' => 'Order saved successfully'
        ]);
    } else {
        // Error
        http_response_code(500); // Internal Server Error
        echo json_encode([
            'error' => 'Failed to save order',
            'filename' => $filename
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Exception: ' . $e->getMessage(),
        'filename' => $filename
    ]);
}
?>