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

// Log request for debugging
error_log('Order received: ' . substr($json, 0, 100) . '...');

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

// Try multiple possible paths for data directory
$possiblePaths = [
    'data',                      // Relative to this file
    './data',                    // Explicit relative
    dirname(__FILE__) . '/data', // Absolute based on this file
    $_SERVER['DOCUMENT_ROOT'] . '/data' // Absolute from document root
];

$ordersDir = null;

foreach ($possiblePaths as $path) {
    // Create data directory
    if (!file_exists($path)) {
        @mkdir($path, 0777, true);
    }
    
    // Create orders directory
    $testOrdersDir = $path . '/orders';
    if (!file_exists($testOrdersDir)) {
        @mkdir($testOrdersDir, 0777, true);
    }
    
    // Check if directory is writable
    if (is_dir($testOrdersDir) && is_writable($testOrdersDir)) {
        $ordersDir = $testOrdersDir;
        break;
    }
}

// If no writable directory found
if (!$ordersDir) {
    error_log('No writable directory found for orders');
    http_response_code(500);
    echo json_encode([
        'error' => 'No writable directory found for orders',
        'paths_tried' => $possiblePaths
    ]);
    exit;
}

// Save the order to a JSON file
$filename = $ordersDir . '/' . $orderId . '.json';

try {
    // Try to save the file
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);
    if ($jsonData === false) {
        throw new Exception('Failed to encode JSON: ' . json_last_error_msg());
    }
    
    // Try to write to file
    if (@file_put_contents($filename, $jsonData)) {
        // Success
        error_log('Order saved successfully: ' . $orderId);
        echo json_encode([
            'success' => true,
            'orderId' => $orderId,
            'message' => 'Order saved successfully',
            'path_used' => $ordersDir
        ]);
    } else {
        // Error
        $errorMsg = error_get_last()['message'] ?? 'Unknown error';
        error_log('Failed to save order: ' . $errorMsg);
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to save order: ' . $errorMsg,
            'filename' => $filename,
            'is_writable' => is_writable(dirname($filename)) ? 'yes' : 'no'
        ]);
    }
} catch (Exception $e) {
    error_log('Exception saving order: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Exception: ' . $e->getMessage(),
        'filename' => $filename
    ]);
}
?>