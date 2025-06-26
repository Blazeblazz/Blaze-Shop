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
$data = json_decode($json, true);

// Validate the data
if (!$data) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Path to the test file
$testFilePath = '../data/orders/BLZ-20240101-test.json';

// Make sure the directories exist
$ordersDir = '../data/orders';
if (!file_exists('../data')) {
    @mkdir('../data', 0777, true);
}
if (!file_exists($ordersDir)) {
    @mkdir($ordersDir, 0777, true);
}

// Write the data to the file
try {
    if (file_put_contents($testFilePath, json_encode($data, JSON_PRETTY_PRINT))) {
        echo json_encode([
            'success' => true,
            'message' => 'Test file updated successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to write to test file',
            'path' => $testFilePath
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Exception: ' . $e->getMessage(),
        'path' => $testFilePath
    ]);
}
?>